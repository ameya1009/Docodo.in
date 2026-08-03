import { describe, it, expect } from "vitest";
import { SignUpSchema, LoginSchema, ResetPasswordSchema } from "../lib/validations/auth";
import { evaluatePasswordStrength, sanitizeEmail } from "../lib/engines/auth-engine";

describe("Priority 2: Authentication Engine - Validation & Business Logic Tests", () => {
  describe("SignUpSchema Validation", () => {
    it("accepts well-formed signup credentials", () => {
      const input = {
        name: "Rohit Sharma",
        email: "rohit@enterprise.co",
        password: "SuperSecretPassword123!",
      };
      expect(SignUpSchema.safeParse(input).success).toBe(true);
    });

    it("rejects passwords under 8 characters", () => {
      const input = {
        name: "Rohit Sharma",
        email: "rohit@enterprise.co",
        password: "123",
      };
      const res = SignUpSchema.safeParse(input);
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0].message).toContain("8 characters");
      }
    });

    it("rejects malformed emails during registration", () => {
      expect(SignUpSchema.safeParse({ name: "Demo", email: "user@domain", password: "ValidPassword123!" }).success).toBe(false);
    });
  });

  describe("LoginSchema Validation", () => {
    it("enforces non-empty password entry on login", () => {
      expect(LoginSchema.safeParse({ email: "valid@email.com", password: "" }).success).toBe(false);
      expect(LoginSchema.safeParse({ email: "valid@email.com", password: "somepassword" }).success).toBe(true);
    });
  });

  describe("Authentication Business Logic (auth-engine)", () => {
    it("sanitizes email casing and trims surrounding whitespaces", () => {
      expect(sanitizeEmail("   User@Company.IN   ")).toBe("user@company.in");
    });

    it("evaluates weak vs bulletproof passwords correctly", () => {
      const weak = evaluatePasswordStrength("password");
      expect(weak.label).toBe("WEAK");
      expect(weak.suggestions.length).toBeGreaterThan(0);

      const strong = evaluatePasswordStrength("P@ssword2026!Secured");
      expect(strong.label).toBe("BULLETPROOF");
      expect(strong.score).toBeGreaterThanOrEqual(4);
    });
  });
});
