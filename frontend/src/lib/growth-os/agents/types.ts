import { DiscoveredRecord, PlatformSource } from "../adapters/types";

export interface CanonicalLead {
  id: string;
  canonicalName: string;
  normalizedDomain?: string;
  normalizedPhone?: string;
  city: string;
  state?: string;
  country: string;
  address?: string;
  category?: string;
  icpScore: number;
  crmStage:
    | "discovered"
    | "researched"
    | "qualified"
    | "high_intent"
    | "outreach_ready"
    | "contacted"
    | "replied"
    | "interested"
    | "demo"
    | "proposal"
    | "negotiation"
    | "won"
    | "lost"
    | "nurture"
    | "suppressed";
  confidenceScore: number;
  primarySource: PlatformSource;
  identities: DiscoveredRecord[];
  opportunities: OpportunitySignal[];
  scoreBreakdown: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}

export interface OpportunitySignal {
  id: string;
  problem: string;
  evidence: string;
  source: PlatformSource;
  recommendedSolution: string;
  recommendedProduct:
    | "Docodo AI Storefront"
    | "WhatsApp AI Receptionist"
    | "Google Review & Local SEO Engine"
    | "Instant Booking & Calendar Sync"
    | "Docodo Omnichannel CRM & Nurturing";
  confidence: number;
  status: "OPEN" | "PITCHED" | "ACCEPTED" | "REJECTED";
}

export interface SocialIntentSignal {
  id: string;
  platform: PlatformSource;
  author: string;
  content: string;
  intentClass: string;
  entityType:
    | "potential_customer"
    | "existing_customer"
    | "competitor"
    | "industry_discussion"
    | "general_user"
    | "irrelevant"
    | "unknown";
  sentiment: "positive" | "negative" | "neutral";
  isLead: boolean;
  recommendedAction: string;
  timestamp: string;
}

export interface ContentThesis {
  sourceIdea: string;
  pillar: string;
  targetAudience: string;
  coreAngle: string;
}

export interface MultiPlatformContentPlan {
  id: string;
  sourceIdea: string;
  pillar: string;
  createdAt: string;
  platforms: {
    linkedinPost: { copy: string; hook: string; hashtags: string[] };
    instagramCarousel: { slides: Array<{ title: string; body: string }>; caption: string; imageBrief: string };
    instagramReel: { script: string; visualBrief: string; audioTrackSuggestion: string; caption: string };
    facebookPost: { copy: string; cta: string };
    facebookReel: { hook: string; script: string; cta: string };
    xThread: { tweets: string[]; hashtags: string[] };
    youtubeShort: { hook: string; visualNotes: string; script: string; caption: string };
    youtubeLongScript: { title: string; outline: string[]; scriptSections: Array<{ heading: string; body: string }> };
    pinterestPin: { title: string; visualPrompt: string; description: string; linkDestination: string };
    blogArticle: { title: string; metaDescription: string; markdownBody: string };
    newsletterEmail: { subject: string; preheader: string; htmlBody: string };
    websiteContent: { heroHeadline: string; subheadline: string; featureBullets: string[]; comparisonMatrix: Array<{ feature: string; manualWay: string; docodoWay: string }>; ctaText: string };
    adVariation: { headline: string; primaryText: string; callToAction: string };
  };
}

export interface SupervisorMissionPlan {
  id: string;
  objective: string;
  selectedSources: PlatformSource[];
  stages: Array<{
    name: string;
    status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "PAUSED_FOR_APPROVAL";
    details?: string;
    count?: number;
  }>;
  budgetAllocated: number;
  budgetSpent: number;
  discoveredLeads: CanonicalLead[];
  pendingApprovals: Array<{
    type: "OUTREACH" | "SOCIAL_POST" | "AD_CAMPAIGN";
    id: string;
    description: string;
    preview: Record<string, any>;
    status: "PENDING" | "APPROVED" | "REJECTED";
  }>;
  auditLogs: Array<{
    timestamp: string;
    step: string;
    agent: string;
    message: string;
    level: "INFO" | "WARN" | "ERROR" | "GATE";
  }>;
}
