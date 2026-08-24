"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
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

/**
 * PUBLIC booking creation — used by the /book/[slug] page.
 * businessId is validated against isPublished — not trusted from client.
 * Booking conflict check is wrapped in a serializable transaction to prevent race conditions.
 */
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

  // Use a serializable transaction to prevent TOCTOU race conditions.
  // Both the conflict check and the insert happen atomically.
  const booking = await prisma.$transaction(
    async (tx) => {
      // 1. Verify business is published and accepting bookings.
      const business = await tx.business.findFirst({
        where: { id: data.businessId, isPublished: true },
        select: { id: true, name: true, slug: true },
      });
      if (!business) {
        throw new Error("Business is currently not receiving online appointments.");
      }

      // 2. Verify service exists and belongs to this business.
      const service = await tx.service.findUnique({
        where: { id: data.serviceId },
      });
      if (!service || service.businessId !== data.businessId) {
        throw new Error("Service not found or does not belong to this business.");
      }
      if (!service.isActive) {
        throw new Error("This service is not currently available for booking.");
      }

      // 3. Calculate end time from service duration.
      const endTime = calculateEndTime(data.startTime, service.duration);

      // 4. Check for conflicts inside the transaction (atomic read-check-write).
      const existingBookings = await tx.booking.findMany({
        where: {
          businessId: data.businessId,
          date: data.date,
          status: { in: ["CONFIRMED", "PENDING", "NDR_HOLD"] },
          ...(data.staffId ? { staffId: data.staffId } : {}),
        },
        select: { startTime: true, endTime: true, status: true },
      });

      if (hasTimeSlotConflict(data.startTime, endTime, existingBookings)) {
        throw new Error(
          "This appointment slot was just booked by another customer. Please select a different time."
        );
      }

      // 5. Upsert customer (phone-based, per-business identity).
      let customer = null;
      try {
        customer = await tx.customer.upsert({
          where: {
            businessId_phone: {
              businessId: data.businessId,
              phone: data.customerPhone,
            },
          },
          update: {
            name: data.customerName,
            ...(data.customerEmail ? { email: data.customerEmail } : {}),
            visitCount: { increment: 1 },
            lifetimeValue: { increment: service.price },
          },
          create: {
            businessId: data.businessId,
            name: data.customerName,
            phone: data.customerPhone,
            email: data.customerEmail || null,
            visitCount: 1,
            lifetimeValue: service.price,
            source: "BOOKING",
          },
        });
      } catch (crmErr) {
        // CRM failure must NOT block booking — log and continue.
        console.warn("[CRM] Customer upsert failed, booking will proceed:", crmErr);
      }

      // 6. Create the booking.
      const newBooking = await tx.booking.create({
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
          duration: service.duration,
          price: service.price,
          notes: data.notes || null,
          status: service.price > 0 ? "PENDING" : "CONFIRMED",
          paymentStatus: service.price > 0 ? "UNPAID" : "PAID",
          paymentMethod: data.paymentMethod ?? "UPI",
        },
        include: { service: true },
      });

      return { booking: newBooking, businessSlug: business.slug };
    },
    {
      // Serializable isolation prevents concurrent transactions from reading
      // the same available slot and both succeeding.
      isolationLevel: "Serializable",
    }
  );

  // Non-blocking: trigger WhatsApp confirmation — failure must not affect booking.
  DocodoBackendAPI.verifyNDRBooking({
    businessId: data.businessId,
    bookingId: booking.booking.id,
    customerPhone: data.customerPhone,
    customerName: data.customerName,
  }).catch((err) => {
    console.warn("[NDR] Backend notification failed (non-critical):", err);
  });

  revalidatePath(`/book/${booking.businessSlug}`);
  revalidatePath("/dashboard/bookings");

  return booking.booking;
}

/**
 * Get available time slots for a service on a given date.
 * Used by the public booking page.
 */
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
      where: {
        businessId,
        date,
        status: { notIn: ["CANCELLED", "NO_SHOW"] },
      },
      select: { startTime: true, endTime: true, status: true },
    }),
  ]);

  if (!service) throw new Error("Selected service not found.");
  if (service.businessId !== businessId) {
    throw new Error("Service does not belong to this business.");
  }

  // Determine weekday from date (0=Sun, 1=Mon, ..., 6=Sat)
  const dayIndex = new Date(date).getDay();
  const daysMap = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;
  const dayStr = daysMap[dayIndex];

  const todayHours = workingHours.find((w) => w.day === dayStr);
  if (!todayHours || !todayHours.isOpen) {
    return {
      slots: [],
      isClosed: true,
      reason: "Business is closed on this day of the week.",
    };
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

/**
 * Update booking status — protected, owner-only.
 * Used by the dashboard.
 */
export async function updateBookingStatusAction(rawInput: {
  bookingId: string;
  status: "CONFIRMED" | "PENDING" | "COMPLETED" | "CANCELLED" | "NO_SHOW" | "NDR_HOLD";
  internalNotes?: string;
}) {
  // SECURITY: Verify session and that booking belongs to user's business.
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const validated = UpdateBookingStatusSchema.parse(rawInput);

  // Verify ownership before updating.
  const booking = await prisma.booking.findUnique({
    where: { id: validated.bookingId },
    select: { businessId: true },
  });
  if (!booking) throw new Error("Booking not found.");

  const ownedBusiness = await prisma.business.findFirst({
    where: { id: booking.businessId, ownerId: session.user.id },
    select: { id: true },
  });
  if (!ownedBusiness) {
    throw new Error("Forbidden: you do not have access to this booking.");
  }

  const updated = await prisma.booking.update({
    where: { id: validated.bookingId },
    data: {
      status: validated.status,
      ...(validated.internalNotes !== undefined
        ? { internalNotes: validated.internalNotes }
        : {}),
    },
  });

  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard");
  return updated;
}
