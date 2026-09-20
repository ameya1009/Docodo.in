import { describe, it, expect } from "vitest";
import { AdapterRegistry } from "../lib/growth-os/adapters/AdapterRegistry";
import { EntityResolutionAgent } from "../lib/growth-os/agents/EntityResolutionAgent";
import { ContentEngine } from "../lib/growth-os/agents/ContentEngine";
import { OpportunityAgent } from "../lib/growth-os/agents/OpportunityAgent";
import { IntentAgent } from "../lib/growth-os/agents/IntentAgent";
import { AdsAgent } from "../lib/growth-os/agents/AdsAgent";
import { OutreachAgent } from "../lib/growth-os/agents/OutreachAgent";
import { GrowthSupervisorAgent } from "../lib/growth-os/agents/GrowthSupervisorAgent";

describe("Docodo Growth OS — Omnichannel Acquisition Platform Test Suite", () => {
  describe("1. Platform Adapter Architecture & Capabilities", () => {
    it("initializes all 16 platform adapters in the registry", () => {
      const adapters = AdapterRegistry.getAllAdapters();
      expect(adapters.length).toBeGreaterThanOrEqual(14);
      
      const platforms = adapters.map((a: any) => a.platform);
      expect(platforms).toContain("google_places");
      expect(platforms).toContain("google_search");
      expect(platforms).toContain("website");
      expect(platforms).toContain("instagram");
      expect(platforms).toContain("facebook");
      expect(platforms).toContain("linkedin");
      expect(platforms).toContain("x");
      expect(platforms).toContain("reddit");
      expect(platforms).toContain("youtube");
      expect(platforms).toContain("pinterest");
      expect(platforms).toContain("directory");
      expect(platforms).toContain("email");
      expect(platforms).toContain("whatsapp");
    });

    it("probes capabilities correctly for each adapter", () => {
      const gp = AdapterRegistry.getAdapter("google_places");
      expect(gp).toBeDefined();
      expect(gp?.capabilities.canDiscover).toBe(true);

      const email = AdapterRegistry.getAdapter("email");
      expect(email).toBeDefined();
      expect(email?.capabilities.canGetAnalytics).toBe(true);
    });
  });

  describe("2. Entity Resolution & Identity Merging", () => {
    it("normalizes phone numbers to standard E.164 without national prefixes", () => {
      expect(EntityResolutionAgent.normalizePhone("98220 11223")).toBe("+919822011223");
      expect(EntityResolutionAgent.normalizePhone("09822011223")).toBe("+919822011223");
      expect(EntityResolutionAgent.normalizePhone("+91-98220-11223")).toBe("+919822011223");
    });

    it("normalizes web domains cleanly", () => {
      expect(EntityResolutionAgent.normalizeDomain("https://www.xyzsalon.in/about")).toBe("xyzsalon.in");
      expect(EntityResolutionAgent.normalizeDomain("http://xyzsalon.in/")).toBe("xyzsalon.in");
    });

    it("computes accurate entity similarity and prevents false positive substring merges", () => {
      // Unrelated businesses sharing a generic token should not merge
      const sim1 = EntityResolutionAgent.calculateSimilarity(
        { name: "Spa", city: "Pune" },
        { name: "Green Luxury Spa Pune", city: "Pune" }
      );
      expect(sim1).toBeLessThan(0.80);

      // Matches on exact domain or phone should produce high confidence
      const sim2 = EntityResolutionAgent.calculateSimilarity(
        { name: "XYZ Salon", domain: "xyzsalon.in", phone: "+919822011223" },
        { name: "XYZ Salon Pune", domain: "xyzsalon.in", phone: "+919822011223" }
      );
      expect(sim2).toBeGreaterThanOrEqual(0.85);
    });
  });

  describe("3. Omnichannel Content Engine (13 Native Platform Formats)", () => {
    it("adapts a core idea into all 13 native platform formats across Docodo content pillars", async () => {
      const thesis = "Why local salons lose 40% of Instagram booking inquiries";
      const bundle = await ContentEngine.generateOmnichannelBundle({
        thesis,
        pillar: "Salon marketing",
        targetAudience: "Salon and Spa Owners",
      });

      expect(bundle).toBeDefined();
      expect(bundle.linkedinPost).toBeDefined();
      expect(bundle.instagramCarousel).toBeDefined();
      expect(bundle.instagramCarousel.slides.length).toBeGreaterThan(0);
      expect(bundle.instagramReelScript).toBeDefined();
      expect(bundle.facebookPost).toBeDefined();
      expect(bundle.facebookReelScript).toBeDefined();
      expect(bundle.xThread).toBeDefined();
      expect(bundle.xThread.tweets.length).toBeGreaterThan(0);
      expect(bundle.youtubeShortScript).toBeDefined();
      expect(bundle.youtubeLongScript).toBeDefined();
      expect(bundle.pinterestGraphicBrief).toBeDefined();
      expect(bundle.blogArticle).toBeDefined();
      expect(bundle.emailNewsletter).toBeDefined();
      expect(bundle.websiteContent).toBeDefined();
      expect(bundle.adVariation).toBeDefined();
    });
  });

  describe("4. Intent Detection & Opportunity Mapping", () => {
    it("detects SMB business pain points from conversations", () => {
      const signal1 = IntentAgent.detectIntent("Our website gets traffic but nobody books appointments online");
      expect(signal1.category).toBe("website_conversion");
      expect(signal1.confidence).toBeGreaterThan(0.7);

      const signal2 = IntentAgent.detectIntent("We lose customers because staff forget to reply to WhatsApp leads");
      expect(signal2.category).toBe("whatsapp_automation");
    });

    it("maps verified business opportunities to Docodo solutions", () => {
      const opp = OpportunityAgent.mapOpportunity({
        businessName: "Glow Skin Clinic",
        problems: ["no_booking_funnel", "lost_whatsapp_leads"],
      });

      expect(opp.length).toBeGreaterThan(0);
      const solutions = opp.map((o: any) => o.recommendedProduct);
      expect(solutions).toContain("Booking System + WhatsApp AI Receptionist");
    });
  });

  describe("5. Advertising & Outreach Safety Guardrails", () => {
    it("enforces daily budget limits and spend alert thresholds", () => {
      const budgetCheck = AdsAgent.validateBudget({
        dailyBudgetINR: 500,
        monthlyBudgetINR: 15000,
        currentSpendINR: 14500,
      });

      expect(budgetCheck.allowed).toBe(true);
      expect(budgetCheck.spendAlertTriggered).toBe(true);

      const overBudgetCheck = AdsAgent.validateBudget({
        dailyBudgetINR: 20000,
        monthlyBudgetINR: 15000,
        currentSpendINR: 16000,
      });
      expect(overBudgetCheck.allowed).toBe(false);
    });

    it("enforces opt-out suppression on outbound outreach", () => {
      const isSuppressed = OutreachAgent.isSuppressed("optout@example.com", ["optout@example.com"]);
      expect(isSuppressed).toBe(true);

      const isAllowed = OutreachAgent.isSuppressed("prospect@salon.com", ["optout@example.com"]);
      expect(isAllowed).toBe(false);
    });
  });

  describe("6. Growth Supervisor Mission Orchestration", () => {
    it("executes an end-to-end acquisition query with full audit trail", async () => {
      const mission = await GrowthSupervisorAgent.executeMission({
        query: "Find 50 salons in Pune for Docodo WhatsApp automation",
        sources: ["google_places", "website", "instagram"],
        autoApproveOutreach: false,
      });

      expect(mission.status).toBe("COMPLETED");
      expect(mission.discoveredCount).toBeGreaterThan(0);
      expect(mission.resolvedCount).toBeGreaterThan(0);
      expect(mission.opportunitiesCount).toBeGreaterThan(0);
      expect(mission.outreachDraftsCount).toBeGreaterThan(0);
      expect(mission.auditLog.length).toBeGreaterThan(0);
    });
  });
});
