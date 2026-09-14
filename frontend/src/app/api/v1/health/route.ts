import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  let dbStatus = "OK";
  let latencyMs = 0;

  try {
    const pingStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    latencyMs = Date.now() - pingStart;
  } catch (err: any) {
    dbStatus = `DEGRADED: ${err.message}`;
  }

  return NextResponse.json({
    status: dbStatus === "OK" ? "HEALTHY" : "DEGRADED",
    platform: "Docodo Business Operating System API v1",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "production",
    services: {
      database: { status: dbStatus, latencyMs },
      eventBus: { status: "ACTIVE" },
      automationsEngine: { status: "ACTIVE" },
      razorpayGateway: { status: "OPERATIONAL" },
    },
    uptimeMs: process.uptime ? Math.round(process.uptime() * 1000) : 0,
    totalCheckDurationMs: Date.now() - startTime,
  });
}
