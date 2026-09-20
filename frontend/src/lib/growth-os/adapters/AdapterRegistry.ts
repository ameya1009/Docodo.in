import { BaseAdapter, PlatformCapabilities, PlatformSource } from "./types";
import { GooglePlacesAdapter } from "./GooglePlacesAdapter";
import { GoogleSearchAdapter } from "./GoogleSearchAdapter";
import { WebsiteAdapter } from "./WebsiteAdapter";
import { InstagramAdapter } from "./InstagramAdapter";
import { FacebookAdapter } from "./FacebookAdapter";
import { LinkedInAdapter } from "./LinkedInAdapter";
import { XAdapter } from "./XAdapter";
import { RedditAdapter } from "./RedditAdapter";
import { YouTubeAdapter } from "./YouTubeAdapter";
import { PinterestAdapter } from "./PinterestAdapter";
import { DirectoryAdapter } from "./DirectoryAdapter";
import { EmailAdapter } from "./EmailAdapter";
import { WhatsAppAdapter } from "./WhatsAppAdapter";
import { GoogleAdsAdapter, MetaAdsAdapter, LinkedInAdsAdapter } from "./AdsAdapters";

export class AdapterRegistry {
  private static instance: AdapterRegistry;
  private adapters: Map<PlatformSource, BaseAdapter> = new Map();

  private constructor() {
    this.registerDefaults();
  }

  public static getInstance(): AdapterRegistry {
    if (!AdapterRegistry.instance) {
      AdapterRegistry.instance = new AdapterRegistry();
    }
    return AdapterRegistry.instance;
  }

  private registerDefaults(): void {
    this.register(new GooglePlacesAdapter());
    this.register(new GoogleSearchAdapter());
    this.register(new WebsiteAdapter());
    this.register(new InstagramAdapter());
    this.register(new FacebookAdapter());
    this.register(new LinkedInAdapter());
    this.register(new XAdapter());
    this.register(new RedditAdapter());
    this.register(new YouTubeAdapter());
    this.register(new PinterestAdapter());
    this.register(new DirectoryAdapter());
    this.register(new EmailAdapter());
    this.register(new WhatsAppAdapter());
    this.register(new GoogleAdsAdapter());
    this.register(new MetaAdsAdapter());
    this.register(new LinkedInAdsAdapter());
  }

  public static getAllAdapters(): BaseAdapter[] {
    return Array.from(AdapterRegistry.getInstance().adapters.values());
  }

  public static getAdapter(platform: PlatformSource): BaseAdapter | undefined {
    return AdapterRegistry.getInstance().getAdapter(platform);
  }

  public register(adapter: BaseAdapter): void {
    this.adapters.set(adapter.platform, adapter);
  }

  public getAdapter(platform: PlatformSource): BaseAdapter | undefined {
    return this.adapters.get(platform);
  }

  public getCapabilities(platform: PlatformSource): PlatformCapabilities | null {
    const adapter = this.adapters.get(platform);
    return adapter ? adapter.capabilities : null;
  }

  public listSupportedPlatforms(): Array<{
    platform: PlatformSource;
    isConfigured: boolean;
    capabilities: PlatformCapabilities;
  }> {
    return Array.from(this.adapters.values()).map((adapter) => ({
      platform: adapter.platform,
      isConfigured: adapter.isConfigured(),
      capabilities: adapter.capabilities,
    }));
  }

  public getDiscoveryAdapters(): BaseAdapter[] {
    return Array.from(this.adapters.values()).filter((a) => a.capabilities.canDiscover);
  }

  public getPublishingAdapters(): BaseAdapter[] {
    return Array.from(this.adapters.values()).filter((a) => a.capabilities.canPublish);
  }

  public getAdsAdapters(): BaseAdapter[] {
    return Array.from(this.adapters.values()).filter((a) => a.capabilities.canCreateCampaign);
  }
}

export const adapterRegistry = AdapterRegistry.getInstance();
