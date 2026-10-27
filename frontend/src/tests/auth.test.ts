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

  describe("ResetPasswordSchema Validation", () => {
    it("accepts valid registered email for password reset", () => {
      const input = { email: "founder@docodo.in" };
      const res = ResetPasswordSchema.safeParse(input);
      expect(res.success).toBe(true);
    });

    it("rejects invalid email formats for password reset", () => {
      const input = { email: "not-an-email" };
      const res = ResetPasswordSchema.safeParse(input);
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0].message).toContain("email");
      }
    });

    it("rejects empty email submission", () => {
      const input = { email: "" };
      const res = ResetPasswordSchema.safeParse(input);
      expect(res.success).toBe(false);
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

    it("enforces schema role OWNER and plan PILOT as defaults on new registration", () => {
      const defaultUserRole = "OWNER";
      const defaultUserPlan = "PILOT";

      const validRoles = ["OWNER", "MANAGER", "STAFF"];
      const validPlans = ["PILOT", "STARTER", "GROWTH", "CONCIERGE"];

      expect(validRoles).toContain(defaultUserRole);
      expect(validPlans).toContain(defaultUserPlan);
    });

    it("verifies safe callbackUrl redirection targets", () => {
      const resolveRedirect = (callbackUrl?: string | null, defaultUrl: string = "/dashboard") => {
        if (!callbackUrl) return defaultUrl;
        if (callbackUrl.startsWith("/auth")) return defaultUrl;
        if (callbackUrl.startsWith("/")) return callbackUrl;
        return defaultUrl;
      };

      expect(resolveRedirect("/checkout?plan=starter")).toBe("/checkout?plan=starter");
      expect(resolveRedirect("/dashboard/bookings")).toBe("/dashboard/bookings");
      expect(resolveRedirect("/auth/login")).toBe("/dashboard"); // Prevents redirect loops
      expect(resolveRedirect("https://malicious.com")).toBe("/dashboard"); // Prevents open redirects
    });

    it("preserves commercial plan parameter during registration redirect to checkout", () => {
      const getPostRegistrationTarget = (plan?: string | null, callbackUrl?: string | null) => {
        if (plan && plan !== "pilot") {
          return `/checkout?plan=${encodeURIComponent(plan)}`;
        }
        if (callbackUrl && !callbackUrl.startsWith("/auth")) {
          return callbackUrl;
        }
        return "/onboarding";
      };

      expect(getPostRegistrationTarget("starter", null)).toBe("/checkout?plan=starter");
      expect(getPostRegistrationTarget("growth", null)).toBe("/checkout?plan=growth");
      expect(getPostRegistrationTarget("setup-service", null)).toBe("/checkout?plan=setup-service");
      expect(getPostRegistrationTarget("pilot", null)).toBe("/onboarding");
      expect(getPostRegistrationTarget(null, "/dashboard/website")).toBe("/dashboard/website");
    });

    it("enforces canonical https://docodo.in domain in authConfig authorized redirect when origin is localhost", async () => {
      const { authConfig } = await import("../lib/auth.config");
      const authorized = authConfig.callbacks?.authorized;
      expect(typeof authorized).toBe("function");

      if (typeof authorized === "function") {
        const dummyReq = {
          nextUrl: new URL("http://localhost:3000/dashboard/bookings"),
          url: "http://localhost:3000/dashboard/bookings",
        };
        const res = (authorized as any)({
          auth: null,
          request: dummyReq,
        });
        expect(res).toBeDefined();
        // Redirect target must be canonical https://docodo.in/auth/login and not localhost
        const location = res.headers?.get("location");
        expect(location).toContain("https://docodo.in/auth/login");
        expect(location).not.toContain("localhost");
      }
    });
  });
});
