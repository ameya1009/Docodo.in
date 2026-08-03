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

export async function getDashboardData() {
  const session = await auth();
  if (!session?.user?.id && !session?.user?.email) return null;

  const user = await prisma.user.findFirst({
    where: session.user.id ? { id: session.user.id } : { email: session.user.email! },
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

  const [bookings, customerCount, upcomingBookings] = await Promise.all([
    prisma.booking.findMany({
      where: { businessId: business.id },
      select: { id: true, price: true, status: true, date: true, startTime: true, customerName: true },
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

  // Calculate this month's revenue
  const currentMonthStr = todayStr.slice(0, 7);
  const monthlyRecords = records.filter((r) => r.date && r.date.startsWith(currentMonthStr));
  const monthlyRevenue = calculateTotalRevenue(monthlyRecords);

  return {
    business,
    upcomingBookings,
    recentBookings: business.bookings,
    stats: {
      todayBookings: todayBookingsCount,
      monthlyRevenue,
      totalRevenue,
      customers: customerCount,
      activeServices: business.services.length,
      completionRate,
      averageOrderValue,
      statusBreakdown,
      revenueByDate,
    },
  };
}

export async function getDashboardStatsAction(rawInput: {
  businessId: string;
  dateFilter?: { period?: "TODAY" | "WEEK" | "MONTH" | "ALL"; startDate?: string; endDate?: string };
}) {
  const { businessId } = GetDashboardStatsSchema.parse(rawInput);

  const [bookings, customerCount, servicesCount] = await Promise.all([
    prisma.booking.findMany({
      where: { businessId },
      select: { price: true, status: true, date: true, startTime: true, customerName: true },
    }),
    prisma.customer.count({ where: { businessId } }),
    prisma.service.count({ where: { businessId } }),
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
  businessId: string;
  serviceId?: string;
  staffId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string;
  startTime: string;
  notes?: string;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const service = data.serviceId
    ? await prisma.service.findUnique({ where: { id: data.serviceId } })
    : null;

  const duration = service?.duration ?? 60;
  const [h, m] = data.startTime.split(":").map(Number);
  const endMinutes = h * 60 + m + duration;
  const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, "0")}:${String(endMinutes % 60).padStart(2, "0")}`;

  // Upsert customer
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
        email: data.customerEmail,
        visitCount: { increment: 1 },
        lifetimeValue: { increment: service?.price ?? 0 },
      },
      create: {
        businessId: data.businessId,
        name: data.customerName,
        phone: data.customerPhone,
        email: data.customerEmail,
        visitCount: 1,
        lifetimeValue: service?.price ?? 0,
        source: "BOOKING",
      },
    });
  } catch {}

  const booking = await prisma.booking.create({
    data: {
      businessId: data.businessId,
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

  // Automatically trigger backend WhatsApp NDR verification & confirmation engine
  try {
    await DocodoBackendAPI.verifyNDRBooking({
      businessId: data.businessId,
      bookingId: booking.id,
      customerPhone: data.customerPhone,
      customerName: data.customerName,
    });
  } catch (backendErr) {
    console.warn("Notice: Offline backend queueing for NDR verification:", backendErr);
  }

  revalidatePath("/dashboard/bookings");
  return booking;
}

export async function updateBookingStatus(
  bookingId: string,
  status: "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW"
) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });

  revalidatePath("/dashboard/bookings");
}

export async function getBookings(businessId: string, date?: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const where: any = { businessId, status: { not: "CANCELLED" } };
  if (date) where.date = date;

  return prisma.booking.findMany({
    where,
    include: { service: true, staff: true, customer: true },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });
}

export async function getCustomers(businessId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  return prisma.customer.findMany({
    where: { businessId },
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

export async function generateAIPost(businessId: string, type: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const business = await prisma.business.findUnique({ where: { id: businessId } });
  if (!business) throw new Error("Business not found");

  const prompts: Record<string, string> = {
    INSTAGRAM: `Create an engaging Instagram post for ${business.name}, a ${business.industry} business. Include emojis, a call-to-action, and 5-7 relevant hashtags. Keep it warm and professional for an Indian audience.`,
    WHATSAPP: `Create a WhatsApp promotional message for ${business.name}, a ${business.industry}. Keep it concise, friendly, and add a clear call-to-action. Max 200 words.`,
    BLOG: `Write a helpful blog article outline (300 words) for ${business.name} about tips related to ${business.industry}. Include an SEO-friendly title and 3-4 key sections.`,
    FAQ: `Generate 5 common customer FAQs with answers for ${business.name}, a ${business.industry} business in India.`,
    REVIEW_REPLY: `Write a professional, warm response to a 5-star Google review for ${business.name}. Thank the customer, mention specific service quality, and invite them back.`,
  };

  const promptText = prompts[type] ?? prompts.INSTAGRAM;
  const mappedType: "DESCRIPTION" | "SEO" | "INSTAGRAM" | "WHATSAPP_CAMPAIGN" | "FAQ" | "REVIEW_REPLY" =
    type === "WHATSAPP" ? "WHATSAPP_CAMPAIGN" : (type as any);

  const res = await DocodoBackendAPI.generateContent({
    businessId,
    type: mappedType,
    prompt: promptText,
    industry: business.industry,
    name: business.name,
  });

  const finalContent = res.content || "AI generation completed via fallback engine.";

  await prisma.aIContent.create({
    data: { businessId, type, content: finalContent },
  });
  
  return finalContent;
}
