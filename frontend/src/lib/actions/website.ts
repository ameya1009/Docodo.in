"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  UpdateWebsiteConfigSchema,
  UpdateSEODetailsSchema,
} from "@/lib/validations/website";
import { serializeWebsiteConfig } from "@/lib/engines/website-engine";

export async function updateWebsiteSectionsAction(rawInput: {
  businessId: string;
  sections: Record<string, boolean>;
}) {
  const { businessId, sections } = UpdateWebsiteConfigSchema.parse(rawInput);
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

  const updated = await prisma.business.update({
    where: { id: businessId },
    data: { seoTitle, seoDesc: seoDesc || null },
    select: { id: true, slug: true, seoTitle: true, seoDesc: true },
  });

  revalidatePath("/dashboard/website");
  revalidatePath(`/book/${updated.slug}`);
  return updated;
}
