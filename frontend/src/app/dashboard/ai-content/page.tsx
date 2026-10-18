import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AIContentClient from "./AIContentClient";
import { PlanGate } from "@/components/dashboard/PlanGate";

export default async function AIContentPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const business = await prisma.business.findFirst({
    where: { ownerId: session.user.id },
    select: { id: true, name: true, industry: true },
  });
  if (!business) redirect("/onboarding");

  const subscription = await prisma.subscription.findFirst({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
  });

  const existingContent = await prisma.aIContent.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const userPlan = subscription?.planId || session.user?.plan || "PILOT";

  return (
    <PlanGate
      plan={userPlan}
      requiredPlan="GROWTH"
      featureName="AI Clinical Content & Social Marketing Suite"
      featureDescription="Generate patient-attracting Instagram reels, WhatsApp medical newsletters, and festival greetings tailored to Indian healthcare."
      roiMessage="Automates monthly practice marketing, saving ₹15,000+ compared to hiring a digital agency."
    >
      <AIContentClient business={business} existingContent={existingContent} />
    </PlanGate>
  );
}
