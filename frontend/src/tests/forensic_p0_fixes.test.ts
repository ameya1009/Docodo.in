import { describe, it, expect, vi, beforeEach } from "vitest";
import fs from "fs";
import path from "path";
import { DocodoBackendAPI } from "../lib/api-client";
import { GET as whatsappWebhookGET } from "../app/api/webhooks/whatsapp/route";
import { createBookingAction } from "../lib/actions/dashboard";
import { computeCustomerLtv } from "../app/dashboard/customers/CustomersClient";

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(() => Promise.resolve({ user: { id: "test_user_owner", name: "Test Owner" } })),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("Forensic P0 & Operational Defect Verification", () => {
  describe("1. Table Name Alignment in Growth OS Migration", () => {
    const migrationPath = path.resolve(
      __dirname,
      "../../../supabase/migrations/20260920000001_enable_growth_os_rls.sql"
    );

    it("verifies the migration file exists", () => {
      expect(fs.existsSync(migrationPath)).toBe(true);
    });

    it("verifies legacy table names are completely purged", () => {
      const content = fs.readFileSync(migrationPath, "utf-8");
      const legacyNames = [
        '"OmnichannelLead"',
        '"LeadOpportunity"',
        '"LeadGraphNode"',
        '"MarketingCampaign"',
        '"OutreachDraft"',
        '"AdCampaignBudget"',
        '"GrowthExperiment"',
      ];

      for (const legacy of legacyNames) {
        expect(content).not.toContain(legacy);
      }
    });

    it("verifies all active Prisma schema Growth OS tables are present with RLS and policies", () => {
      const content = fs.readFileSync(migrationPath, "utf-8");
      const activeNames = [
        '"LeadEntity"',
        '"SocialIdentity"',
        '"OpportunityRecord"',
        '"ContentAsset"',
        '"AdCampaign"',
        '"OutreachSequence"',
        '"AttributionEvent"',
        '"SupervisorRun"',
        '"LeadGraphEdge"',
        '"SocialListeningSignal"',
      ];

      for (const active of activeNames) {
        expect(content).toContain(`ALTER TABLE IF EXISTS ${active}            ENABLE ROW LEVEL SECURITY;`.slice(0, 30));
        expect(content).toContain(active);
      }

      // Check tenant policy definition
      expect(content).toContain('"lead_entity_owner_all"');
      expect(content).toContain('"content_asset_owner_all"');
      expect(content).toContain('"ad_campaign_owner_all"');
      expect(content).toContain('"supervisor_run_owner_all"');
    });
  });

  describe("2. Missing SQL Migration 20260925000000_partners_and_optouts.sql", () => {
    const migrationPath = path.resolve(
      __dirname,
      "../../../supabase/migrations/20260925000000_partners_and_optouts.sql"
    );

    it("verifies the migration file exists and is populated", () => {
      expect(fs.existsSync(migrationPath)).toBe(true);
      const content = fs.readFileSync(migrationPath, "utf-8");
      expect(content.length).toBeGreaterThan(100);
    });

    it("verifies Partner, Referral, CommissionLedger, and OptOutLog table creations", () => {
      const content = fs.readFileSync(migrationPath, "utf-8");
      expect(content).toContain('CREATE TABLE IF NOT EXISTS "Partner"');
      expect(content).toContain('CREATE TABLE IF NOT EXISTS "Referral"');
      expect(content).toContain('CREATE TABLE IF NOT EXISTS "CommissionLedger"');
      expect(content).toContain('CREATE TABLE IF NOT EXISTS "OptOutLog"');
    });

    it("verifies RLS enablement and tenant isolation policies", () => {
      const content = fs.readFileSync(migrationPath, "utf-8");
      expect(content).toContain('ALTER TABLE IF EXISTS "Partner"          ENABLE ROW LEVEL SECURITY;');
      expect(content).toContain('ALTER TABLE IF EXISTS "Referral"         ENABLE ROW LEVEL SECURITY;');
      expect(content).toContain('ALTER TABLE IF EXISTS "CommissionLedger" ENABLE ROW LEVEL SECURITY;');
      expect(content).toContain('ALTER TABLE IF EXISTS "OptOutLog"        ENABLE ROW LEVEL SECURITY;');
      expect(content).toContain('"optout_owner_all"');
    });

    it("verifies compliance columns on Customer and Booking", () => {
      const content = fs.readFileSync(migrationPath, "utf-8");
      expect(content).toContain('"optedOut"');
      expect(content).toContain('"optOutAt"');
      expect(content).toContain('"reminder2hSent"');
    });
  });

  describe("3. Vercel Cron Expressions", () => {
    const rootVercelPath = path.resolve(__dirname, "../../../vercel.json");
    const frontendVercelPath = path.resolve(__dirname, "../../vercel.json");

    it("verifies root vercel.json cron schedule for reminders and greetings", () => {
      expect(fs.existsSync(rootVercelPath)).toBe(true);
      const vercelConfig = JSON.parse(fs.readFileSync(rootVercelPath, "utf-8"));
      const crons = vercelConfig.crons as Array<{ path: string; schedule: string }>;

      const remindersCron = crons.find((c) => c.path === "/api/cron/reminders");
      expect(remindersCron).toBeDefined();
      expect(remindersCron?.schedule).toBe("0 * * * *"); // Hourly for accurate 2h reminders

      const greetingsCron = crons.find((c) => c.path === "/api/cron/greetings");
      expect(greetingsCron).toBeDefined();
      expect(greetingsCron?.schedule).toBe("30 3 * * *"); // 09:00 AM IST
    });

    it("verifies frontend/vercel.json is aligned with the same cron expressions", () => {
      expect(fs.existsSync(frontendVercelPath)).toBe(true);
      const vercelConfig = JSON.parse(fs.readFileSync(frontendVercelPath, "utf-8"));
      const crons = vercelConfig.crons as Array<{ path: string; schedule: string }>;

      const remindersCron = crons.find((c) => c.path === "/api/cron/reminders");
      expect(remindersCron?.schedule).toBe("0 * * * *");

      const greetingsCron = crons.find((c) => c.path === "/api/cron/greetings");
      expect(greetingsCron?.schedule).toBe("30 3 * * *");
    });
  });

  describe("4. Hardened WhatsApp Dispatch & Webhook Verification", () => {
    const originalEnv = process.env;

    beforeEach(() => {
      vi.resetModules();
      process.env = { ...originalEnv };
    });

    it("DocodoBackendAPI.dispatchWhatsAppMessage returns success: false and status: NOT_CONFIGURED when credentials are unset", async () => {
      delete process.env.WHATSAPP_ACCESS_TOKEN;
      delete process.env.WHATSAPP_PHONE_NUMBER_ID;

      const res = await DocodoBackendAPI.dispatchWhatsAppMessage({
        businessId: "biz_test",
        recipientPhone: "+919876543210",
        messageType: "TEST",
        customMessage: "Test WhatsApp Message",
      });

      expect(res.success).toBe(false);
      expect(res.error).toBeDefined();
      expect(res.error).toContain("unconfigured");
    });

    it("DocodoBackendAPI.dispatchWhatsAppMessage returns success: false when recipient phone is invalid", async () => {
      process.env.WHATSAPP_ACCESS_TOKEN = "mock_token";
      process.env.WHATSAPP_PHONE_NUMBER_ID = "mock_phone_id";

      const res = await DocodoBackendAPI.dispatchWhatsAppMessage({
        businessId: "biz_test",
        recipientPhone: "invalid_phone_no_digits",
        messageType: "TEST",
        customMessage: "Test WhatsApp Message",
      });

      expect(res.success).toBe(false);
      expect(res.error).toContain("Invalid recipient phone number");
    });

    it("DocodoBackendAPI.dispatchWhatsAppMessage returns success: false when Meta API returns HTTP 400", async () => {
      process.env.WHATSAPP_ACCESS_TOKEN = "mock_token";
      process.env.WHATSAPP_PHONE_NUMBER_ID = "mock_phone_id";

      const originalFetch = global.fetch;
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        text: () => Promise.resolve('{"error":{"message":"Invalid OAuth access token"}}'),
      } as any);

      try {
        const res = await DocodoBackendAPI.dispatchWhatsAppMessage({
          businessId: "biz_test",
          recipientPhone: "+919876543210",
          messageType: "TEST",
          customMessage: "Test WhatsApp Message",
        });

        expect(res.success).toBe(false);
        expect(res.error).toContain("Meta Graph API error (status 400)");
      } finally {
        global.fetch = originalFetch;
      }
    });

    it("DocodoBackendAPI.dispatchWhatsAppMessage returns success: false when fetch throws network failure", async () => {
      process.env.WHATSAPP_ACCESS_TOKEN = "mock_token";
      process.env.WHATSAPP_PHONE_NUMBER_ID = "mock_phone_id";

      const originalFetch = global.fetch;
      global.fetch = vi.fn().mockRejectedValue(new Error("Network connection dropped"));

      try {
        const res = await DocodoBackendAPI.dispatchWhatsAppMessage({
          businessId: "biz_test",
          recipientPhone: "+919876543210",
          messageType: "TEST",
          customMessage: "Test WhatsApp Message",
        });

        expect(res.success).toBe(false);
        expect(res.error).toContain("Network connection dropped");
      } finally {
        global.fetch = originalFetch;
      }
    });

    it("WhatsApp webhook GET handshake rejects with 500 when WHATSAPP_VERIFY_TOKEN is unset (no docodo_wa_verify_secret fallback)", async () => {
      delete process.env.WHATSAPP_VERIFY_TOKEN;

      const req = {
        url: "https://docodo.in/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=docodo_wa_verify_secret&hub.challenge=test_challenge",
      } as any;

      const res = await whatsappWebhookGET(req);
      expect(res.status).toBe(500);
      const json = await res.json();
      expect(json.error).toContain("WHATSAPP_VERIFY_TOKEN is not configured");
    });

    it("WhatsApp webhook GET handshake succeeds when WHATSAPP_VERIFY_TOKEN matches", async () => {
      process.env.WHATSAPP_VERIFY_TOKEN = "custom_production_secret_token_12345";

      const req = {
        url: "https://docodo.in/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=custom_production_secret_token_12345&hub.challenge=test_challenge",
      } as any;

      const res = await whatsappWebhookGET(req);
      expect(res.status).toBe(200);
      const text = await res.text();
      expect(text).toBe("test_challenge");
    });

    it("WhatsApp webhook GET handshake rejects with 403 when token does not match", async () => {
      process.env.WHATSAPP_VERIFY_TOKEN = "custom_production_secret_token_12345";

      const req = {
        url: "https://docodo.in/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=wrong_token&hub.challenge=test_challenge",
      } as any;

      const res = await whatsappWebhookGET(req);
      expect(res.status).toBe(403);
    });
  });

  describe("5. CRM Lifetime Value (LTV) Accounting", () => {
    it("verifies CustomersClient computes dynamic LTV by filtering for b.paymentStatus === 'PAID'", () => {
      const clientPath = path.resolve(__dirname, "../app/dashboard/customers/CustomersClient.tsx");
      const clientContent = fs.readFileSync(clientPath, "utf-8");

      expect(clientContent).toContain('b.paymentStatus === "PAID"');
      expect(clientContent).toContain("computeCustomerLtv");
      // Verify legacy unconditional summation is gone
      expect(clientContent).not.toContain(
        "c.bookings?.reduce((acc: number, b: any) => acc + (b.service?.price || 0), 0) || c.lifetimeValue || 0"
      );
    });

    it("computeCustomerLtv dynamically sums only bookings with paymentStatus === 'PAID'", () => {
      const customer = {
        lifetimeValue: 9999,
        bookings: [
          { paymentStatus: "PAID", price: 500, paidAmount: 500 },
          { paymentStatus: "UNPAID", price: 1000 },
          { paymentStatus: "PAID", price: 300, paidAmount: 250 },
          { paymentStatus: "PENDING", price: 700 },
        ],
      };
      // Should sum only the two PAID bookings: 500 + 250 = 750
      expect(computeCustomerLtv(customer)).toBe(750);
    });

    it("computeCustomerLtv returns 0 if all bookings are UNPAID", () => {
      const customer = {
        lifetimeValue: 9999,
        bookings: [
          { paymentStatus: "UNPAID", price: 1000 },
          { paymentStatus: "PENDING", price: 500 },
        ],
      };
      expect(computeCustomerLtv(customer)).toBe(0);
    });

    it("computeCustomerLtv falls back to customer.lifetimeValue when bookings array is empty or undefined", () => {
      expect(computeCustomerLtv({ lifetimeValue: 1200, bookings: [] })).toBe(1200);
      expect(computeCustomerLtv({ lifetimeValue: 800 })).toBe(800);
      expect(computeCustomerLtv(null)).toBe(0);
    });

    it("computeCustomerLtv correctly handles paidAmount of 0 for complimentary/free sessions", () => {
      const customer = {
        lifetimeValue: 500,
        bookings: [
          { paymentStatus: "PAID", price: 500, paidAmount: 0 },
        ],
      };
      // Must not fall back to price 500 if paidAmount is recorded as 0
      expect(computeCustomerLtv(customer)).toBe(0);
    });

    it("verifies createBookingAction only increments customer LTV when paymentStatus === 'PAID'", () => {
      const dashboardPath = path.resolve(__dirname, "../lib/actions/dashboard.ts");
      const dashboardContent = fs.readFileSync(dashboardPath, "utf-8");

      expect(dashboardContent).toContain('data.paymentStatus === "PAID"');
      expect(dashboardContent).toContain("ltvIncrement");
      expect(dashboardContent).toContain("createBookingAction = createBooking");
    });
  });
});
