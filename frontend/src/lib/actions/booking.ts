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
import { checkRateLimit } from "@/lib/rate-limit";
import { 
  canConsume, 
  recordUsage, 
  getBusinessSubscription,
} from "@/lib/services/entitlement-service";
import { PILOT_BOOKING_LIMIT } from "@/lib/plans-config";

/**
 * PUBLIC booking creation — used by the /book/[slug] page.
 * 
 * Enforces real subscription & entitlement limits server-side:
 * 1. Authenticate / Identify business
 * 2. Determine active subscription / plan
 * 3. Determine booking limit
 * 4. Calculate current-period usage inside an atomic serializable transaction
 * 5. Reject if limit exceeded (cannot exceed 50 bookings on Pilot)
 * 6. Concurrency & race condition defense
 * 7. Atomically create booking & record usage
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

  // Rate-limit by phone and business to prevent slot-hoarding attacks
  const rateLimit = checkRateLimit(`booking:${data.businessId}:${data.customerPhone}`, {
    maxTokens: 6,
    intervalMs: 60_000,
  });
  if (!rateLimit.allowed) {
    throw new Error("Too many booking attempts. Please wait a minute before submitting again.");
  }

  // Pre-check entitlement before opening transaction for rapid fast-fail
  const preCheck = await canConsume(data.businessId, "BOOKINGS_COUNT", 1);
  if (!preCheck.allowed) {
    throw new Error(
      "This business has reached its monthly booking limit and is currently not accepting new online bookings."
    );
  }

  // Use a serializable transaction to prevent TOCTOU race conditions.
  const booking = await prisma.$transaction(
    async (tx) => {
      // 1. Verify business is published and active.
      const business = await tx.business.findFirst({
        where: { id: data.businessId, isPublished: true },
        select: { id: true, name: true, slug: true },
      });
      if (!business) {
        throw new Error("Business is currently not receiving online appointments.");
      }

      // 2. Strict In-Transaction Booking Limit & Concurrency Defense
      const sub = await getBusinessSubscription(data.businessId, tx);
      const isPilot = sub.planId === "pilot";

      if (isPilot) {
        const periodStart = new Date(sub.currentPeriodStart);
        const periodEnd = new Date(sub.currentPeriodEnd);

        // Count non-cancelled bookings directly within transaction snapshot
        const currentPeriodBookingsCount = await tx.booking.count({
          where: {
            businessId: data.businessId,
            createdAt: {
              gte: periodStart,
              lte: periodEnd,
            },
            status: { not: "CANCELLED" },
          },
        });

        if (currentPeriodBookingsCount >= PILOT_BOOKING_LIMIT) {
          throw new Error(
            "This business has reached its monthly booking limit and is currently not accepting new online bookings."
          );
        }
      }

      // 3. Verify service exists and belongs to this business.
      const service = await tx.service.findUnique({
        where: { id: data.serviceId },
      });
      if (!service || service.businessId !== data.businessId) {
        throw new Error("Service not found or does not belong to this business.");
      }
      if (!service.isActive) {
        throw new Error("This service is not currently available for booking.");
      }

      // 4. Calculate end time from service duration.
      const endTime = calculateEndTime(data.startTime, service.duration);

      // 5. Check for conflicts inside the transaction (atomic read-check-write).
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
      const existingBookings = await tx.booking.findMany({
        where: {
          businessId: data.businessId,
          date: data.date,
          OR: [
            { status: { in: ["CONFIRMED", "NDR_HOLD"] } },
            { status: "PENDING", createdAt: { gte: fifteenMinutesAgo } },
          ],
          ...(data.staffId ? { staffId: data.staffId } : {}),
        },
        select: { startTime: true, endTime: true, status: true },
      });

      if (hasTimeSlotConflict(data.startTime, endTime, existingBookings)) {
        throw new Error(
          "This appointment slot was just booked by another customer. Please select a different time."
        );
      }

      // 6. Upsert customer (phone-based, per-business identity).
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
        console.warn("[CRM] Customer upsert handled:", crmErr);
      }

      // 7. Create the booking.
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

      // 8. Atomically Record Usage for the current billing period
      await recordUsage(data.businessId, "BOOKINGS_COUNT", 1, tx);

      return { booking: newBooking, businessSlug: business.slug };
    },
    {
      isolationLevel: "Serializable",
    }
  );

  // Non-blocking notifications
  DocodoBackendAPI.verifyNDRBooking({
    businessId: data.businessId,
    bookingId: booking.booking.id,
    customerPhone: data.customerPhone,
    customerName: data.customerName,
  }).catch((err) => {
    console.warn("[NDR] Backend notification handled:", err);
  });

  if (data.customerEmail) {
    import("@/lib/notifications").then(({ sendBookingConfirmationEmail }) => {
      sendBookingConfirmationEmail({
        toEmail: data.customerEmail!,
        customerName: data.customerName,
        businessName: "Docodo Partner",
        serviceName: booking.booking.service?.name || "Appointment",
        date: data.date,
        startTime: data.startTime,
        price: booking.booking.price,
        paymentMethod: data.paymentMethod,
      }).catch((err) => console.warn("[Email Notification] Handled:", err));
    });
  }

  revalidatePath(`/book/${booking.businessSlug}`);
  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard/usage");
  revalidatePath("/dashboard");

  return booking.booking;
}

/**
 * Get available time slots for a service on a given date.
 */
export async function getAvailableSlotsAction(rawInput: {
  businessId: string;
  serviceId: string;
  date: string;
}) {
  const { businessId, serviceId, date } = GetAvailableSlotsSchema.parse(rawInput);

  // Check if business has reached monthly booking limit
  const limitCheck = await canConsume(businessId, "BOOKINGS_COUNT", 1);
  if (!limitCheck.allowed) {
    return {
      slots: [],
      isClosed: true,
      reason: "This business has reached its monthly booking limit and is currently not accepting new online bookings.",
      limitReached: true,
    };
  }

  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
  const [service, workingHours, existingBookings] = await Promise.all([
    prisma.service.findUnique({ where: { id: serviceId } }),
    prisma.workingHours.findMany({ where: { businessId } }),
    prisma.booking.findMany({
      where: {
        businessId,
        date,
        OR: [
          { status: { in: ["CONFIRMED", "NDR_HOLD"] } },
          { status: "PENDING", createdAt: { gte: fifteenMinutesAgo } },
        ],
      },
      select: { startTime: true, endTime: true, status: true },
    }),
  ]);

  if (!service) throw new Error("Selected service not found.");
  if (service.businessId !== businessId) {
    throw new Error("Service does not belong to this business.");
  }

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
 */
export async function updateBookingStatusAction(rawInput: {
  bookingId: string;
  status: "CONFIRMED" | "PENDING" | "COMPLETED" | "CANCELLED" | "NO_SHOW" | "NDR_HOLD";
  internalNotes?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const validated = UpdateBookingStatusSchema.parse(rawInput);

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
  revalidatePath("/dashboard/usage");
  revalidatePath("/dashboard");
  return updated;
}
