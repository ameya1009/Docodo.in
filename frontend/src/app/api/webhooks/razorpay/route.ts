import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { WebhookQueueManager } from "@/lib/queue/webhook-queue";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const eventIdHeader = req.headers.get("x-razorpay-event-id");

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.warn("[Razorpay Webhook] RAZORPAY_WEBHOOK_SECRET not configured on server.");
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    if (!signature) {
      return NextResponse.json({ error: "Missing signature header" }, { status: 400 });
    }

    // 1. Constant-time cryptographic HMAC-SHA256 signature verification
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    const expectedBuf = Buffer.from(expectedSignature, "utf-8");
    const signatureBuf = Buffer.from(signature, "utf-8");

    if (
      expectedBuf.length !== signatureBuf.length ||
      !crypto.timingSafeEqual(expectedBuf, signatureBuf)
    ) {
      console.error("[Razorpay Webhook] Invalid signature detected. Tampering attempt rejected.");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // 2. Parse Event Metadata
    const payload = JSON.parse(rawBody);
    const eventType = payload.event;
    const eventId = 
      eventIdHeader || 
      payload.event_id || 
      `${eventType}_${payload.payload?.payment?.entity?.id || payload.payload?.order?.entity?.id || Date.now()}`;

    // 3. Durable Enqueue & Fast Synchronous ACK (< 50ms total latency)
    const enqueueResult = await WebhookQueueManager.enqueue(
      eventId,
      eventType,
      rawBody,
      payload
    );

    const latencyMs = Date.now() - startTime;
    return NextResponse.json(
      { 
        received: true, 
        eventId, 
        status: enqueueResult.status,
        latencyMs 
      }, 
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[Razorpay Webhook] Processing error:", error);
    return NextResponse.json({ error: "Webhook processing error" }, { status: 500 });
  }
}
