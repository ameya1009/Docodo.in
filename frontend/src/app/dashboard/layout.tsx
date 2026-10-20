import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardLayoutClient from "./DashboardLayoutClient";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  let session: any = null;
  try {
    session = await auth();
  } catch (err: any) {
    if (err?.digest !== "DYNAMIC_SERVER_USAGE") {
      console.warn("[Auth Exception in DashboardLayout]:", err);
    }
  }

  if (!session?.user?.id) redirect("/auth/login");

  let business: any = null;
  let subscription: any = null;
  try {
    business = await prisma.business.findFirst({
      where: { ownerId: session.user.id },
      select: { id: true, name: true, slug: true, onboardingComplete: true },
    });
    if (business) {
      subscription = await prisma.subscription.findFirst({
        where: { businessId: business.id },
        orderBy: { createdAt: "desc" },
      });
    }
  } catch (err) {
    console.warn("[Prisma Exception in DashboardLayout]:", err);
  }

  if (!business) {
    try {
      const { db } = await import("@/lib/supabase-db");
      business = await db.business.findFirst({
        where: { ownerId: session.user.id },
      });
    } catch (err) {
      console.warn("[Supabase DB Exception in DashboardLayout]:", err);
    }
  }

  // If business query failed or onboarding pending
  const businessName = business?.name || "My Business";
  const businessSlug = business?.slug || "my-business";

  const rawCandidate = session.user?.plan || subscription?.planId || "PILOT";
  const cleanPlan = String(rawCandidate).toLowerCase();
  let plan = "PILOT";
  if (cleanPlan.includes("concierge") || cleanPlan.includes("setup")) {
    plan = "CONCIERGE";
  } else if (cleanPlan.includes("growth") || cleanPlan.includes("pro")) {
    plan = "GROWTH";
  } else if (cleanPlan.includes("starter")) {
    plan = "STARTER";
  }

  return (
    <DashboardLayoutClient
      user={session.user}
      businessName={businessName}
      businessSlug={businessSlug}
      plan={plan}
    >
      {children}
    </DashboardLayoutClient>
  );
}

