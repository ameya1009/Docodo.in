import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import WebsiteClient from "./WebsiteClient";

export default async function WebsitePage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");
  const userId = (session.user as any).id;

  const business = await prisma.business.findFirst({
    where: { ownerId: userId },
    include: {
      services: { where: { isActive: true }, orderBy: { order: "asc" } },
      aiContents: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });
  if (!business) redirect("/onboarding/step/1");

  return <WebsiteClient business={JSON.parse(JSON.stringify(business))} />;
}
