import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DocodoBackendAPI } from "@/lib/api-client";
import { sendBookingConfirmationEmail } from "@/lib/notifications";

export const dynamic = "force-dynamic";

/**
 * 24-Hour Pre-Appointment Automated Reminder Cron Worker
 * Triggered daily via Vercel Cron or QStash.
 * Scans for all CONFIRMED bookings scheduled for tomorrow and dispatches WhatsApp / Email alerts.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // Verify cron secret if configured
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized cron trigger" }, { status: 401 });
  }

  try {
    // Calculate tomorrow's date string in Asia/Kolkata timezone (IST is UTC+5:30)
    const istNow = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
    const istTomorrow = new Date(istNow.getTime() + 24 * 60 * 60 * 1000);
    const tomorrowStr = istTomorrow.toISOString().slice(0, 10);

    const upcomingBookings = await prisma.booking.findMany({
      where: {
        date: tomorrowStr,
        status: "CONFIRMED",
        reminderSent: false,
      },
      include: {
        business: true,
        service: true,
      },
      take: 100,
    });

    let dispatchedCount = 0;
    let failedCount = 0;

    // P0-8: Process in batches of 10 with Promise.allSettled to prevent
    // Vercel serverless timeout when handling 100+ bookings sequentially.
    const BATCH_SIZE = 10;

    const processBooking = async (booking: typeof upcomingBookings[number]): Promise<void> => {
      const bizName = booking.business.name;
      const serviceName = booking.service?.name || "Appointment";
      const timeStr = booking.startTime;
      const phone = booking.customerPhone;

      // 1. Dispatch WhatsApp Reminder
      const waContent = `⏰ Reminder: You have an appointment for *${serviceName}* with *${bizName}* tomorrow at *${timeStr}*. Address: ${booking.business.address || booking.business.city || "Clinic / Salon"}. Reply 'RESCHEDULE' if you need changes.`;

      try {
        await DocodoBackendAPI.dispatchWhatsAppMessage({
          businessId: booking.businessId,
          recipientPhone: phone,
          messageType: "REMINDER_24HR",
          customMessage: waContent,
        });
      } catch (waErr) {
        console.warn(`[Cron] WhatsApp reminder warning for ${booking.id}:`, waErr);
      }

      // 2. Dispatch Email if email is present
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
          console.warn(`[Cron] Email reminder warning for ${booking.id}:`, emailErr);
        }
      }

      // Mark reminder as sent
      await prisma.booking.update({
        where: { id: booking.id },
        data: { reminderSent: true },
      });
    };

    for (let i = 0; i < upcomingBookings.length; i += BATCH_SIZE) {
      const batch = upcomingBookings.slice(i, i + BATCH_SIZE);
      const results = await Promise.allSettled(batch.map((b) => processBooking(b)));
      results.forEach((result, idx) => {
        if (result.status === "fulfilled") {
          dispatchedCount++;
        } else {
          failedCount++;
          console.error(`[Cron] Reminder failed for booking ${batch[idx].id}:`, result.reason);
        }
      });
    }

    return NextResponse.json({
      success: true,
      targetDate: tomorrowStr,
      remindersSent: dispatchedCount,
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
