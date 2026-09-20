import {
  BaseAdapter,
  DiscoveredRecord,
  DiscoveryQuery,
  PlatformCapabilities,
  PlatformSource,
  PublishPayload,
  PublishResult,
} from "./types";

export class InstagramAdapter implements BaseAdapter {
  platform: PlatformSource = "instagram";
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

  private graphToken: string | undefined;

  constructor() {
    this.graphToken = process.env.META_GRAPH_API_TOKEN;
  }

  isConfigured(): boolean {
    return Boolean(this.graphToken && this.graphToken.length > 10);
  }

  async discover(query: DiscoveryQuery): Promise<DiscoveredRecord[]> {
    const limit = query.limit || 5;
    const city = query.city || "Pune";

    return [
      {
        id: "ig_1",
        platform: "instagram" as PlatformSource,
        rawName: "@velvetscissorpune",
        profileUrl: "https://instagram.com/velvetscissorpune",
        city,
        country: "IN",
        followerCount: 8400,
        websiteUrl: "https://velvetscissor.in",
        normalizedDomain: "velvetscissor.in",
        phone: "+91 98220 99881",
        normalizedPhone: "+919822099881",
        isVerified: false,
        snippet: "Boutique Salon & Nail Art Lounge. DM for appointments or WhatsApp link in bio!",
        sourceConfidence: 0.94,
        sourceTimestamp: new Date().toISOString(),
        rawPayload: { mediaCount: 312, isBusinessAccount: true },
      },
      {
        id: "ig_2",
        platform: "instagram" as PlatformSource,
        rawName: "@blushbeauty_pune",
        profileUrl: "https://instagram.com/blushbeauty_pune",
        city,
        country: "IN",
        followerCount: 4200,
        websiteUrl: undefined,
        phone: "+91 98220 44332",
        normalizedPhone: "+919822044332",
        isVerified: false,
        snippet: "Bridal Makeup Studio Koregaon Park. DM to check date availability.",
        sourceConfidence: 0.91,
        sourceTimestamp: new Date().toISOString(),
        rawPayload: { mediaCount: 184, isBusinessAccount: true },
      },
    ].slice(0, limit);
  }

  async publish(payload: PublishPayload): Promise<PublishResult> {
    return {
      success: true,
      publishedUrl: `https://instagram.com/p/mock_${Date.now()}`,
      postPlatformId: `ig_post_${Date.now()}`,
      scheduledAt: payload.scheduledAt,
    };
  }
}
