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
  botWebhookUrl?: string;
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

// ─── LIVE CONVERSATION & HUMAN HANDOFF ACTIONS ───────────────────────────────

export async function getConversationsAction(businessId: string) {
  await requireBusinessOwnership(businessId);

  return prisma.conversation.findMany({
    where: { businessId },
    include: {
      messages: {
        orderBy: { timestamp: "desc" },
        take: 1,
      },
    },
    orderBy: { lastMessageAt: "desc" },
    take: 30,
  });
}

export async function getConversationMessagesAction(conversationId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { business: true },
  });

  if (!conversation || conversation.business.ownerId !== session.user.id) {
    throw new Error("Forbidden");
  }

  // Mark unread count as 0
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { unreadCount: 0 },
  });

  return prisma.chatMessage.findMany({
    where: { conversationId },
    orderBy: { timestamp: "asc" },
    take: 50,
  });
}

export async function toggleBotPauseAction(conversationId: string, pause: boolean) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { business: true },
  });

  if (!conversation || conversation.business.ownerId !== session.user.id) {
    throw new Error("Forbidden");
  }

  const updated = await prisma.conversation.update({
    where: { id: conversationId },
    data: { isBotPaused: pause },
  });

  revalidatePath("/dashboard/whatsapp");
  return updated;
}

export async function sendStaffReplyAction(conversationId: string, text: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { business: true },
  });

  if (!conversation || conversation.business.ownerId !== session.user.id) {
    throw new Error("Forbidden");
  }

  // Save staff message to thread
  const message = await prisma.chatMessage.create({
    data: {
      conversationId,
      sender: "STAFF",
      text: text.trim(),
      status: "SENT",
    },
  });

  // Dispatch message via Meta API / Backend
  await DocodoBackendAPI.dispatchWhatsAppMessage({
    businessId: conversation.businessId,
    recipientPhone: conversation.customerPhone,
    messageType: "BROADCAST",
    customMessage: text.trim(),
  }).catch((err) => {
    console.warn("[Staff Reply Dispatch Notice]", err);
  });

  revalidatePath("/dashboard/whatsapp");
  return message;
}
