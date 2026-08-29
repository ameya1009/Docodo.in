"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getKnowledgeBaseAction() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const business = await prisma.business.findFirst({
    where: { ownerId: session.user.id },
    select: { id: true },
  });

  if (!business) return [];

  return prisma.knowledgeBase.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function createKnowledgeBaseAction(data: {
  category: string;
  question: string;
  answer: string;
  tags?: string[];
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const business = await prisma.business.findFirst({
    where: { ownerId: session.user.id },
    select: { id: true },
  });

  if (!business) throw new Error("Business profile not found");

  const kb = await prisma.knowledgeBase.create({
    data: {
      businessId: business.id,
      category: data.category || "FAQ",
      question: data.question.trim(),
      answer: data.answer.trim(),
      tags: data.tags ? JSON.stringify(data.tags) : null,
    },
  });

  revalidatePath("/dashboard/whatsapp");
  return kb;
}

export async function deleteKnowledgeBaseAction(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const business = await prisma.business.findFirst({
    where: { ownerId: session.user.id },
    select: { id: true },
  });

  if (!business) throw new Error("Business not found");

  const kb = await prisma.knowledgeBase.findUnique({
    where: { id },
  });

  if (!kb || kb.businessId !== business.id) {
    throw new Error("Forbidden");
  }

  await prisma.knowledgeBase.delete({
    where: { id },
  });

  revalidatePath("/dashboard/whatsapp");
  return { success: true };
}
