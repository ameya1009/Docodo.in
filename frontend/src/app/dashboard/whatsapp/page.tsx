import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import WhatsAppClient from "./WhatsAppClient";

export default async function WhatsAppPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const business = await prisma.business.findFirst({
    where: { ownerId: session.user.id },
    select: { id: true, name: true, slug: true, phone: true, whatsapp: true },
  });
  if (!business) redirect("/onboarding");

  const [logs, customerCount, conversations, knowledgeBases] = await Promise.all([
    prisma.whatsAppLog.findMany({
      where: { businessId: business.id },
      orderBy: { timestamp: "desc" },
      take: 20,
    }),
    prisma.customer.count({
      where: { businessId: business.id },
    }),
    prisma.conversation.findMany({
      where: { businessId: business.id },
      include: {
        messages: {
          orderBy: { timestamp: "desc" },
          take: 1,
        },
      },
      orderBy: { lastMessageAt: "desc" },
      take: 20,
    }),
    prisma.knowledgeBase.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <WhatsAppClient
      business={business}
      logs={logs}
      customerCount={customerCount}
      initialConversations={conversations}
      initialKnowledgeBases={knowledgeBases}
    />
  );
}
