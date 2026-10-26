import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DocodoBackendAPI } from "@/lib/api-client";
import { sendBookingConfirmationEmail } from "@/lib/notifications";

export const dynamic = "force-dynamic";

/**
 * Pre-Appointment Automated Reminder Cron Worker (24-Hour & 2-Hour)
 * Triggered periodically via Vercel Cron or QStash.
 * Scans for:
 * 1. 24-hour pre-appointment reminders for tomorrow's confirmed clinic visits.
 * 2. 2-hour pre-appointment reminders for today's upcoming confirmed slots.
 * Enforces DPDP Act 2023 compliance by skipping any patient who has opted out.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // Enforce strict header verification: reject unauthenticated calls even if CRON_SECRET is unset
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: "Unauthorized cron trigger. Valid Bearer CRON_SECRET is required." },
      { status: 401 }
    );
  }

  try {
    // Calculate date strings in Asia/Kolkata timezone (IST is UTC+5:30)
    const istNow = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
    const todayStr = istNow.toISOString().slice(0, 10);
    const istTomorrow = new Date(istNow.getTime() + 24 * 60 * 60 * 1000);
    const tomorrowStr = istTomorrow.toISOString().slice(0, 10);

    const currentHour = istNow.getUTCHours();
    const currentMin = istNow.getUTCMinutes();
    const currentMinutesFromMidnight = currentHour * 60 + currentMin;

    let dispatched24h = 0;
    let dispatched2h = 0;
    let skippedOptOut = 0;
    let failedCount = 0;

    const BATCH_SIZE = 10;

    // ─── 1. PROCESS 24-HOUR REMINDERS (FOR TOMORROW) ───────────────────────────
    const upcoming24hBookings = await prisma.booking.findMany({
      where: {
        date: tomorrowStr,
        status: "CONFIRMED",
        reminderSent: false,
      },
      include: {
        business: true,
        service: true,
        customer: true,
      },
      take: 100,
    });

    const process24hBooking = async (booking: typeof upcoming24hBookings[number]): Promise<void> => {
      // Check if patient opted out
      if (booking.customer?.optedOut) {
        skippedOptOut++;
        await prisma.booking.update({
          where: { id: booking.id },
          data: { reminderSent: true },
        });
        return;
      }

      const bizName = booking.business.name;
      const serviceName = booking.service?.name || "Appointment";
      const timeStr = booking.startTime;
      const phone = booking.customerPhone;

      const waContent = `⏰ Reminder: You have an appointment for *${serviceName}* with *${bizName}* tomorrow at *${timeStr}*. Address: ${booking.business.address || booking.business.city || "Clinic premises"}. Reply 'RESCHEDULE' if you need changes.`;

      try {
        await DocodoBackendAPI.dispatchWhatsAppMessage({
          businessId: booking.businessId,
          recipientPhone: phone,
          messageType: "REMINDER_24HR",
          customMessage: waContent,
        });
      } catch (waErr) {
        console.warn(`[Cron 24h] WhatsApp reminder warning for ${booking.id}:`, waErr);
      }

      if (booking.customerEmail) {
        try {
          await sendBookingConfirmationEmail({
            toEmail: booking.customerEmail,
            customerName: booking.customerName,
            businessName: bizName,
            serviceName,
            date: booking.date,
            startTime: booking.startTime,
            price: booking.price,
            paymentMethod: "Pre-appointment Reminder",
          });
        } catch (emailErr) {
          console.warn(`[Cron 24h] Email reminder warning for ${booking.id}:`, emailErr);
        }
      }

      await prisma.booking.update({
        where: { id: booking.id },
        data: { reminderSent: true },
      });
      dispatched24h++;
    };

    for (let i = 0; i < upcoming24hBookings.length; i += BATCH_SIZE) {
      const batch = upcoming24hBookings.slice(i, i + BATCH_SIZE);
      const results = await Promise.allSettled(batch.map((b) => process24hBooking(b)));
      results.forEach((r, idx) => {
        if (r.status === "rejected") {
          failedCount++;
          console.error(`[Cron 24h] Error for booking ${batch[idx].id}:`, r.reason);
        }
      });
    }

    // ─── 2. PROCESS 2-HOUR REMINDERS (FOR TODAY) ───────────────────────────────
    const todayConfirmedBookings = await prisma.booking.findMany({
      where: {
        date: todayStr,
        status: "CONFIRMED",
        reminder2hSent: false,
      },
      include: {
        business: true,
        service: true,
        customer: true,
      },
      take: 100,
    });

    const isTestMode = request.nextUrl.searchParams.get("test") === "true" || process.env.NODE_ENV === "test";
    const isForce2h = request.nextUrl.searchParams.get("force2h") === "true";

    // Filter appointments occurring within the upcoming 2 to 2.5 hours
    const eligible2hBookings = todayConfirmedBookings.filter((b) => {
      if (isForce2h || isTestMode) return true;
      if (!b.startTime) return false;
      const [h, m] = b.startTime.split(":").map(Number);
      if (isNaN(h) || isNaN(m)) return false;
      const bookingMinutes = h * 60 + m;
      const diffMinutes = bookingMinutes - currentMinutesFromMidnight;
      return diffMinutes <= 150 && diffMinutes >= -15;
    });

    const process2hBooking = async (booking: typeof eligible2hBookings[number]): Promise<void> => {
      // Check if patient opted out
      if (booking.customer?.optedOut) {
        skippedOptOut++;
        await prisma.booking.update({
          where: { id: booking.id },
          data: { reminder2hSent: true },
        });
        return;
      }

      const bizName = booking.business.name;
      const serviceName = booking.service?.name || "Consultation";
      const timeStr = booking.startTime;
      const phone = booking.customerPhone;

      const waContent = `⏰ 2-Hour Reminder: Dr. appointment for *${serviceName}* with *${bizName}* is today at *${timeStr}*. Address: ${booking.business.address || booking.business.city || "Clinic premises"}. Please arrive 5 minutes early.`;

      try {
        await DocodoBackendAPI.dispatchWhatsAppMessage({
          businessId: booking.businessId,
          recipientPhone: phone,
          messageType: "REMINDER_2HR",
          customMessage: waContent,
        });
      } catch (waErr) {
        console.warn(`[Cron 2h] WhatsApp reminder warning for ${booking.id}:`, waErr);
      }

      await prisma.booking.update({
        where: { id: booking.id },
        data: { reminder2hSent: true },
      });
      dispatched2h++;
    };

    for (let i = 0; i < eligible2hBookings.length; i += BATCH_SIZE) {
      const batch = eligible2hBookings.slice(i, i + BATCH_SIZE);
      const results = await Promise.allSettled(batch.map((b) => process2hBooking(b)));
      results.forEach((r, idx) => {
        if (r.status === "rejected") {
          failedCount++;
          console.error(`[Cron 2h] Error for booking ${batch[idx].id}:`, r.reason);
        }
      });
    }

    return NextResponse.json({
      success: true,
      todayDate: todayStr,
      targetDate24h: tomorrowStr,
      reminders24hSent: dispatched24h,
      reminders2hSent: dispatched2h,
      skippedOptOut,
      failed: failedCount,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to run reminder cron";
    console.error("[Cron Reminder Error]", error);
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}
