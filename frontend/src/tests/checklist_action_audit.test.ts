import { describe, it, expect, vi } from "vitest";
import { FAQ_LIST, PROBLEM_SECTION, FOOTER_LINKS, CASE_STUDIES } from "../lib/constants";
import { registerPartner } from "../lib/actions/partner";
import { requestClinicDemoWalkthrough } from "../lib/actions/enquiry";
import { getBusinessAnalytics } from "../lib/actions/analytics";
import manifest from "../app/manifest";
import fs from "fs";
import path from "path";

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve({ get: vi.fn(), set: vi.fn(), delete: vi.fn() })),
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(() => Promise.resolve(null)),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    partner: {
      findUnique: vi.fn(() => Promise.resolve(null)),
      create: vi.fn(({ data }: any) => Promise.resolve({ id: "partner_test", ...data })),
    },
    enquiry: {
      create: vi.fn(({ data }: any) => Promise.resolve({ id: "enquiry_test", ...data })),
    },
    business: {
      findFirst: vi.fn(() => Promise.resolve({ id: "biz_test" })),
    },
    booking: {
      findMany: vi.fn(() => Promise.resolve([])),
    },
    customer: {
      count: vi.fn(() => Promise.resolve(0)),
    },
  },
}));

describe("Action Checklist 26 October 2026 Compliance Audit", () => {
  describe("1. Healthcare Focus & Copy Purge (PDF Section 2)", () => {
    it("verifies Nav component contains 'Appointment & Patient-Communication Software'", () => {
      const navPath = path.resolve(__dirname, "../components/sections/01-Nav.tsx");
      const navContent = fs.readFileSync(navPath, "utf-8");
      expect(navContent).toContain("Appointment & Patient-Communication Software");
      expect(navContent).not.toContain("Appointment & Booking Software for India");
    });

    it("verifies Floating WhatsApp button is created and configured for +91 92843 10604", () => {
      const floatingWaPath = path.resolve(__dirname, "../components/ui/FloatingWhatsApp.tsx");
      expect(fs.existsSync(floatingWaPath)).toBe(true);
      const content = fs.readFileSync(floatingWaPath, "utf-8");
      expect(content).toContain("https://wa.me/919284310604");
    });

    it("verifies PROBLEM_SECTION has no unverified 25% stats", () => {
      const problemStr = JSON.stringify(PROBLEM_SECTION);
      expect(problemStr).not.toContain("25%");
    });

    it("verifies mandatory FAQs exist in FAQ_LIST", () => {
      const faq1 = FAQ_LIST.find((f) =>
        f.q.toLowerCase().includes("receptionist")
      );
      expect(faq1).toBeDefined();
      expect(faq1?.a).toContain("10-second walk-in");

      const faq2 = FAQ_LIST.find((f) =>
        f.q.toLowerCase().includes("whatsapp") && f.q.toLowerCase().includes("number")
      );
      expect(faq2).toBeDefined();
      expect(faq2?.a).toContain("Cloud API");
    });

    it("verifies zero residual non-clinical references in footer links", () => {
      const solutionsLinks = JSON.stringify(FOOTER_LINKS.solutions);
      expect(solutionsLinks.toLowerCase()).not.toContain("salon");
      expect(solutionsLinks.toLowerCase()).not.toContain("spa");
      expect(solutionsLinks.toLowerCase()).not.toContain("gym");
      expect(solutionsLinks.toLowerCase()).not.toContain("tutor");

      const companyLinks = JSON.stringify(FOOTER_LINKS.company);
      expect(companyLinks).toContain("/partners");
    });

    it("verifies CASE_STUDIES contain only clinical practices without unverified ratings", () => {
      for (const study of CASE_STUDIES) {
        expect(study.industry).toMatch(/Clinic|Healthcare|Dental|Pediatric/i);
        expect((study as any).rating).toBeUndefined();
      }
    });
  });

  describe("2. Database Schema & RBAC Security Guards (PDF Section 3)", () => {
    it("verifies Prisma schema contains RECEPTIONIST, OptOutLog, Partner, and reminder2hSent", () => {
      const schemaPath = path.resolve(__dirname, "../../prisma/schema.prisma");
      const schema = fs.readFileSync(schemaPath, "utf-8");

      expect(schema).toContain("RECEPTIONIST");
      expect(schema).toContain("model OptOutLog");
      expect(schema).toContain("optedOut");
      expect(schema).toContain("optOutAt");
      expect(schema).toContain("reminder2hSent");
      expect(schema).toContain("model Partner");
      expect(schema).toContain("model Referral");
      expect(schema).toContain("model CommissionLedger");
    });

    it("verifies Settings and Usage pages guard against RECEPTIONIST role", () => {
      const settingsPath = path.resolve(__dirname, "../app/dashboard/settings/page.tsx");
      const settings = fs.readFileSync(settingsPath, "utf-8");
      expect(settings).toContain("RECEPTIONIST");
      expect(settings).toContain("/dashboard/bookings");

      const usagePath = path.resolve(__dirname, "../app/dashboard/usage/page.tsx");
      const usage = fs.readFileSync(usagePath, "utf-8");
      expect(usage).toContain("RECEPTIONIST");
      expect(usage).toContain("/dashboard/bookings");
    });
  });

  describe("3. WhatsApp DPDP Opt-Out & 2-Hour Reminders (PDF Sections 3 & 4)", () => {
    it("verifies WhatsApp webhook handles STOP/UNSUBSCRIBE/OPT OUT", () => {
      const webhookPath = path.resolve(__dirname, "../app/api/webhooks/whatsapp/route.ts");
      const webhook = fs.readFileSync(webhookPath, "utf-8");
      expect(webhook).toContain("STOP");
      expect(webhook).toContain("UNSUBSCRIBE");
      expect(webhook).toContain("OPT OUT");
      expect(webhook).toContain("optOutLog");
      expect(webhook).toContain("optedOut: true");
    });

    it("verifies Cron reminders handle 2h reminders and skip opted-out patients", () => {
      const cronPath = path.resolve(__dirname, "../app/api/cron/reminders/route.ts");
      const cron = fs.readFileSync(cronPath, "utf-8");
      expect(cron).toContain("reminder2hSent");
      expect(cron).toContain("booking.customer?.optedOut");
      expect(cron).toContain("skippedOptOut");
    });
  });

  describe("4. 10-Second Walk-in OPD Entry & No-Show Analytics", () => {
    it("verifies analytics metrics includes no-show calculations and zero fallbacks", async () => {
      const metrics = await getBusinessAnalytics("30D");
      expect(metrics).toHaveProperty("noShowCount");
      expect(metrics).toHaveProperty("noShowRate");
      expect(metrics).toHaveProperty("lostRevenue");
      expect(metrics.noShowCount).toBe(0);
      expect(metrics.noShowRate).toBe(0);
      expect(metrics.lostRevenue).toBe(0);
    });

    it("verifies BookingsClient has 10s Walk-in OPD Entry modal and trigger", () => {
      const bookingsClientPath = path.resolve(__dirname, "../app/dashboard/bookings/BookingsClient.tsx");
      const content = fs.readFileSync(bookingsClientPath, "utf-8");
      expect(content).toContain("10s Walk-in OPD");
      expect(content).toContain("10-Second Walk-in OPD Entry");
      expect(content).toContain("showWalkInModal");
    });

    it("verifies DashboardClient and DashboardHome render No-Show Report", () => {
      const homePath = path.resolve(__dirname, "../app/dashboard/DashboardHome.tsx");
      const homeContent = fs.readFileSync(homePath, "utf-8");
      expect(homeContent).toContain("No-Show Rate");
      expect(homeContent).toContain("Estimated Lost Revenue");

      const clientPath = path.resolve(__dirname, "../app/dashboard/DashboardClient.tsx");
      expect(fs.existsSync(clientPath)).toBe(true);
      const clientContent = fs.readFileSync(clientPath, "utf-8");
      expect(clientContent).toContain("NoShowReportCard");
    });
  });

  describe("5. PWA & Partner Affiliate Program (PDF Sections 5 & 6)", () => {
    it("verifies PWA manifest provides clinical app metadata", () => {
      const manifestData = manifest();
      expect(manifestData.name).toContain("Docodo");
      expect(manifestData.short_name).toContain("Docodo OPD");
      expect(manifestData.display).toBe("standalone");
      expect(manifestData.start_url).toBe("/dashboard");
    });

    it("verifies Service Worker is configured with offline caching in public/sw.js", () => {
      const swPath = path.resolve(__dirname, "../../public/sw.js");
      expect(fs.existsSync(swPath)).toBe(true);
      const swContent = fs.readFileSync(swPath, "utf-8");
      expect(swContent).toContain("docodo-clinic-offline-v1");
      expect(swContent).toContain("/dashboard/bookings");
    });

    it("verifies Partner Registration Server Action registers affiliates with unique codes", async () => {
      const res = await registerPartner({
        name: "Dr. Rajesh Kulkarni",
        email: "rajesh.kulkarni@healthdist.in",
        phone: "+91 98765 43210",
        channel: "MEDICAL_REPRESENTATIVE",
        upiId: "rajesh@oksbi",
      });

      expect(res.success).toBe(true);
      expect(res.partner?.referralCode).toBeDefined();
      expect(res.partner?.referralCode.startsWith("DRRA")).toBe(true);
    });

    it("verifies Clinic Walkthrough Demo Action handles requests gracefully", async () => {
      const res = await requestClinicDemoWalkthrough({
        doctorName: "Dr. Neha Patel",
        clinicName: "Patel Dental Care",
        phone: "+91 98220 12345",
        specialty: "Dental Surgery",
        preferredTime: "Evening (4 PM - 7 PM)",
      });

      expect(res.success).toBe(true);
      expect(res.message).toContain("preferred window");
    });
  });
});
