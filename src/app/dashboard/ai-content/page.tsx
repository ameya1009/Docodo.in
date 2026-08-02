import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AIContentClient from "./AIContentClient";

export default async function AIContentPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");
  const userId = (session.user as any).id;

  const business = await prisma.business.findFirst({
    where: { ownerId: userId },
    select: { id: true, name: true, industry: true },
  });
  if (!business) redirect("/onboarding/step/1");

  const existingContent = await prisma.aIContent.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return <AIContentClient business={business} existingContent={existingContent} />;
}
