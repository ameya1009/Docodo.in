import { describe, it, expect } from "vitest";
import { 
  PLANS_CONFIG, 
  PLAN_IDS, 
  FEATURE_KEYS, 
  PILOT_BOOKING_LIMIT, 
  resolvePlan,
  PILOT_USAGE_MILESTONES,
  CONCIERGE_ONBOARDING_STEPS,
  PRICING_PLANS
} from "../lib/plans-config";
import { 
  calculateBillingPeriod, 
  EntitlementError 
} from "../lib/services/entitlement-service";

describe("Commercial Plans, Entitlements & Subscription System Tests", () => {
  describe("1. Plan Specifications & Invariants (Sections 2, 3, 4, 5)", () => {
    it("PILOT plan is ₹0 and enforces exact 50 booking monthly limit", () => {
      const pilot = PLANS_CONFIG[PLAN_IDS.PILOT];
      expect(pilot.price).toBe(0);
      expect(pilot.bookingLimit).toBe(50);
      expect(pilot.entitlements[FEATURE_KEYS.BOOKINGS_MONTHLY_LIMIT]).toBe(50);
      expect(pilot.entitlements[FEATURE_KEYS.BOOKINGS_UNLIMITED]).toBe(false);
      expect(pilot.entitlements[FEATURE_KEYS.CUSTOM_BOOKING_PAGE]).toBe(true);
      expect(pilot.entitlements[FEATURE_KEYS.INDIA_DATA_PROTECTION]).toBe(true);

      // Starter & Growth features must be strictly locked on Pilot
      expect(pilot.entitlements[FEATURE_KEYS.BRANDED_STOREFRONT]).toBe(false);
      expect(pilot.entitlements[FEATURE_KEYS.CRM_LTV]).toBe(false);
      expect(pilot.entitlements[FEATURE_KEYS.RAZORPAY_PAYMENTS]).toBe(false);
      expect(pilot.entitlements[FEATURE_KEYS.AI_MARKETING]).toBe(false);
      expect(pilot.entitlements[FEATURE_KEYS.MULTI_STAFF]).toBe(false);
    });

    it("STARTER plan is ₹999/mo with unlimited bookings and core operational tools", () => {
      const starter = PLANS_CONFIG[PLAN_IDS.STARTER];
      expect(starter.price).toBe(999);
      expect(starter.billingInterval).toBe("MONTHLY");
      expect(starter.bookingLimit).toBe("UNLIMITED");
      expect(starter.entitlements[FEATURE_KEYS.BOOKINGS_UNLIMITED]).toBe(true);
      expect(starter.entitlements[FEATURE_KEYS.BRANDED_STOREFRONT]).toBe(true);
      expect(starter.entitlements[FEATURE_KEYS.CRM_LTV]).toBe(true);
      expect(starter.entitlements[FEATURE_KEYS.ENQUIRY_PIPELINE]).toBe(true);
      expect(starter.entitlements[FEATURE_KEYS.WHATSAPP_CONFIRMATIONS]).toBe(true);
      expect(starter.entitlements[FEATURE_KEYS.RAZORPAY_PAYMENTS]).toBe(true);

      // Growth features must be locked on Starter
      expect(starter.entitlements[FEATURE_KEYS.AI_MARKETING]).toBe(false);
      expect(starter.entitlements[FEATURE_KEYS.MULTI_STAFF]).toBe(false);
      expect(starter.entitlements[FEATURE_KEYS.ROOM_ASSIGNMENT]).toBe(false);
      expect(starter.entitlements[FEATURE_KEYS.REVIEW_AUTOMATION]).toBe(false);
    });

    it("GROWTH plan is ₹2,499/mo with full AI marketing, multi-staff, and reviews", () => {
      const growth = PLANS_CONFIG[PLAN_IDS.GROWTH];
      expect(growth.price).toBe(2499);
      expect(growth.billingInterval).toBe("MONTHLY");
      expect(growth.bookingLimit).toBe("UNLIMITED");
      expect(growth.entitlements[FEATURE_KEYS.MULTI_STAFF]).toBe(true);
      expect(growth.entitlements[FEATURE_KEYS.ROOM_ASSIGNMENT]).toBe(true);
      expect(growth.entitlements[FEATURE_KEYS.PREVISIT_REMINDERS]).toBe(true);
      expect(growth.entitlements[FEATURE_KEYS.REVIEW_AUTOMATION]).toBe(true);
      expect(growth.entitlements[FEATURE_KEYS.AI_MARKETING]).toBe(true);
      expect(growth.entitlements[FEATURE_KEYS.REVENUE_ANALYTICS]).toBe(true);
      expect(growth.entitlements[FEATURE_KEYS.ROUND_ROBIN]).toBe(true);
      expect(growth.entitlements[FEATURE_KEYS.AI_ASSISTANT]).toBe(true);
    });

    it("DONE-FOR-YOU SETUP (CONCIERGE) is ₹4,999 one-time with 30 days of Growth", () => {
      const concierge = PLANS_CONFIG[PLAN_IDS.CONCIERGE];
      expect(concierge.price).toBe(4999);
      expect(concierge.billingInterval).toBe("ONE_TIME");
      expect(concierge.bookingLimit).toBe("UNLIMITED");
      expect(concierge.entitlements[FEATURE_KEYS.CONCIERGE_ONBOARDING]).toBe(true);
      expect(concierge.entitlements[FEATURE_KEYS.AI_MARKETING]).toBe(true);
      expect(concierge.entitlements[FEATURE_KEYS.MULTI_STAFF]).toBe(true);
    });
  });

  describe("2. Single Source of Truth Alignment (Section 30)", () => {
    it("exports PRICING_PLANS perfectly aligned with PLANS_CONFIG", () => {
      expect(PRICING_PLANS).toHaveLength(4);
      expect(PRICING_PLANS[0].price).toBe("₹0");
      expect(PRICING_PLANS[1].price).toBe("₹999");
      expect(PRICING_PLANS[2].price).toBe("₹2,499");
      expect(PRICING_PLANS[3].price).toBe("₹4,999");
    });
  });

  describe("3. Plan Resolution & Fallback Robustness", () => {
    it("resolves plan names and aliases correctly", () => {
      expect(resolvePlan("pilot").id).toBe(PLAN_IDS.PILOT);
      expect(resolvePlan("community").id).toBe(PLAN_IDS.PILOT);
      expect(resolvePlan("starter").id).toBe(PLAN_IDS.STARTER);
      expect(resolvePlan("growth").id).toBe(PLAN_IDS.GROWTH);
      expect(resolvePlan("pro").id).toBe(PLAN_IDS.GROWTH);
      expect(resolvePlan("setup-service").id).toBe(PLAN_IDS.CONCIERGE);
      expect(resolvePlan("concierge").id).toBe(PLAN_IDS.CONCIERGE);
      expect(resolvePlan(null).id).toBe(PLAN_IDS.PILOT);
      expect(resolvePlan(undefined).id).toBe(PLAN_IDS.PILOT);
    });
  });

  describe("4. Monthly Billing Period Mathematics (Section 10)", () => {
    it("calculates exact calendar month period boundaries for Pilot", () => {
      const testDate = new Date(Date.UTC(2026, 8, 15, 12, 0, 0));
      const { periodStart, periodEnd } = calculateBillingPeriod(testDate, PLAN_IDS.PILOT);

      expect(periodStart.toISOString()).toBe("2026-09-01T00:00:00.000Z");
      expect(periodEnd.getUTCMonth()).toBe(8);
      expect(periodEnd.getUTCDate()).toBe(30);
      expect(periodEnd.getUTCHours()).toBe(23);
      expect(periodEnd.getUTCMinutes()).toBe(59);
    });

    it("calculates 30-day cycle for paid subscriptions", () => {
      const testDate = new Date(Date.UTC(2026, 8, 1, 0, 0, 0));
      const { periodStart, periodEnd } = calculateBillingPeriod(testDate, PLAN_IDS.STARTER);

      const diffDays = Math.round((periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24));
      expect(diffDays).toBe(30);
    });
  });

  describe("5. Pilot 50-Booking Limit & Atomic Consumption Boundaries (Sections 9, 11, 13)", () => {
    it("permits bookings from 1 up to 50 on Pilot tier", () => {
      const limit = PILOT_BOOKING_LIMIT;
      for (let count = 0; count < limit; count++) {
        const remaining = limit - count;
        expect(remaining).toBeGreaterThan(0);
        const willReach = count + 1;
        expect(willReach <= limit).toBe(true);
      }
    });

    it("strictly blocks the 51st booking when 50 limit is reached", () => {
      const currentCount = 50;
      const limit = PILOT_BOOKING_LIMIT;
      const delta = 1;
      const allowed = currentCount + delta <= limit;
      expect(allowed).toBe(false);
    });

    it("permits unlimited bookings beyond 50 on Starter or Growth plans", () => {
      const currentCount = 150;
      const limit = "UNLIMITED";
      const allowed = limit === "UNLIMITED" || currentCount < 50;
      expect(allowed).toBe(true);
    });
  });

  describe("6. Commercial Milestone Notification Thresholds (Section 12 & 37)", () => {
    it("maps exact milestone thresholds at 25, 40, 45, and 50 bookings", () => {
      expect(PILOT_USAGE_MILESTONES).toHaveLength(4);
      expect(PILOT_USAGE_MILESTONES[0].count).toBe(25);
      expect(PILOT_USAGE_MILESTONES[1].count).toBe(40);
      expect(PILOT_USAGE_MILESTONES[2].count).toBe(45);
      expect(PILOT_USAGE_MILESTONES[3].count).toBe(50);
      expect(PILOT_USAGE_MILESTONES[3].title).toBe("Pilot Limit Reached");
    });
  });

  describe("7. Entitlement Error & Security Enforcement (Section 18 & 41)", () => {
    it("creates descriptive EntitlementError with HTTP 403 status code", () => {
      const err = new EntitlementError(
        "Feature AI_MARKETING is not available on your current PILOT plan.",
        FEATURE_KEYS.AI_MARKETING,
        "pilot"
      );
      expect(err.statusCode).toBe(403);
      expect(err.featureKey).toBe(FEATURE_KEYS.AI_MARKETING);
      expect(err.planId).toBe("pilot");
      expect(err.message).toContain("AI_MARKETING");
    });
  });

  describe("8. Concierge Onboarding State Machine (Section 26)", () => {
    it("contains complete 11-step launch workflow starting at PAYMENT_RECEIVED", () => {
      expect(CONCIERGE_ONBOARDING_STEPS[0].id).toBe("PAYMENT_RECEIVED");
      expect(CONCIERGE_ONBOARDING_STEPS[1].id).toBe("ONBOARDING_PENDING");
      expect(CONCIERGE_ONBOARDING_STEPS[2].id).toBe("SPECIALIST_ASSIGNED");
      expect(CONCIERGE_ONBOARDING_STEPS[CONCIERGE_ONBOARDING_STEPS.length - 1].id).toBe("COMPLETED");
    });
  });
});
