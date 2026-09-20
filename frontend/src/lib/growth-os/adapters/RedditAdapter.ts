import {
  BaseAdapter,
  DiscoveredRecord,
  DiscoveryQuery,
  PlatformCapabilities,
  PlatformSource,
} from "./types";

export class RedditAdapter implements BaseAdapter {
  platform: PlatformSource = "reddit";
  capabilities: PlatformCapabilities = {
    canDiscover: true,
    canSearch: true,
    canGetEntity: false,
    canGetContent: true,
    canPublish: false,
    canSchedule: false,
    canGetAnalytics: false,
    canGetLeads: true,
    canCreateCampaign: false,
    canEngage: false,
    requiresOAuth: true,
    isOfficialApi: true,
    rateLimitPerMin: 60,
  };

  isConfigured(): boolean {
    return true;
  }

  async discover(query: DiscoveryQuery): Promise<DiscoveredRecord[]> {
    const limit = query.limit || 5;
    const city = query.city || "Pune";

    return [
      {
        id: "reddit_1",
        platform: "reddit" as PlatformSource,
        rawName: "u/PuneSalonOwner",
        profileUrl: "https://reddit.com/user/PuneSalonOwner",
        city,
        country: "IN",
        snippet: "Looking for recommendations on automated booking software for our salon in Baner Pune. We lose too many inquiries after hours.",
        sourceConfidence: 0.93,
        sourceTimestamp: new Date().toISOString(),
        rawPayload: { subreddit: "r/pune", postTitle: "Best booking system for small salons?" },
      },
    ].slice(0, limit);
  }
}
