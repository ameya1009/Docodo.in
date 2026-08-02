"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { generateSlug } from "@/lib/utils";

// Step 1: Save business info
export async function saveBusinessInfo(data: {
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
  if (!session?.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;
  let slug = generateSlug(data.name);

  // Ensure slug uniqueness
  const existing = await prisma.business.findUnique({ where: { slug } });
  if (existing && existing.ownerId !== userId) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const business = await prisma.business.upsert({
    where: { slug },
    update: {
      name: data.name,
      industry: data.industry,
      phone: data.phone,
      email: data.email,
      address: data.address,
      city: data.city,
      description: data.about,
      instagram: data.instagram,
      facebook: data.facebook,
      whatsapp: data.whatsapp,
      onboardingStep: 2,
    },
    create: {
      name: data.name,
      slug,
      industry: data.industry,
      phone: data.phone,
      email: data.email,
      address: data.address,
      city: data.city,
      description: data.about,
      instagram: data.instagram,
      facebook: data.facebook,
      whatsapp: data.whatsapp,
      ownerId: userId,
      onboardingStep: 2,
      // Seed default working hours
      workingHours: {
        create: [
          { day: "MON", isOpen: true, openTime: "09:00", closeTime: "18:00" },
          { day: "TUE", isOpen: true, openTime: "09:00", closeTime: "18:00" },
          { day: "WED", isOpen: true, openTime: "09:00", closeTime: "18:00" },
          { day: "THU", isOpen: true, openTime: "09:00", closeTime: "18:00" },
          { day: "FRI", isOpen: true, openTime: "09:00", closeTime: "18:00" },
          { day: "SAT", isOpen: true, openTime: "10:00", closeTime: "16:00" },
          { day: "SUN", isOpen: false, openTime: "10:00", closeTime: "14:00" },
        ],
      },
    },
  });

  return { businessId: business.id, slug: business.slug };
}

// Step 2: Save style
export async function saveBusinessStyle(businessId: string, style: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.business.update({
    where: { id: businessId },
    data: { style, onboardingStep: 3 },
  });
}

// Step 3: Save theme
export async function saveBusinessTheme(businessId: string, data: {
  primaryColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
  darkMode: boolean;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.business.update({
    where: { id: businessId },
    data: { ...data, onboardingStep: 4 },
  });
}

// Step 4: Complete onboarding — trigger AI generation
export async function completeOnboarding(businessId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    include: { services: true },
  });
  if (!business) throw new Error("Business not found");

  // Seed default services based on industry
  const defaultServices = getDefaultServices(business.industry);
  if (business.services.length === 0 && defaultServices.length > 0) {
    await prisma.service.createMany({
      data: defaultServices.map((s, i) => ({
        businessId,
        ...s,
        order: i,
      })),
    });
  }

  // Generate AI content (async, non-blocking)
  generateAIContent(businessId, business).catch(console.error);

  // Mark onboarding complete
  await prisma.business.update({
    where: { id: businessId },
    data: { onboardingComplete: true, isPublished: true, onboardingStep: 5 },
  });

  revalidatePath("/dashboard");
  return { slug: business.slug };
}

// Seed default services by industry
function getDefaultServices(industry: string) {
  const services: Record<string, Array<{ name: string; duration: number; price: number; description?: string }>> = {
    salon: [
      { name: "Haircut & Style", duration: 45, price: 400, description: "Professional cut and styling" },
      { name: "Hair Colour", duration: 90, price: 1200, description: "Full colour treatment" },
      { name: "Blow Dry", duration: 30, price: 250, description: "Wash and blow dry" },
    ],
    spa: [
      { name: "Swedish Massage", duration: 60, price: 1500, description: "Full body relaxation massage" },
      { name: "Deep Tissue Massage", duration: 60, price: 1800, description: "Therapeutic deep tissue work" },
      { name: "Facial", duration: 60, price: 1200, description: "Brightening facial treatment" },
    ],
    clinic: [
      { name: "General Consultation", duration: 20, price: 500, description: "Doctor consultation" },
      { name: "Follow-up Visit", duration: 15, price: 300, description: "Follow-up appointment" },
    ],
    dentist: [
      { name: "Dental Checkup", duration: 30, price: 400, description: "Routine dental examination" },
      { name: "Teeth Cleaning", duration: 45, price: 800, description: "Professional scaling and polishing" },
      { name: "Tooth Extraction", duration: 30, price: 600, description: "Simple tooth extraction" },
    ],
    gym: [
      { name: "Personal Training Session", duration: 60, price: 800, description: "One-on-one training session" },
      { name: "Trial Class", duration: 60, price: 0, description: "Free trial class for new members" },
    ],
    yoga: [
      { name: "Group Yoga Class", duration: 60, price: 300, description: "Open group yoga session" },
      { name: "Private Session", duration: 60, price: 800, description: "One-on-one yoga instruction" },
    ],
  };

  return services[industry.toLowerCase()] ?? [
    { name: "Consultation", duration: 30, price: 500, description: "Initial consultation" },
    { name: "Session", duration: 60, price: 1000, description: "Full service session" },
  ];
}

// AI content generation
async function generateAIContent(businessId: string, business: any) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Mock content if no API key
    await prisma.aIContent.createMany({
      data: [
        {
          businessId,
          type: "DESCRIPTION",
          content: `Welcome to ${business.name}, your trusted ${business.industry} in ${business.city || "your city"}. We are dedicated to providing exceptional service and care to every client. Our experienced team ensures you leave feeling confident and refreshed.`,
        },
        {
          businessId,
          type: "SEO",
          content: `Best ${business.industry} in ${business.city || "your area"} | ${business.name} - Professional services, affordable prices, expert team. Book your appointment online today.`,
        },
        {
          businessId,
          type: "INSTAGRAM",
          content: `✨ Transform yourself at ${business.name}! 🌟\n\nWe believe everyone deserves to look and feel their best. Our expert team is ready to make your experience unforgettable.\n\n📍 ${business.address || business.city || "Visit us"}\n📞 ${business.phone}\n🔗 Book online - link in bio!\n\n#${business.industry.toLowerCase()} #${business.city?.toLowerCase().replace(/\s/g, '') || "india"} #selfcare #wellness`,
        },
      ],
    });
    return;
  }

  try {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are a marketing expert for local service businesses in India. Generate professional content for:
Business Name: ${business.name}
Industry: ${business.industry}
City: ${business.city || "India"}
Phone: ${business.phone}

Generate a JSON object with these keys:
- description: 2-3 sentence business description (warm, professional, India-appropriate)
- seoMeta: SEO meta description (under 160 chars)
- instagramPost: Instagram post with emojis, hashtags, call to action (India-focused)`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      await prisma.aIContent.createMany({
        data: [
          { businessId, type: "DESCRIPTION", content: parsed.description },
          { businessId, type: "SEO", content: parsed.seoMeta },
          { businessId, type: "INSTAGRAM", content: parsed.instagramPost },
        ],
      });
    }
  } catch (err) {
    console.error("AI generation failed:", err);
  }
}
