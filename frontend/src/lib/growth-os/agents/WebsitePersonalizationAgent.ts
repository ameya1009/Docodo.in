/**
 * Docodo Autonomous Revenue OS — Website Active Sales & Personalization Agent
 * Adapts Docodo.in landing pages and interactive sales assistants based on visitor industry, bottlenecks, and intent.
 */

import { productCatalogAgent, DocodoProduct } from "./ProductCatalogAgent";

export interface VisitorContext {
  industry?: "salon" | "gym" | "clinic" | "spa" | "restaurant" | "general";
  city?: string;
  hasInstagram?: boolean;
  hasWebsite?: boolean;
  bookingMethod?: "manual_phone" | "whatsapp_dm" | "online_portal";
  primaryProblem?: string;
}

export interface PersonalizedLandingPage {
  heroHeadline: string;
  heroSubheadline: string;
  primaryCTA: string;
  comparisonPoints: Array<{ problem: string; docodoFix: string }>;
  recommendedPackage: DocodoProduct;
  projectedBenefit: string;
}

export class WebsitePersonalizationAgent {
  public getPersonalizedPage(context: VisitorContext): PersonalizedLandingPage {
    const industry = context.industry || "salon";
    const city = context.city || "your city";

    if (industry === "gym") {
      const prod = productCatalogAgent.getProduct("prod_growth_bundle") || productCatalogAgent.getAllProducts()[0];
      return {
        heroHeadline: `Get More Gym Members & Automate Membership Renewals in ${city}`,
        heroSubheadline: `Stop losing trial drop-ins. Docodo captures inquiries from Instagram and Google, schedules gym trials via WhatsApp, and collects recurring membership dues automatically.`,
        primaryCTA: "Launch Your Free 14-Day Gym Trial",
        comparisonPoints: [
          { problem: "Members forget trial workout dates", docodoFix: "Automated WhatsApp trial reminders & 1-tap reschedule" },
          { problem: "Manual membership renewal follow-ups", docodoFix: "Automated payment link notifications before expiry" },
        ],
        recommendedPackage: prod,
        projectedBenefit: "+32% increase in trial workout completion and renewal velocity",
      };
    }

    if (industry === "clinic") {
      const prod = productCatalogAgent.getProduct("prod_booking_engine") || productCatalogAgent.getAllProducts()[0];
      return {
        heroHeadline: `Turn Patient Enquiries Into Confirmed Clinic Appointments in ${city}`,
        heroSubheadline: `Provide patients with a seamless 24/7 online booking portal and automated WhatsApp consultation reminders.`,
        primaryCTA: "Preview Interactive Clinic Booking Flow",
        comparisonPoints: [
          { problem: "Reception phone lines constantly busy", docodoFix: "Patients choose doctor slot online in under 30 seconds" },
          { problem: "High consultation no-show rates", docodoFix: "Pre-appointment WhatsApp confirmation & digital intake forms" },
        ],
        recommendedPackage: prod,
        projectedBenefit: "Eliminate 80% of reception scheduling calls and reduce no-shows to < 5%",
      };
    }

    // Default: Salon / Spa
    const prod = productCatalogAgent.getProduct("prod_whatsapp_ai") || productCatalogAgent.getAllProducts()[0];
    return {
      heroHeadline: `Grow Your Salon Bookings with 24/7 WhatsApp AI in ${city}`,
      heroSubheadline: `Capture every Instagram DM and night-time inquiry automatically. Turn cold visitors into confirmed salon appointments in under 5 seconds.`,
      primaryCTA: "Try 2-Minute Salon Booking Demo",
      comparisonPoints: [
        { problem: "40%+ inquiries arrive after 7 PM when salon is closed", docodoFix: "24/7 AI WhatsApp assistant answers and books slots instantly" },
        { problem: "Slow replies to Instagram DMs", docodoFix: "Instant link-in-bio to interactive booking menu" },
      ],
      recommendedPackage: prod,
      projectedBenefit: "+₹45,000 to ₹80,000/mo in previously lost after-hours appointment revenue",
    };
  }
}

export const websitePersonalizationAgent = new WebsitePersonalizationAgent();
