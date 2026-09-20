import { OpportunitySignal } from "./types";

export interface IntentMapping {
  phrase: string;
  detectedProblem: string;
  solution: string;
  docodoProduct: OpportunitySignal["recommendedProduct"];
  defaultConfidence: number;
}

export class IntentAgent {
  private static intentRules: IntentMapping[] = [
    {
      phrase: "i need more customers",
      detectedProblem: "Stagnant lead generation & low customer acquisition",
      solution: "Deploy omnichannel discovery, local SEO, and AI ad funnels.",
      docodoProduct: "Docodo Omnichannel CRM & Nurturing",
      defaultConfidence: 0.95,
    },
    {
      phrase: "website doesn't generate bookings",
      detectedProblem: "Poor website conversion and missing automated booking funnel",
      solution: "Deploy instant Docodo AI Storefront with embedded live scheduling.",
      docodoProduct: "Docodo AI Storefront",
      defaultConfidence: 0.94,
    },
    {
      phrase: "improve google visibility",
      detectedProblem: "Weak local SEO and low review count on Google Maps",
      solution: "Automate post-visit review generation and GBP optimization.",
      docodoProduct: "Google Review & Local SEO Engine",
      defaultConfidence: 0.92,
    },
    {
      phrase: "lose leads because nobody follows up",
      detectedProblem: "Delayed lead response time and unorganized CRM pipeline",
      solution: "Implement autonomous instant multi-channel lead follow-up.",
      docodoProduct: "Docodo Omnichannel CRM & Nurturing",
      defaultConfidence: 0.96,
    },
    {
      phrase: "need whatsapp automation",
      detectedProblem: "Manual WhatsApp management causing missed client bookings",
      solution: "Install Docodo 24/7 WhatsApp AI receptionist with live calendar sync.",
      docodoProduct: "WhatsApp AI Receptionist",
      defaultConfidence: 0.98,
    },
  ];

  public detectIntent(inputText: string): IntentMapping | null {
    const clean = inputText.toLowerCase();
    for (const rule of IntentAgent.intentRules) {
      if (clean.includes(rule.phrase)) {
        return rule;
      }
    }
    // Partial keyword fallback
    if (clean.includes("whatsapp")) {
      return IntentAgent.intentRules[4];
    }
    if (clean.includes("website") || clean.includes("booking")) {
      return IntentAgent.intentRules[1];
    }
    if (clean.includes("review") || clean.includes("google")) {
      return IntentAgent.intentRules[2];
    }
    if (clean.includes("lead") || clean.includes("customer")) {
      return IntentAgent.intentRules[0];
    }
    return null;
  }

  public static detectIntent(inputText: string): { category: string; confidence: number; mapping: IntentMapping | null } {
    const res = intentAgent.detectIntent(inputText);
    let category = "general";
    if (res?.docodoProduct === "Docodo AI Storefront") category = "website_conversion";
    else if (res?.docodoProduct === "WhatsApp AI Receptionist") category = "whatsapp_automation";
    else if (res?.docodoProduct === "Google Review & Local SEO Engine") category = "local_seo";
    else if (res?.docodoProduct === "Docodo Omnichannel CRM & Nurturing") category = "lead_generation";

    return {
      category,
      confidence: res?.defaultConfidence || 0.8,
      mapping: res,
    };
  }
}

export const intentAgent = new IntentAgent();
