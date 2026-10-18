import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createPublicBooking } from "@/lib/actions/booking";
import { checkRateLimit } from "@/lib/rate-limit";
import { extractAgentToken, verifyAgentAccessToken, isAiAgent } from "@/lib/ai-agents/registry";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const apiKey = req.headers.get("x-api-key");
    const agentToken = extractAgentToken(req.headers);
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const date = searchParams.get("date");

    // Authenticate via session, verified AI agent token, or server x-api-key
    let businessId: string | undefined;

    if (session?.user?.id) {
      const biz = await prisma.business.findFirst({
        where: { ownerId: session.user.id },
        select: { id: true },
      });
      businessId = biz?.id;
    } else if (agentToken) {
      const verification = verifyAgentAccessToken(agentToken);
      if (!verification.valid) {
        return NextResponse.json(
          { error: `Unauthorized AI Agent: ${verification.error}` },
          { status: 401 }
        );
      }
      const requestedBizId = searchParams.get("businessId");
      const biz = slug
        ? await prisma.business.findUnique({ where: { slug }, select: { id: true } })
        : requestedBizId
        ? await prisma.business.findUnique({ where: { id: requestedBizId }, select: { id: true } })
        : null;
      businessId = biz?.id;
    } else if (apiKey) {
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
    }

    if (!businessId) {
      return NextResponse.json(
        {
          error:
            "Unauthorized: An authenticated merchant session, verified AI agent token (docodo_agy_*), or valid API key is required to view bookings.",
        },
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
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "client";
    const agentToken = extractAgentToken(req.headers);

    let isVerifiedAgent = false;
    let agentPayload: any = null;

    if (agentToken) {
      const verification = verifyAgentAccessToken(agentToken);
      if (!verification.valid) {
        return NextResponse.json(
          { error: `Unauthorized AI Agent: ${verification.error}` },
          { status: 401 }
        );
      }
      isVerifiedAgent = true;
      agentPayload = verification.payload;
    } else if (isAiAgent(req.headers)) {
      // Compulsory AI Agent Registration Mark (DAAMP-2026)
      return NextResponse.json(
        {
          error:
            "Mandatory AI Agent Registration Required: All AI models, crawlers, and autonomous agents must register at /api/ai-agents/register to obtain an agent access token before booking appointments.",
          registrationUrl: "/api/ai-agents/register",
          protocol: "Docodo Autonomous Agent Mandatory Protocol (DAAMP-2026)",
        },
        { status: 401 }
      );
    }

    // Verified AI Agents get elevated rate limits (120 req/min) vs anonymous web clients (10 req/min)
    const rateLimitConfig = isVerifiedAgent
      ? { maxTokens: 120, intervalMs: 60000 }
      : { maxTokens: 10, intervalMs: 60000 };

    const rateKey = isVerifiedAgent
      ? `api_v1_bookings_agent_${agentPayload?.agentId || ip}`
      : `api_v1_bookings_ip_${ip}`;

    const rl = checkRateLimit(rateKey, rateLimitConfig);
    if (!rl.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const body = await req.json();
    const booking = await createPublicBooking(body);

    return NextResponse.json({
      success: true,
      data: booking,
      ...(isVerifiedAgent ? { agentId: agentPayload?.agentId, agentName: agentPayload?.agentName } : {}),
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to create booking via API v1" },
      { status: 400 }
    );
  }
}
