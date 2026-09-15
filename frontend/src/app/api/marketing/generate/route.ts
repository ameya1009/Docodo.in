import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireFeature } from "@/lib/services/entitlement-service";
import { FEATURE_KEYS } from "@/lib/plans-config";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const business = await prisma.business.findFirst({
      where: { ownerId: session.user.id },
      select: { id: true, name: true, industry: true },
    });

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    // Require Growth AI_MARKETING feature
    await requireFeature(business.id, FEATURE_KEYS.AI_MARKETING);

    const body = await req.json().catch(() => ({}));
    const { platform = "INSTAGRAM" } = body;

    return NextResponse.json({
      success: true,
      content: `Exclusive special for ${business.name}: Book your appointment online today on Docodo!`,
      platform,
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
