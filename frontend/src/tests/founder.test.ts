import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  })),
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(() => Promise.resolve(null)),
}));

// P0-3C: Set required env vars BEFORE importing founder-auth so requireEnv() doesn't throw
// when the module is evaluated. These are test-only values.
const TEST_FOUNDER_PASSWORD = "TestFounderPass@99";
const TEST_FOUNDER_SECRET = "test-founder-secret-for-vitest-only";
process.env.FOUNDER_PASSWORD = TEST_FOUNDER_PASSWORD;
process.env.FOUNDER_SECRET = TEST_FOUNDER_SECRET;

afterAll(() => {
  delete process.env.FOUNDER_PASSWORD;
  delete process.env.FOUNDER_SECRET;
});

import {
  FOUNDER_CONFIG,
  verifyFounderCredentials,
  createFounderToken,
  verifyFounderToken,
} from "../lib/founder-auth";


describe("Founder Security & Authentication Suite", () => {
  it("authenticates valid founder email and password with constant-time equality", () => {
    const isValid = verifyFounderCredentials(FOUNDER_CONFIG.email, TEST_FOUNDER_PASSWORD);
    expect(isValid).toBe(true);
  });

  it("authenticates case-insensitively for email", () => {
    const isValid = verifyFounderCredentials("AMEYAKSHIRSAGAR@DOCODO.IN", TEST_FOUNDER_PASSWORD);
    expect(isValid).toBe(true);
  });

  it("rejects unauthorized email addresses", () => {
    const isValid = verifyFounderCredentials("hacker@malicious.com", TEST_FOUNDER_PASSWORD);
    expect(isValid).toBe(false);
  });

  it("rejects wrong passwords", () => {
    const isValid = verifyFounderCredentials(FOUNDER_CONFIG.email, "WrongPassword123");
    expect(isValid).toBe(false);
  });

  it("creates and verifies valid HMAC founder tokens", () => {
    const token = createFounderToken(FOUNDER_CONFIG.email);
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(20);

    const verified = verifyFounderToken(token);
    expect(verified).toBe(true);
  });

  it("rejects forged or tampered founder tokens", () => {
    const validToken = createFounderToken(FOUNDER_CONFIG.email);
    // Tamper with the base64url string
    const tamperedToken = validToken.slice(0, -4) + "AAAA";
    const verified = verifyFounderToken(tamperedToken);
    expect(verified).toBe(false);
  });

  it("rejects invalid non-JSON or corrupted tokens", () => {
    expect(verifyFounderToken("invalid_garbage_token")).toBe(false);
    expect(verifyFounderToken("")).toBe(false);
  });
});

