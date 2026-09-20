import { adapterRegistry } from "../adapters/AdapterRegistry";
import { AdCampaignPayload, AdCampaignResult, PlatformSource } from "../adapters/types";

export interface ManagedCampaign {
  id: string;
  name: string;
  platform: PlatformSource;
  objective: "LEAD_GENERATION" | "TRAFFIC" | "CONVERSIONS" | "BRAND_AWARENESS";
  dailyBudget: number;
  monthlyBudgetLimit: number;
  currentSpend: number;
  pauseThresholdSpend?: number;
  adCopy: string;
  headline: string;
  landingPageUrl: string;
  approvalStatus: "REQUIRES_APPROVAL" | "APPROVED" | "REJECTED";
  status: "DRAFT" | "PENDING_APPROVAL" | "ACTIVE" | "PAUSED" | "COMPLETED";
  roas: number;
  cpl: number;
  leadsGenerated: number;
  spendAlerts: string[];
  createdAt: string;
}

export class AdsAgent {
  private campaigns: ManagedCampaign[] = [];
  private readonly DEFAULT_DAILY_BUDGET_CAP = 2500; // INR
  private readonly DEFAULT_MONTHLY_BUDGET_CAP = 30000; // INR

  public createCampaignDraft(
    platform: PlatformSource,
    objective: ManagedCampaign["objective"],
    businessCategory: string,
    city: string = "Pune",
    customDailyBudget?: number,
    customPauseThreshold?: number
  ): ManagedCampaign {
    const dailyBudget = customDailyBudget || 500;
    if (dailyBudget > this.DEFAULT_DAILY_BUDGET_CAP) {
      throw new Error(`Requested daily budget INR ${dailyBudget} exceeds safety threshold (INR ${this.DEFAULT_DAILY_BUDGET_CAP}).`);
    }

    const campaignId = `camp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const headline = `Scale Your ${businessCategory} in ${city} with 24/7 AI Reception`;
    const adCopy = `Tired of losing appointment bookings to missed inquiries? Docodo Growth OS automates WhatsApp scheduling, Google 5-star reviews, and customer re-engagement. Start free today.`;

    const campaign: ManagedCampaign = {
      id: campaignId,
      name: `${businessCategory} Acquisition Campaign — ${city}`,
      platform,
      objective,
      dailyBudget,
      monthlyBudgetLimit: this.DEFAULT_MONTHLY_BUDGET_CAP,
      currentSpend: 0,
      pauseThresholdSpend: customPauseThreshold || dailyBudget * 5,
      adCopy,
      headline,
      landingPageUrl: `https://docodo.in/growth-os?utm_source=${platform}&utm_medium=cpc&utm_campaign=${businessCategory.toLowerCase()}_${city.toLowerCase()}`,
      approvalStatus: "REQUIRES_APPROVAL",
      status: "PENDING_APPROVAL",
      roas: 0,
      cpl: 0,
      leadsGenerated: 0,
      spendAlerts: [],
      createdAt: new Date().toISOString(),
    };

    this.campaigns.push(campaign);
    return campaign;
  }

  public approveCampaign(campaignId: string): ManagedCampaign | null {
    const campaign = this.campaigns.find((c) => c.id === campaignId);
    if (campaign && campaign.approvalStatus === "REQUIRES_APPROVAL") {
      campaign.approvalStatus = "APPROVED";
      campaign.status = "ACTIVE";
      return campaign;
    }
    return null;
  }

  public pauseCampaign(campaignId: string, reason: string = "Manual pause"): ManagedCampaign | null {
    const campaign = this.campaigns.find((c) => c.id === campaignId);
    if (campaign && campaign.status === "ACTIVE") {
      campaign.status = "PAUSED";
      campaign.spendAlerts.push(`Campaign paused: ${reason} at ${new Date().toISOString()}`);
      return campaign;
    }
    return null;
  }

  public checkSpendAlerts(campaignId: string, additionalSpend: number): { alertTriggered: boolean; message?: string } {
    const campaign = this.campaigns.find((c) => c.id === campaignId);
    if (!campaign) return { alertTriggered: false };

    campaign.currentSpend += additionalSpend;

    if (campaign.pauseThresholdSpend && campaign.currentSpend >= campaign.pauseThresholdSpend) {
      this.pauseCampaign(campaignId, `Spend INR ${campaign.currentSpend} reached pause threshold INR ${campaign.pauseThresholdSpend}`);
      return {
        alertTriggered: true,
        message: `Safety Auto-Pause: Campaign ${campaign.name} reached pause threshold spend limit.`,
      };
    }

    if (campaign.currentSpend >= campaign.monthlyBudgetLimit * 0.9) {
      const alert = `Spend Warning: Campaign has reached 90% of monthly budget limit (INR ${campaign.currentSpend}/${campaign.monthlyBudgetLimit}).`;
      campaign.spendAlerts.push(alert);
      return { alertTriggered: true, message: alert };
    }

    return { alertTriggered: false };
  }

  public async launchCampaign(campaignId: string): Promise<AdCampaignResult> {
    const campaign = this.campaigns.find((c) => c.id === campaignId);
    if (!campaign) {
      return { success: false, status: "REJECTED", dailyBudget: 0, error: "Campaign not found" };
    }

    if (campaign.approvalStatus !== "APPROVED") {
      return {
        success: false,
        status: "REJECTED",
        dailyBudget: campaign.dailyBudget,
        error: "Ad campaign blocked: Explicit human approval required before spending ad budget.",
      };
    }

    const adapter = adapterRegistry.getAdapter(campaign.platform);
    if (!adapter || !adapter.createCampaign) {
      return {
        success: false,
        status: "REJECTED",
        dailyBudget: campaign.dailyBudget,
        error: `Platform ${campaign.platform} does not support automated campaign launch.`,
      };
    }

    const payload: AdCampaignPayload = {
      name: campaign.name,
      objective: campaign.objective,
      dailyBudget: campaign.dailyBudget,
      monthlyBudgetLimit: campaign.monthlyBudgetLimit,
      targetAudience: { city: "Pune", industry: "Salons & Clinics" },
      adCopy: campaign.adCopy,
      headline: campaign.headline,
      landingPageUrl: campaign.landingPageUrl,
    };

    const result = await adapter.createCampaign(payload);
    if (result.success) {
      campaign.status = "ACTIVE";
    }
    return result;
  }

  public getCampaigns(): ManagedCampaign[] {
    return [...this.campaigns];
  }

  public static validateBudget(input: {
    dailyBudgetINR: number;
    monthlyBudgetINR: number;
    currentSpendINR: number;
  }): { allowed: boolean; spendAlertTriggered: boolean } {
    const isOverBudget = input.dailyBudgetINR > 2500 || input.currentSpendINR >= input.monthlyBudgetINR;
    const spendAlertTriggered = input.currentSpendINR >= input.monthlyBudgetINR * 0.9;
    return {
      allowed: !isOverBudget,
      spendAlertTriggered,
    };
  }
}

export const adsAgent = new AdsAgent();
