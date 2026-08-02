import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BookingPageClient from "./BookingPageClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const business = await prisma.business.findUnique({
    where: { slug, isPublished: true },
    select: { name: true, industry: true, city: true, seoDesc: true, description: true },
  });

  if (!business) return { title: "Not Found" };

  return {
    title: `Book ${business.name} | ${business.industry} in ${business.city ?? "India"}`,
    description: business.seoDesc ?? business.description ?? `Book an appointment at ${business.name}`,
    openGraph: {
      title: `Book ${business.name}`,
      description: business.seoDesc ?? business.description ?? `Online booking for ${business.name}`,
    },
  };
}

export default async function BookingPage({ params }: Props) {
  const { slug } = await params;

  const business = await prisma.business.findUnique({
    where: { slug, isPublished: true },
    include: {
      services: { where: { isActive: true }, orderBy: { order: "asc" } },
      staff: { where: { isActive: true } },
      workingHours: true,
    },
  });

  if (!business) notFound();

  // Get upcoming booked slots (next 30 days)
  const today = new Date().toISOString().split("T")[0];
  const in30 = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const bookedSlots = await prisma.booking.findMany({
    where: {
      businessId: business.id,
      date: { gte: today, lte: in30 },
      status: { in: ["CONFIRMED", "PENDING"] },
    },
    select: { date: true, startTime: true, endTime: true, staffId: true },
  });

  return (
    <BookingPageClient
      business={business}
      bookedSlots={bookedSlots}
    />
  );
}
