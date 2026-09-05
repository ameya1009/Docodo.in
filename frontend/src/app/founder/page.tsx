import { redirect } from "next/navigation";
import { isFounderAuthenticated } from "@/lib/founder-auth";
import { prisma } from "@/lib/prisma";
import FounderDashboardClient from "./FounderDashboardClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Founder Master Command Center | Docodo.in",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function FounderPage() {
  const isAuth = await isFounderAuthenticated();

  if (!isAuth) {
    redirect("/founder/login");
  }

  // Load platform-wide metrics with fault tolerance
  let totalBusinesses = 0;
  let totalCustomers = 0;
  let totalBookings = 0;
  let totalRevenue = 0;
  let recentBusinesses: any[] = [];
  let recentBookings: any[] = [];

  try {
    const [bizCount, custCount, bookCount, bookings, businesses] = await Promise.all([
      prisma.business.count(),
      prisma.customer.count(),
      prisma.booking.count(),
      prisma.booking.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          customerName: true,
          customerPhone: true,
          price: true,
          status: true,
          date: true,
          startTime: true,
          business: {
            select: { name: true, slug: true, industry: true },
          },
        },
      }),
      prisma.business.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          slug: true,
          industry: true,
          city: true,
          isPublished: true,
          createdAt: true,
          _count: {
            select: { bookings: true, customers: true },
          },
        },
      }),
    ]);

    totalBusinesses = bizCount;
    totalCustomers = custCount;
    totalBookings = bookCount;
    recentBookings = bookings;
    recentBusinesses = businesses;

    totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.price) || 0), 0);
  } catch (err) {
    console.warn("[Founder Portal] Metrics query fallback:", err);
  }

  return (
    <FounderDashboardClient
      initialData={{
        totalBusinesses,
        totalCustomers,
        totalBookings,
        totalRevenue,
        recentBusinesses,
        recentBookings,
      }}
    />
  );
}
