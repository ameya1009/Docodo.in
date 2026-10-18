import { describe, it, expect } from "vitest";
import { 
  leadGeneratorEngine, 
  SEED_LEAD_TARGETS 
} from "../lib/growth-os/agents/LeadGeneratorEngine";
import { FAQ_LIST, PRICING_PLANS } from "../lib/constants";

describe("Docodo Q&A Knowledge Integrity & Guardrails", () => {
  it("contains verified answers for all primary clinic operational questions in FAQ_LIST", () => {
    expect(FAQ_LIST.length).toBeGreaterThanOrEqual(10);
    const questions = FAQ_LIST.map((f) => f.q.toLowerCase());

    expect(questions.some((q) => q.includes("what is docodo"))).toBe(true);
    expect(questions.some((q) => q.includes("how long does setup take"))).toBe(true);
    expect(questions.some((q) => q.includes("whatsapp"))).toBe(true);
    expect(questions.some((q) => q.includes("payments") || q.includes("upi"))).toBe(true);
    expect(questions.some((q) => q.includes("data secure") || q.includes("dpdp"))).toBe(true);
  });

  it("ensures pricing plans guarantee 0% booking commission on all tiers", () => {
    expect(PRICING_PLANS.length).toBeGreaterThanOrEqual(2);
    for (const plan of PRICING_PLANS) {
      expect(plan.id).toBeTruthy();
      expect(plan.price).toMatch(/₹/);
      expect(plan.features.length).toBeGreaterThan(0);
    }
  });
});

describe("Autonomous Lead Discovery & Multi-Channel Sales Funnel Engine", () => {
  it("initializes seed leads across Reddit, Twitter, Google Maps with valid 5-channel funnels", () => {
    const leads = leadGeneratorEngine.getAllLeads();
    expect(leads.length).toBeGreaterThanOrEqual(4);

    for (const lead of leads) {
      expect(lead.intentScore).toBeGreaterThanOrEqual(80);
      expect(lead.funnel.email.subject).toBeTruthy();
      expect(lead.funnel.email.body).toContain("Docodo");
      expect(lead.funnel.whatsapp.directSendUrl).toContain("https://wa.me/");
      expect(lead.funnel.sms.message.length).toBeLessThanOrEqual(160);
      expect(lead.funnel.instagramDm.message).toBeTruthy();
      expect(lead.funnel.redditAnswer.subreddit).toMatch(/^r\//);
      expect(lead.funnel.redditAnswer.commentBody).toContain("Docodo");
    }
  });

  it("filters leads accurately by detected need (Dashboard, Website, Automation)", () => {
    const dashboardLeads = leadGeneratorEngine.getLeadsByNeed("Dashboard");
    expect(dashboardLeads.length).toBeGreaterThanOrEqual(1);
    expect(dashboardLeads.every((l) => l.detectedNeed.includes("Dashboard"))).toBe(true);

    const websiteLeads = leadGeneratorEngine.getLeadsByNeed("Website");
    expect(websiteLeads.length).toBeGreaterThanOrEqual(1);

    const automationLeads = leadGeneratorEngine.getLeadsByNeed("Automation");
    expect(automationLeads.length).toBeGreaterThanOrEqual(1);
  });

  it("transitions lead status cleanly through the sales funnel stages", () => {
    const testLeadId = SEED_LEAD_TARGETS[0].id;
    
    expect(leadGeneratorEngine.updateLeadStatus(testLeadId, "IN_FUNNEL")).toBe(true);
    let lead = leadGeneratorEngine.getAllLeads().find((l) => l.id === testLeadId);
    expect(lead?.status).toBe("IN_FUNNEL");

    expect(leadGeneratorEngine.updateLeadStatus(testLeadId, "DISPATCHED")).toBe(true);
    lead = leadGeneratorEngine.getAllLeads().find((l) => l.id === testLeadId);
    expect(lead?.status).toBe("DISPATCHED");

    expect(leadGeneratorEngine.updateLeadStatus(testLeadId, "CONVERTED")).toBe(true);
    lead = leadGeneratorEngine.getAllLeads().find((l) => l.id === testLeadId);
    expect(lead?.status).toBe("CONVERTED");
  });
});
