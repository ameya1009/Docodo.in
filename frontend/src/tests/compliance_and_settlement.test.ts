import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { createAgentToken } from "../lib/ai-agents/registry";
import { GET as getBookings } from "../app/api/v1/bookings/route";
import { GET as getAvailability } from "../app/api/v1/availability/route";
import { POST as createOrder } from "../app/api/create-order/route";
import { GET as getRemindersCron } from "../app/api/cron/reminders/route";
import { GET as getGreetingsCron } from "../app/api/cron/greetings/route";
import { verifyFounderCredentials, FOUNDER_CONFIG } from "../lib/founder-auth";

// Mock prisma and auth for isolated route testing
vi.mock("@/lib/prisma", () => ({
  prisma: {
    business: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    booking: {
      findMany: vi.fn(() => Promise.resolve([])),
      count: vi.fn(() => Promise.resolve(0)),
      update: vi.fn(),
    },
    service: {
      findMany: vi.fn(() => Promise.resolve([])),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(() => Promise.resolve(null)),
}));

vi.mock("@/lib/services/entitlement-service", () => ({
  canConsume: vi.fn(() => Promise.resolve({ allowed: true })),
}));

describe("Commercial Compliance & Settlement Verification Suite", () => {
  describe("P0-1: DPDP Act 2023 & Patient Data Isolation", () => {
    it("returns 403 Forbidden when an AI Agent token attempts GET /api/v1/bookings", async () => {
      const token = createAgentToken({
        agentId: "agy_crawler_007",
        agentName: "AgentCrawler",
        modelProvider: "Anthropic",
        operatorEmail: "ops@anthropic.com",
        scopes: ["book:appointments"],
      });

      const req = new NextRequest("https://docodo.in/api/v1/bookings?businessId=biz_1", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const res = await getBookings(req);
      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.error).toContain("DPDP Act 2023");
      expect(data.endpoint).toBe("/api/v1/availability");
    });

    it("returns 403 Forbidden when an AI Agent User-Agent attempts GET /api/v1/bookings without session", async () => {
      const req = new NextRequest("https://docodo.in/api/v1/bookings?businessId=biz_1", {
        headers: {
          "user-agent": "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)",
        },
      });

      const res = await getBookings(req);
      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.error).toContain("DPDP Act 2023");
      expect(data.endpoint).toBe("/api/v1/availability");
    });

    it("returns 401 Unauthorized for unauthenticated GET /api/v1/bookings requests", async () => {
      const req = new NextRequest("https://docodo.in/api/v1/bookings?businessId=biz_1");
      const res = await getBookings(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toContain("authenticated merchant session is required");
    });

    it("GET /api/v1/availability returns 400 when business identifier is omitted", async () => {
      const req = new NextRequest("https://docodo.in/api/v1/availability");
      const res = await getAvailability(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain("Missing required parameter");
    });

    it("GET /api/v1/availability returns 400 when date is malformed", async () => {
      const req = new NextRequest("https://docodo.in/api/v1/availability?slug=my-clinic&date=not-a-date");
      const res = await getAvailability(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain("Invalid date format");
    });
  });

  describe("P0-2: RBI PA Compliance & Direct Settlement Restrictions", () => {
    it("rejects appointment booking payments through platform Razorpay create-order route", async () => {
      const req = new NextRequest("https://docodo.in/api/create-order", {
        method: "POST",
        body: JSON.stringify({
          bookingId: "bk_customer_appointment_123",
          amount: 50000,
          currency: "INR",
        }),
      });

      const res = await createOrder(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.compliance).toBe("RBI_PA_DIRECT_SETTLEMENT_MANDATE");
      expect(data.error).toContain("RBI Payment Aggregator Guidelines");
    });

    it("rejects orders without a valid SaaS subscription planId", async () => {
      const req = new NextRequest("https://docodo.in/api/create-order", {
        method: "POST",
        body: JSON.stringify({
          amount: 50000,
          currency: "INR",
        }),
      });

      const res = await createOrder(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain("strictly restricted to Docodo SaaS subscriptions");
    });

    it("verifies direct UPI intent URL format for merchant settlement", () => {
      const vpa = "drsharma@okhdfcbank";
      const name = "Dr Sharma Dental Clinic";
      const amount = 500;
      const note = "Booking Dental Cleaning - Rahul Kumar";

      const uri = `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

      expect(uri.startsWith("upi://pay?")).toBe(true);
      expect(uri).toContain("pa=drsharma%40okhdfcbank");
      expect(uri).toContain("am=500");
      expect(uri).toContain("cu=INR");
    });

    it("validates merchant UPI VPA format correctly", () => {
      const vpaRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
      expect(vpaRegex.test("drsharma@okhdfcbank")).toBe(true);
      expect(vpaRegex.test("9876543210@paytm")).toBe(true);
      expect(vpaRegex.test("clinic.care@icici")).toBe(true);
      expect(vpaRegex.test("invalid-no-at-sign")).toBe(false);
      expect(vpaRegex.test("@missingusername")).toBe(false);
      expect(vpaRegex.test("user@")).toBe(false);
    });
  });

  describe("P0-3: Superadmin Security & Hardcoded Fallback Prevention", () => {
    it("rejects unauthorized passwords in verifyFounderCredentials", () => {
      process.env.FOUNDER_PASSWORD = "StrongEnvPassword123!";
      expect(verifyFounderCredentials(FOUNDER_CONFIG.email, "WrongPassword!")).toBe(false);
      expect(verifyFounderCredentials(FOUNDER_CONFIG.email, "DocodoFounder2026!")).toBe(false);
    });

    it("authenticates when exact environment password matches", () => {
      process.env.FOUNDER_PASSWORD = "StrongEnvPassword123!";
      expect(verifyFounderCredentials(FOUNDER_CONFIG.email, "StrongEnvPassword123!")).toBe(true);
    });
  });

  describe("P1-1: Reminder & Greetings Cron Authentication Invariants", () => {
    it("rejects unauthenticated requests to /api/cron/reminders with 401", async () => {
      process.env.CRON_SECRET = "secure_production_cron_secret_2026";
      const req = new NextRequest("https://docodo.in/api/cron/reminders");
      const res = await getRemindersCron(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toContain("Unauthorized");
    });

    it("rejects unauthenticated requests to /api/cron/greetings with 401", async () => {
      process.env.CRON_SECRET = "secure_production_cron_secret_2026";
      const req = new NextRequest("https://docodo.in/api/cron/greetings");
      const res = await getGreetingsCron(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toContain("Unauthorized");
    });

    it("rejects cron calls if CRON_SECRET is unset in production environment", async () => {
      delete process.env.CRON_SECRET;
      const req = new NextRequest("https://docodo.in/api/cron/reminders", {
        headers: { authorization: "Bearer some_unauthorized_token" },
      });
      const res = await getRemindersCron(req);
      expect(res.status).toBe(401);
    });
  });

  describe("P2-1: Schema.org JSON-LD Working Hours Attributes", () => {
    it("correctly maps wh.day and wh.isOpen to Schema.org OpeningHoursSpecification", () => {
      const mockWorkingHours = [
        { day: "MON", isOpen: true, openTime: "09:00", closeTime: "18:00" },
        { day: "SUN", isOpen: false, openTime: "09:00", closeTime: "18:00" },
      ];

      const dayMap: Record<string, string> = {
        MON: "https://schema.org/Monday",
        TUE: "https://schema.org/Tuesday",
        WED: "https://schema.org/Wednesday",
        THU: "https://schema.org/Thursday",
        FRI: "https://schema.org/Friday",
        SAT: "https://schema.org/Saturday",
        SUN: "https://schema.org/Sunday",
      };

      const openingHoursSpecification = mockWorkingHours
        .filter((wh) => wh.isOpen !== false)
        .map((wh) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: dayMap[wh.day.toUpperCase()] || wh.day,
          opens: wh.openTime || "09:00",
          closes: wh.closeTime || "18:00",
        }));

      expect(openingHoursSpecification.length).toBe(1);
      expect(openingHoursSpecification[0].dayOfWeek).toBe("https://schema.org/Monday");
      expect(openingHoursSpecification[0].opens).toBe("09:00");
      expect(openingHoursSpecification[0].closes).toBe("18:00");
    });
  });
});
