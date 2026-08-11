"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import {
  BusinessDiscoverySchema,
  BusinessDiscoveryInput,
  ConfirmDiscoveredProfileSchema,
  ConfirmDiscoveredProfileInput,
} from "@/lib/validations/discovery";
import {
  synthesizeBusinessProfile,
  recordInstrumentationEvent,
  DiscoveredBusinessProfile,
} from "@/lib/engines/discovery-engine";

export interface DiscoveryActionResponse {
  success: boolean;
  profile?: DiscoveredBusinessProfile;
  error?: string;
}

/**
 * Executes zero-config AI discovery synthesis from just 3 core business identity fields.
 */
export async function discoverBusinessAction(rawInput: unknown): Promise<DiscoveryActionResponse> {
  try {
    const parsed = BusinessDiscoverySchema.parse(rawInput);
    recordInstrumentationEvent("discovery_triggered", {
      name: parsed.name,
      city: parsed.city,
      type: parsed.businessType,
    });

    const profile = synthesizeBusinessProfile(parsed);
    return { success: true, profile };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to analyze business details." };
  }
}

/**
 * Helper to generate an available URL-safe slug for instant website generation.
 */
async function generateUniqueSlug(name: string, city: string): Promise<string> {
  const baseSlug = `${name} ${city}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  
  let candidate = baseSlug;
  let counter = 1;
  while (true) {
    const existing = await prisma.business.findUnique({ where: { slug: candidate }, select: { id: true } });
    if (!existing) return candidate;
    candidate = `${baseSlug}-${counter++}`;
  }
}

/**
 * Confirms discovered profile, commits real PostgreSQL entities (Business, WorkingHours, Services),
 * immediately publishes the live website & booking page, and emits telemetry funnels.
 */
export async function confirmDiscoveredBusinessAction(
  rawProfile: unknown
): Promise<{ success: boolean; error?: string; slug?: string }> {
  try {
    const data = ConfirmDiscoveredProfileSchema.parse(rawProfile);
    const session = await auth();

    recordInstrumentationEvent("profile_confirmed", { name: data.name, city: data.city });

    // If user is not yet signed in, we store validated state in runtime memory or return clean prompt to complete signup
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Please complete account registration to instantly activate your digital booking page.",
      };
    }

    const userId = session.user.id;
    const slug = await generateUniqueSlug(data.name, data.city);

    // Reconstruct clean Working Hours from engine default mapping
    const defaultHours = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => ({
      day,
      isOpen: day !== "SUN",
      openTime: "09:30",
      closeTime: "19:00",
    }));

    // Find or create Business attached to authenticated merchant owner
    const existingBusiness = await prisma.business.findFirst({
      where: { ownerId: userId },
      select: { id: true, slug: true },
    });

    let activeBusinessId: string;
    let finalSlug: string;

    if (existingBusiness) {
      activeBusinessId = existingBusiness.id;
      finalSlug = existingBusiness.slug;
      await prisma.business.update({
        where: { id: activeBusinessId },
        data: {
          name: data.name,
          industry: data.businessType,
          city: data.city,
          tagline: data.tagline || null,
          description: data.description || null,
          address: data.address || null,
          phone: data.phone || null,
          discoveryQuery: `${data.name}, ${data.city} (${data.businessType})`,
          discoveredProfile: JSON.stringify(data),
          onboardingStep: 4,
          onboardingComplete: true,
          activationScore: 40, // Website Live (20%) + Booking Active (20%)
          activatedAt: new Date(),
        },
      });
    } else {
      finalSlug = slug;
      const created = await prisma.business.create({
        data: {
          ownerId: userId,
          name: data.name,
          slug: finalSlug,
          industry: data.businessType,
          city: data.city,
          tagline: data.tagline || null,
          description: data.description || null,
          address: data.address || null,
          phone: data.phone || null,
          discoveryQuery: `${data.name}, ${data.city} (${data.businessType})`,
          discoveredProfile: JSON.stringify(data),
          onboardingStep: 4,
          onboardingComplete: true,
          activationScore: 40,
          activatedAt: new Date(),
        },
      });
      activeBusinessId = created.id;
    }

    // Replace working hours with standard operating schedule
    await prisma.workingHours.deleteMany({ where: { businessId: activeBusinessId } });
    await prisma.workingHours.createMany({
      data: defaultHours.map((h) => ({ ...h, businessId: activeBusinessId })),
    });

    // Replace services with the discovered booking offerings
    await prisma.service.deleteMany({ where: { businessId: activeBusinessId } });
    await prisma.service.createMany({
      data: data.services.map((svc) => ({
        businessId: activeBusinessId,
        name: svc.name,
        price: svc.price,
        duration: svc.duration,
        description: svc.description || null,
        isAvailable: true,
      })),
    });

    recordInstrumentationEvent("website_published", {
      businessId: activeBusinessId,
      slug: finalSlug,
      activationScore: 40,
    });

    revalidatePath("/dashboard");
    revalidatePath(`/book/${finalSlug}`);
    return { success: true, slug: finalSlug };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to finalize business activation." };
  }
}
