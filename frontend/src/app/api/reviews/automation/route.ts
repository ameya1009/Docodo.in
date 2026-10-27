import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireFeature } from "@/lib/services/entitlement-service";
import { FEATURE_KEYS } from "@/lib/plans-config";

import { DocodoBackendAPI } from "@/lib/api-client";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const business = await prisma.business.findFirst({
      where: { ownerId: session.user.id },
      select: { id: true, name: true, slug: true, websiteConfig: true },
    });

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    // Server-side entitlement check: require Growth REVIEW_AUTOMATION
    await requireFeature(business.id, FEATURE_KEYS.REVIEW_AUTOMATION);

    const body = await req.json().catch(() => ({}));
    const { bookingId } = body;

    // Real review automation logic
    if (bookingId) {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { business: true, customer: true, service: true },
      });

      if (!booking) {
        return NextResponse.json({ error: "Booking not found" }, { status: 404 });
      }

      if (booking.businessId !== business.id) {
        return NextResponse.json(
          { error: "Forbidden: you do not have permission to manage this booking" },
          { status: 403 }
        );
      }

      const customerPhone = booking.customerPhone || booking.customer?.phone;
      const biz = booking.business || business;

      if (customerPhone && biz) {
        let reviewUrl = (biz as any).googleReviewUrl || null;
        if (!reviewUrl && (biz as any).googlePlaceId) {
          reviewUrl = `https://search.google.com/local/writereview?placeid=${(biz as any).googlePlaceId}`;
        }
        if (!reviewUrl && biz.websiteConfig) {
          try {
            const cfg = typeof biz.websiteConfig === "string" ? JSON.parse(biz.websiteConfig) : biz.websiteConfig;
            if (cfg.googleReviewUrl) reviewUrl = cfg.googleReviewUrl;
            else if (cfg.googlePlaceId) reviewUrl = `https://search.google.com/local/writereview?placeid=${cfg.googlePlaceId}`;
          } catch {}
        }
        if (!reviewUrl && biz.slug) {
          const rawUrl = process.env.NEXT_PUBLIC_APP_URL || "https://docodo.in";
          const baseUrl = (!rawUrl || rawUrl.includes("localhost") || rawUrl.includes("127.0.0.1")) ? "https://docodo.in" : rawUrl;
          reviewUrl = `${baseUrl}/book/${biz.slug}#reviews`;
        }

        if (reviewUrl) {
          const customerName = booking.customerName || booking.customer?.name || "Valued Client";
          const bizName = biz.name || "our team";
          const thankYouMessage = `Hi ${customerName}, thank you for choosing ${bizName}! We hope you had a great experience with our team. Could you please take 30 seconds to share your feedback and leave us a review? It helps us immensely:\n${reviewUrl}`;

          await DocodoBackendAPI.dispatchWhatsAppMessage({
            businessId: biz.id,
            recipientPhone: customerPhone,
            messageType: "REVIEW_REQUEST",
            customMessage: thankYouMessage,
          }).catch((err) => {
            console.warn("[Review Automation API] WhatsApp review dispatch error:", err);
          });
        }
      }

      await prisma.booking.update({
        where: { id: bookingId },
        data: { reviewSent: true },
      }).catch(() => null);
    }

    return NextResponse.json({
      success: true,
      message: "Review collection sequence dispatched successfully",
      feature: FEATURE_KEYS.REVIEW_AUTOMATION,
    });
  } catch (error: any) {
    if (error.name === "EntitlementError") {
      return NextResponse.json(
        { error: error.message, featureKey: error.featureKey, planId: error.planId },
        { status: error.statusCode || 403 }
      );
    }
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
