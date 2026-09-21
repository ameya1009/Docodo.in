/**
 * Docodo Autonomous Revenue OS — Solution Matching Engine
 * Takes business research signals, diagnoses operational bottlenecks, and matches exact Docodo solutions.
 */

import { productCatalogAgent, DocodoProduct } from "./ProductCatalogAgent";
import { CanonicalLead } from "./types";

export interface SolutionMatchDiagnosis {
  problem: string;
  evidence: string;
  businessImpact: string;
  recommendedDocodoSolution: DocodoProduct;
  whyThisSolution: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  confidence: number;
  estimatedValueMonthlyINR: number;
}

export class SolutionMatchingAgent {
  public diagnoseAndMatch(lead: CanonicalLead): SolutionMatchDiagnosis[] {
    const diagnoses: SolutionMatchDiagnosis[] = [];

    // 1. Check for missing online booking CTA or manual DM workflow
    const hasWebsite = Boolean(lead.normalizedDomain);
    const hasPhone = Boolean(lead.normalizedPhone);
    const igIdentity = lead.identities.find((i) => i.platform === "instagram");
    const googleIdentity = lead.identities.find((i) => i.platform === "google_places");

    // Diagnosis 1: Ineffective social-to-booking conversion
    if (igIdentity && !hasWebsite) {
      const prod = productCatalogAgent.getProduct("prod_whatsapp_ai") || productCatalogAgent.getAllProducts()[0];
      diagnoses.push({
        problem: "Social attention is not efficiently converted into bookings",
        evidence: `Active Instagram presence with ${igIdentity.followerCount || "established"} followers, but inquiries are directed to manual DM or unlinked calls.`,
        businessImpact: "Up to 40% of interested prospects abandon inquiry due to delayed DM replies and friction.",
        recommendedDocodoSolution: prod,
        whyThisSolution: "WhatsApp AI Receptionist instantly converts social DM traffic into confirmed appointments 24/7 without manual staff delays.",
        priority: "HIGH",
        confidence: 0.94,
        estimatedValueMonthlyINR: 45000,
      });
    }

    // Diagnosis 2: Missing online booking infrastructure
    if (!hasWebsite || (hasWebsite && !lead.opportunities.some((o) => o.recommendedProduct.includes("Booking")))) {
      const prod = productCatalogAgent.getProduct("prod_booking_engine") || productCatalogAgent.getAllProducts()[0];
      diagnoses.push({
        problem: "No interactive online booking storefront found",
        evidence: "Business lacks a 24/7 self-service scheduling portal for slot selection and confirmations.",
        businessImpact: "Staff wastes 10+ hours per week manually texting open slots back-and-forth; high no-show risk.",
        recommendedDocodoSolution: prod,
        whyThisSolution: "Enables instant slot selection with automated calendar sync and WhatsApp reminders to reduce no-shows.",
        priority: "HIGH",
        confidence: 0.92,
        estimatedValueMonthlyINR: 35000,
      });
    }

    // Diagnosis 3: Low review count / weak local search ranking
    if (googleIdentity && (googleIdentity.reviewCount || 0) < 50) {
      const prod = productCatalogAgent.getProduct("prod_review_seo") || productCatalogAgent.getAllProducts()[0];
      diagnoses.push({
        problem: "Low Google Review volume hurting local search discovery",
        evidence: `Google listing currently has only ${googleIdentity.reviewCount || 0} reviews (${googleIdentity.rating || 4.0} rating).`,
        businessImpact: "Competitors with 50+ reviews capture the top 3 spots on Google Maps, stealing local customer search traffic.",
        recommendedDocodoSolution: prod,
        whyThisSolution: "Automates post-visit review collection via WhatsApp to systematically build 5-star Google authority.",
        priority: "MEDIUM",
        confidence: 0.91,
        estimatedValueMonthlyINR: 25000,
      });
    }

    // If multiple bottlenecks exist, recommend the All-In-One Growth Bundle
    if (diagnoses.length >= 2) {
      const bundle = productCatalogAgent.getProduct("prod_growth_bundle");
      if (bundle) {
        diagnoses.unshift({
          problem: "Fragmented customer acquisition, scheduling, and retention systems",
          evidence: "Simultaneous friction in social conversion, lack of online booking, and under-utilized customer follow-ups.",
          businessImpact: "Revenue leak across both new acquisition and repeat client retention.",
          recommendedDocodoSolution: bundle,
          whyThisSolution: "Docodo Complete Local Growth OS consolidates Website Storefront, 24/7 WhatsApp AI, and Review Automation into one high-ROI system.",
          priority: "HIGH",
          confidence: 0.96,
          estimatedValueMonthlyINR: 85000,
        });
      }
    }

    return diagnoses;
  }
}

export const solutionMatchingAgent = new SolutionMatchingAgent();
