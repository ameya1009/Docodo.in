"use server";

import {
  runAutonomousGrowthAgent,
  AgentJobRequest,
  AgentExecutionResult,
} from "@/lib/engines/autonomous-agent-swarm";
import { isFounderAuthenticated } from "@/lib/founder-auth";

/**
 * Server Action to dispatch an autonomous agent job
 */
export async function triggerGrowthAgent(
  req: AgentJobRequest
): Promise<{ success: boolean; data?: AgentExecutionResult; error?: string }> {
  try {
    const isAuth = await isFounderAuthenticated();
    if (!isAuth) {
      return { success: false, error: "Unauthorized access to Autonomous Agent Swarm" };
    }

    const result = await runAutonomousGrowthAgent(req);
    return { success: true, data: result };
  } catch (err: any) {
    console.error("[Agent Swarm Action Error]", err);
    return { success: false, error: err?.message || "Failed to run agent job" };
  }
}
