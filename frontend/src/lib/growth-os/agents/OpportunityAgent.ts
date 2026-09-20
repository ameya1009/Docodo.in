import { CanonicalLead, OpportunitySignal } from "./types";
import { intentAgent, IntentMapping } from "./IntentAgent";

export type { IntentMapping };

export class OpportunityAgent {
  public evaluateLeadOpportunities(lead: CanonicalLead): OpportunitySignal[] {
    const opportunities: OpportunitySignal[] = [];

    // 1. Evaluate Website & Booking Funnel
    if (!lead.normalizedDomain) {
      opportunities.push({
        id: `opp_${Date.now()}_1`,
        problem: "No verified website or direct online booking portal found",
        evidence: "Business operates purely on manual phone calls with no interactive web presence.",
        source: lead.primarySource,
        recommendedSolution: "Launch a custom Docodo AI storefront with integrated booking in < 5 minutes.",
        recommendedProduct: "Docodo AI Storefront",
        confidence: 0.95,
        status: "OPEN",
      });
    }

    // 2. Evaluate WhatsApp / Lead Capture
    if (lead.normalizedPhone) {
      opportunities.push({
        id: `opp_${Date.now()}_2`,
        problem: "Potential lead leakage from unautomated WhatsApp & phone inquiries",
        evidence: `Phone ${lead.normalizedPhone} verified across listings without automated WhatsApp receptionist.`,
        source: "whatsapp",
        recommendedSolution: "Connect Docodo 24/7 AI Receptionist for instant bookings and inquiry resolution.",
        recommendedProduct: "WhatsApp AI Receptionist",
        confidence: 0.92,
        status: "OPEN",
      });
    }

    // 3. Evaluate Social Presence vs Conversion
    const igIdentity = lead.identities.find((i) => i.platform === "instagram");
    if (igIdentity && (igIdentity.followerCount || 0) > 1000) {
      opportunities.push({
        id: `opp_${Date.now()}_3`,
        problem: "Strong social audience without conversion infrastructure",
        evidence: `Instagram account has ${igIdentity.followerCount} followers but relies on manual DM booking.`,
        source: "instagram",
        recommendedSolution: "Deploy Instagram DM link-to-booking automation + WhatsApp sync.",
        recommendedProduct: "Instant Booking & Calendar Sync",
        confidence: 0.94,
        status: "OPEN",
      });
    }

    // 4. Evaluate Google Reviews / Local SEO
    const googleIdentity = lead.identities.find((i) => i.platform === "google_places");
    if (googleIdentity && (googleIdentity.reviewCount || 0) < 50) {
      opportunities.push({
        id: `opp_${Date.now()}_4`,
        problem: "Low Google Review volume hurting local search discoverability",
        evidence: `Google listing currently has only ${googleIdentity.reviewCount || 0} reviews with ${googleIdentity.rating || 4.0} rating.`,
        source: "google_places",
        recommendedSolution: "Implement automated post-appointment WhatsApp review collection flow.",
        recommendedProduct: "Google Review & Local SEO Engine",
        confidence: 0.91,
        status: "OPEN",
      });
    }

    lead.opportunities = opportunities;
    return opportunities;
  }

  public static mapOpportunity(input: {
    businessName: string;
    problems: string[];
  }): Array<{ problem: string; recommendedProduct: string; confidence: number }> {
    return input.problems.map((p) => ({
      problem: p,
      recommendedProduct: "Booking System + WhatsApp AI Receptionist",
      confidence: 0.95,
    }));
  }
}

export const opportunityAgent = new OpportunityAgent();
