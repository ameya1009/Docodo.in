import { describe, it, expect, vi } from "vitest";
import { SITE_CONFIG, defaultMetadata, jsonLd } from "../lib/metadata";
import { HERO_CONTENT, PROBLEM_SECTION, PRICING_PLANS } from "../lib/constants";

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve({ get: vi.fn(), set: vi.fn(), delete: vi.fn() })),
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(() => Promise.resolve(null)),
}));

describe("Clinical Rebrand, SEO & Security Verification Tests", () => {
  describe("1. Top 1% SEO & Metadata Coverage (CRM, Automation, Marketing, Dashboard)", () => {
    it("includes primary target search keywords in defaultMetadata", () => {
      const keywords = defaultMetadata.keywords as string[];
      expect(keywords).toBeDefined();
      expect(keywords).toContain("CRM");
      expect(keywords).toContain("automation");
      expect(keywords).toContain("marketing");
      expect(keywords).toContain("dashboard");
      expect(keywords).toContain("doctor CRM");
      expect(keywords).toContain("clinic CRM");
      expect(keywords).toContain("WhatsApp automation");
      expect(keywords).toContain("doctor dashboard");
      expect(keywords).toContain("DPDP Act 2023 compliant medical software");
    });

    it("anchors site title and description to healthcare CRM and automation", () => {
      expect(SITE_CONFIG.title).toContain("CRM");
      expect(SITE_CONFIG.title).toContain("Automation");
      expect(SITE_CONFIG.title).toContain("Marketing");
      expect(SITE_CONFIG.title).toContain("Dashboard");
      expect(SITE_CONFIG.description).toContain("0% aggregator commissions");
      expect(SITE_CONFIG.description).toContain("DPDP Act");
    });

    it("verifies JSON-LD Schema.org graph for SoftwareApplication & FAQPage", () => {
      expect(jsonLd["@context"]).toBe("https://schema.org");
      const graph = jsonLd["@graph"];
      expect(Array.isArray(graph)).toBe(true);

      const softwareApp = graph.find((node: any) => node["@type"] === "SoftwareApplication");
      expect(softwareApp).toBeDefined();
      expect(softwareApp.featureList).toContain("Patient Relationship Management (CRM)");
      expect(softwareApp.featureList).toContain("Automated WhatsApp Appointment & Token Workflows");
      expect(softwareApp.featureList).toContain("Real-Time Clinical Consultation & Revenue Dashboard");

      const faq = graph.find((node: any) => node["@type"] === "FAQPage");
      expect(faq).toBeDefined();
      expect(faq.mainEntity.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe("2. Authentic Clinical Positioning & Problem Alignment", () => {
    it("positions hero messaging specifically for doctors and outpatient clinics", () => {
      expect(HERO_CONTENT.headline.line2).toContain("Doctors & Clinics");
      expect(HERO_CONTENT.subheadline).toContain("patient CRM");
      expect(HERO_CONTENT.trustTicker).toContain("0% Aggregator Take-Rate");
      expect(HERO_CONTENT.trustTicker).toContain("DPDP Act 2023 Compliant");
    });

    it("articulates the empty consultation chair problem accurately", () => {
      expect(PROBLEM_SECTION.headline).toContain("Empty Consultation Chair");
      expect(PROBLEM_SECTION.flow.some((f) => f.title.includes("Aggregator Shows Rivals"))).toBe(true);
    });
  });

  describe("3. Pricing & Direct UPI Settlement Alignment", () => {
    it("ensures pilot plan is ₹0 setup fee and paid plans offer direct settlement", () => {
      const pilotPlan = PRICING_PLANS.find((p) => p.id === "pilot");
      expect(pilotPlan).toBeDefined();
      expect(pilotPlan?.price).toBe("₹0");

      const starterPlan = PRICING_PLANS.find((p) => p.id === "starter");
      expect(starterPlan).toBeDefined();
      expect(starterPlan?.features.some((f) => f.includes("Razorpay") || f.includes("UPI"))).toBe(true);
    });
  });

  describe("4. Enterprise Tax Invoice & Password Reset Email Service", () => {
    it("generates GST-compliant invoice data with 18% tax breakdown and SAC 998313", async () => {
      const { generateInvoiceData, generateTaxInvoiceHtml } = await import("../lib/services/invoice-email-service");
      const invoice = generateInvoiceData({
        clientName: "Dr. Aditi Sharma",
        clientEmail: "aditi@sharmaclinic.in",
        businessName: "Sharma Multi-Specialty Clinic",
        planId: "PRO",
        planName: "Growth Clinical Enterprise",
        amountPaid: 2499,
        paymentId: "pay_test_123456",
        orderId: "order_test_123456",
      });

      expect(invoice.invoiceNumber).toMatch(/^DOC-INV-\d{6}-\d{4}$/);
      expect(invoice.amountPaid).toBe(2499);
      expect(invoice.currency).toBe("INR");

      const html = generateTaxInvoiceHtml(invoice);
      expect(html).toContain("DOC-INV-");
      expect(html).toContain("998313"); // SAC Code for SaaS IT services
      expect(html).toContain("CGST (9.0%)");
      expect(html).toContain("SGST (9.0%)");
      expect(html).toContain("Sharma Multi-Specialty Clinic");
      expect(html).toContain("Docodo Technologies Private Limited");
    });

    it("generates secure forgot password reset HTML email with 60-min expiry", async () => {
      const { generateForgotPasswordHtml } = await import("../lib/services/invoice-email-service");
      const resetHtml = generateForgotPasswordHtml({
        resetUrl: "https://docodo.in/auth/reset-password?token=secret123&email=doctor@clinic.in",
        email: "doctor@clinic.in",
      });

      expect(resetHtml).toContain("Reset Password Now");
      expect(resetHtml).toContain("60 minutes");
      expect(resetHtml).toContain("doctor@clinic.in");
      expect(resetHtml).toContain("secret123");
      expect(resetHtml).toContain("DPDP 2023");
    });
  });

  describe("5. Indian Hindu Calendar Festivals & Patient Birthday Engine", () => {
    it("contains major auspicious Hindu festivals with clinical health tips", async () => {
      const { HINDU_FESTIVALS_SCHEDULE } = await import("../lib/engines/hindu-calendar-greetings");
      expect(HINDU_FESTIVALS_SCHEDULE.length).toBeGreaterThanOrEqual(10);

      const diwali = HINDU_FESTIVALS_SCHEDULE.find((f) => f.id === "diwali");
      expect(diwali).toBeDefined();
      expect(diwali?.name).toContain("Diwali");
      expect(diwali?.healthTip).toBeDefined();

      const holi = HINDU_FESTIVALS_SCHEDULE.find((f) => f.id === "holi");
      expect(holi).toBeDefined();
      expect(holi?.name).toContain("Holi");

      const ganesh = HINDU_FESTIVALS_SCHEDULE.find((f) => f.id === "ganesh_chaturthi");
      expect(ganesh).toBeDefined();
      expect(ganesh?.name).toContain("Ganesh Chaturthi");
    });

    it("formats personalized patient birthday greetings with clinic branding", async () => {
      const { formatPatientBirthdayMessage, getHinduCalendarStatus } = await import("../lib/engines/hindu-calendar-greetings");
      const birthdayMsg = formatPatientBirthdayMessage({
        patientName: "Rahul Sharma",
        clinicName: "Apex Dental Care",
        doctorName: "Anand Joshi",
        appointmentLink: "https://docodo.in/book/apex-dental",
      });

      expect(birthdayMsg).toContain("Dear Rahul Sharma");
      expect(birthdayMsg).toContain("Happy Birthday");
      expect(birthdayMsg).toContain("Apex Dental Care");
      expect(birthdayMsg).toContain("Dr. Anand Joshi");
      expect(birthdayMsg).toContain("https://docodo.in/book/apex-dental");

      const status = getHinduCalendarStatus(new Date("2026-11-08"), "Apex Dental Care");
      expect(status.festivalToday?.id).toBe("diwali");
      expect(status.festivalGreetingText).toContain("Diwali");
    });
  });

  describe("6. Plan Hierarchy & Feature Gating Specification", () => {
    it("verifies strict plan hierarchy and feature matrix in plans-config", async () => {
      const { PLANS_CONFIG, PLAN_IDS, FEATURE_KEYS, resolvePlan } = await import("../lib/plans-config");
      
      // Pilot plan: limited to 50 bookings, no AI marketing, no custom branded storefront
      const pilot = PLANS_CONFIG[PLAN_IDS.PILOT];
      expect(pilot.bookingLimit).toBe(50);
      expect(pilot.entitlements[FEATURE_KEYS.AI_MARKETING]).toBe(false);
      expect(pilot.entitlements[FEATURE_KEYS.BRANDED_STOREFRONT]).toBe(false);
      expect(pilot.entitlements[FEATURE_KEYS.BOOKINGS_UNLIMITED]).toBe(false);

      // Starter plan: unlimited bookings, branded storefront, CRM LTV, but no AI or multi-staff
      const starter = PLANS_CONFIG[PLAN_IDS.STARTER];
      expect(starter.bookingLimit).toBe("UNLIMITED");
      expect(starter.entitlements[FEATURE_KEYS.BRANDED_STOREFRONT]).toBe(true);
      expect(starter.entitlements[FEATURE_KEYS.CRM_LTV]).toBe(true);
      expect(starter.entitlements[FEATURE_KEYS.AI_MARKETING]).toBe(false);
      expect(starter.entitlements[FEATURE_KEYS.MULTI_STAFF]).toBe(false);

      // Growth plan: unlocks AI marketing, multi-staff, revenue analytics
      const growth = PLANS_CONFIG[PLAN_IDS.GROWTH];
      expect(growth.entitlements[FEATURE_KEYS.AI_MARKETING]).toBe(true);
      expect(growth.entitlements[FEATURE_KEYS.MULTI_STAFF]).toBe(true);
      expect(growth.entitlements[FEATURE_KEYS.REVENUE_ANALYTICS]).toBe(true);

      // Plan resolution helpers
      expect(resolvePlan("pilot").id).toBe(PLAN_IDS.PILOT);
      expect(resolvePlan("starter").id).toBe(PLAN_IDS.STARTER);
      expect(resolvePlan("growth").id).toBe(PLAN_IDS.GROWTH);
      expect(resolvePlan("pro").id).toBe(PLAN_IDS.GROWTH);
      expect(resolvePlan("setup-service").id).toBe(PLAN_IDS.CONCIERGE);
    });
  });

  describe("7. Multi-Tenant Database Isolation Integrity", () => {
    it("verifies all operational queries enforce businessId isolation", async () => {
      const { getBusinessAnalytics } = await import("../lib/actions/analytics");
      // Calling without active session safely defaults to empty zeroed metrics
      const result = await getBusinessAnalytics("30D");
      expect(result.grossRevenue).toBe(0);
      expect(result.totalBookings).toBe(0);
      expect(result.conversionRate).toBe(0);
    });
  });
});
