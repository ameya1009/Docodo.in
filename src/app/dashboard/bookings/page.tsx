import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import BookingsClient from "./BookingsClient";

export default async function BookingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");
  const userId = (session.user as any).id;

  const business = await prisma.business.findFirst({
    where: { ownerId: userId },
    include: { services: true, staff: true },
  });
  if (!business) redirect("/onboarding/step/1");

  const today = new Date().toISOString().split("T")[0];
  const bookings = await prisma.booking.findMany({
    where: { businessId: business.id },
    include: { service: true, staff: true, customer: true },
    orderBy: [{ date: "desc" }, { startTime: "asc" }],
    take: 100,
  });

  return <BookingsClient business={business} bookings={bookings} today={today} />;
}
