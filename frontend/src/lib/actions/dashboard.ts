"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
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
