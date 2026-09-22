import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import WebsiteClient from "./WebsiteClient";

export const dynamic = "force-dynamic";

export default async function WebsitePage() {
  const session = await auth();
  if (!session?.user?.id && !session?.user?.email) redirect("/auth/login");

  const userId = session.user?.id;
  const userEmail = session.user?.email;

  let business: any = null;

  // 1. Try Prisma
  try {
    business = await prisma.business.findFirst({
      where: userId ? { ownerId: userId } : { email: userEmail },
      include: {
        services: { where: { isActive: true }, orderBy: { order: "asc" } },
        aiContents: { orderBy: { createdAt: "desc" }, take: 5 },
      },
    });
  } catch (err) {
    console.warn("[WebsitePage Prisma Exception Handled]:", err);
  }

  // 2. Try Supabase REST fallback
  if (!business) {
    try {
      const { db } = await import("@/lib/supabase-db");
      if (userId) {
        business = await db.business.findFirst({
          where: { ownerId: userId },
          include: { services: true, aiContents: true },
        });
      }
    } catch (sbErr) {
      console.warn("[WebsitePage Supabase Exception Handled]:", sbErr);
    }
  }

  // 3. Clean default fallback if fresh user
  if (!business) {
    business = {
      id: `biz_${userId || "default"}`,
      name: session.user?.name ? `${session.user.name}'s Studio` : "My Business",
      slug: session.user?.name
        ? session.user.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
        : "my-business",
      industry: "Services",
      websiteConfig: null,
      style: "modern",
      services: [],
      aiContents: [],
    };
  }

  return <WebsiteClient business={JSON.parse(JSON.stringify(business))} />;
}
