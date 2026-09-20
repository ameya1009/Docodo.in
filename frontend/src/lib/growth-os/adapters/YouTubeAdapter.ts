import {
  BaseAdapter,
  DiscoveredRecord,
  DiscoveryQuery,
  PlatformCapabilities,
  PlatformSource,
  PublishPayload,
  PublishResult,
} from "./types";

export class YouTubeAdapter implements BaseAdapter {
  platform: PlatformSource = "youtube";
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
    rateLimitPerMin: 40,
  };

  isConfigured(): boolean {
    return true;
  }

  async discover(query: DiscoveryQuery): Promise<DiscoveredRecord[]> {
    const limit = query.limit || 5;
    const city = query.city || "Pune";

    return [
      {
        id: "yt_1",
        platform: "youtube" as PlatformSource,
        rawName: "Pune Hair & Style Vlogs",
        profileUrl: "https://youtube.com/@punehairvlogs",
        city,
        country: "IN",
        followerCount: 12500,
        snippet: "Salon transformation tutorials and styling highlights from leading Pune salons.",
        sourceConfidence: 0.9,
        sourceTimestamp: new Date().toISOString(),
        rawPayload: { videoCount: 88 },
      },
    ].slice(0, limit);
  }

  async publish(payload: PublishPayload): Promise<PublishResult> {
    return {
      success: true,
      publishedUrl: `https://youtube.com/shorts/mock_${Date.now()}`,
      postPlatformId: `yt_short_${Date.now()}`,
      scheduledAt: payload.scheduledAt,
    };
  }
}
