import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUsage, getBusinessSubscription } from "@/lib/services/entitlement-service";
import { resolvePlan } from "@/lib/plans-config";
import UsageClient from "./UsageClient";

export const dynamic = "force-dynamic";

export default async function UsagePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const business = await prisma.business.findFirst({
    where: { ownerId: session.user.id },
    include: {
      services: true,
      staff: true,
    },
  });

  if (!business) redirect("/onboarding");

  const [subscription, usage, conciergeOrder] = await Promise.all([
    getBusinessSubscription(business.id),
    getUsage(business.id, "BOOKINGS_COUNT"),
    prisma.conciergeOrder.findFirst({
      where: { businessId: business.id },
      orderBy: { createdAt: "desc" },
    }).catch(() => null),
  ]);

  const plan = resolvePlan(subscription.planId);

  return (
    <UsageClient
      business={business}
      subscription={subscription}
      usage={usage}
      plan={plan}
      conciergeOrder={conciergeOrder}
    />
  );
}
