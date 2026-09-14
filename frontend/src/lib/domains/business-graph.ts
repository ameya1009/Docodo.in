/**
 * DOCODO BUSINESS OPERATING SYSTEM — SINGLE BUSINESS GRAPH
 * Inspired by Odoo's modular business model.
 * Connects all tenant entities into a unified graph:
 * Business -> Staff, Services, Customers, Bookings, Payments, Automations, Analytics.
 */

import { prisma } from "@/lib/prisma";

export interface BusinessGraphSnapshot {
  business: {
    id: string;
    name: string;
    slug: string;
    industry: string;
    city: string | null;
  };
  metrics: {
    totalRevenue: number;
    totalBookings: number;
    activeCustomersCount: number;
    atRiskCustomersCount: number;
    activeServicesCount: number;
    activeStaffCount: number;
  };
  topServices: {
    name: string;
    bookingsCount: number;
    revenue: number;
  }[];
  customerHealth: {
    active30d: number;
    inactive30d: number;
    totalLTV: number;
  };
  insights: string[];
}

export async function getBusinessGraphSnapshot(businessId: string): Promise<BusinessGraphSnapshot | null> {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: {
      id: true,
      name: true,
      slug: true,
      industry: true,
      city: true,
      services: { where: { isActive: true }, select: { id: true, name: true, price: true } },
      staff: { where: { isActive: true }, select: { id: true, name: true } },
    },
  });

  if (!business) return null;

  const [bookings, customers] = await Promise.all([
    prisma.booking.findMany({
      where: { businessId },
      select: { id: true, price: true, status: true, serviceId: true, date: true },
    }),
    prisma.customer.findMany({
      where: { businessId },
      select: { id: true, lifetimeValue: true, visitCount: true, updatedAt: true },
    }),
  ]);

  const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED" || b.status === "COMPLETED");
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.price || 0), 0);

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const active30d = customers.filter((c) => new Date(c.updatedAt) >= thirtyDaysAgo).length;
  const inactive30d = customers.length - active30d;

  // Service performance
  const serviceRevenueMap = new Map<string, { name: string; count: number; rev: number }>();
  for (const s of business.services) {
    serviceRevenueMap.set(s.id, { name: s.name, count: 0, rev: 0 });
  }

  for (const b of confirmedBookings) {
    if (b.serviceId) {
      const entry = serviceRevenueMap.get(b.serviceId);
      if (entry) {
        entry.count += 1;
        entry.rev += b.price || 0;
      }
    }
  }

  const topServices = Array.from(serviceRevenueMap.values())
    .sort((a, b) => b.rev - a.rev)
    .slice(0, 5)
    .map((s) => ({ name: s.name, bookingsCount: s.count, revenue: s.rev }));

  // Dynamic Business Intelligence Insights (No faking)
  const insights: string[] = [];
  if (inactive30d > 0) {
    insights.push(`${inactive30d} customers have not booked in the last 30 days. Run an automated reactivation campaign.`);
  }
  if (topServices.length > 0) {
    insights.push(`Top revenue driver: "${topServices[0].name}" contributing ₹${topServices[0].revenue.toLocaleString("en-IN")}.`);
  }
  if (confirmedBookings.length > 0) {
    insights.push(`Average booking value: ₹${Math.round(totalRevenue / confirmedBookings.length).toLocaleString("en-IN")}.`);
  }

  return {
    business: {
      id: business.id,
      name: business.name,
      slug: business.slug,
      industry: business.industry,
      city: business.city,
    },
    metrics: {
      totalRevenue,
      totalBookings: confirmedBookings.length,
      activeCustomersCount: active30d,
      atRiskCustomersCount: inactive30d,
      activeServicesCount: business.services.length,
      activeStaffCount: business.staff.length,
    },
    topServices,
    customerHealth: {
      active30d,
      inactive30d,
      totalLTV: customers.reduce((acc, c) => acc + (c.lifetimeValue || 0), 0),
    },
    insights,
  };
}
