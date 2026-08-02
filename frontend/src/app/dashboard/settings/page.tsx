import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");
  const userId = (session.user as any).id;

  const business = await prisma.business.findFirst({
    where: { ownerId: userId },
    include: {
      services: { orderBy: { order: "asc" } },
      staff: { orderBy: { createdAt: "asc" } },
      workingHours: { orderBy: { day: "asc" } },
    },
  });
  if (!business) redirect("/onboarding/step/1");

  return <SettingsClient business={JSON.parse(JSON.stringify(business))} />;
}
