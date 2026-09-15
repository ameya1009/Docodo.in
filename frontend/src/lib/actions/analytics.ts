"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export interface AnalyticsMetrics {
  grossRevenue: number;
  totalBookings: number;
  completedBookings: number;
  uniqueCustomers: number;
  avgLTV: number;
  conversionRate: number;
  weeklyTrends: Array<{ day: string; revenue: number; label: string; count: number }>;
}

export async function getBusinessAnalytics(timeRange: "7D" | "30D" | "90D" | "ALL" = "30D"): Promise<AnalyticsMetrics> {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      grossRevenue: 0,
      totalBookings: 0,
      completedBookings: 0,
      uniqueCustomers: 0,
      avgLTV: 0,
      conversionRate: 0,
      weeklyTrends: [
        { day: "Mon", revenue: 0, label: "₹0", count: 0 },
        { day: "Tue", revenue: 0, label: "₹0", count: 0 },
        { day: "Wed", revenue: 0, label: "₹0", count: 0 },
        { day: "Thu", revenue: 0, label: "₹0", count: 0 },
        { day: "Fri", revenue: 0, label: "₹0", count: 0 },
        { day: "Sat", revenue: 0, label: "₹0", count: 0 },
        { day: "Sun", revenue: 0, label: "₹0", count: 0 },
      ],
    };
  }

  try {
    const business = await prisma.business.findFirst({
      where: { ownerId: session.user.id },
      select: { id: true },
    });

    if (!business) {
      return {
        grossRevenue: 0,
        totalBookings: 0,
        completedBookings: 0,
        uniqueCustomers: 0,
        avgLTV: 0,
        conversionRate: 0,
        weeklyTrends: [
          { day: "Mon", revenue: 0, label: "₹0", count: 0 },
          { day: "Tue", revenue: 0, label: "₹0", count: 0 },
          { day: "Wed", revenue: 0, label: "₹0", count: 0 },
          { day: "Thu", revenue: 0, label: "₹0", count: 0 },
          { day: "Fri", revenue: 0, label: "₹0", count: 0 },
          { day: "Sat", revenue: 0, label: "₹0", count: 0 },
          { day: "Sun", revenue: 0, label: "₹0", count: 0 },
        ],
      };
    }

    const businessId = business.id;

    // Calculate date filter
    const now = new Date();
    let startDate: Date | undefined;
    if (timeRange === "7D") {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (timeRange === "30D") {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (timeRange === "90D") {
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    }

    const dateQuery = startDate ? { gte: startDate.toISOString().split("T")[0] } : undefined;

    // 1. Fetch bookings
    const bookings = await prisma.booking.findMany({
      where: {
        businessId,
        ...(dateQuery ? { date: dateQuery } : {}),
      },
      select: {
        price: true,
        paidAmount: true,
        status: true,
        paymentStatus: true,
        date: true,
        createdAt: true,
      },
    });

    // 2. Fetch customer count
    const customerCount = await prisma.customer.count({
      where: { businessId },
    });

    let grossRevenue = 0;
    let completedBookings = 0;
    let totalBookings = bookings.length;

    const daysMap: Record<string, { revenue: number; count: number }> = {
      Mon: { revenue: 0, count: 0 },
      Tue: { revenue: 0, count: 0 },
      Wed: { revenue: 0, count: 0 },
      Thu: { revenue: 0, count: 0 },
      Fri: { revenue: 0, count: 0 },
      Sat: { revenue: 0, count: 0 },
      Sun: { revenue: 0, count: 0 },
    };

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (const b of bookings) {
      const isPaid = b.paymentStatus === "PAID" || b.paidAmount > 0;
      const isNotCancelled = b.status !== "CANCELLED" && b.status !== "NO_SHOW";

      if (isPaid && isNotCancelled) {
        const amount = b.paidAmount > 0 ? b.paidAmount : b.price;
        grossRevenue += amount;

        const bookingDate = new Date(b.date || b.createdAt);
        const dayName = dayNames[bookingDate.getDay()] || "Mon";
        if (daysMap[dayName]) {
          daysMap[dayName].revenue += amount;
          daysMap[dayName].count += 1;
        }
      }

      if ((b.status === "COMPLETED" || b.status === "CONFIRMED") && isNotCancelled) {
        completedBookings++;
      }
    }


    const avgLTV = customerCount > 0 ? Math.round(grossRevenue / customerCount) : 0;
    const conversionRate = totalBookings > 0 ? Math.round((completedBookings / totalBookings) * 100) : 0;

    const weeklyTrends = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
      day,
      revenue: daysMap[day]?.revenue || 0,
      label: daysMap[day]?.revenue ? `₹${(daysMap[day].revenue / 1000).toFixed(1)}k` : "₹0",
      count: daysMap[day]?.count || 0,
    }));

    return {
      grossRevenue,
      totalBookings,
      completedBookings,
      uniqueCustomers: customerCount,
      avgLTV,
      conversionRate,
      weeklyTrends,
    };
  } catch (error) {
    console.error("[Analytics Engine] Failed to aggregate metrics:", error);
    return {
      grossRevenue: 0,
      totalBookings: 0,
      completedBookings: 0,
      uniqueCustomers: 0,
      avgLTV: 0,
      conversionRate: 0,
      weeklyTrends: [
        { day: "Mon", revenue: 0, label: "₹0", count: 0 },
        { day: "Tue", revenue: 0, label: "₹0", count: 0 },
        { day: "Wed", revenue: 0, label: "₹0", count: 0 },
        { day: "Thu", revenue: 0, label: "₹0", count: 0 },
        { day: "Fri", revenue: 0, label: "₹0", count: 0 },
        { day: "Sat", revenue: 0, label: "₹0", count: 0 },
        { day: "Sun", revenue: 0, label: "₹0", count: 0 },
      ],
    };
  }
}
