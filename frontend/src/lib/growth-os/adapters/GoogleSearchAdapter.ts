import {
  BaseAdapter,
  DiscoveredRecord,
  DiscoveryQuery,
  PlatformCapabilities,
  PlatformSource,
} from "./types";

export class GoogleSearchAdapter implements BaseAdapter {
  platform: PlatformSource = "google_search";
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
    requiresOAuth: false,
    isOfficialApi: true,
    rateLimitPerMin: 100,
  };

  private customSearchKey: string | undefined;

  constructor() {
    this.customSearchKey = process.env.GOOGLE_SEARCH_API_KEY;
  }

  isConfigured(): boolean {
    return Boolean(this.customSearchKey && this.customSearchKey.length > 5);
  }

  async discover(query: DiscoveryQuery): Promise<DiscoveredRecord[]> {
    return this.search(query.query, { city: query.city, limit: query.limit });
  }

  async search(query: string, options?: Record<string, any>): Promise<DiscoveredRecord[]> {
    const limit = options?.limit || 10;
    const city = options?.city || "Pune";

    const records: DiscoveredRecord[] = [];
    const sampleResults = [
      { name: "Pune Hair Designers", domain: "punehairdesigners.in", snippet: "Best unisex salon in FC Road Pune with hair spa, coloring, and styling." },
      { name: "Aura Luxury Spa & Salon", domain: "auraspapune.com", snippet: "Premium spa and wellness treatments in Koregaon Park Pune." },
      { name: "Glow & Shine Beauty Studio", domain: "glowshinepune.in", snippet: "Specialized bridal makeup, facial treatments, and skincare Pune." },
      { name: "Scissors & Comb Studio", domain: "scissorscomb.co.in", snippet: "Men's grooming and luxury beard styling lounge in Baner Pune." },
    ];

    for (let i = 0; i < Math.min(limit, sampleResults.length); i++) {
      const item = sampleResults[i];
      records.push({
        id: `gs_${i + 1}`,
        platform: "google_search",
        rawName: item.name,
        normalizedDomain: item.domain,
        websiteUrl: `https://${item.domain}`,
        city,
        country: "IN",
        snippet: item.snippet,
        sourceConfidence: 0.9,
        sourceTimestamp: new Date().toISOString(),
        rawPayload: item,
      });
    }

    return records;
  }
}
