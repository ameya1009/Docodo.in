"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { DocodoBackendAPI } from "@/lib/api-client";
import { GetDashboardStatsSchema } from "@/lib/validations/dashboard";
import {
  calculateTotalRevenue,
  calculateCompletionRate,
  calculateAverageOrderValue,
  getStatusBreakdown,
  aggregateRevenueByDate,
} from "@/lib/engines/dashboard-engine";

/**
 * Resolves the authenticated user's business.
 * Throws if the session is invalid or the user has no business.
 * This is the single source of truth for tenant resolution.
 */
async function requireAuthBusiness() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized: you must be logged in.");
  }

  const business = await prisma.business.findFirst({
    where: { ownerId: session.user.id },
    select: { id: true, slug: true, name: true, ownerId: true },
  });

  if (!business) {
    throw new Error("No business found for this account.");
  }

  return { session, business };
}

/**
 * Verifies that a booking belongs to the authenticated user's business.
 * Prevents IDOR: a user from Business A modifying Business B's bookings.
 */
async function requireBookingOwnership(bookingId: string): Promise<string> {
  const { business } = await requireAuthBusiness();

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: { id: true, businessId: true },
  });

  if (!booking) {
    throw new Error("Booking not found.");
  }

  if (booking.businessId !== business.id) {
    throw new Error("Forbidden: you do not have access to this booking.");
  }

  return booking.id;
}

export async function getDashboardData() {
  const session = await auth();
  if (!session?.user?.id && !session?.user?.email) return null;

  const user = await prisma.user.findFirst({
    where: session.user.id
      ? { id: session.user.id }
      : { email: session.user.email! },
    include: {
      businesses: {
        include: {
          services: true,
          staff: true,
          workingHours: true,
          bookings: {
            orderBy: { createdAt: "desc" },
            take: 10,
            include: { service: true, customer: true },
          },
        },
      },
    },
  });

  if (!user || !user.businesses || user.businesses.length === 0) {
    return null;
  }

  const business = user.businesses[0];

  const [bookings, customerCount, upcomingBookings, recentEnquiries] = await Promise.all([
    prisma.booking.findMany({
      where: { businessId: business.id },
      select: {
        id: true,
        price: true,
        status: true,
        date: true,
        startTime: true,
        customerName: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.customer.count({ where: { businessId: business.id } }),
    prisma.booking.findMany({
      where: {
        businessId: business.id,
        status: { in: ["CONFIRMED", "PENDING"] },
      },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
      take: 8,
      include: { service: true, staff: true },
    }),
    prisma.enquiry.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  const records = bookings.map((b) => ({
    price: Number(b.price) || 0,
    status: b.status || "CONFIRMED",
    date: b.date,
  }));

  const totalRevenue = calculateTotalRevenue(records);
  const completionRate = calculateCompletionRate(records);
  const averageOrderValue = calculateAverageOrderValue(
    totalRevenue,
    records.filter((r) => ["CONFIRMED", "COMPLETED"].includes(r.status)).length
  );
  const statusBreakdown = getStatusBreakdown(records);
  const revenueByDate = aggregateRevenueByDate(records);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayBookingsCount = bookings.filter((b) => b.date === todayStr).length;

  const currentMonthStr = todayStr.slice(0, 7);
  const monthlyRecords = records.filter(
    (r) => r.date && r.date.startsWith(currentMonthStr)
  );
  const monthlyRevenue = calculateTotalRevenue(monthlyRecords);

  return {
    business: business || {},
    upcomingBookings: upcomingBookings || [],
    recentBookings: (business && business.bookings) || [],
    recentEnquiries: recentEnquiries || [],
    stats: {
      todayBookings: todayBookingsCount || 0,
      monthlyRevenue: monthlyRevenue || 0,
      totalRevenue: totalRevenue || 0,
      customers: customerCount || 0,
      activeServices: (business?.services || []).length,
      completionRate: completionRate || 0,
      averageOrderValue: averageOrderValue || 0,
      statusBreakdown: statusBreakdown || {},
      revenueByDate: revenueByDate || [],
    },
  };
}


export async function getDashboardStatsAction(rawInput: {
  businessId: string;
  dateFilter?: {
    period?: "TODAY" | "WEEK" | "MONTH" | "ALL";
    startDate?: string;
    endDate?: string;
  };
}) {
  // SECURITY: Ignore the businessId from client — always resolve from session.
  GetDashboardStatsSchema.parse(rawInput);
  const { business } = await requireAuthBusiness();

  const [bookings, customerCount, servicesCount] = await Promise.all([
    prisma.booking.findMany({
      where: { businessId: business.id },
      select: {
        price: true,
        status: true,
        date: true,
        startTime: true,
        customerName: true,
      },
    }),
    prisma.customer.count({ where: { businessId: business.id } }),
    prisma.service.count({ where: { businessId: business.id } }),
  ]);

  const records = bookings.map((b) => ({
    price: Number(b.price) || 0,
    status: b.status || "CONFIRMED",
    date: b.date,
  }));

  const totalRevenue = calculateTotalRevenue(records);
  const completionRate = calculateCompletionRate(records);
  const averageOrderValue = calculateAverageOrderValue(
    totalRevenue,
    records.filter((r) => ["CONFIRMED", "COMPLETED"].includes(r.status)).length
  );
  const statusBreakdown = getStatusBreakdown(records);
  const revenueByDate = aggregateRevenueByDate(records);

  return {
    totalRevenue,
    totalAppointments: bookings.length,
    totalCustomers: customerCount,
    activeServices: servicesCount,
    completionRate,
    averageOrderValue,
    statusBreakdown,
    revenueByDate,
  };
}

export async function createBooking(data: {
  serviceId?: string;
  staffId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string;
  startTime: string;
  notes?: string;
}) {
  // SECURITY: businessId comes from session, never from client input.
  const { business } = await requireAuthBusiness();

  const service = data.serviceId
    ? await prisma.service.findUnique({ where: { id: data.serviceId } })
    : null;

  // Verify service belongs to this business
  if (service && service.businessId !== business.id) {
    throw new Error("Forbidden: service does not belong to your business.");
  }

  const duration = service?.duration ?? 60;
  const [h, m] = data.startTime.split(":").map(Number);
  const endMinutes = (h ?? 0) * 60 + (m ?? 0) + duration;
  const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, "0")}:${String(endMinutes % 60).padStart(2, "0")}`;

  let customer = null;
  try {
    customer = await prisma.customer.upsert({
      where: {
        businessId_phone: {
          businessId: business.id,
          phone: data.customerPhone,
        },
      },
      update: {
        name: data.customerName,
        ...(data.customerEmail ? { email: data.customerEmail } : {}),
        visitCount: { increment: 1 },
        lifetimeValue: { increment: service?.price ?? 0 },
      },
      create: {
        businessId: business.id,
        name: data.customerName,
        phone: data.customerPhone,
        email: data.customerEmail || null,
        visitCount: 1,
        lifetimeValue: service?.price ?? 0,
        source: "BOOKING",
      },
    });
  } catch (crmErr) {
    console.warn("[CRM] Customer upsert failed, booking will proceed:", crmErr);
  }

  const booking = await prisma.booking.create({
    data: {
      businessId: business.id,
      serviceId: data.serviceId,
      staffId: data.staffId,
      customerId: customer?.id,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      date: data.date,
      startTime: data.startTime,
      endTime,
      duration,
      price: service?.price ?? 0,
      notes: data.notes,
      status: "CONFIRMED",
    },
  });

  // Non-blocking: backend WhatsApp/NDR trigger — failure must not break booking
  DocodoBackendAPI.verifyNDRBooking({
    businessId: business.id,
    bookingId: booking.id,
    customerPhone: data.customerPhone,
    customerName: data.customerName,
  }).catch((err) => {
    console.warn("[NDR] Backend notification failed:", err);
  });

  revalidatePath("/dashboard/bookings");
  return booking;
}

export async function updateBookingStatus(
  bookingId: string,
  status: "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW"
) {
  // SECURITY: Verify this booking belongs to the authenticated user's business.
  await requireBookingOwnership(bookingId);

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });

  revalidatePath("/dashboard/bookings");
}

export async function getBookings(date?: string) {
  // SECURITY: businessId resolved from session — never from client.
  const { business } = await requireAuthBusiness();

  const where: {
    businessId: string;
    status: { not: string };
    date?: string;
  } = { businessId: business.id, status: { not: "CANCELLED" } };

  if (date) where.date = date;

  return prisma.booking.findMany({
    where,
    include: { service: true, staff: true, customer: true },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });
}

export async function getCustomers() {
  // SECURITY: businessId resolved from session — never from client.
  const { business } = await requireAuthBusiness();

  return prisma.customer.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
    include: {
      bookings: {
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { service: true },
      },
    },
  });
}

export async function generateAIPost(type: string) {
  // SECURITY: businessId resolved from session — never from client.
  const { business } = await requireAuthBusiness();

  const businessData = await prisma.business.findUnique({
    where: { id: business.id },
  });
  if (!businessData) throw new Error("Business not found");

  const prompts: Record<string, string> = {
    INSTAGRAM: `Create an engaging Instagram post for ${businessData.name}, a ${businessData.industry} business in India. Include emojis, engaging hooks, a clear call-to-action to book at docodo.in/book/${businessData.slug}, and 5-7 relevant hashtags.`,
    REEL_SCRIPT: `Write a viral 30-45 second Instagram Reel Script for ${businessData.name}, a premier ${businessData.industry} business in India.\n\nStructure:\n1. ⚡ 3-Second Scroll-Stopping Hook (Spoken + Visual text on screen)\n2. 💡 Problem / Agitation (Common pain point customers face)\n3. ✨ The Transformation / Secret (How ${businessData.name} delivers results)\n4. 🚀 Direct Call-to-Action (e.g., 'DM \"BOOK\" or tap link in bio to book your slot')\n5. 🎵 Suggested Audio Vibe & B-Roll Visual Direction`,
    CAROUSEL_POST: `Create a high-retention 5-Slide Instagram Carousel Blueprint for ${businessData.name} (${businessData.industry} in India).\n\nStructure:\n- Slide 1: Bold Hook Headline & Curiosity Subtitle\n- Slide 2: The #1 Mistake People Make\n- Slide 3: Step 1 / Actionable Technique\n- Slide 4: Step 2 / Pro Transformation Tip\n- Slide 5: Recap & CTA (Save this post & book at docodo.in/book/${businessData.slug})\n\nInclude a full caption with emojis and 8 high-reach hashtags.`,
    WHATSAPP: `Create a personalized, high-converting WhatsApp promotional message for ${businessData.name} (${businessData.industry}). Keep it concise, friendly, include an irresistible limited-time offer, and add a direct booking link: docodo.in/book/${businessData.slug}. Max 150 words.`,
    WHATSAPP_BROADCAST: `Create a high-impact VIP WhatsApp Broadcast for existing and new clients of ${businessData.name} (${businessData.industry}). Announce a priority slot opening/exclusive perk with 1-click booking link docodo.in/book/${businessData.slug}. Professional, warm, and urgent.`,
    DM_AUTO_REPLY: `Write a 3-step high-converting Instagram DM & WhatsApp Auto-Response flow for ${businessData.name} (${businessData.industry}) when a prospect asks for prices, location, or appointment availability. Keep it friendly, empathetic, Indian conversational style, and guide them directly to book at docodo.in/book/${businessData.slug}.`,
    BLOG: `Write a helpful blog article outline (300 words) for ${businessData.name} about expert tips related to ${businessData.industry}. Include an SEO-friendly title, key insights, and a booking CTA.`,
    FAQ: `Generate 5 common customer FAQs with crisp answers for ${businessData.name}, a ${businessData.industry} business in India, addressing pricing, booking procedure, and location.`,
    REVIEW_REPLY: `Write a professional, warm response to a 5-star Google review for ${businessData.name}. Thank the customer, mention specific service quality, and invite them back.`,
  };

  const promptText = prompts[type] ?? prompts["INSTAGRAM"]!;

  const validTypes = [
    "DESCRIPTION",
    "SEO",
    "INSTAGRAM",
    "REEL_SCRIPT",
    "CAROUSEL_POST",
    "WHATSAPP_CAMPAIGN",
    "WHATSAPP_BROADCAST",
    "DM_AUTO_REPLY",
    "FAQ",
    "REVIEW_REPLY",
  ] as const;
  type AIContentType = (typeof validTypes)[number];
  const mappedType: AIContentType =
    type === "WHATSAPP" || type === "WHATSAPP_BROADCAST"
      ? "WHATSAPP_CAMPAIGN"
      : validTypes.includes(type as AIContentType)
      ? (type as AIContentType)
      : "INSTAGRAM";

  const res = await DocodoBackendAPI.generateContent({
    businessId: business.id,
    type: mappedType,
    prompt: promptText,
    industry: businessData.industry,
    name: businessData.name,
  });

  const finalContent = res.content || "AI generation completed via fallback engine.";

  await prisma.aIContent.create({
    data: { businessId: business.id, type, content: finalContent },
  });

  return finalContent;
}
