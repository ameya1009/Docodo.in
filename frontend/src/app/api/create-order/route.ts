import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay API credentials not configured on server" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { currency = "INR", bookingId } = body;
    let { amount, receipt, notes = {} } = body;

    // If bookingId is provided, look up booking details
    let booking = null;
    if (bookingId) {
      booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { business: true, service: true },
      });

      if (!booking) {
        return NextResponse.json({ error: "Booking not found" }, { status: 404 });
      }

      // Enforce server-side price from booking record to prevent client-side tampering
      amount = Math.round(booking.price * 100);

      receipt = receipt || `receipt_${booking.id.slice(0, 30)}`;
      notes = {
        ...notes,
        businessId: booking.businessId,
        bookingId: booking.id,
        businessName: booking.business.name,
      };
    }

    // Validation: amount is mandatory and must be an integer >= 100 paise (₹1.00)
    const amountInPaise = Number(amount);
    if (!amountInPaise || isNaN(amountInPaise) || amountInPaise < 100) {
      return NextResponse.json(
        { error: "Invalid amount. Minimum amount is 100 paise (₹1.00)." },
        { status: 400 }
      );
    }

    const orderOptions = {
      amount: Math.round(amountInPaise),
      currency: currency.toUpperCase(),
      receipt: (receipt || `rcpt_${Date.now()}`).slice(0, 40),
      notes: notes,
    };

    const order = await razorpay.orders.create(orderOptions);

    // If booking exists, update razorpayOrderId on booking record
    if (booking) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { razorpayOrderId: order.id },
      });
    }

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: keyId,
      receipt: order.receipt,
      notes: order.notes,
      business_name: booking?.business?.name,
      customer_name: booking?.customerName,
      customer_email: booking?.customerEmail,
      customer_phone: booking?.customerPhone,
    });
  } catch (error: any) {
    console.error("[Razorpay API] Order creation failed:", error);
    const status = error.statusCode || 500;
    return NextResponse.json(
      {
        error: error.message || "Failed to create Razorpay order",
        description: error.description,
        code: error.error?.code,
      },
      { status }
    );
  }
}
