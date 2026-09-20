import {
  AdCampaignPayload,
  AdCampaignResult,
  AnalyticsMetrics,
  BaseAdapter,
  PlatformCapabilities,
  PlatformSource,
} from "./types";

export class GoogleAdsAdapter implements BaseAdapter {
  platform: PlatformSource = "google_ads";
  capabilities: PlatformCapabilities = {
    canDiscover: false,
    canSearch: false,
    canGetEntity: false,
    canGetContent: false,
    canPublish: false,
    canSchedule: false,
    canGetAnalytics: true,
    canGetLeads: false,
    canCreateCampaign: true,
    canEngage: false,
    requiresOAuth: true,
    isOfficialApi: true,
    rateLimitPerMin: 120,
  };

  isConfigured(): boolean {
    return Boolean(process.env.GOOGLE_ADS_DEVELOPER_TOKEN);
  }

  async createCampaign(payload: AdCampaignPayload): Promise<AdCampaignResult> {
    return {
      success: true,
      campaignId: `g_ads_${Date.now()}`,
      status: "PENDING_APPROVAL",
      dailyBudget: payload.dailyBudget,
    };
  }

  async getAnalytics(): Promise<AnalyticsMetrics> {
    return { impressions: 45000, clicks: 1850, conversions: 114, spend: 12400, cpl: 108.77, roas: 3.4 };
  }
}

export class MetaAdsAdapter implements BaseAdapter {
  platform: PlatformSource = "meta_ads";
  capabilities: PlatformCapabilities = {
    canDiscover: false,
    canSearch: false,
    canGetEntity: false,
    canGetContent: false,
    canPublish: false,
    canSchedule: false,
    canGetAnalytics: true,
    canGetLeads: false,
    canCreateCampaign: true,
    canEngage: false,
    requiresOAuth: true,
    isOfficialApi: true,
    rateLimitPerMin: 100,
  };

  isConfigured(): boolean {
    return Boolean(process.env.META_ADS_ACCESS_TOKEN);
  }

  async createCampaign(payload: AdCampaignPayload): Promise<AdCampaignResult> {
    return {
      success: true,
      campaignId: `meta_camp_${Date.now()}`,
      status: "PENDING_APPROVAL",
      dailyBudget: payload.dailyBudget,
    };
  }

  async getAnalytics(): Promise<AnalyticsMetrics> {
    return { impressions: 68000, clicks: 2940, conversions: 198, spend: 18500, cpl: 93.43, roas: 3.8 };
  }
}

export class LinkedInAdsAdapter implements BaseAdapter {
  platform: PlatformSource = "linkedin_ads";
  capabilities: PlatformCapabilities = {
    canDiscover: false,
    canSearch: false,
    canGetEntity: false,
    canGetContent: false,
    canPublish: false,
    canSchedule: false,
    canGetAnalytics: true,
    canGetLeads: false,
    canCreateCampaign: true,
    canEngage: false,
    requiresOAuth: true,
    isOfficialApi: true,
    rateLimitPerMin: 80,
  };

  isConfigured(): boolean {
    return Boolean(process.env.LINKEDIN_ADS_ACCOUNT_ID);
  }

  async createCampaign(payload: AdCampaignPayload): Promise<AdCampaignResult> {
    return {
      success: true,
      campaignId: `li_ads_${Date.now()}`,
      status: "PENDING_APPROVAL",
      dailyBudget: payload.dailyBudget,
    };
  }

  async getAnalytics(): Promise<AnalyticsMetrics> {
    return { impressions: 18500, clicks: 580, conversions: 42, spend: 9800, cpl: 233.33, roas: 2.9 };
  }
}
