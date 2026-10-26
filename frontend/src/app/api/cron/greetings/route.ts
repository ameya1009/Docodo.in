import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getHinduCalendarStatus, formatPatientBirthdayMessage } from "@/lib/engines/hindu-calendar-greetings";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Enforce strict header verification: reject unauthenticated calls even if CRON_SECRET is unset
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized cron execution. Valid Bearer CRON_SECRET is required." }, { status: 401 });
    }

    const businessSlug = req.nextUrl.searchParams.get("slug");
    const now = new Date();

    // Query target businesses
    const businesses = await prisma.business.findMany({
      where: businessSlug ? { slug: businessSlug } : { isPublished: true },
      select: {
        id: true,
        name: true,
        slug: true,
        customers: {
          select: { id: true, name: true, phone: true, email: true, notes: true, tags: true },
          take: 50,
        },
      },
      take: 20,
    });

    const results = [];

    for (const biz of businesses) {
      const status = getHinduCalendarStatus(now, biz.name);

      // Check for customers with birthday today
      // Birthday can be recorded in notes or tags as YYYY-MM-DD, MM-DD, DD-MM, etc.
      const nowMonth = String(now.getMonth() + 1).padStart(2, "0");
      const nowDate = String(now.getDate()).padStart(2, "0");
      const patterns = [
        `${nowMonth}-${nowDate}`,
        `${nowDate}-${nowMonth}`,
        `${nowMonth}/${nowDate}`,
        `${nowDate}/${nowMonth}`,
      ];

      const birthdayCustomers = (biz.customers || []).filter((c) => {
        const text = `${c.notes || ""} ${c.tags || ""}`.toLowerCase();
        const hasBdayWord = /dob|birthday|bday|birth|janm/i.test(text);
        const hasDateMatch = patterns.some((p) => text.includes(p));
        return (hasBdayWord && hasDateMatch) || (text.includes("dob:") && patterns.some((p) => text.includes(p)));
      });

      const birthdayMessages = [];
      for (const c of birthdayCustomers) {
        const msg = formatPatientBirthdayMessage({
          patientName: c.name,
          clinicName: biz.name,
          appointmentLink: `https://docodo.in/book/${biz.slug}`,
        });

        // If email is available, dispatch via Resend
        if (c.email && process.env.RESEND_API_KEY) {
          try {
            const { Resend } = await import("resend");
            const resendClient = new Resend(process.env.RESEND_API_KEY);
            await resendClient.emails.send({
              from: "Docodo Care Team <greetings@docodo.in>",
              to: [c.email],
              subject: `Happy Birthday from ${biz.name}! 🎂🎉`,
              text: msg,
            });
          } catch (e) {
            console.warn("[Birthday Dispatch] Email warning:", e);
          }
        }

        birthdayMessages.push({
          customerId: c.id,
          customerName: c.name,
          phone: c.phone,
          email: c.email,
          message: msg,
        });
      }

      results.push({
        businessId: biz.id,
        businessName: biz.name,
        festivalToday: status.festivalToday ? status.festivalToday.name : null,
        festivalGreeting: status.festivalGreetingText,
        upcomingFestivalsCount: status.upcomingFestivals.length,
        birthdaysDetected: birthdayMessages.length,
        birthdayMessages,
      });
    }

    return NextResponse.json({
      success: true,
      executionDate: now.toISOString(),
      processedBusinesses: results.length,
      details: results,
    });
  } catch (err: any) {
    console.error("[Cron Greetings Engine Error]:", err);
    return NextResponse.json({ error: err.message || "Failed to execute greetings cron" }, { status: 500 });
  }
}
