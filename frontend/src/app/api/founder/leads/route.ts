import { NextRequest, NextResponse } from "next/server";
import { isFounderAuthenticated } from "@/lib/founder-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const isAuth = await isFounderAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const enquiries = await prisma.enquiry.findMany({
      include: {
        business: {
          select: { name: true, city: true, industry: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const leads = enquiries.map((e) => ({
      id: e.id,
      businessName: e.business?.name || "Independent Lead",
      ownerName: e.name,
      phone: e.phone,
      city: e.business?.city || "Pune",
      industry: e.business?.industry || "Salons & Spas",
      stage: e.status === "BOOKED" ? "PAID_MERCHANT" : e.status === "CONTACTED" ? "CONTACTED" : "NEW_LEAD",
      expectedMonthly: 2499,
      notes: e.message || undefined,
      createdAt: e.createdAt.toISOString(),
    }));

    return NextResponse.json({ leads });
  } catch (error: any) {
    console.warn("[Founder Leads GET] Database query failed:", error);
    return NextResponse.json({ leads: [] });
  }
}

export async function POST(req: NextRequest) {
  const isAuth = await isFounderAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { lead, leads } = body;

    if (lead) {
      // Find or associate with a business
      let business = await prisma.business.findFirst({
        select: { id: true },
      });

      if (business) {
        await prisma.enquiry.create({
          data: {
            businessId: business.id,
            name: lead.ownerName || lead.businessName || "New Lead",
            phone: lead.phone,
            message: `[Founder Lead] City: ${lead.city} | Industry: ${lead.industry} | Expected: ₹${lead.expectedMonthly}/mo. Notes: ${lead.notes || "None"}`,
            status: lead.stage === "PAID_MERCHANT" ? "BOOKED" : lead.stage === "CONTACTED" ? "CONTACTED" : "NEW",
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Founder Leads POST] Error persisting lead:", error);
    return NextResponse.json({ error: error.message || "Failed to save lead" }, { status: 500 });
  }
}
