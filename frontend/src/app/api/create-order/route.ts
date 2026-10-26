import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Docodo SaaS Subscription Order Creation Route
 * 
 * In compliance with RBI Payment Aggregator (PA) Guidelines and direct merchant settlement rules:
 * Platform Razorpay orders are RESTRICTED STRICTLY to Docodo platform SaaS subscriptions (/checkout).
 * Customer appointment booking payments CANNOT be routed through Docodo's central account
 * and must be settled directly with merchants (Pay at Venue / Direct Merchant UPI).
 */
export async function POST(req: NextRequest) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_docodo";

    const body = await req.json();
    const { currency = "INR", bookingId } = body;
    let { amount, receipt, notes = {} } = body;

    // 1. REJECT APPOINTMENT BOOKINGS: RBI PA & Direct Settlement Compliance
    if (bookingId || notes?.bookingId || body.orderType === "booking") {
      return NextResponse.json(
        {
          error:
            "Platform Razorpay account cannot collect customer appointment payments directly under RBI Payment Aggregator Guidelines. Merchant appointments must be settled directly with the business via Pay at Venue or Merchant UPI.",
          compliance: "RBI_PA_DIRECT_SETTLEMENT_MANDATE",
        },
        { status: 400 }
      );
    }

    // 2. REQUIRE VALID SAAS PLAN FOR CENTRAL PLATFORM CHECKOUT
    const planId = notes?.planId || body.planId;
    if (!planId) {
      return NextResponse.json(
        {
          error:
            "Invalid order request: This checkout endpoint is strictly restricted to Docodo SaaS subscriptions. Customer appointments cannot be processed through the platform account.",
        },
        { status: 400 }
      );
    }

    const session = await auth();
    const userId = session?.user?.id || body.userId;

    notes = {
      ...notes,
      planId: String(planId),
      planName: notes.planName || body.planName || String(planId),
      customerEmail: notes.customerEmail || body.customerEmail || session?.user?.email || "",
      customerPhone: notes.customerPhone || body.customerPhone || "",
      customerName: notes.customerName || body.customerName || session?.user?.name || "",
      businessName: notes.businessName || body.businessName || "",
      userId: userId || "",
    };

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
      receipt: (receipt || `rcpt_plan_${Date.now()}`).slice(0, 40),
      notes: notes,
    };

    const order = await razorpay.orders.create(orderOptions);

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: keyId,
      receipt: order.receipt,
      notes: order.notes,
      plan_id: planId,
      customer_name: notes.customerName,
      customer_email: notes.customerEmail,
      customer_phone: notes.customerPhone,
    });
  } catch (error: any) {
    console.error("[Razorpay API] Order creation failed:", error);
    const status = error.statusCode || 500;
    return NextResponse.json(
      {
        error: error.message || "Failed to create Razorpay subscription order",
        description: error.description,
        code: error.error?.code,
      },
      { status }
    );
  }
}
