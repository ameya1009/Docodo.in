import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardLayoutClient from "./DashboardLayoutClient";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const business = await prisma.business.findFirst({
    where: { ownerId: session.user.id },
    select: { name: true, slug: true, onboardingComplete: true },
  });

  // Redirect to onboarding if no business setup
  if (!business || !business.onboardingComplete) {
    redirect("/onboarding");
  }

  return (
    <DashboardLayoutClient
      user={session.user}
      businessName={business.name}
      businessSlug={business.slug}
    >
      {children}
    </DashboardLayoutClient>
  );
}
