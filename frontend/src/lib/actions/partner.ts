"use server";

import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

export interface RegisterPartnerInput {
  name: string;
  email: string;
  phone: string;
  city?: string;
  upiId?: string;
  channel?: string;
}

export async function registerPartner(input: RegisterPartnerInput) {
  const { name, email, phone, city, upiId, channel } = input;

  if (!name?.trim() || !email?.trim() || !phone?.trim()) {
    throw new Error("Full name, email address, and mobile number are required to join the partner program.");
  }

  const cleanPhone = phone.trim().replace(/[^0-9]/g, "");
  const cleanEmail = email.trim().toLowerCase();

  const rateLimit = checkRateLimit(`partner_reg:${cleanPhone}`, {
    maxTokens: 3,
    intervalMs: 60_000,
  });
  if (!rateLimit.allowed) {
    throw new Error("Too many partner signup attempts. Please wait a minute and try again.");
  }

  // Generate unique referral code
  const cleanName = name.replace(/[^a-zA-Z]/g, "").slice(0, 4).toUpperCase() || "DOC";
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const referralCode = `${cleanName}-${randomSuffix}`;

  try {
    // Check if partner email already registered
    const existing = await prisma.partner.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return {
        success: true,
        message: "You are already registered in the Docodo Partner Program!",
        partner: {
          id: existing.id,
          name: existing.name,
          referralCode: existing.referralCode,
          commissionRate: existing.commissionRate,
        },
      };
    }

    const partner = await prisma.partner.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        referralCode,
        upiId: upiId?.trim() || null,
        commissionRate: 20.0,
        status: "ACTIVE",
      },
    });

    return {
      success: true,
      message: `Welcome to the Docodo Partner Program, ${partner.name}! Your referral link is live.`,
      partner: {
        id: partner.id,
        name: partner.name,
        referralCode: partner.referralCode,
        commissionRate: partner.commissionRate,
      },
    };
  } catch (err: any) {
    console.error("[Partner Registration Error]", err);
    throw new Error(err.message || "Failed to register partner account. Please try again.");
  }
}
