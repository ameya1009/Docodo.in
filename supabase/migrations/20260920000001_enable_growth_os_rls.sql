-- ============================================================
-- DOCODO GROWTH OS ROW LEVEL SECURITY (RLS) & TENANT POLICIES
-- Covers all 10 Growth OS models in schema.prisma.
-- service_role (Prisma/backend server) bypasses RLS by design.
-- ============================================================

-- ── 1. Enable RLS on all 10 Growth OS tables ─────────────────
ALTER TABLE IF EXISTS "OmnichannelLead"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "LeadOpportunity"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "LeadGraphNode"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "LeadGraphEdge"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "MarketingCampaign"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "OutreachDraft"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "SocialListeningSignal" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "SocialPostSchedule"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "AdCampaignBudget"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "GrowthExperiment"     ENABLE ROW LEVEL SECURITY;

-- ── 2. Grants ────────────────────────────────────────────────
-- Authenticated merchants: CRUD access on owned records
GRANT SELECT, INSERT, UPDATE, DELETE ON 
  "OmnichannelLead",
  "LeadOpportunity",
  "LeadGraphNode",
  "LeadGraphEdge",
  "MarketingCampaign",
  "OutreachDraft",
  "SocialListeningSignal",
  "SocialPostSchedule",
  "AdCampaignBudget",
  "GrowthExperiment"
TO authenticated;

-- Service role: Full access
GRANT ALL ON 
  "OmnichannelLead",
  "LeadOpportunity",
  "LeadGraphNode",
  "LeadGraphEdge",
  "MarketingCampaign",
  "OutreachDraft",
  "SocialListeningSignal",
  "SocialPostSchedule",
  "AdCampaignBudget",
  "GrowthExperiment"
TO service_role;

-- ── 3. Tenant Isolation Policies ─────────────────────────────
-- Marketing Campaigns
DROP POLICY IF EXISTS "campaign_owner_all" ON "MarketingCampaign";
CREATE POLICY "campaign_owner_all" ON "MarketingCampaign"
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM "Business" b WHERE b.id = "MarketingCampaign"."businessId" AND b."ownerId" = auth.uid()::text));

-- Outreach Drafts
DROP POLICY IF EXISTS "outreach_owner_all" ON "OutreachDraft";
CREATE POLICY "outreach_owner_all" ON "OutreachDraft"
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM "Business" b WHERE b.id = "OutreachDraft"."businessId" AND b."ownerId" = auth.uid()::text));

-- Social Post Schedules
DROP POLICY IF EXISTS "social_post_owner_all" ON "SocialPostSchedule";
CREATE POLICY "social_post_owner_all" ON "SocialPostSchedule"
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM "Business" b WHERE b.id = "SocialPostSchedule"."businessId" AND b."ownerId" = auth.uid()::text));

-- Ad Campaign Budgets
DROP POLICY IF EXISTS "ad_budget_owner_all" ON "AdCampaignBudget";
CREATE POLICY "ad_budget_owner_all" ON "AdCampaignBudget"
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM "Business" b WHERE b.id = "AdCampaignBudget"."businessId" AND b."ownerId" = auth.uid()::text));

-- Growth Experiments
DROP POLICY IF EXISTS "experiment_owner_all" ON "GrowthExperiment";
CREATE POLICY "experiment_owner_all" ON "GrowthExperiment"
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM "Business" b WHERE b.id = "GrowthExperiment"."businessId" AND b."ownerId" = auth.uid()::text));
