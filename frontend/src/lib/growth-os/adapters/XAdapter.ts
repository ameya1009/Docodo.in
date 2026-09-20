import {
  BaseAdapter,
  DiscoveredRecord,
  DiscoveryQuery,
  PlatformCapabilities,
  PlatformSource,
  PublishPayload,
  PublishResult,
} from "./types";

export class XAdapter implements BaseAdapter {
  platform: PlatformSource = "x";
  capabilities: PlatformCapabilities = {
    canDiscover: true,
    canSearch: true,
    canGetEntity: true,
    canGetContent: true,
    canPublish: true,
    canSchedule: true,
    canGetAnalytics: true,
    canGetLeads: true,
    canCreateCampaign: false,
    canEngage: true,
    requiresOAuth: true,
    isOfficialApi: true,
    rateLimitPerMin: 50,
  };

  private bearerToken: string | undefined;

  constructor() {
    this.bearerToken = process.env.X_BEARER_TOKEN;
  }

  isConfigured(): boolean {
    return Boolean(this.bearerToken && this.bearerToken.length > 10);
  }

  async discover(query: DiscoveryQuery): Promise<DiscoveredRecord[]> {
    const limit = query.limit || 5;
    const city = query.city || "Pune";

    return [
      {
        id: "x_1",
        platform: "x" as PlatformSource,
        rawName: "@PuneSalonHub",
        profileUrl: "https://x.com/PuneSalonHub",
        city,
        country: "IN",
        followerCount: 1650,
        snippet: "Independent salon collective in Pune. Discussing hair trends, styling tools and appointments.",
        sourceConfidence: 0.88,
        sourceTimestamp: new Date().toISOString(),
        rawPayload: { verified: false },
      },
    ].slice(0, limit);
  }

  async publish(payload: PublishPayload): Promise<PublishResult> {
    return {
      success: true,
      publishedUrl: `https://x.com/docodo_in/status/mock_${Date.now()}`,
      postPlatformId: `x_tweet_${Date.now()}`,
      scheduledAt: payload.scheduledAt,
    };
  }
}
