import {
  BaseAdapter,
  DiscoveredRecord,
  DiscoveryQuery,
  PlatformCapabilities,
  PlatformSource,
} from "./types";

export class DirectoryAdapter implements BaseAdapter {
  platform: PlatformSource = "directory";
  capabilities: PlatformCapabilities = {
    canDiscover: true,
    canSearch: true,
    canGetEntity: true,
    canGetContent: false,
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
    const limit = query.limit || 5;
    const city = query.city || "Pune";

    return [
      {
        id: "dir_1",
        platform: "directory" as PlatformSource,
        rawName: "Miracle Looks Unisex Salon",
        address: "Shop 4, Aundh Road, Pune 411007",
        city,
        country: "IN",
        phone: "+91 98220 88990",
        normalizedPhone: "+919822088990",
        category: "Beauty Parlour & Unisex Salon",
        rating: 4.1,
        reviewCount: 78,
        sourceConfidence: 0.91,
        sourceTimestamp: new Date().toISOString(),
        rawPayload: { directory: "Justdial", verifiedBadge: true },
      },
      {
        id: "dir_2",
        platform: "directory" as PlatformSource,
        rawName: "Nirvana Ayurvedic Spa & Massage Center",
        address: "Kalyani Nagar, Pune 411006",
        city,
        country: "IN",
        phone: "+91 98220 66778",
        normalizedPhone: "+919822066778",
        category: "Ayurvedic Spa & Wellness",
        rating: 4.4,
        reviewCount: 142,
        sourceConfidence: 0.93,
        sourceTimestamp: new Date().toISOString(),
        rawPayload: { directory: "Sulekha", verifiedBadge: true },
      },
    ].slice(0, limit);
  }
}
