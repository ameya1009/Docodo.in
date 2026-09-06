import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  let business: any = {
    id: "biz-default",
    name: "My Business",
    slug: "my-business",
    industry: "Salons & Spas",
    services: [],
    staff: [],
    workingHours: [],
  };

  try {
    const fetchedBusiness = await prisma.business.findFirst({
      where: { ownerId: session.user.id },
      include: {
        services: { orderBy: { order: "asc" } },
        staff: { orderBy: { createdAt: "asc" } },
        workingHours: { orderBy: { day: "asc" } },
      },
    });
    if (fetchedBusiness) {
      business = fetchedBusiness;
    }
  } catch (err) {
    console.warn("[SettingsPage Fallback]:", err);
  }

  return <SettingsClient business={JSON.parse(JSON.stringify(business))} />;
}
