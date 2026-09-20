import {
  BaseAdapter,
  DiscoveredRecord,
  DiscoveryQuery,
  PlatformCapabilities,
  PlatformSource,
  PublishPayload,
  PublishResult,
} from "./types";

export class PinterestAdapter implements BaseAdapter {
  platform: PlatformSource = "pinterest";
  capabilities: PlatformCapabilities = {
    canDiscover: true,
    canSearch: true,
    canGetEntity: false,
    canGetContent: true,
    canPublish: true,
    canSchedule: true,
    canGetAnalytics: true,
    canGetLeads: true,
    canCreateCampaign: false,
    canEngage: false,
    requiresOAuth: true,
    isOfficialApi: true,
    rateLimitPerMin: 30,
  };

  isConfigured(): boolean {
    return true;
  }

  async discover(query: DiscoveryQuery): Promise<DiscoveredRecord[]> {
    const limit = query.limit || 5;
    const city = query.city || "Pune";

    return [
      {
        id: "pin_1",
        platform: "pinterest" as PlatformSource,
        rawName: "Pune Bridal Hair Inspirations",
        profileUrl: "https://pinterest.com/punebridalhair",
        city,
        country: "IN",
        followerCount: 5600,
        snippet: "Curated Indian bridal makeup and hair styling aesthetics for Pune weddings.",
        sourceConfidence: 0.88,
        sourceTimestamp: new Date().toISOString(),
        rawPayload: { pinsCount: 420 },
      },
    ].slice(0, limit);
  }

  async publish(payload: PublishPayload): Promise<PublishResult> {
    return {
      success: true,
      publishedUrl: `https://pinterest.com/pin/mock_${Date.now()}`,
      postPlatformId: `pin_${Date.now()}`,
      scheduledAt: payload.scheduledAt,
    };
  }
}
