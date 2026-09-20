"use server";

import { growthSupervisorAgent, SupervisorObjectiveInput } from "../../growth-os/agents/GrowthSupervisorAgent";

export async function runSupervisorMissionAction(input: SupervisorObjectiveInput) {
  try {
    const plan = await growthSupervisorAgent.executeMission(input);
    return { success: true, plan };
  } catch (error: any) {
    return { success: false, error: error?.message || "Supervisor mission execution failed" };
  }
}
