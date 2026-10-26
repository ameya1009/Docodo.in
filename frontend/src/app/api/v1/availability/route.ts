import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractAgentToken, verifyAgentAccessToken } from "@/lib/ai-agents/registry";
import { generateAvailableTimeSlots } from "@/lib/engines/booking-engine";
import { canConsume } from "@/lib/services/entitlement-service";

export const dynamic = "force-dynamic";

const DAYS_MAP = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

/**
 * Isolated Availability & Slot Capacity API for AI Agents and Public Integrations
 * Strictly DPDP-compliant: Does NOT return customer names, phone numbers, or clinical notes.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const requestedBizId = searchParams.get("businessId");
    const serviceId = searchParams.get("serviceId");
    
    // Default date to today in IST (UTC+5:30)
    const istNow = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
    const date = searchParams.get("date") || istNow.toISOString().slice(0, 10);

    // Validate date format early
    const dayIndex = new Date(date + "T00:00:00").getDay();
    if (isNaN(dayIndex) || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: "Invalid date format. Expected YYYY-MM-DD." },
        { status: 400 }
      );
    }

    // Optional Agent verification
    const agentToken = extractAgentToken(req.headers);
    let agentPayload: any = null;
    if (agentToken) {
      const verification = verifyAgentAccessToken(agentToken);
      if (!verification.valid) {
        return NextResponse.json(
          { error: `Unauthorized AI Agent: ${verification.error}` },
          { status: 401 }
        );
      }
      agentPayload = verification.payload;
    }

    if (!slug && !requestedBizId) {
      return NextResponse.json(
        { error: "Missing required parameter: provide 'slug' or 'businessId' to query availability." },
        { status: 400 }
      );
    }

    const business = await prisma.business.findFirst({
      where: slug ? { slug, isPublished: true } : { id: requestedBizId || undefined, isPublished: true },
      select: {
        id: true,
        name: true,
        slug: true,
        address: true,
        city: true,
        phone: true,
        workingHours: true,
        services: {
          where: { isActive: true },
          select: { id: true, name: true, duration: true, price: true, description: true },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!business) {
      return NextResponse.json(
        { error: "Business not found or is currently not active." },
        { status: 404 }
      );
    }

    // Check monthly booking quota
    const limitCheck = await canConsume(business.id, "BOOKINGS_COUNT", 1);
    if (!limitCheck.allowed) {
      return NextResponse.json({
        businessId: business.id,
        businessName: business.name,
        slug: business.slug,
        date,
        isClosed: true,
        reason: "Business has reached monthly appointment capacity.",
        slots: [],
        services: business.services,
      });
    }

    // Determine day of week
    const dayStr = DAYS_MAP[dayIndex];
    const todayHours = business.workingHours.find((w) => w.day?.toUpperCase() === dayStr);

    if (!todayHours || !todayHours.isOpen) {
      return NextResponse.json({
        businessId: business.id,
        businessName: business.name,
        slug: business.slug,
        date,
        isClosed: true,
        reason: "Business is closed on this day of the week.",
        slots: [],
        services: business.services,
      });
    }

    // Determine target service duration
    const targetService = serviceId
      ? business.services.find((s) => s.id === serviceId)
      : business.services[0];

    const duration = targetService ? targetService.duration : 30;

    // Fetch existing booked slots for that day without any customer PII
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const existingBookings = await prisma.booking.findMany({
      where: {
        businessId: business.id,
        date,
        OR: [
          { status: { in: ["CONFIRMED", "NDR_HOLD"] } },
          { status: "PENDING", createdAt: { gte: fifteenMinutesAgo } },
        ],
      },
      select: { startTime: true, endTime: true, status: true },
    });

    const slots = generateAvailableTimeSlots(
      todayHours.openTime,
      todayHours.closeTime,
      duration,
      30,
      existingBookings
    );

    return NextResponse.json({
      success: true,
      businessId: business.id,
      businessName: business.name,
      slug: business.slug,
      date,
      dayOfWeek: dayStr,
      workingHours: {
        openTime: todayHours.openTime,
        closeTime: todayHours.closeTime,
      },
      selectedService: targetService || null,
      availableSlotsCount: slots.length,
      availableSlots: slots,
      services: business.services,
      compliance: {
        dpdpCompliant: true,
        piiMasked: true,
      },
      ...(agentPayload ? { agentId: agentPayload.agentId } : {}),
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to calculate slot availability" },
      { status: 500 }
    );
  }
}
