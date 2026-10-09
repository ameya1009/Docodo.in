import { prisma } from "@/lib/prisma";
import { eventBus } from "@/lib/events/event-bus";
import { 
  provisionStarter, 
  provisionGrowth, 
  provisionConcierge 
} from "@/lib/services/provisioning-service";
import { SUBSCRIPTION_STATES } from "@/lib/plans-config";

export interface QueueJobPayload {
  eventId: string;
  eventType: string;
  payload: any;
  rawBody: string;
  attempts: number;
}

export class WebhookQueueManager {
  /**
   * Enqueues the verified webhook event into durable storage and triggers async worker.
   */
  public static async enqueue(
    eventId: string, 
    eventType: string, 
    rawBody: string, 
    payload: any
  ): Promise<{ status: "QUEUED" | "DUPLICATE"; eventId: string }> {
    // 1. Atomic Idempotency Check & Ingestion Gate
    const existing = await prisma.webhookEvent.findUnique({
      where: { eventId },
    });

    if (existing && existing.status === "PROCESSED") {
      return { status: "DUPLICATE", eventId };
    }

    // 2. Persist with PENDING status
    await prisma.webhookEvent.upsert({
      where: { eventId },
      update: {},
      create: {
        eventId,
        eventType,
        payload: rawBody.slice(0, 8000),
        status: "PENDING",
      },
    });

    // 3. Trigger Asynchronous Processing Worker (Non-blocking)
    if (process.env.QSTASH_URL && process.env.QSTASH_TOKEN) {
      await this.publishToQStash(eventId, eventType, payload);
    } else {
      // Serverless edge background execution
      try {
        await this.processWorkerJob({
          eventId,
          eventType,
          payload,
          rawBody,
          attempts: 1,
        });
      } catch (err) {
        console.error(`[WebhookQueue:CRITICAL] DLQ event ${eventId}:`, err);
      }
      /*
        this.processWorkerJob({
          eventId,
          eventType,
          payload,
          rawBody,
          attempts: 1,
        }).catch((err) => {
          console.error(`[WebhookQueue:CRITICAL] DLQ event ${eventId}:`, err);
        });
      */
    }

    return { status: "QUEUED", eventId };
  }

  /**
   * Dispatches event payload to Upstash QStash for multi-region durable queueing
   */
  private static async publishToQStash(eventId: string, eventType: string, payload: any) {
    try {
      const qstashEndpoint = `${process.env.QSTASH_URL}/v2/publish/${encodeURIComponent(
        `${process.env.NEXTAUTH_URL || "https://docodo.in"}/api/queue/process-webhook`
      )}`;

      await fetch(qstashEndpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.QSTASH_TOKEN}`,
          "Content-Type": "application/json",
          "Upstash-Deduplication-Id": eventId,
          "Upstash-Retries": "3",
        },
        body: JSON.stringify({ eventId, eventType, payload }),
      });
    } catch (error) {
      console.warn("[QStash] Queue dispatch fallback to internal worker:", error);
    }
  }

  /**
   * Deterministic Idempotent Background Worker
   */
  public static async processWorkerJob(job: QueueJobPayload): Promise<void> {
    const { eventId, eventType, payload } = job;

    try {
      if (eventType === "order.paid" || eventType === "payment.captured") {
        const paymentEntity = payload.payload?.payment?.entity;
        const orderEntity = payload.payload?.order?.entity;
        const orderId = paymentEntity?.order_id || orderEntity?.id;
        const paymentId = paymentEntity?.id;
        const amount = (paymentEntity?.amount ?? 0) / 100;
        const notes = orderEntity?.notes || paymentEntity?.notes || {};

        // A. Appointment Booking Reconciliation
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

            await eventBus.publish({
              eventType: "PAYMENT_SUCCESS",
              businessId: booking.businessId,
              entityId: booking.id,
              idempotencyKey: `pay_${eventId}`,
              payload: { bookingId: booking.id, amount },
            });
          }
        }

        // B. SaaS Subscription & Concierge Provisioning
        const planIdentifier = notes.planId || notes.planName;
        const businessId = notes.businessId;
        let userId = notes.userId;

        if (planIdentifier) {
          const planStr = String(planIdentifier).toLowerCase();
          const isConcierge = planStr.includes("setup") || planStr.includes("concierge");
          const isGrowth = planStr.includes("growth") || planStr.includes("pro");

          // Auto-resolve or create user by email when userId and businessId are empty in notes
          const customerEmail = notes.customerEmail || notes.email || paymentEntity?.email || orderEntity?.notes?.customerEmail;
          if (!userId && customerEmail) {
            let existingUser = await prisma.user.findUnique({ where: { email: customerEmail } }).catch(() => null);
            if (!existingUser) {
              existingUser = await prisma.user.create({
                data: {
                  email: customerEmail,
                  name: notes.customerName || notes.name || paymentEntity?.notes?.customerName || "Business Owner",
                  role: "OWNER",
                },
              }).catch(() => null);
            }
            if (existingUser) {
              userId = existingUser.id;
            }
          }

          let resolvedBusinessId = businessId;
          if (!resolvedBusinessId && userId) {
            const biz = await prisma.business.findFirst({
              where: { ownerId: userId },
              select: { id: true },
            });
            if (biz) {
              resolvedBusinessId = biz.id;
            } else {
              const newBiz = await prisma.business.create({
                data: {
                  name: notes.businessName || `${notes.customerName || "My"}'s Business`,
                  slug: `biz-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
                  industry: "General Service",
                  ownerId: userId,
                  phone: notes.customerPhone || paymentEntity?.contact || null,
                  email: customerEmail || null,
                  onboardingStep: 1,
                  onboardingComplete: false,
                },
              }).catch((e) => {
                console.warn("[WebhookQueue] Auto-provision business container failed:", e);
                return null;
              });
              if (newBiz) {
                resolvedBusinessId = newBiz.id;
              }
            }
          }

          if (resolvedBusinessId) {
            if (isConcierge) {
              await provisionConcierge(resolvedBusinessId, { userId, orderId, paymentId, amount, source: "RAZORPAY" });
            } else if (isGrowth) {
              await provisionGrowth(resolvedBusinessId, { userId, orderId, paymentId, amount, source: "RAZORPAY" });
            } else {
              await provisionStarter(resolvedBusinessId, { userId, orderId, paymentId, amount, source: "RAZORPAY" });
            }
          }
        }
      } else if (eventType === "subscription.cancelled") {
        const subId = payload.payload?.subscription?.entity?.id;
        if (subId) {
          await prisma.subscription.updateMany({
            where: { providerSubscriptionId: subId },
            data: { status: SUBSCRIPTION_STATES.CANCELLED, cancelledAt: new Date() },
          });
        }
      } else if (eventType === "payment.failed") {
        const orderId = payload.payload?.payment?.entity?.order_id;
        if (orderId) {
          await prisma.subscription.updateMany({
            where: { providerSubscriptionId: orderId },
            data: { status: SUBSCRIPTION_STATES.PAYMENT_FAILED },
          });
        }
      }

      // Mark Event PROCESSED
      await prisma.webhookEvent.update({
        where: { eventId },
        data: { status: "PROCESSED" },
      });
    } catch (err: any) {
      console.error(`[WebhookWorker] Failed processing event ${eventId}:`, err);
      await prisma.webhookEvent.update({
        where: { eventId },
        data: { status: "FAILED" },
      });
      throw err;
    }
  }
}
