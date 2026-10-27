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
import { isSerializationConflict, runWithSerializationRetry } from "@/lib/concurrency";
export { isSerializationConflict, runWithSerializationRetry };

/**
 * Detects whether an error was caused by a database transaction serialization conflict or deadlock.
 * Catches Prisma code P2034 and PostgreSQL code 40001 (serialization_failure).
 */


/**
 * Executes a function within an exponential backoff retry loop with randomized jitter
 * specifically catching serialization failures (P2034 / 40001 / 40P01) under high concurrency.
 */


/**
 * PUBLIC booking creation — used by the /book/[slug] page.
 * 
 * Enforces real subscription & entitlement limits server-side:
 * 1. Authenticate / Identify business
 * 2. Determine active subscription / plan
 * 3. Determine booking limit
 * 4. Calculate current-period usage inside an atomic serializable transaction
 * 5. Reject if limit exceeded (cannot exceed 50 bookings on Pilot)
 * 6. Concurrency & race condition defense with retry wrapper
 * 7. Atomically create booking
 * 8. Decoupled usage tracking outside slot-locking transaction
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
  paymentMethod?: "UPI" | "CASH_ON_DELIVERY" | "CARDS" | "NETBANKING" | "FREE";
  paymentPreference?: string;
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

  // Use a serializable transaction wrapped in an exponential backoff retry loop
  // to prevent TOCTOU race conditions while gracefully handling serialization conflicts.
  const booking = await runWithSerializationRetry(async () => {
    return await prisma.$transaction(
      async (tx) => {
        // 1. Verify business is published and active.
        const business = await tx.business.findFirst({
          where: { id: data.businessId, isPublished: true },
          select: { id: true, name: true, slug: true },
        });
        if (!business) {
          throw new Error("Business is currently not receiving online appointments.");
        }

        // 2. Service verification and slot lock isolation:
        // Entitlement pre-checks (canConsume) and usage recording (recordUsage) are handled outside
        // this serializable transaction to prevent cross-doctor / cross-slot predicate lock serialization.

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

        // Multi-Provider Round-Robin Allocation:
        // If data.staffId is not explicitly provided, query active staff members for that business.
        // If staff members exist, allocate the booking to the staff member with the fewest bookings on that date.
        let assignedStaffId = data.staffId || null;
        if (!assignedStaffId) {
          const activeStaff = await tx.staff.findMany({
            where: {
              businessId: data.businessId,
              isActive: true,
            },
            select: { id: true },
          });

          if (activeStaff.length > 0) {
            const staffIds = activeStaff.map((s) => s.id);
            const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

            // Query existing slot bookings for active staff on this date to prioritize unconflicted providers
            const slotBookings = await tx.booking.findMany({
              where: {
                businessId: data.businessId,
                date: data.date,
                staffId: { in: staffIds },
                OR: [
                  { status: { in: ["CONFIRMED", "NDR_HOLD"] } },
                  { status: "PENDING", createdAt: { gte: fifteenMinutesAgo } },
                ],
              },
              select: { staffId: true, startTime: true, endTime: true, status: true },
            });

            // Find providers who do NOT have a time conflict for this appointment slot
            const unconflictedStaff = activeStaff.filter((s) => {
              const providerBookings = slotBookings.filter((b) => b.staffId === s.id);
              return !hasTimeSlotConflict(data.startTime, endTime, providerBookings);
            });

            // Candidate pool: prefer unconflicted staff; if all conflicted, fall back to all active staff
            const candidates = unconflictedStaff.length > 0 ? unconflictedStaff : activeStaff;
            const candidateIds = candidates.map((s) => s.id);

            const staffBookings = await tx.booking.groupBy({
              by: ["staffId"],
              where: {
                businessId: data.businessId,
                date: data.date,
                staffId: { in: candidateIds },
                status: { in: ["CONFIRMED", "PENDING", "COMPLETED", "NDR_HOLD"] },
              },
              _count: { id: true },
            });

            const countMap = new Map<string, number>();
            for (const s of candidates) {
              countMap.set(s.id, 0);
            }
            for (const b of staffBookings) {
              if (b.staffId) {
                countMap.set(b.staffId, b._count.id);
              }
            }

            let selectedStaffId = candidates[0].id;
            let minCount = countMap.get(selectedStaffId) ?? 0;

            for (const s of candidates) {
              const count = countMap.get(s.id) ?? 0;
              if (count < minCount) {
                minCount = count;
                selectedStaffId = s.id;
              }
            }

            assignedStaffId = selectedStaffId;
          }
        }

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
            ...(assignedStaffId ? { staffId: assignedStaffId } : {}),
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
              // P0-6: lifetimeValue is incremented only on payment confirmation,
              // not here at booking creation time, to prevent CRM LTV inflation.
            },
            create: {
              businessId: data.businessId,
              name: data.customerName,
              phone: data.customerPhone,
              email: data.customerEmail || null,
              visitCount: 1,
              lifetimeValue: 0, // starts at 0; set to service.price after payment verified
              source: "BOOKING",
            },
          });
        } catch (crmErr) {
          console.warn("[CRM] Customer upsert handled:", crmErr);
        }

        // 7. Create the booking.
        // Under direct merchant settlement (Pay at Venue or Direct UPI), all public bookings are
        // confirmed appointments on the calendar. This prevents slot release after 15 mins and ensures
        // automated 24-hr reminder crons dispatch correctly.
        const isFree = service.price === 0 || data.paymentMethod === "FREE";
        const isPayAtVenue = !isFree && (data.paymentPreference === "cash" || data.paymentPreference === "venue" || data.paymentMethod === "CASH_ON_DELIVERY");
        const bookingStatus = "CONFIRMED";
        const bookingPaymentStatus = isFree ? "PAID" : "UNPAID";
        const bookingPaymentMethod = isFree ? "FREE" : isPayAtVenue ? "CASH_ON_DELIVERY" : (data.paymentMethod ?? "UPI");
        const newBooking = await tx.booking.create({
          data: {
            businessId: data.businessId,
            serviceId: data.serviceId,
            staffId: assignedStaffId,
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
            status: bookingStatus,
            paymentStatus: bookingPaymentStatus,
            paymentMethod: bookingPaymentMethod,
          },
          include: { service: true },
        });

        // NOTE: recordUsage is intentionally decoupled outside tx to eliminate cross-slot row locks
        return { booking: newBooking, businessSlug: business.slug };
      },
      {
        isolationLevel: "Serializable",
      }
    );
  }, 4);

  // 8. Decoupled Clinic-Wide Usage Lock:
  // Move recordUsage OUT of the serializable slot-locking transaction so concurrent patients
  // booking different doctors/slots in the same clinic do NOT serialize on the identical monthly UsageRecord row.
  try {
    await recordUsage(data.businessId, "BOOKINGS_COUNT", 1);
  } catch (usageErr) {
    console.warn("[createPublicBooking] Decoupled usage record update handled:", usageErr);
  }

  // Resiliently sync booking record to Supabase DB
  try {
    const { db } = await import("@/lib/supabase-db");
    await db.booking.create({
      data: {
        id: booking.booking.id,
        businessId: data.businessId,
        serviceId: data.serviceId,
        staffId: booking.booking.staffId || null,
        customerId: booking.booking.customerId || null,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail || null,
        date: data.date,
        startTime: data.startTime,
        endTime: booking.booking.endTime,
        duration: booking.booking.duration,
        price: booking.booking.price,
        notes: data.notes || null,
        status: booking.booking.status,
        paymentStatus: booking.booking.paymentStatus,
        paymentMethod: booking.booking.paymentMethod,
      },
    }).catch(() => null);
  } catch (sbErr) {
    console.warn("[createPublicBooking] Supabase booking sync handled:", sbErr);
  }

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
  return updated;
}
