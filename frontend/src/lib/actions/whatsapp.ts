"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DocodoBackendAPI } from "@/lib/api-client";
import { revalidatePath } from "next/cache";

async function requireBusinessOwnership(businessId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const business = await prisma.business.findFirst({
    where: { id: businessId, ownerId: session.user.id },
    select: { id: true, name: true, slug: true, phone: true, whatsapp: true },
  });

  if (!business) throw new Error("Forbidden: business not found or not owned by user.");
  return business;
}

export async function sendWhatsAppBroadcastAction(rawInput: {
  businessId: string;
  segment: string;
  template: string;
}) {
  const business = await requireBusinessOwnership(rawInput.businessId);

  const res = await DocodoBackendAPI.sendWhatsAppBroadcast({
    businessId: business.id,
    segment: rawInput.segment,
    template: rawInput.template,
  });

  revalidatePath("/dashboard/whatsapp");
  return res;
}

export async function saveWhatsAppConfigAction(rawInput: {
  businessId: string;
  whatsappPhone?: string;
  whatsappApiKey?: string;
  botWebhookUrl?: string; // Botpress / BotPenguin / Custom Webhook integration
}) {
  const business = await requireBusinessOwnership(rawInput.businessId);

  const updated = await prisma.business.update({
    where: { id: business.id },
    data: {
      whatsapp: rawInput.whatsappPhone?.trim() || business.phone,
    },
  });

  revalidatePath("/dashboard/whatsapp");
  revalidatePath("/dashboard/settings");
  return { success: true, whatsapp: updated.whatsapp };
}

export async function getWhatsAppLogsAction(businessId: string) {
  await requireBusinessOwnership(businessId);

  return prisma.whatsAppLog.findMany({
    where: { businessId },
    orderBy: { timestamp: "desc" },
    take: 50,
  });
}
