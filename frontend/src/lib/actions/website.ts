"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  UpdateWebsiteConfigSchema,
  UpdateSEODetailsSchema,
} from "@/lib/validations/website";
import { serializeWebsiteConfig } from "@/lib/engines/website-engine";

async function requireBusinessOwnership(businessId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized: you must be logged in.");
  }

  const business = await prisma.business.findFirst({
    where: { id: businessId, ownerId: session.user.id },
    select: { id: true, slug: true },
  });

  if (!business) {
    throw new Error("Forbidden: you do not have permission to configure this business website.");
  }

  return business;
}

export async function updateWebsiteSectionsAction(rawInput: {
  businessId: string;
  sections: Record<string, boolean>;
}) {
  const { businessId, sections } = UpdateWebsiteConfigSchema.parse(rawInput);
  await requireBusinessOwnership(businessId);

  const jsonStr = serializeWebsiteConfig(sections);

  const updated = await prisma.business.update({
    where: { id: businessId },
    data: { websiteConfig: jsonStr },
    select: { id: true, slug: true, websiteConfig: true },
  });

  revalidatePath("/dashboard/website");
  revalidatePath(`/book/${updated.slug}`);
  return updated;
}

export async function updateSEODetailsAction(rawInput: {
  businessId: string;
  seoTitle: string;
  seoDesc?: string;
}) {
  const { businessId, seoTitle, seoDesc } = UpdateSEODetailsSchema.parse(rawInput);
  await requireBusinessOwnership(businessId);

  const updated = await prisma.business.update({
    where: { id: businessId },
    data: { seoTitle, seoDesc: seoDesc || null },
    select: { id: true, slug: true, seoTitle: true, seoDesc: true },
  });

  revalidatePath("/dashboard/website");
  revalidatePath(`/book/${updated.slug}`);
  return updated;
}
