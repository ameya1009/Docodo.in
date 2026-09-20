import {
  BaseAdapter,
  DiscoveredRecord,
  DiscoveryQuery,
  PlatformCapabilities,
  PlatformSource,
} from "./types";

export class WebsiteAdapter implements BaseAdapter {
  platform: PlatformSource = "website";
  capabilities: PlatformCapabilities = {
    canDiscover: true,
    canSearch: true,
    canGetEntity: true,
    canGetContent: true,
    canPublish: false,
    canSchedule: false,
    canGetAnalytics: false,
    canGetLeads: true,
    canCreateCampaign: false,
    canEngage: false,
    requiresOAuth: false,
    isOfficialApi: false,
    rateLimitPerMin: 30,
  };

  isConfigured(): boolean {
    return true;
  }

  async discover(query: DiscoveryQuery): Promise<DiscoveredRecord[]> {
    return this.search(query.query, { city: query.city, limit: query.limit });
  }

  async search(query: string, options?: Record<string, any>): Promise<DiscoveredRecord[]> {
    const limit = options?.limit || 5;
    const city = options?.city || "Pune";

    return [
      {
        id: "web_1",
        platform: "website" as PlatformSource,
        rawName: "Studio Seven Unisex Salon",
        websiteUrl: "https://studiosevenpune.com",
        normalizedDomain: "studiosevenpune.com",
        phone: "+91 98220 33445",
        normalizedPhone: "+919822033445",
        email: "bookings@studiosevenpune.com",
        city,
        country: "IN",
        snippet: "Modern studio offering premium hair styling, skin treatments, and bridal services in Pune.",
        sourceConfidence: 0.92,
        sourceTimestamp: new Date().toISOString(),
        rawPayload: { hasBookingForm: false, platform: "wordpress" },
      },
      {
        id: "web_2",
        platform: "website" as PlatformSource,
        rawName: "The Royal Touch Aesthetic Clinic",
        websiteUrl: "https://royaltouchclinic.in",
        normalizedDomain: "royaltouchclinic.in",
        phone: "+91 98220 55667",
        normalizedPhone: "+919822055667",
        email: "contact@royaltouchclinic.in",
        city,
        country: "IN",
        snippet: "Cosmetology and skin laser clinic in Baner Pune. Advanced aesthetic care.",
        sourceConfidence: 0.94,
        sourceTimestamp: new Date().toISOString(),
        rawPayload: { hasBookingForm: true, bookingEngine: "none" },
      },
    ].slice(0, limit);
  }

  async getEntity(entityUrl: string): Promise<DiscoveredRecord | null> {
    return {
      id: `web_${encodeURIComponent(entityUrl)}`,
      platform: "website" as PlatformSource,
      rawName: "Target Business Site",
      websiteUrl: entityUrl,
      normalizedDomain: entityUrl.replace(/^https?:\/\//, "").split("/")[0],
      sourceConfidence: 0.9,
      sourceTimestamp: new Date().toISOString(),
      rawPayload: { scanned: true },
    };
  }
}
