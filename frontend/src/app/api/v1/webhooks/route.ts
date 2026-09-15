import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { eventBus, DocodoEventType } from "@/lib/events/event-bus";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("x-docodo-signature");
    const bodyText = await req.text();

    // Verify HMAC signature — mandatory when DOCODO_WEBHOOK_SECRET is configured.
    // A missing or invalid signature is always rejected; only an unconfigured secret
    // (dev/local mode) skips verification.
    const webhookSecret = process.env.DOCODO_WEBHOOK_SECRET || process.env.RAZORPAY_WEBHOOK_SECRET;
    if (webhookSecret) {
      if (!signature) {
        return NextResponse.json({ error: "Missing x-docodo-signature header" }, { status: 401 });
      }
      const expectedSig = crypto
        .createHmac("sha256", webhookSecret)
        .update(bodyText)
        .digest("hex");

      const expectedBuf = Buffer.from(expectedSig, "utf-8");
      const receivedBuf = Buffer.from(signature, "utf-8");

      if (expectedBuf.length !== receivedBuf.length || !crypto.timingSafeEqual(expectedBuf, receivedBuf)) {
        return NextResponse.json({ error: "Invalid webhook HMAC signature" }, { status: 401 });
      }
    }

    const payload = JSON.parse(bodyText);
    const { eventType, businessId, entityId, data, idempotencyKey } = payload;

    if (!eventType || !businessId || !entityId) {
      return NextResponse.json(
        { error: "Missing required fields: eventType, businessId, and entityId are mandatory" },
        { status: 400 }
      );
    }

    // Publish event into Docodo serverless Event Bus
    const executionResults = await eventBus.publish({
      eventType: eventType as DocodoEventType,
      businessId,
      entityId,
      payload: data || {},
      idempotencyKey: idempotencyKey || `wh_${Date.now()}_${entityId}`,
    });

    return NextResponse.json({
      received: true,
      eventType,
      handlersExecuted: executionResults.length,
      results: executionResults,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to process incoming webhook" },
      { status: 500 }
    );
  }
}
