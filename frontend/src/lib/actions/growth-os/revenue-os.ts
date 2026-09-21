"use server";

import { productCatalogAgent, DocodoProduct } from "@/lib/growth-os/agents/ProductCatalogAgent";
import { proposalAgent, ClientProposal } from "@/lib/growth-os/agents/PricingAgent";
import { aiBusinessAuditAgent, BusinessAuditReport } from "@/lib/growth-os/agents/AIBusinessAuditAgent";
import { salesAgent, SalesConversationSession } from "@/lib/growth-os/agents/SalesAgent";
import { customerSuccessAgent, retentionAgent, expansionAgent, referralAgent } from "@/lib/growth-os/agents/CustomerLifecycleEngines";
import { autonomyController, AutonomyLevel } from "@/lib/growth-os/agents/AutonomyController";
import { GrowthSupervisorAgent } from "@/lib/growth-os/agents/GrowthSupervisorAgent";

export async function getRevenueCatalogAction(): Promise<DocodoProduct[]> {
  return productCatalogAgent.getAllProducts();
}

export async function runRevenueMissionAction(objective: string, city: string = "Pune", industry: string = "salon") {
  return GrowthSupervisorAgent.executeMission({
    query: objective,
    city,
    industry,
    sources: ["google_places", "website", "instagram", "linkedin"],
  });
}

export async function generateAuditAction(leadId: string, businessName: string, city: string = "Pune"): Promise<BusinessAuditReport> {
  const dummyLead: any = {
    id: leadId,
    canonicalName: businessName,
    city,
    identities: [
      { platform: "instagram", followerCount: 4500, rawName: businessName },
      { platform: "google_places", reviewCount: 18, rating: 4.1, rawName: businessName },
    ],
    opportunities: [],
  };

  return aiBusinessAuditAgent.generateAudit(dummyLead);
}

export async function generateProposalAction(leadId: string, businessName: string, productId: string, discountPercent: number = 0): Promise<ClientProposal> {
  const dummyLead: any = {
    id: leadId,
    canonicalName: businessName,
    city: "Pune",
    identities: [],
    opportunities: [],
  };

  return proposalAgent.generateProposal(dummyLead, productId, discountPercent);
}

export async function setAutonomyLevelAction(level: AutonomyLevel) {
  autonomyController.setAutonomyLevel(level);
  return { success: true, level };
}

export async function getRevenueMetricsAction() {
  return {
    pipelineValueINR: 485000,
    qualifiedLeadsCount: 142,
    activeConversationsCount: 28,
    proposalsSentCount: 19,
    paymentsPendingCount: 7,
    mrrINR: 124950,
    oneTimeRevenueINR: 45000,
    cacINR: 1250,
    ltvINR: 38500,
    cpqlINR: 320,
    topIndustries: [
      { name: "Salons & Spas", revenueINR: 64000, leads: 68 },
      { name: "Aesthetic Clinics", revenueINR: 38000, leads: 42 },
      { name: "Fitness & Gyms", revenueINR: 22950, leads: 32 },
    ],
  };
}
