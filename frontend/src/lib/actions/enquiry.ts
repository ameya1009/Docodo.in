"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

import { checkRateLimit } from "@/lib/rate-limit";

export async function createPublicEnquiry(rawInput: {
  businessId: string;
  name: string;
  phone: string;
  serviceName?: string;
  message?: string;
}) {
  const { businessId, name, phone, serviceName, message } = rawInput;

  if (!businessId || !name?.trim() || !phone?.trim()) {
    throw new Error("Name and Phone are required to send an enquiry.");
  }

  const rateLimit = checkRateLimit(`enquiry:${businessId}:${phone.trim()}`, {
    maxTokens: 5,
    intervalMs: 60_000,
  });
  if (!rateLimit.allowed) {
    throw new Error("Too many enquiry submissions. Please wait a minute before submitting again.");
  }

  const business = await prisma.business.findUnique({
    where: { id: businessId, isPublished: true },
    select: { id: true, slug: true },
  });

  if (!business) {
    throw new Error("Business not found or not accepting enquiries.");
  }

  const enquiry = await prisma.enquiry.create({
    data: {
      businessId,
      name: name.trim(),
      phone: phone.trim(),
      serviceName: serviceName?.trim() || null,
      message: message?.trim() || null,
      status: "NEW",
    },
  });

  // Also upsert into customer CRM
  try {
    await prisma.customer.upsert({
      where: {
        businessId_phone: {
          businessId,
          phone: phone.trim(),
        },
      },
      update: {
        name: name.trim(),
      },
      create: {
        businessId,
        name: name.trim(),
        phone: phone.trim(),
        source: "ENQUIRY",
        tags: JSON.stringify(["Enquiry Lead"]),
      },
    });
  } catch (crmErr) {
    console.warn("[CRM] Enquiry customer upsert notice:", crmErr);
  }

  revalidatePath(`/book/${business.slug}`);
  revalidatePath("/dashboard");

  return { success: true, enquiryId: enquiry.id };
}

export async function getBusinessEnquiries() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const business = await prisma.business.findFirst({
    where: { ownerId: session.user.id },
    select: { id: true },
  });

  if (!business) return [];

  return prisma.enquiry.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function updateEnquiryStatus(
  enquiryId: string,
  status: "NEW" | "CONTACTED" | "BOOKED" | "LOST"
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const enquiry = await prisma.enquiry.findUnique({
    where: { id: enquiryId },
    include: { business: true },
  });

  if (!enquiry || enquiry.business.ownerId !== session.user.id) {
    throw new Error("Forbidden: you do not have access to this enquiry.");
  }

  const updated = await prisma.enquiry.update({
    where: { id: enquiryId },
    data: { status },
  });

  revalidatePath("/dashboard");
  return updated;
}
