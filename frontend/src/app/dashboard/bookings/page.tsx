import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import BookingsClient from "./BookingsClient";

export default async function BookingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  let business: any = null;
  let bookings: any[] = [];
  const today = new Date().toISOString().split("T")[0];

  try {
    business = await prisma.business.findFirst({
      where: { ownerId: session.user.id },
      include: { services: true, staff: true },
    });

    if (business) {
      bookings = await prisma.booking.findMany({
        where: { businessId: business.id },
        include: { service: true, staff: true, customer: true },
        orderBy: [{ date: "desc" }, { startTime: "asc" }],
        take: 100,
      });
    }
  } catch (err) {
    console.warn("[BookingsPage Fallback]:", err);
  }

  if (!business) {
    business = {
      id: "biz-default",
      name: "My Business",
      slug: "my-business",
      services: [],
      staff: [],
    };
  }

  return <BookingsClient business={business} bookings={bookings} today={today} />;
}
