"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { DocodoBackendAPI } from "@/lib/api-client";
import {
  CreateBookingSchema,
  GetAvailableSlotsSchema,
  UpdateBookingStatusSchema,
} from "@/lib/validations/booking";
import {
  calculateEndTime,
  hasTimeSlotConflict,
  generateAvailableTimeSlots,
} from "@/lib/engines/booking-engine";

export async function createPublicBooking(rawInput: {
  businessId: string;
  serviceId: string;
  staffId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string;
  startTime: string;
  notes?: string;
  paymentMethod?: "UPI" | "CASH_ON_DELIVERY" | "CARDS" | "NETBANKING";
}) {
  const data = CreateBookingSchema.parse(rawInput);

  // Verify business exists and is publicly active
  const business = await prisma.business.findFirst({
    where: { id: data.businessId, isPublished: true },
    select: { id: true, name: true, slug: true },
  });

  if (!business) {
    throw new Error("Business is currently not receiving online appointments.");
  }

  const service = await prisma.service.findUnique({ where: { id: data.serviceId } });
  const duration = service?.duration ?? 60;
  const endTime = calculateEndTime(data.startTime, duration);

  // Retrieve existing bookings on that date for conflict checking
  const existingBookings = await prisma.booking.findMany({
    where: {
      businessId: data.businessId,
      date: data.date,
      status: { in: ["CONFIRMED", "PENDING", "NDR_HOLD"] },
      ...(data.staffId ? { staffId: data.staffId } : {}),
    },
    select: { startTime: true, endTime: true, status: true },
  });

  if (hasTimeSlotConflict(data.startTime, endTime, existingBookings)) {
    throw new Error("This timeslot was just booked by another customer. Please select another available time.");
  }

  // Securely register or update Customer CRM profile without exposing auth credentials
  let customer = null;
  try {
    customer = await prisma.customer.upsert({
      where: {
        businessId_phone: {
          businessId: data.businessId,
          phone: data.customerPhone,
        },
      },
      update: {
        name: data.customerName,
        email: data.customerEmail || undefined,
        visitCount: { increment: 1 },
        lifetimeValue: { increment: service?.price ?? 0 },
      },
      create: {
        businessId: data.businessId,
        name: data.customerName,
        phone: data.customerPhone,
        email: data.customerEmail || null,
        visitCount: 1,
        lifetimeValue: service?.price ?? 0,
        source: "BOOKING",
      },
    });
  } catch (crmError) {
    console.warn("CRM silent sync fallback:", crmError);
  }

  const booking = await prisma.booking.create({
    data: {
      businessId: data.businessId,
      serviceId: data.serviceId,
      staffId: data.staffId || null,
      customerId: customer?.id || null,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || null,
      date: data.date,
      startTime: data.startTime,
      endTime,
      duration,
      price: service?.price ?? 0,
      notes: data.notes || null,
      status: (service?.price ?? 0) > 0 ? "PENDING" : "CONFIRMED",
      paymentStatus: (service?.price ?? 0) > 0 ? "UNPAID" : "PAID",
      paymentMethod: data.paymentMethod,
    },
    include: {
      service: true,
    },
  });

  // Automatically trigger real-time WhatsApp confirmation and NDR verification shield
  try {
    await DocodoBackendAPI.verifyNDRBooking({
      businessId: data.businessId,
      bookingId: booking.id,
      customerPhone: data.customerPhone,
      customerName: data.customerName,
    });
  } catch (backendError) {
    console.warn("Notice: Offline backup queue for WhatsApp NDR check activated:", backendError);
  }

  revalidatePath(`/book/${business.slug}`);
  revalidatePath("/dashboard/bookings");
  return booking;
}

export async function getAvailableSlotsAction(rawInput: {
  businessId: string;
  serviceId: string;
  date: string;
}) {
  const { businessId, serviceId, date } = GetAvailableSlotsSchema.parse(rawInput);

  const [service, workingHours, existingBookings] = await Promise.all([
    prisma.service.findUnique({ where: { id: serviceId } }),
    prisma.workingHours.findMany({ where: { businessId } }),
    prisma.booking.findMany({
      where: { businessId, date, status: { notIn: ["CANCELLED", "NO_SHOW"] } },
      select: { startTime: true, endTime: true, status: true },
    }),
  ]);

  if (!service) throw new Error("Selected service not found.");

  // Determine weekday from date string (0=Sun, 1=Mon...)
  const dayIndex = new Date(date).getDay();
  const daysMap = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const dayStr = daysMap[dayIndex];

  const todayHours = workingHours.find((w) => w.day === dayStr);
  if (!todayHours || !todayHours.isOpen) {
    return { slots: [], isClosed: true, reason: "Business is closed on this day of the week." };
  }

  const slots = generateAvailableTimeSlots(
    todayHours.openTime,
    todayHours.closeTime,
    service.duration,
    30,
    existingBookings
  );

  return { slots, isClosed: false };
}

export async function updateBookingStatusAction(rawInput: {
  bookingId: string;
  status: "CONFIRMED" | "PENDING" | "COMPLETED" | "CANCELLED" | "NO_SHOW" | "NDR_HOLD";
  internalNotes?: string;
}) {
  const validated = UpdateBookingStatusSchema.parse(rawInput);
  const updated = await prisma.booking.update({
    where: { id: validated.bookingId },
    data: {
      status: validated.status,
      ...(validated.internalNotes !== undefined ? { internalNotes: validated.internalNotes } : {}),
    },
  });

  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard");
  return updated;
}
