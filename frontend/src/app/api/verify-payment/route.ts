import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

      // Send transactional booking confirmation email if customerEmail exists
      if (updatedBooking.customerEmail) {
        import("@/lib/notifications").then(({ sendBookingConfirmationEmail }) => {
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
        });
      }

      revalidatePath(`/book/${updatedBooking.business.slug}`);
      revalidatePath("/dashboard/bookings");
      revalidatePath("/dashboard");
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      payment_id: razorpay_payment_id,
      order_id: finalOrderId,
      booking_id: bookingIdResult,
    });
  } catch (error: any) {
    console.error("[Razorpay Verify] Error processing verification:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error during verification" },
      { status: 500 }
    );
  }
}
