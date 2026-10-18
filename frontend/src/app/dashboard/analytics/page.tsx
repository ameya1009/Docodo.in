import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AnalyticsClient from "./AnalyticsClient";
import { PlanGate } from "@/components/dashboard/PlanGate";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Growth Analytics & Funnels | Docodo Business OS",
  description: "Real-time revenue metrics, repeat booking rates, and conversion intelligence.",
};

export default async function AnalyticsDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  let userPlan = session.user?.plan || "PILOT";
  try {
    const business = await prisma.business.findFirst({
      where: { ownerId: session.user.id },
      select: { id: true },
    });
    if (business) {
      const subscription = await prisma.subscription.findFirst({
        where: { businessId: business.id },
        orderBy: { createdAt: "desc" },
      });
      if (subscription?.planId) {
        userPlan = subscription.planId;
      }
    }
  } catch (e) {
    console.warn("Failed fetching subscription for analytics gate:", e);
  }

  return (
    <PlanGate
      plan={userPlan}
      requiredPlan="GROWTH"
      featureName="Revenue Analytics & Retention Intelligence"
      featureDescription="Inspect real-time booking conversion rates, patient lifetime spend (LTV), and multi-channel marketing performance."
      roiMessage="Empowers clinical practices to identify leakages in booking funnels and maximize doctor room occupancy."
    >
      <AnalyticsClient />
    </PlanGate>
  );
}
