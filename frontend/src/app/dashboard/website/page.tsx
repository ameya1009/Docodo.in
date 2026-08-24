import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import WebsiteClient from "./WebsiteClient";

export default async function WebsitePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const business = await prisma.business.findFirst({
    where: { ownerId: session.user.id },
    include: {
      services: { where: { isActive: true }, orderBy: { order: "asc" } },
      aiContents: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });
  if (!business) redirect("/onboarding");

  return <WebsiteClient business={JSON.parse(JSON.stringify(business))} />;
}
