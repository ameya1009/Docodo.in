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
  const business = await requireBusinessOwnership(businessId);

  const updated = await prisma.business.update({
    where: { id: businessId },
    data: { seoTitle, seoDesc: seoDesc || null },
    select: { id: true, slug: true, seoTitle: true, seoDesc: true },
  });

  revalidatePath("/dashboard/website");
  revalidatePath(`/book/${business.slug}`);
  return updated;
}

export async function createServiceAction(rawInput: {
  businessId: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
}) {
  const { businessId, name, description, duration, price } = rawInput;
  if (!name?.trim()) throw new Error("Service name is required");
  if (!duration || duration <= 0) throw new Error("Duration must be greater than 0");
  if (price < 0) throw new Error("Price cannot be negative");

  const business = await requireBusinessOwnership(businessId);

  const service = await prisma.service.create({
    data: {
      businessId: business.id,
      name: name.trim(),
      description: description?.trim() || null,
      duration: Number(duration),
      price: Number(price),
      currency: "INR",
      isActive: true,
    },
  });

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/website");
  revalidatePath(`/book/${business.slug}`);
  return service;
}

export async function updateServiceAction(rawInput: {
  serviceId: string;
  name?: string;
  description?: string;
  duration?: number;
  price?: number;
  isActive?: boolean;
}) {
  const { serviceId, name, description, duration, price, isActive } = rawInput;
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: { business: true },
  });

  if (!service || service.business.ownerId !== session.user.id) {
    throw new Error("Forbidden: you do not own this service.");
  }

  const updated = await prisma.service.update({
    where: { id: serviceId },
    data: {
      name: name !== undefined ? name.trim() : undefined,
      description: description !== undefined ? description.trim() : undefined,
      duration: duration !== undefined ? Number(duration) : undefined,
      price: price !== undefined ? Number(price) : undefined,
      isActive: isActive !== undefined ? Boolean(isActive) : undefined,
    },
  });

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/website");
  revalidatePath(`/book/${service.business.slug}`);
  return updated;
}

export async function deleteServiceAction(serviceId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: { business: true },
  });

  if (!service || service.business.ownerId !== session.user.id) {
    throw new Error("Forbidden: you do not own this service.");
  }

  // Soft deactivation safeguard: never hard-delete if service has existing bookings
  const bookingCount = await prisma.booking.count({
    where: { serviceId },
  });

  if (bookingCount > 0) {
    await prisma.service.update({
      where: { id: serviceId },
      data: { isActive: false },
    });
    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard/website");
    revalidatePath(`/book/${service.business.slug}`);
    return { success: true, deactivated: true };
  }

  await prisma.service.delete({
    where: { id: serviceId },
  });

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/website");
  revalidatePath(`/book/${service.business.slug}`);
  return { success: true };
}

export async function updatePaymentSettingsAction(rawInput: {
  businessId: string;
  upiId?: string;
  beneficiaryName?: string;
  acceptVenue?: boolean;
  acceptUpi?: boolean;
}) {
  const { businessId, upiId, beneficiaryName, acceptVenue, acceptUpi } = rawInput;
  const business = await requireBusinessOwnership(businessId);

  // Validate UPI VPA format if provided
  if (upiId && upiId.trim()) {
    const trimmedUpi = upiId.trim();
    const vpaRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    if (!vpaRegex.test(trimmedUpi)) {
      throw new Error(
        "Invalid UPI ID format. Must be in the form username@bankhandle (e.g. drsharma@okhdfcbank or 9876543210@paytm)."
      );
    }
  }

  const existingBiz = await prisma.business.findUnique({
    where: { id: businessId },
    select: { websiteConfig: true, name: true },
  });

  let parsedConfig: Record<string, any> = {};
  try {
    if (existingBiz?.websiteConfig) {
      parsedConfig = JSON.parse(existingBiz.websiteConfig);
    }
  } catch {}

  const currentPaymentSettings = parsedConfig.paymentSettings || {};
  const updatedPaymentSettings = {
    ...currentPaymentSettings,
    upiId: upiId !== undefined ? upiId.trim() : (currentPaymentSettings.upiId || ""),
    beneficiaryName: beneficiaryName !== undefined ? beneficiaryName.trim() : (currentPaymentSettings.beneficiaryName || existingBiz?.name || "Business"),
    acceptVenue: acceptVenue !== undefined ? Boolean(acceptVenue) : (currentPaymentSettings.acceptVenue ?? true),
    acceptUpi: acceptUpi !== undefined ? Boolean(acceptUpi) : (currentPaymentSettings.acceptUpi ?? true),
  };

  parsedConfig.paymentSettings = updatedPaymentSettings;

  await prisma.business.update({
    where: { id: businessId },
    data: { websiteConfig: JSON.stringify(parsedConfig) },
  });

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/website");
  revalidatePath(`/book/${business.slug}`);

  return { success: true, paymentSettings: updatedPaymentSettings };
}

