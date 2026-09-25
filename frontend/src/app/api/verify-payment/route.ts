import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  provisionStarter,
  provisionGrowth,
  provisionConcierge,
} from "@/lib/services/provisioning-service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json(
        { error: "RAZORPAY_KEY_SECRET not configured on server" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const {
      order_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = body;

    const finalOrderId = order_id || razorpay_order_id;

    // Validate mandatory fields
    if (!finalOrderId || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        {
          error: "Missing required fields: order_id, razorpay_payment_id, and razorpay_signature are mandatory",
        },
        { status: 400 }
      );
    }

    // Step 3 Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${finalOrderId}|${razorpay_payment_id}`)
      .digest("hex");

    // Secure timing-safe signature comparison with length guard
    const expectedBuf = Buffer.from(expectedSignature, "utf-8");
    const receivedBuf = Buffer.from(razorpay_signature || "", "utf-8");

    const isAuthentic =
      expectedBuf.length === receivedBuf.length &&
      crypto.timingSafeEqual(expectedBuf, receivedBuf);

    if (!isAuthentic) {
      console.error("[Razorpay Verify] Signature mismatch detected! Possible tampered transaction.");
      return NextResponse.json(
        {
          success: false,
          error: "Payment verification failed! Invalid signature.",
        },
        { status: 400 }
      );
    }

    // Signature verified authentic! If bookingId or order_id is associated with a booking, update DB
    let bookingIdResult: string | undefined;
    const targetBooking = bookingId
      ? await prisma.booking.findUnique({ where: { id: bookingId }, include: { business: true, service: true } })
      : await prisma.booking.findFirst({ where: { razorpayOrderId: finalOrderId }, include: { business: true, service: true } });

    if (targetBooking) {
      const updatedBooking = await prisma.booking.update({
        where: { id: targetBooking.id },
        data: {
          status: "CONFIRMED",
          paymentStatus: "PAID",
          razorpayPaymentId: razorpay_payment_id,
          paidAmount: targetBooking.price,
        },
        include: { business: true, service: true },
      });
      bookingIdResult = updatedBooking.id;

      // P0-6: Increment customer LTV only after payment is confirmed, not at booking creation.
      if (targetBooking.customerId && targetBooking.price > 0) {
        await prisma.customer.update({
          where: { id: targetBooking.customerId },
          data: { lifetimeValue: { increment: targetBooking.price } },
        }).catch((err) => console.warn("[CRM] LTV update after payment failed:", err));
      }

      // Send transactional booking confirmation email if customerEmail exists
      if (updatedBooking.customerEmail) {
        import("@/lib/notifications").then(({ sendBookingConfirmationEmail, sendAdminNotification }) => {
          sendBookingConfirmationEmail({
            toEmail: updatedBooking.customerEmail!,
            customerName: updatedBooking.customerName,
            businessName: updatedBooking.business.name,
            serviceName: updatedBooking.service?.name || "Appointment",
            date: updatedBooking.date,
            startTime: updatedBooking.startTime,
            price: updatedBooking.price,
            paymentMethod: "Razorpay (Online)",
          }).catch((err) => console.warn("[Email Notification] Failed:", err));

          sendAdminNotification("PAYMENT", {
            amount: updatedBooking.price,
            customerName: updatedBooking.customerName,
            business: updatedBooking.business.name,
            paymentId: razorpay_payment_id,
          }).catch((err) => console.warn("[Admin Notification] Failed:", err));
        });
      }

      revalidatePath(`/book/${updatedBooking.business.slug}`);
      revalidatePath("/dashboard/bookings");
      revalidatePath("/dashboard");
    }

    // Handle SaaS Subscription or Concierge plan purchase
    let updatedPlanResult: string | undefined;
    const planIdentifier = body.planId || body.planName;
    if (planIdentifier) {
      try {
        const { auth } = await import("@/lib/auth");
        const session = await auth();
        let userId = session?.user?.id || body.userId;
        const planStr = String(planIdentifier).toLowerCase();
        const isDoneForYou = planStr.includes("setup") || planStr.includes("concierge");
        const isGrowth = planStr.includes("growth") || planStr.includes("pro");
        const normalizedPlan = isDoneForYou || isGrowth ? "PRO" : "STARTER";

        // Auto-resolve user by email if session is absent (Guest SaaS Checkout)
        const emailToMatch = body.email || body.customerEmail || body.notes?.customerEmail || session?.user?.email;
        if (!userId && emailToMatch) {
          let existingUser = await prisma.user.findUnique({ where: { email: emailToMatch } }).catch(() => null);
          if (!existingUser) {
            existingUser = await prisma.user.create({
              data: {
                email: emailToMatch,
                name: body.notes?.customerName || body.name || session?.user?.name || "Business Owner",
                role: "OWNER",
              },
            }).catch(() => null);
          }
          if (existingUser) {
            userId = existingUser.id;
          }
        }

        // P0-2: Auto-resolve or create business entity for user
        let resolvedBusinessId = body.businessId;
        if (!resolvedBusinessId && userId) {
          const biz = await prisma.business.findFirst({
            where: { ownerId: userId },
            select: { id: true },
          });
          if (biz) {
            resolvedBusinessId = biz.id;
          } else {
            // Auto-provision initial business container so payment is never rejected
            const newBiz = await prisma.business.create({
              data: {
                name: body.notes?.businessName || body.businessName || (session?.user?.name ? `${session.user.name}'s Business` : "My Business"),
                slug: `biz-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
                industry: "General Service",
                ownerId: userId,
                phone: body.notes?.customerPhone || body.phone || null,
                email: emailToMatch || null,
                onboardingStep: 1,
                onboardingComplete: false,
              },
            });
            resolvedBusinessId = newBiz.id;
          }
        }

        if (!resolvedBusinessId) {
          return NextResponse.json(
            { success: false, error: "Business ID or user session is required to provision a SaaS plan." },
            { status: 400 }
          );
        }

        if (isDoneForYou) {
          await provisionConcierge(resolvedBusinessId, {
            userId,
            orderId: finalOrderId,
            paymentId: razorpay_payment_id,
            amount: 4999,
            source: "RAZORPAY",
          });
          updatedPlanResult = "CONCIERGE";
        } else if (isGrowth) {
          await provisionGrowth(resolvedBusinessId, {
            userId,
            orderId: finalOrderId,
            paymentId: razorpay_payment_id,
            amount: 2499,
            source: "RAZORPAY",
          });
          updatedPlanResult = "PRO";
        } else {
          await provisionStarter(resolvedBusinessId, {
            userId,
            orderId: finalOrderId,
            paymentId: razorpay_payment_id,
            amount: 999,
            source: "RAZORPAY",
          });
          updatedPlanResult = "STARTER";
        }

        import("@/lib/notifications").then(({ sendAdminNotification }) => {
          sendAdminNotification("PAYMENT", {
            type: isDoneForYou ? "DONE_FOR_YOU_SETUP_PURCHASE" : "SAAS_PLAN_PURCHASE",
            plan: isDoneForYou ? "DONE_FOR_YOU_ONBOARDING (₹4,999)" : normalizedPlan,
            userId: userId || "guest",
            paymentId: razorpay_payment_id,
            orderId: finalOrderId,
          }).catch(() => null);
        });

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/usage");
        revalidatePath("/pricing");
      } catch (planErr) {
        console.warn("[Payment Verify] SaaS plan upgrade failed:", planErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      payment_id: razorpay_payment_id,
      order_id: finalOrderId,
      booking_id: bookingIdResult,
      plan: updatedPlanResult,
    });
  } catch (error: any) {
    console.error("[Razorpay Verify] Error processing verification:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error during verification" },
      { status: 500 }
    );
  }
}
