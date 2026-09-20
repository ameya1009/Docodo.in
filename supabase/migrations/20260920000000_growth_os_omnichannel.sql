-- Docodo Growth OS Omnichannel Acquisition Migration
-- Created on 2026-09-20

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Canonical Lead Entities
CREATE TABLE IF NOT EXISTS "LeadEntity" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "businessId" TEXT,
    "canonicalName" TEXT NOT NULL,
    "normalizedDomain" TEXT,
    "normalizedPhone" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT NOT NULL DEFAULT 'IN',
    "address" TEXT,
    "industry" TEXT,
    "category" TEXT,
    "icpScore" INTEGER NOT NULL DEFAULT 0,
    "crmStage" TEXT NOT NULL DEFAULT 'discovered',
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "primarySource" TEXT NOT NULL DEFAULT 'google_places',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_lead_entity_name" ON "LeadEntity"("canonicalName");
CREATE INDEX IF NOT EXISTS "idx_lead_entity_crm_stage" ON "LeadEntity"("crmStage");
CREATE INDEX IF NOT EXISTS "idx_lead_entity_domain" ON "LeadEntity"("normalizedDomain");
CREATE INDEX IF NOT EXISTS "idx_lead_entity_phone" ON "LeadEntity"("normalizedPhone");

-- 2. Social Identities
CREATE TABLE IF NOT EXISTS "SocialIdentity" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "leadEntityId" TEXT NOT NULL REFERENCES "LeadEntity"("id") ON DELETE CASCADE,
    "platform" TEXT NOT NULL,
    "platformUserId" TEXT,
    "profileUrl" TEXT,
    "displayName" TEXT,
    "handle" TEXT,
    "followerCount" INTEGER DEFAULT 0,
    "reviewCount" INTEGER DEFAULT 0,
    "rating" DOUBLE PRECISION DEFAULT 0.0,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "lastActivityAt" TIMESTAMP(3),
    "sourcePayload" JSONB,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_social_identity_lead_platform" ON "SocialIdentity"("leadEntityId", "platform");
CREATE INDEX IF NOT EXISTS "idx_social_identity_platform_user" ON "SocialIdentity"("platform", "platformUserId");

-- 3. Lead Graph Edges
CREATE TABLE IF NOT EXISTS "LeadGraphEdge" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "relationType" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_lead_graph_source" ON "LeadGraphEdge"("sourceId", "sourceType");
CREATE INDEX IF NOT EXISTS "idx_lead_graph_target" ON "LeadGraphEdge"("targetId", "targetType");
CREATE INDEX IF NOT EXISTS "idx_lead_graph_rel" ON "LeadGraphEdge"("relationType");

-- 4. Opportunity Records
CREATE TABLE IF NOT EXISTS "OpportunityRecord" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "leadEntityId" TEXT NOT NULL REFERENCES "LeadEntity"("id") ON DELETE CASCADE,
    "problem" TEXT NOT NULL,
    "evidence" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "recommendedSolution" TEXT NOT NULL,
    "recommendedProduct" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.9,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_opp_lead_prob" ON "OpportunityRecord"("leadEntityId", "problem");
CREATE INDEX IF NOT EXISTS "idx_opp_product" ON "OpportunityRecord"("recommendedProduct");

-- 5. Social Listening Signals
CREATE TABLE IF NOT EXISTS "SocialListeningSignal" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "platform" TEXT NOT NULL,
    "authorHandle" TEXT,
    "authorName" TEXT,
    "content" TEXT NOT NULL,
    "postUrl" TEXT,
    "intentClass" TEXT NOT NULL,
    "entityType" TEXT NOT NULL DEFAULT 'potential_customer',
    "sentiment" TEXT NOT NULL DEFAULT 'neutral',
    "isLead" BOOLEAN NOT NULL DEFAULT false,
    "leadEntityId" TEXT,
    "metadata" JSONB,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_signal_platform_intent" ON "SocialListeningSignal"("platform", "intentClass");
CREATE INDEX IF NOT EXISTS "idx_signal_lead_type" ON "SocialListeningSignal"("isLead", "entityType");

-- 6. Content Assets
CREATE TABLE IF NOT EXISTS "ContentAsset" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "businessId" TEXT,
    "topic" TEXT NOT NULL,
    "pillar" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "hook" TEXT,
    "script" TEXT,
    "copy" TEXT NOT NULL,
    "imageBrief" TEXT,
    "videoBrief" TEXT,
    "thumbnailPrompt" TEXT,
    "caption" TEXT,
    "cta" TEXT,
    "hashtags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "scheduledAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "publishedUrl" TEXT,
    "analytics" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_content_platform_status" ON "ContentAsset"("platform", "status");
CREATE INDEX IF NOT EXISTS "idx_content_pillar" ON "ContentAsset"("pillar");

-- 7. Ad Campaigns
CREATE TABLE IF NOT EXISTS "AdCampaign" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "businessId" TEXT,
    "name" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "targetAudience" JSONB,
    "adCopy" TEXT NOT NULL,
    "creativeUrl" TEXT,
    "landingPageUrl" TEXT,
    "dailyBudget" DOUBLE PRECISION NOT NULL DEFAULT 500.0,
    "monthlyBudgetLimit" DOUBLE PRECISION NOT NULL DEFAULT 15000.0,
    "currentSpend" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "roas" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "cpl" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "leadsGenerated" INTEGER NOT NULL DEFAULT 0,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "approvalStatus" TEXT NOT NULL DEFAULT 'REQUIRES_APPROVAL',
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_ad_campaign_status" ON "AdCampaign"("platform", "status");
CREATE INDEX IF NOT EXISTS "idx_ad_campaign_approval" ON "AdCampaign"("approvalStatus");

-- 8. Outreach Sequences
CREATE TABLE IF NOT EXISTS "OutreachSequence" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "leadEntityId" TEXT NOT NULL REFERENCES "LeadEntity"("id") ON DELETE CASCADE,
    "channel" TEXT NOT NULL,
    "step" INTEGER NOT NULL DEFAULT 1,
    "templateId" TEXT,
    "draftSubject" TEXT,
    "draftBody" TEXT NOT NULL,
    "evidenceCitations" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "recipientAddress" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "openedAt" TIMESTAMP(3),
    "repliedAt" TIMESTAMP(3),
    "optOut" BOOLEAN NOT NULL DEFAULT false,
    "errorMessage" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_outreach_lead_channel" ON "OutreachSequence"("leadEntityId", "channel");
CREATE INDEX IF NOT EXISTS "idx_outreach_status" ON "OutreachSequence"("status");

-- 9. Attribution Events
CREATE TABLE IF NOT EXISTS "AttributionEvent" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "leadEntityId" TEXT NOT NULL REFERENCES "LeadEntity"("id") ON DELETE CASCADE,
    "touchpointType" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "campaignId" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmContent" TEXT,
    "conversionMilestone" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_attr_lead_touch" ON "AttributionEvent"("leadEntityId", "touchpointType");
CREATE INDEX IF NOT EXISTS "idx_attr_utm" ON "AttributionEvent"("platform", "utmCampaign");

-- 10. Supervisor Execution Runs
CREATE TABLE IF NOT EXISTS "SupervisorRun" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "businessId" TEXT,
    "objective" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'RUNNING',
    "currentStep" TEXT NOT NULL DEFAULT 'discovery',
    "stepHistory" JSONB,
    "discoveredCount" INTEGER NOT NULL DEFAULT 0,
    "qualifiedCount" INTEGER NOT NULL DEFAULT 0,
    "draftsCount" INTEGER NOT NULL DEFAULT 0,
    "campaignsCount" INTEGER NOT NULL DEFAULT 0,
    "budgetSpent" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "budgetLimit" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "logEntries" JSONB,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3)
);

CREATE INDEX IF NOT EXISTS "idx_supervisor_run_status" ON "SupervisorRun"("status");
