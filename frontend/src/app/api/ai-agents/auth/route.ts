import { NextRequest, NextResponse } from "next/server";
import { verifyAgentAccessToken, extractAgentToken } from "@/lib/ai-agents/registry";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const token = extractAgentToken(req.headers);

  if (!token) {
    return NextResponse.json(
      {
        authenticated: false,
        error: "Missing Agent Access Token. Provide 'Authorization: Bearer <token>' or 'x-agent-token: <token>' header.",
        registrationUrl: "/api/ai-agents/register",
      },
      { status: 401 }
    );
  }

  const result = verifyAgentAccessToken(token);

  if (!result.valid || !result.payload) {
    return NextResponse.json(
      {
        authenticated: false,
        error: result.error || "Invalid or expired Agent Access Token",
        registrationUrl: "/api/ai-agents/register",
      },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    agent: result.payload,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  let token = extractAgentToken(req.headers);

  if (!token) {
    try {
      const body = await req.json();
      if (body?.token && typeof body.token === "string") {
        token = body.token.trim();
      }
    } catch {
      // Body may not be JSON
    }
  }

  if (!token) {
    return NextResponse.json(
      {
        authenticated: false,
        error: "Missing Agent Access Token. Provide 'Authorization: Bearer <token>', 'x-agent-token', or { 'token': ... } JSON body.",
        registrationUrl: "/api/ai-agents/register",
      },
      { status: 401 }
    );
  }

  const result = verifyAgentAccessToken(token);

  if (!result.valid || !result.payload) {
    return NextResponse.json(
      {
        authenticated: false,
        error: result.error || "Invalid or expired Agent Access Token",
        registrationUrl: "/api/ai-agents/register",
      },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    agent: result.payload,
    timestamp: new Date().toISOString(),
  });
}
