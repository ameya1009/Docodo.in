import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { 
  provisionStarter, 
  provisionGrowth, 
  provisionConcierge 
} from "@/lib/services/provisioning-service";
import { 
  PLAN_IDS, 
  SUBSCRIPTION_STATES 
} from "@/lib/plans-config";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const eventIdHeader = req.headers.get("x-razorpay-event-id");

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.warn("[Razorpay Webhook] RAZORPAY_WEBHOOK_SECRET is not configured on server.");
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    if (!signature) {
      return NextResponse.json({ error: "Missing signature header" }, { status: 400 });
    }

    // 1. Cryptographic HMAC-SHA256 signature verification with timingSafeEqual
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    const expectedBuf = Buffer.from(expectedSignature, "utf-8");
    const signatureBuf = Buffer.from(signature, "utf-8");

    const isValidSignature =
      expectedBuf.length === signatureBuf.length &&
      crypto.timingSafeEqual(expectedBuf, signatureBuf);

    if (!isValidSignature) {
      console.error("[Razorpay Webhook] Invalid signature detected. Tampering attempt rejected.");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const eventId = eventIdHeader || payload.event_id || `${event}_${payload.payload?.payment?.entity?.id || payload.payload?.order?.entity?.id || Date.now()}`;

    // 2. Webhook Idempotency Check (Section 16)
    try {
      const existingEvent = await prisma.webhookEvent.findUnique({
        where: { eventId },
      });

      if (existingEvent && existingEvent.status === "PROCESSED") {
        console.log(`[Razorpay Webhook] Idempotency guard: Event ${eventId} already processed. Skipping.`);
        return NextResponse.json({ received: true, idempotent: true });
      }

      await prisma.webhookEvent.upsert({
        where: { eventId },
        update: {},
        create: {
          eventId,
          eventType: event,
          payload: rawBody.slice(0, 4000),
          status: "PROCESSED",
        },
      });
    } catch (idempotencyErr) {
      console.warn("[Razorpay Webhook] WebhookEvent ledger check handled:", idempotencyErr);
    }

    // 3. Handle Events
    if (event === "order.paid" || event === "payment.captured") {
      const paymentEntity = payload.payload?.payment?.entity;
      const orderEntity = payload.payload?.order?.entity;
      const orderId = paymentEntity?.order_id || orderEntity?.id;
      const paymentId = paymentEntity?.id;
      const amount = (paymentEntity?.amount ?? 0) / 100;
      const notes = orderEntity?.notes || paymentEntity?.notes || {};

      // A. Check if payment is for an Appointment Booking
      if (orderId) {
        const booking = await prisma.booking.findFirst({
          where: { razorpayOrderId: orderId },
          include: { business: true },
        });

        if (booking && booking.paymentStatus !== "PAID") {
          await prisma.booking.update({
            where: { id: booking.id },
            data: {
              status: "CONFIRMED",
              paymentStatus: "PAID",
              razorpayPaymentId: paymentId || booking.razorpayPaymentId,
              paidAmount: amount > 0 ? amount : booking.price,
            },
          });

          revalidatePath(`/book/${booking.business.slug}`);
          revalidatePath("/dashboard/bookings");
        }
      }

      // B. Check if payment is for SaaS Plan or Concierge Onboarding
      const planIdentifier = notes.planId || notes.planName;
      const businessId = notes.businessId;
      const userId = notes.userId;

      if (planIdentifier) {
        const planStr = String(planIdentifier).toLowerCase();
        const isConcierge = planStr.includes("setup") || planStr.includes("concierge");
        const isGrowth = planStr.includes("growth") || planStr.includes("pro");

        let resolvedBusinessId = businessId;
        if (!resolvedBusinessId && userId) {
          const biz = await prisma.business.findFirst({
            where: { ownerId: userId },
            select: { id: true },
          });
          resolvedBusinessId = biz?.id;
        }

        if (resolvedBusinessId) {
          if (isConcierge) {
            await provisionConcierge(resolvedBusinessId, {
              userId,
              orderId,
              paymentId,
              amount,
              source: "RAZORPAY",
            });
          } else if (isGrowth) {
            await provisionGrowth(resolvedBusinessId, {
              userId,
              orderId,
              paymentId,
              amount,
              source: "RAZORPAY",
            });
          } else {
            await provisionStarter(resolvedBusinessId, {
              userId,
              orderId,
              paymentId,
              amount,
              source: "RAZORPAY",
            });
          }

          revalidatePath("/dashboard");
          revalidatePath("/dashboard/usage");
          revalidatePath("/pricing");
        }
      }
    } else if (event === "subscription.cancelled") {
      const subscriptionEntity = payload.payload?.subscription?.entity;
      const providerSubId = subscriptionEntity?.id;

      if (providerSubId) {
        await prisma.subscription.updateMany({
          where: { providerSubscriptionId: providerSubId },
          data: {
            status: SUBSCRIPTION_STATES.CANCELLED,
            cancelledAt: new Date(),
          },
        }).catch(() => null);
      }
    } else if (event === "payment.failed") {
      const paymentEntity = payload.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id;

      if (orderId) {
        await prisma.subscription.updateMany({
          where: { providerSubscriptionId: orderId },
          data: { status: SUBSCRIPTION_STATES.PAYMENT_FAILED },
        }).catch(() => null);
      }
    }

    return NextResponse.json({ received: true, event: eventId });
  } catch (error: any) {
    console.error("[Razorpay Webhook] Processing error:", error);
    return NextResponse.json({ error: "Webhook processing error" }, { status: 500 });
  }
}
