import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import {
  createAgentToken,
  verifyAgentAccessToken,
  extractAgentToken,
  isAiAgent,
  TOKEN_PREFIX,
  ONE_YEAR_SECONDS,
} from "../lib/ai-agents/registry";
import { GET as getRegister, POST as postRegister } from "../app/api/ai-agents/register/route";
import { GET as getAuth, POST as postAuth } from "../app/api/ai-agents/auth/route";

describe("Mandatory AI Agent Protocol (DAAMP-2026) Suite", () => {
  const samplePayload = {
    agentId: "agy_test_123456",
    agentName: "ClaudeBot-Clinical-Scheduler",
    modelProvider: "Anthropic",
    operatorEmail: "ops@anthropic.com",
    purpose: "Testing appointment reservation workflows in Pune clinics",
    scopes: ["read:storefront", "book:appointments"],
  };

  describe("Token Generation & Formatting", () => {
    it("generates an HMAC-SHA256 signed token with docodo_agy_ prefix", () => {
      const token = createAgentToken(samplePayload);
      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.startsWith(TOKEN_PREFIX)).toBe(true);

      const parts = token.replace(TOKEN_PREFIX, "").split(".");
      expect(parts.length).toBe(2);
      expect(parts[0].length).toBeGreaterThan(10); // base64url payload
      expect(parts[1].length).toBe(64); // 64 hex characters for SHA-256
    });

    it("embeds default 1-year validity when exp is omitted", () => {
      const before = Math.floor(Date.now() / 1000);
      const token = createAgentToken(samplePayload);
      const res = verifyAgentAccessToken(token);

      expect(res.valid).toBe(true);
      expect(res.payload).toBeDefined();
      expect(res.payload?.exp).toBeGreaterThanOrEqual(before + ONE_YEAR_SECONDS - 5);
      expect(res.payload?.agentId).toBe("agy_test_123456");
      expect(res.payload?.operatorEmail).toBe("ops@anthropic.com");
    });

    it("applies default scopes when custom scopes are not supplied", () => {
      const token = createAgentToken({
        agentId: "agy_default_scopes",
        modelProvider: "Google",
        operatorEmail: "ai@google.com",
        scopes: [],
      });
      const res = verifyAgentAccessToken(token);
      expect(res.valid).toBe(true);
      expect(res.payload?.scopes).toContain("read:storefront");
      expect(res.payload?.scopes).toContain("book:appointments");
    });
  });

  describe("Cryptographic Verification & Invariant Checking", () => {
    it("successfully verifies valid tokens and returns complete payload", () => {
      const token = createAgentToken(samplePayload);
      const verification = verifyAgentAccessToken(token);

      expect(verification.valid).toBe(true);
      expect(verification.payload?.agentName).toBe("ClaudeBot-Clinical-Scheduler");
      expect(verification.payload?.modelProvider).toBe("Anthropic");
      expect(verification.payload?.scopes).toContain("read:storefront");
      expect(verification.payload?.scopes).toContain("book:appointments");
    });

    it("rejects token when signature is altered or corrupted", () => {
      const token = createAgentToken(samplePayload);
      // Corrupt the signature hex
      const corruptedSig = token.slice(0, -4) + "dead";
      const result = verifyAgentAccessToken(corruptedSig);

      expect(result.valid).toBe(false);
      expect(result.error).toContain("Cryptographic signature verification failed");
    });

    it("rejects token when signature contains non-hex characters", () => {
      const token = createAgentToken(samplePayload);
      const parts = token.split(".");
      const nonHexToken = `${parts[0]}.zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz`;
      const result = verifyAgentAccessToken(nonHexToken);

      expect(result.valid).toBe(false);
      expect(result.error).toContain("Cryptographic signature verification failed");
    });

    it("rejects token when payload body is modified", () => {
      const token = createAgentToken(samplePayload);
      const parts = token.split(".");
      // Alter the payload segment
      const tamperedBody = parts[0] + "xyz";
      const tamperedToken = `${tamperedBody}.${parts[1]}`;
      const result = verifyAgentAccessToken(tamperedToken);

      expect(result.valid).toBe(false);
    });

    it("rejects expired agent tokens", () => {
      const pastTime = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      const expiredToken = createAgentToken({
        ...samplePayload,
        iat: pastTime - 86400,
        exp: pastTime,
      });

      const result = verifyAgentAccessToken(expiredToken);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("expired");
    });

    it("gracefully handles invalid, null, empty, or non-docodo prefixes", () => {
      expect(verifyAgentAccessToken("").valid).toBe(false);
      expect(verifyAgentAccessToken(null).valid).toBe(false);
      expect(verifyAgentAccessToken(undefined).valid).toBe(false);
      expect(verifyAgentAccessToken("Bearer eyJhbGciOiJIUzI1Ni...").valid).toBe(false);
      expect(verifyAgentAccessToken("docodo_agy_malformed_no_dot").valid).toBe(false);
    });
  });

  describe("Agent Detection & Header Extraction Helpers", () => {
    it("detects known AI bots from user-agent header", () => {
      const botUserAgents = [
        "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)",
        "ClaudeBot/1.0; +https://www.anthropic.com/claudebot",
        "PerplexityBot/1.0 (+https://www.perplexity.ai/perplexitybot)",
        "Google-Extended",
        "Amazonbot/0.1",
        "FacebookBot/1.0",
        "Bytespider",
        "cohere-ai",
      ];

      for (const ua of botUserAgents) {
        const headers = new Headers({ "user-agent": ua });
        expect(isAiAgent(headers)).toBe(true);
      }
    });

    it("does NOT classify normal human browser user agents as AI agents", () => {
      const browserUA =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
      const headers = new Headers({ "user-agent": browserUA });
      expect(isAiAgent(headers)).toBe(false);
    });

    it("detects agent requests by explicit agent headers", () => {
      expect(isAiAgent(new Headers({ "x-agent-id": "agent_123" }))).toBe(true);
      expect(isAiAgent(new Headers({ "X-Agent-Name": "ClinicalBot" }))).toBe(true);
      expect(isAiAgent(new Headers({ "x-agent-token": "docodo_agy_abc.123" }))).toBe(true);
    });

    it("extracts token from standard Authorization: Bearer header", () => {
      const token = createAgentToken(samplePayload);
      const headers = new Headers({
        authorization: `Bearer ${token}`,
      });

      const extracted = extractAgentToken(headers);
      expect(extracted).toBe(token);
    });

    it("extracts token from x-agent-token header (case-insensitive)", () => {
      const token = createAgentToken(samplePayload);
      expect(extractAgentToken(new Headers({ "x-agent-token": token }))).toBe(token);
      expect(extractAgentToken(new Headers({ "X-Agent-Token": token }))).toBe(token);
    });

    it("returns null if header is missing or non-agent Bearer token", () => {
      const headers = new Headers({
        authorization: "Bearer some_random_jwt_token",
      });

      expect(extractAgentToken(headers)).toBeNull();
    });
  });

  describe("API Route Handlers: /api/ai-agents/register & /auth", () => {
    it("GET /api/ai-agents/register returns public DAAMP-2026 protocol schema", async () => {
      const res = await getRegister();
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.protocol).toContain("Docodo Autonomous Agent Mandatory Protocol");
      expect(data.registrationEndpoint).toBe("/api/ai-agents/register");
      expect(data.compliance?.framework).toContain("DPDP Act 2023");
    });

    it("POST /api/ai-agents/register rejects missing agentName", async () => {
      const req = new NextRequest("https://docodo.in/api/ai-agents/register", {
        method: "POST",
        body: JSON.stringify({
          modelProvider: "Anthropic",
          operatorEmail: "admin@anthropic.com",
        }),
      });
      const res = await postRegister(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain("agentName");
    });

    it("POST /api/ai-agents/register rejects missing modelProvider", async () => {
      const req = new NextRequest("https://docodo.in/api/ai-agents/register", {
        method: "POST",
        body: JSON.stringify({
          agentName: "SchedulerBot",
          operatorEmail: "admin@anthropic.com",
        }),
      });
      const res = await postRegister(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain("modelProvider");
    });

    it("POST /api/ai-agents/register rejects invalid operatorEmail", async () => {
      const req = new NextRequest("https://docodo.in/api/ai-agents/register", {
        method: "POST",
        body: JSON.stringify({
          agentName: "SchedulerBot",
          modelProvider: "OpenAI",
          operatorEmail: "not-an-email",
        }),
      });
      const res = await postRegister(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain("operatorEmail");
    });

    it("POST /api/ai-agents/register issues signed token and DPDP compliance", async () => {
      const req = new NextRequest("https://docodo.in/api/ai-agents/register", {
        method: "POST",
        body: JSON.stringify({
          agentName: "Siri-Health-Assistant",
          modelProvider: "Apple",
          operatorEmail: "siri-ops@apple.com",
          purpose: "Appointment scheduling integration for dental and general physician visits",
        }),
      });
      const res = await postRegister(req);
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.status).toBe("registered");
      expect(data.agentAccessToken).toBeDefined();
      expect(data.agentAccessToken.startsWith(TOKEN_PREFIX)).toBe(true);
      expect(data.compliance?.dpdpCompliant).toBe(true);

      // Verify the issued token is cryptographically valid
      const verified = verifyAgentAccessToken(data.agentAccessToken);
      expect(verified.valid).toBe(true);
      expect(verified.payload?.agentName).toBe("Siri-Health-Assistant");
      expect(verified.payload?.operatorEmail).toBe("siri-ops@apple.com");
    });

    it("GET /api/ai-agents/auth returns 401 when token is omitted", async () => {
      const req = new NextRequest("https://docodo.in/api/ai-agents/auth");
      const res = await getAuth(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.authenticated).toBe(false);
    });

    it("GET /api/ai-agents/auth authenticates valid Authorization header", async () => {
      const token = createAgentToken(samplePayload);
      const req = new NextRequest("https://docodo.in/api/ai-agents/auth", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      const res = await getAuth(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.authenticated).toBe(true);
      expect(data.agent.agentId).toBe("agy_test_123456");
    });

    it("POST /api/ai-agents/auth validates token in JSON body", async () => {
      const token = createAgentToken(samplePayload);
      const req = new NextRequest("https://docodo.in/api/ai-agents/auth", {
        method: "POST",
        body: JSON.stringify({ token }),
      });
      const res = await postAuth(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.authenticated).toBe(true);
      expect(data.agent.modelProvider).toBe("Anthropic");
    });
  });
});
