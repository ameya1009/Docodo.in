"use server";

import { contentEngine, DocodoPillar } from "../../growth-os/agents/ContentEngine";

export async function generate30DaySuiteAction(industry: string = "Salon & Spa") {
  try {
    const plans = contentEngine.generate30DayOmnichannelSuite(industry);
    return { success: true, plans };
  } catch (error: any) {
    return { success: false, error: error?.message || "Content generation failed" };
  }
}

export async function adaptIdeaAction(idea: string, pillar: DocodoPillar) {
  try {
    const plan = contentEngine.adaptSingleIdea(idea, pillar);
    return { success: true, plan };
  } catch (error: any) {
    return { success: false, error: error?.message || "Idea adaptation failed" };
  }
}
