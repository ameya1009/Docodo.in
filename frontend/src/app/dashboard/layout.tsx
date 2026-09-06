import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardLayoutClient from "./DashboardLayoutClient";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  let session: any = null;
  try {
    session = await auth();
  } catch (err) {
    console.warn("[Auth Exception in DashboardLayout]:", err);
  }

  if (!session?.user?.id) redirect("/auth/login");

  let business: any = null;
  try {
    business = await prisma.business.findFirst({
      where: { ownerId: session.user.id },
      select: { name: true, slug: true, onboardingComplete: true },
    });
  } catch (err) {
    console.warn("[Prisma Exception in DashboardLayout]:", err);
  }

  // If business query failed or onboarding pending
  const businessName = business?.name || "My Business";
  const businessSlug = business?.slug || "my-business";

  return (
    <DashboardLayoutClient
      user={session.user}
      businessName={businessName}
      businessSlug={businessSlug}
    >
      {children}
    </DashboardLayoutClient>
  );
}

