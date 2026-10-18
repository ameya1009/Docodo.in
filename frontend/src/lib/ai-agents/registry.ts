import crypto from "crypto";

export interface AgentTokenPayload {
  agentId: string;
  agentName?: string;
  modelProvider: string;
  operatorEmail: string;
  purpose?: string;
  scopes: string[];
  iat: number;
  exp: number;
}

export interface AgentVerificationResult {
  valid: boolean;
  payload?: AgentTokenPayload;
  error?: string;
}

export const TOKEN_PREFIX = "docodo_agy_";
export const ONE_YEAR_SECONDS = 365 * 24 * 60 * 60;

function getSigningSecret(): string {
  return (
    process.env.AUTH_SECRET ||
    process.env.FOUNDER_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "docodo_autonomous_agent_protocol_master_signing_key_2026"
  );
}

/**
 * Creates a signed stateless HMAC-SHA256 Docodo Agent Access Token.
 * Format: docodo_agy_<base64url_payload>.<hmac_signature>
 */
export function createAgentToken(
  params: Omit<AgentTokenPayload, "iat" | "exp"> & { iat?: number; exp?: number }
): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: AgentTokenPayload = {
    agentId: params.agentId,
    agentName: params.agentName,
    modelProvider: params.modelProvider,
    operatorEmail: params.operatorEmail,
    purpose: params.purpose,
    scopes: params.scopes && params.scopes.length > 0 ? params.scopes : ["read:storefront", "book:appointments"],
    iat: params.iat ?? now,
    exp: params.exp ?? now + ONE_YEAR_SECONDS,
  };

  const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const secret = getSigningSecret();
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payloadEncoded)
    .digest("hex");

  return `${TOKEN_PREFIX}${payloadEncoded}.${signature}`;
}

/**
 * Verifies a Docodo Agent Access Token cryptographically using HMAC-SHA256 and validates expiry.
 */
export function verifyAgentAccessToken(token: string | null | undefined): AgentVerificationResult {
  if (!token || typeof token !== "string") {
    return { valid: false, error: "Missing or invalid token format" };
  }

  const trimmedToken = token.trim();
  if (!trimmedToken.startsWith(TOKEN_PREFIX)) {
    return { valid: false, error: "Invalid token prefix: must begin with docodo_agy_" };
  }

  const tokenBody = trimmedToken.slice(TOKEN_PREFIX.length);
  const dotIndex = tokenBody.lastIndexOf(".");
  if (dotIndex === -1) {
    return { valid: false, error: "Malformed token structure: missing signature separator" };
  }

  const payloadPart = tokenBody.slice(0, dotIndex);
  const signaturePart = tokenBody.slice(dotIndex + 1);

  if (!payloadPart || !signaturePart) {
    return { valid: false, error: "Malformed token payload or signature component" };
  }

  const secret = getSigningSecret();
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payloadPart)
    .digest("hex");

  const sigBuffer = Buffer.from(signaturePart, "hex");
  const expectedBuffer = Buffer.from(expectedSignature, "hex");

  if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    return { valid: false, error: "Cryptographic signature verification failed" };
  }

  try {
    const rawJson = Buffer.from(payloadPart, "base64url").toString("utf8");
    const payload = JSON.parse(rawJson) as AgentTokenPayload;

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && now > payload.exp) {
      return { valid: false, error: "Agent access token has expired", payload };
    }

    return { valid: true, payload };
  } catch {
    return { valid: false, error: "Failed to decode or parse token payload" };
  }
}

/**
 * Detects whether an incoming HTTP request originates from an AI crawler, LLM model, or autonomous agent.
 */
export function isAiAgent(headers: Headers | { get(name: string): string | null }): boolean {
  const ua = (headers.get("user-agent") || headers.get("User-Agent") || "").toLowerCase();
  const knownBots = [
    "gptbot",
    "chatgpt",
    "claudebot",
    "claude-web",
    "anthropic",
    "perplexitybot",
    "google-extended",
    "amazonbot",
    "facebookbot",
    "bytespider",
    "cohere-ai",
    "omgilibot",
    "diffbot",
    "applebot-extended",
    "meta-externalagent",
  ];

  if (knownBots.some((bot) => ua.includes(bot))) {
    return true;
  }

  // Check explicit agent identification headers
  if (
    headers.get("x-agent-id") ||
    headers.get("X-Agent-Id") ||
    headers.get("x-agent-name") ||
    headers.get("X-Agent-Name") ||
    headers.get("x-agent-token") ||
    headers.get("X-Agent-Token")
  ) {
    return true;
  }

  return false;
}

/**
 * Extracts the Agent Access Token from Authorization: Bearer or x-agent-token headers.
 */
export function extractAgentToken(headers: Headers | { get(name: string): string | null }): string | null {
  const authHeader = headers.get("authorization") || headers.get("Authorization");
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    const candidate = authHeader.slice(7).trim();
    if (candidate.startsWith(TOKEN_PREFIX)) {
      return candidate;
    }
  }

  const agentHeader = headers.get("x-agent-token") || headers.get("X-Agent-Token");
  if (agentHeader && agentHeader.trim().startsWith(TOKEN_PREFIX)) {
    return agentHeader.trim();
  }

  return null;
}

