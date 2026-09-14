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

  // If business does not exist in DB, show verified Business Not Found state
  if (!business) {
    return (
      <main className="min-h-screen bg-[var(--bg-void)] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-5 bg-[var(--bg-surface)] border border-[var(--border-default)] p-8 rounded-3xl shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-2xl font-mono">
            🏪
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 inline-block mb-2">
              Storefront Not Claimed
            </span>
            <h1 className="text-2xl font-display font-black text-white">
              Business Not Found
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-2">
              The booking portal for <span className="font-mono text-[var(--lime)] font-bold">/{slug}</span> has not been registered yet or is currently inactive.
            </p>
          </div>

          <div className="p-4 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)] text-xs text-left space-y-1.5">
            <p className="font-bold text-white">Are you the business owner?</p>
            <p className="text-[var(--text-secondary)]">
              Claim this booking URL, list your real services and pricing, and start accepting online UPI payments and automated WhatsApp appointments today.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <a
              href={`/onboarding?slug=${encodeURIComponent(slug)}`}
              className="w-full py-3 bg-[var(--lime)] text-black font-bold rounded-xl text-xs hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shadow-[var(--lime-glow-sm)]"
            >
              Launch Your Business in 15 Mins →
            </a>
            <a
              href="/"
              className="w-full py-2.5 bg-[var(--bg-elevated)] text-[var(--text-secondary)] font-semibold rounded-xl text-xs hover:text-white transition-all"
            >
              Return to Docodo Home
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <BookingPageClient
      business={business}
      bookedSlots={bookedSlots}
    />
  );
}
