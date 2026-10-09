import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createPublicBooking } from "@/lib/actions/booking";
import { checkRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const apiKey = req.headers.get("x-api-key");
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const date = searchParams.get("date");

    // Authenticate via session or x-api-key — never allow unauthenticated public PII access
    let businessId: string | undefined;

    if (session?.user?.id) {
      const biz = await prisma.business.findFirst({
        where: { ownerId: session.user.id },
        select: { id: true },
      });
      businessId = biz?.id;
    } else if (apiKey) {
      // Disallow IDOR: never accept raw business.id as x-api-key. Require valid server API token.
      const validToken = process.env.DOCODO_API_KEY || process.env.INTERNAL_API_KEY || process.env.API_SECRET_KEY;
      if (validToken && apiKey === validToken) {
        const requestedBizId = searchParams.get("businessId");
        const biz = slug
          ? await prisma.business.findUnique({ where: { slug }, select: { id: true } })
          : requestedBizId
          ? await prisma.business.findUnique({ where: { id: requestedBizId }, select: { id: true } })
          : null;
        businessId = biz?.id;
      }
      // legacy IDOR vulnerable lookup removed
      /*
        where: { id: apiKey },
        select: { id: true },
      });
      */
    }

    if (!businessId) {
      return NextResponse.json(
        { error: "Unauthorized: An authenticated merchant session or valid API key is required to view customer bookings." },
        { status: 401 }
      );
    }


    const bookings = await prisma.booking.findMany({
      where: {
        businessId,
        ...(date ? { date } : {}),
      },
      include: {
        service: { select: { name: true, price: true, duration: true } },
      },
      orderBy: { date: "desc" },
      take: 50,
    });

    return NextResponse.json({
      data: bookings,
      count: bookings.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error fetching bookings" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "client";
    const rl = checkRateLimit(`api_v1_bookings_${ip}`, { maxTokens: 10, intervalMs: 60000 });
    if (!rl.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const body = await req.json();
    const booking = await createPublicBooking(body);

    return NextResponse.json({
      success: true,
      data: booking,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to create booking via API v1" },
      { status: 400 }
    );
  }
}
