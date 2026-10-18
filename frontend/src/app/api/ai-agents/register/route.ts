import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAgentToken } from "@/lib/ai-agents/registry";
import { checkRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const DEFAULT_SCOPES = [
  "read:storefront",
  "read:services",
  "read:availability",
  "book:appointments",
];

export async function GET() {
  return NextResponse.json({
    protocol: "Docodo Autonomous Agent Mandatory Protocol (DAAMP-2026)",
    version: "1.0.0",
    description:
      "All autonomous AI agents, web crawlers, LLM assistants, and robotic booking delegates must register before querying Docodo storefronts, clinical schedules, or booking APIs.",
    registrationEndpoint: "/api/ai-agents/register",
    authEndpoint: "/api/ai-agents/auth",
    tokenSpecification: "Stateless HMAC-SHA256 Token (docodo_agy_<base64url>.<signature>)",
    tokenValidity: "365 days (1 year)",
    defaultRateLimit: "120 requests / minute",
    compliance: {
      framework: "DPDP Act 2023 (Digital Personal Data Protection Act, India)",
      patientDataPrivacy: "Zero PHI exposure without verified merchant & agent cryptographic keys",
      zeroCommission: "0% commission fee architecture on all appointments & direct UPI settlements",
    },
    requiredPayload: {
      agentName: "string (e.g., 'Siri-Health-Assistant', 'Perplexity-Clinical-Bot')",
      modelProvider: "string (e.g., 'OpenAI', 'Anthropic', 'Google', 'Custom')",
      operatorEmail: "string (valid contact email of bot operator)",
      purpose: "string (optional description of agent usage)",
    },
    documentationUrls: ["/llms.txt", "/llms-full.txt"],
  });
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const rl = checkRateLimit(`ai_agent_reg_${ip}`, { maxTokens: 120, intervalMs: 60_000 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Agent registration rate limit exceeded. Max 120 requests per minute." },
        { status: 429 }
      );
    }

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body provided in registration request." },
        { status: 400 }
      );
    }

    const { agentName, modelProvider, operatorEmail, purpose, requestedScopes } = body || {};

    if (!agentName || typeof agentName !== "string" || !agentName.trim()) {
      return NextResponse.json(
        { error: "Validation failed: 'agentName' is required." },
        { status: 400 }
      );
    }

    if (!modelProvider || typeof modelProvider !== "string" || !modelProvider.trim()) {
      return NextResponse.json(
        { error: "Validation failed: 'modelProvider' is required (e.g., 'OpenAI', 'Anthropic', 'Google', 'Custom')." },
        { status: 400 }
      );
    }

    if (
      !operatorEmail ||
      typeof operatorEmail !== "string" ||
      !operatorEmail.includes("@") ||
      !operatorEmail.includes(".")
    ) {
      return NextResponse.json(
        { error: "Validation failed: 'operatorEmail' must be a valid email address." },
        { status: 400 }
      );
    }

    const agentId = `agy_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
    const scopes = Array.isArray(requestedScopes) && requestedScopes.length > 0
      ? requestedScopes.filter((s: any) => typeof s === "string")
      : DEFAULT_SCOPES;

    const token = createAgentToken({
      agentId,
      agentName: agentName.trim(),
      modelProvider: modelProvider.trim(),
      operatorEmail: operatorEmail.trim().toLowerCase(),
      purpose: typeof purpose === "string" ? purpose.trim() : "Autonomous healthcare and service booking integration",
      scopes,
    });

    return NextResponse.json(
      {
        status: "registered",
        agentId,
        agentName: agentName.trim(),
        modelProvider: modelProvider.trim(),
        operatorEmail: operatorEmail.trim().toLowerCase(),
        agentAccessToken: token,
        tokenType: "Bearer",
        expiresIn: 31536000,
        scopes,
        rateLimit: "120 requests / minute",
        compliance: {
          dpdpCompliant: true,
          regulation: "Digital Personal Data Protection Act 2023 (India)",
          protocol: "Docodo Autonomous Agent Mandatory Protocol (DAAMP-2026)",
        },
        usageInstructions: {
          header: "Authorization: Bearer <agentAccessToken>",
          alternativeHeader: "x-agent-token: <agentAccessToken>",
          docs: "https://docodo.in/llms.txt",
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Internal error during agent registration" },
      { status: 500 }
    );
  }
}
