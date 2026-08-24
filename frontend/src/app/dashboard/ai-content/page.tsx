import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AIContentClient from "./AIContentClient";

export default async function AIContentPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const business = await prisma.business.findFirst({
    where: { ownerId: session.user.id },
    select: { id: true, name: true, industry: true },
  });
  if (!business) redirect("/onboarding");

  const existingContent = await prisma.aIContent.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return <AIContentClient business={business} existingContent={existingContent} />;
}
