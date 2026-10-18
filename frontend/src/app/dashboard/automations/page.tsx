import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AutomationsClient from "./AutomationsClient";
import { PlanGate } from "@/components/dashboard/PlanGate";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Automations & Execution Center | Docodo Business OS",
  description: "Ready-to-run business workflows, execution telemetry, and natural language automation builder.",
};

export default async function AutomationsPage() {
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
    console.warn("Failed fetching subscription for automations gate:", e);
  }

  return (
    <PlanGate
      plan={userPlan}
      requiredPlan="GROWTH"
      featureName="Autonomous WhatsApp & Patient Follow-up Engine"
      featureDescription="Automate 24h appointment reminders, 5-star Google review triggers, and birthday/festival greetings across Indian calendars."
      roiMessage="Reduces patient no-shows by 88% and automatically secures 20+ authentic Google Reviews monthly."
    >
      <AutomationsClient />
    </PlanGate>
  );
}
