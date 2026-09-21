import { describe, it, expect } from "vitest";
import { productCatalogAgent } from "../lib/growth-os/agents/ProductCatalogAgent";
import { solutionMatchingAgent } from "../lib/growth-os/agents/SolutionMatchingAgent";
import { businessResearchAgent, gitHubIntelligenceAgent } from "../lib/growth-os/agents/BusinessResearchAgent";
import { aiBusinessAuditAgent } from "../lib/growth-os/agents/AIBusinessAuditAgent";
import { pricingAgent, proposalAgent } from "../lib/growth-os/agents/PricingAgent";
import { salesAgent, SalesConversationSession } from "../lib/growth-os/agents/SalesAgent";
import {
  paymentAgent,
  onboardingAgent,
  fulfillmentAgent,
  customerSuccessAgent,
  retentionAgent,
  expansionAgent,
  referralAgent,
} from "../lib/growth-os/agents/CustomerLifecycleEngines";
import { autonomyController } from "../lib/growth-os/agents/AutonomyController";
import { websitePersonalizationAgent } from "../lib/growth-os/agents/WebsitePersonalizationAgent";
import { GrowthSupervisorAgent } from "../lib/growth-os/agents/GrowthSupervisorAgent";
import { CanonicalLead } from "../lib/growth-os/agents/types";

describe("Docodo Autonomous Revenue OS — End-to-End Acceptance Test Suite", () => {
  describe("1. Acceptance Test 1: Full Revenue Lifecycle ('Get me more salon customers in Pune')", () => {
    it("executes complete lifecycle: Discovery -> Research -> Diagnosis -> Audit -> Proposal -> Payment -> Onboarding -> Retention -> Referral", async () => {
      // 1. Discovery & Supervisor Mission
      const mission = await GrowthSupervisorAgent.executeMission({
        query: "Get me more salon customers in Pune",
        city: "Pune",
        industry: "salon",
        sources: ["google_places", "website", "instagram"],
      });

      expect(mission.status).toBe("COMPLETED");
      expect(mission.discoveredCount).toBeGreaterThan(0);

      // 2. Mock Canonical Lead
      const mockLead: CanonicalLead = {
        id: "lead_salon_pune_101",
        canonicalName: "Aura Luxe Salon Baner",
        city: "Pune",
        country: "IN",
        normalizedPhone: "+919822011223",
        icpScore: 88,
        crmStage: "discovered",
        confidenceScore: 0.95,
        primarySource: "instagram",
        identities: [
          {
            id: "ig_1",
            platform: "instagram",
            rawName: "@auraluxesalon",
            followerCount: 5400,
            city: "Pune",
            country: "IN",
            sourceConfidence: 0.95,
            sourceTimestamp: new Date().toISOString(),
            rawPayload: { hasBookingForm: false },
          },
          {
            id: "gp_1",
            platform: "google_places",
            rawName: "Aura Luxe Salon Baner",
            city: "Pune",
            country: "IN",
            rating: 4.1,
            reviewCount: 22,
            sourceConfidence: 0.98,
            sourceTimestamp: new Date().toISOString(),
            rawPayload: {},
          },
        ],
        opportunities: [],
        scoreBreakdown: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // 3. Business Research & Tech Stack
      const research = await businessResearchAgent.researchBusiness(mockLead.identities[0]);
      expect(research.businessName).toBe("auraluxesalon");
      expect(research.bookingStatus).toBe("WHATSAPP_ONLY");

      // 4. Solution Matching & Diagnosis
      const diagnoses = solutionMatchingAgent.diagnoseAndMatch(mockLead);
      expect(diagnoses.length).toBeGreaterThan(0);
      expect(diagnoses.some((d) => d.recommendedDocodoSolution.id === "prod_whatsapp_ai" || d.recommendedDocodoSolution.id === "prod_growth_bundle")).toBe(true);

      // 5. Generate AI Business Audit
      const audit = aiBusinessAuditAgent.generateAudit(mockLead);
      expect(audit.businessName).toBe("Aura Luxe Salon Baner");
      expect(audit.identifiedProblems.length).toBeGreaterThan(0);
      expect(audit.projectedMonthlyROI_INR).toBeGreaterThan(0);

      // 6. Proposal & Pricing Calculation
      const proposal = proposalAgent.generateProposal(mockLead, "prod_whatsapp_ai", 10);
      expect(proposal.quote.finalPriceINR).toBeLessThan(proposal.quote.basePriceINR);
      expect(proposal.quote.requiresFounderApproval).toBe(false);
      expect(proposal.scope.length).toBeGreaterThan(0);

      // 7. Sales Conversation Simulation
      const session: SalesConversationSession = {
        sessionId: "sess_101",
        leadId: mockLead.id,
        businessName: mockLead.canonicalName,
        state: "new",
        messages: [],
        identifiedBottlenecks: [],
        isHumanTakeover: false,
        notes: [],
      };

      const res1 = salesAgent.handleCustomerMessage(session, "We get many WhatsApp messages but staff misses replying at night");
      expect(res1.newState).toBe("solution_presented");

      const res2 = salesAgent.handleCustomerMessage(session, "Sounds good, how to start?");
      expect(res2.newState).toBe("payment_pending");
      expect(res2.actionRequired).toBe("TRACK_PAYMENT");

      // 8. Payment Processing & Provisioning
      const paymentResult = paymentAgent.verifyAndProcessPayment({
        paymentId: "pay_rzp_12345",
        orderId: "order_12345",
        customerId: "cust_aura_101",
        businessName: "Aura Luxe Salon Baner",
        email: "contact@auraluxe.in",
        phone: "+919822011223",
        amountINR: proposal.quote.totalInitialPaymentINR,
        productId: "prod_whatsapp_ai",
        paymentGateway: "RAZORPAY",
        verifiedAt: new Date().toISOString(),
        status: "PAID",
      });

      expect(paymentResult.success).toBe(true);
      expect(paymentResult.onboardingInitiated).toBe(true);

      // 9. Onboarding & Fulfillment
      const onboardingStatus = await onboardingAgent.setupCustomerWorkspace({
        workspaceId: paymentResult.workspaceId,
        businessName: "Aura Luxe Salon Baner",
        industry: "Salons & Spas",
        city: "Pune",
        services: [{ name: "Haircut & Styling", priceINR: 800, durationMin: 45 }],
        workingHours: { mon: { open: "10:00", close: "20:00" } },
        whatsappNumber: "+919822011223",
        staffMembers: ["Priya", "Rahul"],
      });

      expect(onboardingStatus.status).toBe("COMPLETED");
      expect(onboardingStatus.onboardingChecklistProgress).toBe(100);

      const tasks = fulfillmentAgent.createFulfillmentPlan("prod_whatsapp_ai", "Aura Luxe Salon Baner");
      expect(tasks.length).toBeGreaterThanOrEqual(4);

      // 10. Customer Success Health & Retention Check
      const health = customerSuccessAgent.evaluateCustomerHealth({
        customerId: "cust_aura_101",
        monthlyBookings: 42,
        unansweredInquiries: 0,
        reviewGrowthLast30Days: 14,
      });

      expect(health.healthScore).toBeGreaterThanOrEqual(70);
      expect(health.riskLevel).toBe("HEALTHY");

      // 11. Referral Trigger
      const referralCheck = referralAgent.evaluateReferralTrigger(health);
      expect(referralCheck.eligible).toBe(true);
      expect(referralCheck.requestPrompt).toContain("Refer a friend");
    });
  });

  describe("2. Acceptance Test 2: Niche Growth Strategy ('I want more gyms')", () => {
    it("autonomously defines gym ICP, messaging, offer, and personalized landing page", () => {
      const page = websitePersonalizationAgent.getPersonalizedPage({
        industry: "gym",
        city: "Pune",
      });

      expect(page.heroHeadline).toContain("Gym Members");
      expect(page.comparisonPoints.some((c) => c.problem.includes("trial workout"))).toBe(true);
      expect(page.recommendedPackage.id).toBe("prod_growth_bundle");
    });
  });

  describe("3. Acceptance Test 3: Problem-Specific Campaign ('Businesses without online booking')", () => {
    it("diagnoses missing booking CTA and pairs with Instant Booking Engine", () => {
      const dummyLead: CanonicalLead = {
        id: "lead_clinic_102",
        canonicalName: "Baner Skin & Laser",
        city: "Pune",
        country: "IN",
        icpScore: 75,
        crmStage: "discovered",
        confidenceScore: 0.9,
        primarySource: "website",
        identities: [],
        opportunities: [],
        scoreBreakdown: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const diagnoses = solutionMatchingAgent.diagnoseAndMatch(dummyLead);
      const bookingMatch = diagnoses.find((d) => d.recommendedDocodoSolution.id === "prod_booking_engine");
      expect(bookingMatch).toBeDefined();
      expect(bookingMatch?.problem).toContain("online booking");
    });
  });

  describe("4. Acceptance Test 4: Outcome-First Sales Strategy ('I want to get more customers')", () => {
    it("recommends appropriate solution without blindly pitching most expensive package", () => {
      const allProducts = productCatalogAgent.getAllProducts();
      expect(allProducts.length).toBeGreaterThanOrEqual(4);

      // Check that WhatsApp AI matches inquiry-loss problem specifically
      const matched = productCatalogAgent.findProductsByNeed(["inquiries", "reply delays", "dm"]);
      expect(matched.length).toBeGreaterThan(0);
      expect(matched[0].id).toBe("prod_whatsapp_ai");
    });
  });

  describe("5. Autonomy Governance & Pricing Guardrails", () => {
    it("enforces explicit approval for high-risk actions and excessive discounts", () => {
      // High-risk action (payment modification or direct credit debit)
      const highRiskPermit = autonomyController.evaluateActionPermission("MODIFY_STRIPE_PAYMENT", "HIGH_RISK");
      expect(highRiskPermit.canAutoExecute).toBe(false);
      expect(highRiskPermit.requiresExplicitHumanApproval).toBe(true);

      // Low-risk action (background intelligence query)
      const lowRiskPermit = autonomyController.evaluateActionPermission("SCAN_PUBLIC_WEBSITE", "LOW_RISK");
      expect(lowRiskPermit.canAutoExecute).toBe(true);

      // Excessive discount check (e.g. 40% discount when max allowed is 15%)
      const quote = pricingAgent.calculateQuote("prod_whatsapp_ai", "MONTHLY", 40);
      expect(quote.requiresFounderApproval).toBe(true);
      expect(quote.approvalReason).toContain("exceeds product limit");
    });
  });
});
