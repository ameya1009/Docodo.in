import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_docodo";
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "docodo_sandbox_secret";

    const body = await req.json();
    const { currency = "INR", bookingId } = body;
    let { amount, receipt, notes = {} } = body;

    const session = await auth();
    const userId = session?.user?.id || body.userId;
    let businessId = body.businessId;

    if (!businessId && userId) {
      try {
        const biz = await prisma.business.findFirst({
          where: { ownerId: userId },
          select: { id: true }
        });
        businessId = biz?.id;
      } catch {
        try {
          const { db } = await import("@/lib/supabase-db");
          const biz = await db.business.findFirst({ where: { ownerId: userId } });
          businessId = biz?.id;
        } catch {}
      }
    }

    notes = {
      ...notes,
      customerEmail: notes.customerEmail || body.customerEmail || session?.user?.email || "",
      customerPhone: notes.customerPhone || body.customerPhone || "",
      customerName: notes.customerName || body.customerName || session?.user?.name || "",
      businessName: notes.businessName || body.businessName || "",
      userId: userId || "",
      businessId: businessId || ""
    };

    // If bookingId is provided, look up booking details
    let booking: any = null;
    if (bookingId) {
      try {
        booking = await prisma.booking.findUnique({
          where: { id: bookingId },
          include: { business: true, service: true },
        });
      } catch {
        try {
          const { db } = await import("@/lib/supabase-db");
          booking = await db.booking.findUnique({ where: { id: bookingId } });
        } catch {}
      }

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
        customerName: booking.customerName || notes.customerName || "",
        customerPhone: booking.customerPhone || notes.customerPhone || "",
        customerEmail: booking.customerEmail || notes.customerEmail || "",
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

    // If booking exists, update razorpayOrderId on booking record across Prisma and Supabase
    if (booking) {
      try {
        await prisma.booking.update({
          where: { id: booking.id },
          data: { razorpayOrderId: order.id },
        });
      } catch (pErr) {
        console.warn("[Razorpay API] Prisma booking update fallback:", pErr);
      }
      try {
        const { db } = await import("@/lib/supabase-db");
        await db.booking.update({
          where: { id: booking.id },
          data: { razorpayOrderId: order.id },
        });
      } catch (sbErr) {
        console.warn("[Razorpay API] Supabase booking update fallback:", sbErr);
      }
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

