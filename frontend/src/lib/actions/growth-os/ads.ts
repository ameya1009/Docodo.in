"use server";

import { adsAgent, ManagedCampaign } from "../../growth-os/agents/AdsAgent";
import { PlatformSource } from "../../growth-os/adapters/types";

export async function createAdCampaignAction(
  platform: PlatformSource,
  objective: ManagedCampaign["objective"],
  businessCategory: string,
  city: string = "Pune",
  dailyBudget?: number
) {
  try {
    const campaign = adsAgent.createCampaignDraft(platform, objective, businessCategory, city, dailyBudget);
    return { success: true, campaign };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to create ad campaign" };
  }
}

export async function approveAndLaunchCampaignAction(campaignId: string) {
  try {
    const approved = adsAgent.approveCampaign(campaignId);
    if (!approved) return { success: false, error: "Campaign not found" };

    const launchResult = await adsAgent.launchCampaign(campaignId);
    return { success: launchResult.success, campaign: approved, result: launchResult };
  } catch (error: any) {
    return { success: false, error: error?.message || "Campaign launch failed" };
  }
}
