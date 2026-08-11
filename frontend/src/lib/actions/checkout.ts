"use server";

import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";
import { revalidatePath } from "next/cache";

export async function createCheckoutOrder(bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { business: true }
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.price <= 0) {
    throw new Error("Cannot create a checkout order for a free service");
  }

  // Razorpay expects amount in paise (multiply INR by 100)
  const amountInPaise = Math.round(booking.price * 100);

  const options = {
    amount: amountInPaise,
    currency: "INR",
    receipt: `receipt_${booking.id}`,
    notes: {
      businessId: booking.businessId,
      bookingId: booking.id,
    }
  };

  const order = await razorpay.orders.create(options);

  await prisma.booking.update({
    where: { id: booking.id },
    data: { razorpayOrderId: order.id }
  });

  return {
    keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_dummy",
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    businessName: booking.business.name,
    customerName: booking.customerName,
    customerEmail: booking.customerEmail,
    customerPhone: booking.customerPhone,
  };
}

export async function verifyPayment(
  bookingId: string, 
  razorpayPaymentId: string, 
  razorpayOrderId: string, 
  razorpaySignature: string
) {
  const secret = process.env.RAZORPAY_KEY_SECRET || "dummy_secret";

  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (generatedSignature !== razorpaySignature) {
    throw new Error("Payment verification failed! Invalid signature.");
  }

  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: "CONFIRMED",
      paymentStatus: "PAID",
      razorpayPaymentId: razorpayPaymentId,
      paidAmount: { set: undefined }, // If we wanted to set exactly how much was paid, but we'll just set it PAID
    },
    include: { business: true }
  });
  
  // Set paid amount exactly as the price
  await prisma.booking.update({
    where: { id: bookingId },
    data: { paidAmount: updatedBooking.price }
  });

  revalidatePath(`/book/${updatedBooking.business.slug}`);
  revalidatePath("/dashboard/bookings");
  
  return { success: true };
}
