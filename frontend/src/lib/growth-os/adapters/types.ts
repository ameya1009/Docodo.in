/**
 * Docodo Growth OS — Typed Platform Adapter Interfaces
 */

export type PlatformSource =
  | "google_places"
  | "google_search"
  | "website"
  | "linkedin"
  | "facebook"
  | "instagram"
  | "x"
  | "x_twitter"
  | "reddit"
  | "youtube"
  | "pinterest"
  | "directory"
  | "email"
  | "whatsapp"
  | "google_ads"
  | "meta_ads"
  | "linkedin_ads";

export interface PlatformCapabilities {
  canDiscover: boolean;
  canSearch: boolean;
  canGetEntity: boolean;
  canGetContent: boolean;
  canPublish: boolean;
  canSchedule: boolean;
  canGetAnalytics: boolean;
  canGetLeads: boolean;
  canCreateCampaign: boolean;
  canEngage: boolean;
  requiresOAuth: boolean;
  isOfficialApi: boolean;
  rateLimitPerMin: number;
}

export interface DiscoveryQuery {
  query: string;
  city?: string;
  industry?: string;
  category?: string;
  country?: string;
  limit?: number;
  offset?: number;
  filters?: Record<string, any>;
}

export interface DiscoveredRecord {
  id: string;
  platform: PlatformSource;
  rawName: string;
  handle?: string;
  normalizedDomain?: string;
  normalizedPhone?: string;
  city?: string;
  state?: string;
  country?: string;
  address?: string;
  category?: string;
  profileUrl?: string;
  followerCount?: number;
  reviewCount?: number;
  rating?: number;
  websiteUrl?: string;
  email?: string;
  phone?: string;
  isVerified?: boolean;
  snippet?: string;
  sourceConfidence: number; // 0.0 to 1.0
  sourceTimestamp: string;
  rawPayload: Record<string, any>;
}

export interface PublishPayload {
  content: string;
  title?: string;
  mediaUrls?: string[];
  hashtags?: string[];
  scheduledAt?: string;
  format?: string;
  targetAudience?: Record<string, any>;
}

export interface PublishResult {
  success: boolean;
  publishedUrl?: string;
  postPlatformId?: string;
  scheduledAt?: string;
  error?: string;
  retryable?: boolean;
}

export interface OutreachPayload {
  recipient: string; // phone, email, or handle
  channel: "email" | "whatsapp" | "linkedin" | "instagram_dm" | "x_dm";
  subject?: string;
  body: string;
  evidenceCitations?: string[];
  metadata?: Record<string, any>;
}

export interface OutreachResult {
  success: boolean;
  messageId?: string;
  sentAt?: string;
  error?: string;
  status: "SENT" | "QUEUED" | "FAILED" | "OPT_OUT";
}

export interface AdCampaignPayload {
  name: string;
  objective: "LEAD_GENERATION" | "TRAFFIC" | "CONVERSIONS" | "BRAND_AWARENESS";
  dailyBudget: number;
  monthlyBudgetLimit: number;
  targetAudience: Record<string, any>;
  adCopy: string;
  headline?: string;
  creativeUrl?: string;
  landingPageUrl: string;
}

export interface AdCampaignResult {
  success: boolean;
  campaignId?: string;
  status: "ACTIVE" | "PENDING_APPROVAL" | "PAUSED" | "REJECTED";
  dailyBudget: number;
  error?: string;
}

export interface EngagementEvent {
  id: string;
  platform: PlatformSource;
  authorHandle: string;
  authorName?: string;
  text: string;
  sentiment: "positive" | "negative" | "neutral";
  classification: "positive" | "negative" | "question" | "lead" | "support" | "spam" | "competitor" | "irrelevant";
  timestamp: string;
  postUrl?: string;
}

export interface AnalyticsMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  cpl: number;
  roas: number;
  breakdown?: Record<string, number>;
}

export interface BaseAdapter {
  platform: PlatformSource;
  capabilities: PlatformCapabilities;
  isConfigured(): boolean;
  discover?(query: DiscoveryQuery): Promise<DiscoveredRecord[]>;
  search?(query: string, options?: Record<string, any>): Promise<DiscoveredRecord[]>;
  getEntity?(entityId: string): Promise<DiscoveredRecord | null>;
  getContent?(criteria?: Record<string, any>): Promise<any[]>;
  publish?(payload: PublishPayload): Promise<PublishResult>;
  schedule?(payload: PublishPayload): Promise<PublishResult>;
  getAnalytics?(timeframe?: string): Promise<AnalyticsMetrics>;
  getLeads?(filters?: Record<string, any>): Promise<DiscoveredRecord[]>;
  createCampaign?(payload: AdCampaignPayload): Promise<AdCampaignResult>;
  engage?(interactionId: string, responseText: string): Promise<{ success: boolean; messageId?: string; error?: string }>;
  sendOutreach?(payload: OutreachPayload): Promise<OutreachResult>;
}
