"use server";

import { leadGraphEngine } from "../../growth-os/agents/LeadGraphEngine";
import { CanonicalLead } from "../../growth-os/agents/types";

export async function getLeadGraphAction(lead: CanonicalLead) {
  try {
    const graph = leadGraphEngine.buildLeadGraph(lead);
    return { success: true, graph };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to generate lead graph" };
  }
}
