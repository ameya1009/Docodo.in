"use server";

import { omnichannelDiscoveryAgent } from "../../growth-os/agents/OmnichannelDiscoveryAgent";
import { entityResolutionAgent } from "../../growth-os/agents/EntityResolutionAgent";
import { DiscoveryQuery, PlatformSource } from "../../growth-os/adapters/types";

export async function runDiscoveryAction(
  query: DiscoveryQuery,
  enabledSources?: PlatformSource[]
) {
  try {
    const { records, progress } = await omnichannelDiscoveryAgent.executeDiscovery(query, enabledSources);
    const resolvedLeads = entityResolutionAgent.resolveEntities(records);

    return {
      success: true,
      rawCount: records.length,
      resolvedCount: resolvedLeads.length,
      leads: resolvedLeads,
      progress,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Discovery action failed",
      leads: [],
      progress: [],
    };
  }
}
