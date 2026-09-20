import {
  BaseAdapter,
  DiscoveredRecord,
  DiscoveryQuery,
  PlatformCapabilities,
  PlatformSource,
  PublishPayload,
  PublishResult,
} from "./types";

export class FacebookAdapter implements BaseAdapter {
  platform: PlatformSource = "facebook";
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
    rateLimitPerMin: 60,
  };

  private pageToken: string | undefined;

  constructor() {
    this.pageToken = process.env.META_FACEBOOK_PAGE_TOKEN;
  }

  isConfigured(): boolean {
    return Boolean(this.pageToken && this.pageToken.length > 10);
  }

  async discover(query: DiscoveryQuery): Promise<DiscoveredRecord[]> {
    const limit = query.limit || 5;
    const city = query.city || "Pune";

    return [
      {
        id: "fb_1",
        platform: "facebook" as PlatformSource,
        rawName: "Urban Scissors Salon Pune",
        profileUrl: "https://facebook.com/urbanscissorspune",
        city,
        country: "IN",
        followerCount: 3800,
        phone: "+91 98220 77665",
        normalizedPhone: "+919822077665",
        snippet: "Family salon and hair care center located in FC Road Pune.",
        sourceConfidence: 0.9,
        sourceTimestamp: new Date().toISOString(),
        rawPayload: { likes: 3800, checkins: 420 },
      },
    ].slice(0, limit);
  }

  async publish(payload: PublishPayload): Promise<PublishResult> {
    return {
      success: true,
      publishedUrl: `https://facebook.com/post/mock_${Date.now()}`,
      postPlatformId: `fb_post_${Date.now()}`,
      scheduledAt: payload.scheduledAt,
    };
  }
}
