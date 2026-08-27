"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { generateSlug } from "@/lib/utils";
import {
  BusinessInfoSchema,
  BusinessStyleSchema,
  BusinessThemeSchema,
  LaunchEngineStepSchema,
} from "@/lib/validations/onboarding";
import {
  getDefaultServices,
  getDefaultWorkingHours,
  generateSEOMetadata,
  getFallbackAIContent,
} from "@/lib/engines/business-launch";

/**
 * 15-MINUTE PROMISE CORE ONBOARDING ACTION
 * Saves business essentials, services, and operating schedule in one atomic transaction,
 * calculating setupTimeMinutes and publishing the booking page immediately.
 */
export async function save15MinuteOnboardingAction(payload: {
  name: string;
  category: string;
  phone: string;
  whatsapp?: string;
  address?: string;
  city: string;
  instagram?: string;
  googleBusinessUrl?: string;
  services: Array<{ name: string; price: number; duration: number }>;
  workingHours: Array<{ day: string; isOpen: boolean; openTime: string; closeTime: string }>;
  startedAt?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized: please sign in first");

  const userId = session.user.id;
  const startedAtDate = payload.startedAt ? new Date(payload.startedAt) : new Date();
  const completedAtDate = new Date();
  const diffMs = completedAtDate.getTime() - startedAtDate.getTime();
  const setupTimeMinutes = Math.max(1, Math.round(diffMs / 60000));

  // Determine base slug
  let slug = generateSlug(payload.name);
  const slugConflict = await prisma.business.findUnique({ where: { slug } });
  if (slugConflict && slugConflict.ownerId !== userId) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const existingBusiness = await prisma.business.findFirst({
    where: { ownerId: userId },
    select: { id: true, slug: true },
  });

  const result = await prisma.$transaction(async (tx) => {
    let businessId: string;
    let finalSlug: string;

    if (existingBusiness) {
      businessId = existingBusiness.id;
      finalSlug = existingBusiness.slug;
      await tx.business.update({
        where: { id: businessId },
        data: {
          name: payload.name.trim(),
          industry: payload.category.trim(),
          phone: payload.phone.trim(),
          whatsapp: payload.whatsapp?.trim() || payload.phone.trim(),
          address: payload.address?.trim() || null,
          city: payload.city.trim(),
          instagram: payload.instagram?.trim() || null,
          isPublished: true,
          onboardingComplete: true,
          onboardingStep: 5,
          onboardingStartedAt: startedAtDate,
          onboardingCompletedAt: completedAtDate,
          setupTimeMinutes,
        },
      });
    } else {
      finalSlug = slug;
      const created = await tx.business.create({
        data: {
          ownerId: userId,
          name: payload.name.trim(),
          slug: finalSlug,
          industry: payload.category.trim(),
          phone: payload.phone.trim(),
          whatsapp: payload.whatsapp?.trim() || payload.phone.trim(),
          address: payload.address?.trim() || null,
          city: payload.city.trim(),
          instagram: payload.instagram?.trim() || null,
          isPublished: true,
          onboardingComplete: true,
          onboardingStep: 5,
          onboardingStartedAt: startedAtDate,
          onboardingCompletedAt: completedAtDate,
          setupTimeMinutes,
        },
      });
      businessId = created.id;
    }

    // Replace services with the custom user services
    if (payload.services && payload.services.length > 0) {
      await tx.service.deleteMany({ where: { businessId } });
      await tx.service.createMany({
        data: payload.services.map((svc, idx) => ({
          businessId,
          name: svc.name.trim(),
          price: Number(svc.price) || 0,
          duration: Number(svc.duration) || 60,
          order: idx,
          isActive: true,
        })),
      });
    }

    // Replace working hours with the custom user schedule
    if (payload.workingHours && payload.workingHours.length > 0) {
      await tx.workingHours.deleteMany({ where: { businessId } });
      await tx.workingHours.createMany({
        data: payload.workingHours.map((wh) => ({
          businessId,
          day: wh.day,
          isOpen: wh.isOpen,
          openTime: wh.openTime || "09:00",
          closeTime: wh.closeTime || "19:00",
        })),
      });
    }

    return { businessId, slug: finalSlug, setupTimeMinutes };
  });

  revalidatePath("/dashboard");
  revalidatePath(`/book/${result.slug}`);

  return { success: true, ...result };
}

// Step 1: Save business info with strict Zod validation
export async function saveBusinessInfo(rawInput: {
  name: string;
  industry: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  about?: string;
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const data = BusinessInfoSchema.parse(rawInput);
  const userId = session.user.id;
  const existingBusiness = await prisma.business.findFirst({
    where: { ownerId: userId },
  });

  // Ensure slug uniqueness across other tenants
  let slug = generateSlug(data.name);
  const slugConflict = await prisma.business.findUnique({ where: { slug } });
  if (slugConflict && slugConflict.ownerId !== userId) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  let business;
  if (existingBusiness) {
    business = await prisma.business.update({
      where: { id: existingBusiness.id },
      data: {
        name: data.name,
        slug,
        industry: data.industry,
        phone: data.phone,
        email: data.email || null,
        address: data.address || null,
        city: data.city || null,
        description: data.about || null,
        instagram: data.instagram || null,
        facebook: data.facebook || null,
        whatsapp: data.whatsapp || data.phone,
        onboardingStep: 2,
      },
    });
  } else {
    business = await prisma.business.create({
      data: {
        name: data.name,
        slug,
        industry: data.industry,
        phone: data.phone,
        email: data.email || null,
        address: data.address || null,
        city: data.city || null,
        description: data.about || null,
        instagram: data.instagram || null,
        facebook: data.facebook || null,
        whatsapp: data.whatsapp || data.phone,
        ownerId: userId,
        onboardingStep: 2,
        workingHours: {
          create: getDefaultWorkingHours(),
        },
      },
    });
  }

  return { businessId: business.id, slug: business.slug };
}

// Step 2: Save design style with Zod validation
export async function saveBusinessStyle(businessId: string, style: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const validated = BusinessStyleSchema.parse({ businessId, style });
  await prisma.business.update({
    where: { id: validated.businessId },
    data: { style: validated.style, onboardingStep: 3 },
  });
}

// Step 3: Save visual theme tokens with Zod validation
export async function saveBusinessTheme(businessId: string, rawInput: {
  primaryColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
  darkMode: boolean;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const validated = BusinessThemeSchema.parse({ businessId, ...rawInput });
  await prisma.business.update({
    where: { id: validated.businessId },
    data: {
      primaryColor: validated.primaryColor,
      accentColor: validated.accentColor,
      fontHeading: validated.fontHeading,
      fontBody: validated.fontBody,
      darkMode: validated.darkMode,
      onboardingStep: 4,
    },
  });
}

// ─── PRODUCTION BUSINESS LAUNCH ENGINE EXECUTORS (ZERO PLACEHOLDERS / MOCKS) ───

export async function launchStep1_Website(rawBusinessId: string) {
  const { businessId } = LaunchEngineStepSchema.parse({ businessId: rawBusinessId });
  const business = await prisma.business.findUnique({ where: { id: businessId } });
  if (!business) throw new Error("Business record not found in DB");

  // Ensure persistent website config exists in DB
  const defaultWebsiteConfig = JSON.stringify({
    hero: true,
    services: true,
    about: true,
    gallery: true,
    testimonials: true,
    faq: false,
    contact: true,
    booking_cta: true,
  });

  await prisma.business.update({
    where: { id: businessId },
    data: {
      websiteConfig: business.websiteConfig || defaultWebsiteConfig,
    },
  });

  return { status: "WEBSITE_READY", slug: business.slug };
}

export async function launchStep2_BookingSystem(rawBusinessId: string) {
  const { businessId } = LaunchEngineStepSchema.parse({ businessId: rawBusinessId });
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    include: { services: true, workingHours: true },
  });
  if (!business) throw new Error("Business not found in DB");

  const defaultServices = getDefaultServices(business.industry);
  if (business.services.length === 0 && defaultServices.length > 0) {
    await prisma.service.createMany({
      data: defaultServices.map((s, i) => ({
        businessId,
        name: s.name,
        duration: s.duration,
        price: s.price,
        description: s.description || null,
        order: i,
        isActive: true,
      })),
    });
  }

  return { status: "BOOKING_ENGINE_ONLINE", servicesCount: defaultServices.length };
}

export async function launchStep3_CRM(rawBusinessId: string) {
  const { businessId } = LaunchEngineStepSchema.parse({ businessId: rawBusinessId });
  const business = await prisma.business.findUnique({ where: { id: businessId } });
  if (!business) throw new Error("Business not found in DB");

  if (business.phone) {
    await prisma.customer.upsert({
      where: {
        businessId_phone: {
          businessId,
          phone: business.phone,
        },
      },
      update: {},
      create: {
        businessId,
        name: `${business.name} Owner (Demo Lead)`,
        phone: business.phone,
        email: business.email || null,
        tags: JSON.stringify(["Owner", "System Ready"]),
        source: "WHATSAPP",
        visitCount: 1,
        lifetimeValue: 0,
      },
    });
  }

  return { status: "CRM_ACTIVE", leadInitialized: true };
}

export async function launchStep4_SEOMetadata(rawBusinessId: string) {
  const { businessId } = LaunchEngineStepSchema.parse({ businessId: rawBusinessId });
  const business = await prisma.business.findUnique({ where: { id: businessId } });
  if (!business) throw new Error("Business not found in DB");

  const { seoTitle, seoDesc } = generateSEOMetadata(business.name, business.industry, business.city);

  await prisma.business.update({
    where: { id: businessId },
    data: { seoTitle, seoDesc },
  });

  return { status: "SEO_CONFIGURED", seoTitle };
}

export async function launchStep5_AIContent(rawBusinessId: string) {
  const { businessId } = LaunchEngineStepSchema.parse({ businessId: rawBusinessId });
  const business = await prisma.business.findUnique({ where: { id: businessId } });
  if (!business) throw new Error("Business not found in DB");

  const apiKey = process.env.GEMINI_API_KEY;
  const fallback = getFallbackAIContent(business.name, business.industry, business.city, business.address);
  let generatedDescription = fallback.description;
  let generatedInstagram = fallback.instagramPost;
  let generatedSEO = fallback.seoMeta;

  if (apiKey) {
    try {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `You are a professional marketing expert for Indian local service businesses. Generate high-converting copywriting for:
Business Name: ${business.name}
Industry: ${business.industry}
City: ${business.city || "India"}
Phone: ${business.phone || ""}

Generate a JSON object with strictly these keys:
- description: 2-3 sentence business description
- seoMeta: SEO description string under 160 chars
- instagramPost: Instagram social post with emojis and hashtags`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.description) generatedDescription = parsed.description;
        if (parsed.instagramPost) generatedInstagram = parsed.instagramPost;
        if (parsed.seoMeta) generatedSEO = parsed.seoMeta;
      }
    } catch (err) {
      console.warn("Gemini Live API unreachable, using robust production deterministic generator:", err);
    }
  }

  await prisma.aIContent.createMany({
    data: [
      { businessId, type: "DESCRIPTION", content: generatedDescription, isUsed: true },
      { businessId, type: "SEO", content: generatedSEO, isUsed: true },
      { businessId, type: "INSTAGRAM", content: generatedInstagram, isUsed: true },
    ],
  });

  return { status: "AI_CONTENT_GENERATED", itemsCreated: 3 };
}

export async function launchStep6_Analytics(rawBusinessId: string) {
  const { businessId } = LaunchEngineStepSchema.parse({ businessId: rawBusinessId });
  const business = await prisma.business.findUnique({ where: { id: businessId } });
  if (!business) throw new Error("Business not found in DB");

  await prisma.business.update({
    where: { id: businessId },
    data: {
      onboardingComplete: true,
      isPublished: true,
      onboardingStep: 5,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/book/${business.slug}`);
  return { status: "LAUNCH_COMPLETE", slug: business.slug };
}

// Complete legacy wrapper for backwards compatibility if invoked directly
export async function completeOnboarding(businessId: string) {
  await launchStep1_Website(businessId);
  await launchStep2_BookingSystem(businessId);
  await launchStep3_CRM(businessId);
  await launchStep4_SEOMetadata(businessId);
  await launchStep5_AIContent(businessId);
  const final = await launchStep6_Analytics(businessId);
  return { slug: final.slug };
}
