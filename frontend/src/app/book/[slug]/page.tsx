import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BookingPageClient from "./BookingPageClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const business = await prisma.business.findUnique({
      where: { slug },
      select: { name: true, industry: true, city: true, seoDesc: true, description: true },
    });

    if (!business) {
      return {
        title: `Book Online | Docodo Instant Appointments`,
        description: `Book appointments online 24/7 with instant WhatsApp reminders on Docodo.in`,
      };
    }

    return {
      title: `Book ${business.name} | ${business.industry} in ${business.city ?? "India"}`,
      description: business.seoDesc ?? business.description ?? `Book an appointment at ${business.name}`,
      openGraph: {
        title: `Book ${business.name}`,
        description: business.seoDesc ?? business.description ?? `Online booking for ${business.name}`,
      },
    };
  } catch {
    return {
      title: `Book Online | Docodo`,
      description: `Instant online booking & automated WhatsApp reminders`,
    };
  }
}

export default async function BookingPage({ params }: Props) {
  const { slug } = await params;

  let business: any = null;
  let bookedSlots: any[] = [];

  try {
    business = await prisma.business.findUnique({
      where: { slug },
      include: {
        services: { where: { isActive: true }, orderBy: { order: "asc" } },
        staff: { where: { isActive: true } },
        workingHours: true,
      },
    });

    if (business) {
      const today = new Date().toISOString().split("T")[0];
      const in30 = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      bookedSlots = await prisma.booking.findMany({
        where: {
          businessId: business.id,
          date: { gte: today, lte: in30 },
          status: { in: ["CONFIRMED", "PENDING"] },
        },
        select: { date: true, startTime: true, endTime: true, staffId: true },
      });
    }
  } catch (err) {
    console.warn("[BookingPage Prisma Fallback]:", err);
  }

  // Fallback demo store if not found or testing arbitrary slug
  if (!business) {
    business = {
      id: "biz-demo",
      name: slug ? `${slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ")} Studio` : "Docodo Wellness & Spa",
      slug: slug || "demo-studio",
      industry: "Salons & Spas",
      description: "Premier wellness, hair styling, and skincare treatments with instant WhatsApp confirmation.",
      city: "Pune",
      address: "FC Road, Deccan Gymkhana, Pune",
      phone: "+91 9284310604",
      whatsapp: "919284310604",
      themeColor: "#CCFF00",
      services: [
        { id: "srv-1", name: "Signature Haircut & Styling", duration: 45, price: 650, description: "Precision styling with hair wash and blowdry", isActive: true },
        { id: "srv-2", name: "Deep Cleansing Organic Facial", duration: 60, price: 1450, description: "Hydrating botanical facial with shoulder massage", isActive: true },
        { id: "srv-3", name: "Aromatherapy Full Body Massage", duration: 75, price: 2200, description: "Relaxing Swedish massage with essential herbal oils", isActive: true },
      ],
      staff: [
        { id: "stf-1", name: "Rahul (Master Stylist)", role: "Senior Stylist", isActive: true },
        { id: "stf-2", name: "Priya (Skin Specialist)", role: "Esthetician", isActive: true },
      ],
      workingHours: [
        { day: 1, openTime: "10:00", closeTime: "20:00", isOpen: true },
        { day: 2, openTime: "10:00", closeTime: "20:00", isOpen: true },
        { day: 3, openTime: "10:00", closeTime: "20:00", isOpen: true },
        { day: 4, openTime: "10:00", closeTime: "20:00", isOpen: true },
        { day: 5, openTime: "10:00", closeTime: "20:00", isOpen: true },
        { day: 6, openTime: "09:00", closeTime: "21:00", isOpen: true },
        { day: 0, openTime: "09:00", closeTime: "21:00", isOpen: true },
      ],
    };
  }

  return (
    <BookingPageClient
      business={business}
      bookedSlots={bookedSlots}
    />
  );
}
