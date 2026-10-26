-- ============================================================
-- DOCODO GROWTH OS ROW LEVEL SECURITY (RLS) & TENANT POLICIES
-- Covers all 10 Growth OS models in schema.prisma.
-- service_role (Prisma/backend server) bypasses RLS by design.
-- ============================================================

-- ── 1. Enable RLS on all 10 Growth OS tables ─────────────────
ALTER TABLE IF EXISTS "LeadEntity"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "SocialIdentity"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "LeadGraphEdge"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "OpportunityRecord"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "SocialListeningSignal" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "ContentAsset"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "AdCampaign"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "OutreachSequence"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "AttributionEvent"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "SupervisorRun"         ENABLE ROW LEVEL SECURITY;

-- ── 2. Grants ────────────────────────────────────────────────
-- Authenticated merchants: CRUD access on owned records
GRANT SELECT, INSERT, UPDATE, DELETE ON 
  "LeadEntity",
  "SocialIdentity",
  "LeadGraphEdge",
  "OpportunityRecord",
  "SocialListeningSignal",
  "ContentAsset",
  "AdCampaign",
  "OutreachSequence",
  "AttributionEvent",
  "SupervisorRun"
TO authenticated;

-- Service role: Full access
GRANT ALL ON 
  "LeadEntity",
  "SocialIdentity",
  "LeadGraphEdge",
  "OpportunityRecord",
  "SocialListeningSignal",
  "ContentAsset",
  "AdCampaign",
  "OutreachSequence",
  "AttributionEvent",
  "SupervisorRun"
TO service_role;

-- ── 3. Tenant Isolation Policies ─────────────────────────────

-- 1. Lead Entities
DROP POLICY IF EXISTS "lead_entity_owner_all" ON "LeadEntity";
CREATE POLICY "lead_entity_owner_all" ON "LeadEntity"
  FOR ALL TO authenticated
  USING ("businessId" IS NULL OR EXISTS (SELECT 1 FROM "Business" b WHERE b.id = "LeadEntity"."businessId" AND b."ownerId" = auth.uid()::text));

-- 2. Social Identities (via parent LeadEntity)
DROP POLICY IF EXISTS "social_identity_owner_all" ON "SocialIdentity";
CREATE POLICY "social_identity_owner_all" ON "SocialIdentity"
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM "LeadEntity" le
    LEFT JOIN "Business" b ON b.id = le."businessId"
    WHERE le.id = "SocialIdentity"."leadEntityId" AND (le."businessId" IS NULL OR b."ownerId" = auth.uid()::text)
  ));

-- 3. Lead Graph Edges
DROP POLICY IF EXISTS "lead_graph_edge_owner_all" ON "LeadGraphEdge";
CREATE POLICY "lead_graph_edge_owner_all" ON "LeadGraphEdge"
  FOR ALL TO authenticated
  USING (true);

-- 4. Opportunity Records (via parent LeadEntity)
DROP POLICY IF EXISTS "opportunity_owner_all" ON "OpportunityRecord";
CREATE POLICY "opportunity_owner_all" ON "OpportunityRecord"
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM "LeadEntity" le
    LEFT JOIN "Business" b ON b.id = le."businessId"
    WHERE le.id = "OpportunityRecord"."leadEntityId" AND (le."businessId" IS NULL OR b."ownerId" = auth.uid()::text)
  ));

-- 5. Social Listening Signals
DROP POLICY IF EXISTS "social_listening_owner_all" ON "SocialListeningSignal";
CREATE POLICY "social_listening_owner_all" ON "SocialListeningSignal"
  FOR ALL TO authenticated
  USING ("leadEntityId" IS NULL OR EXISTS (
    SELECT 1 FROM "LeadEntity" le
    LEFT JOIN "Business" b ON b.id = le."businessId"
    WHERE le.id = "SocialListeningSignal"."leadEntityId" AND (le."businessId" IS NULL OR b."ownerId" = auth.uid()::text)
  ));

-- 6. Content Assets
DROP POLICY IF EXISTS "content_asset_owner_all" ON "ContentAsset";
CREATE POLICY "content_asset_owner_all" ON "ContentAsset"
  FOR ALL TO authenticated
  USING ("businessId" IS NULL OR EXISTS (SELECT 1 FROM "Business" b WHERE b.id = "ContentAsset"."businessId" AND b."ownerId" = auth.uid()::text));

-- 7. Ad Campaigns
DROP POLICY IF EXISTS "ad_campaign_owner_all" ON "AdCampaign";
CREATE POLICY "ad_campaign_owner_all" ON "AdCampaign"
  FOR ALL TO authenticated
  USING ("businessId" IS NULL OR EXISTS (SELECT 1 FROM "Business" b WHERE b.id = "AdCampaign"."businessId" AND b."ownerId" = auth.uid()::text));

-- 8. Outreach Sequences (via parent LeadEntity)
DROP POLICY IF EXISTS "outreach_sequence_owner_all" ON "OutreachSequence";
CREATE POLICY "outreach_sequence_owner_all" ON "OutreachSequence"
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM "LeadEntity" le
    LEFT JOIN "Business" b ON b.id = le."businessId"
    WHERE le.id = "OutreachSequence"."leadEntityId" AND (le."businessId" IS NULL OR b."ownerId" = auth.uid()::text)
  ));

-- 9. Attribution Events (via parent LeadEntity)
DROP POLICY IF EXISTS "attribution_event_owner_all" ON "AttributionEvent";
CREATE POLICY "attribution_event_owner_all" ON "AttributionEvent"
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM "LeadEntity" le
    LEFT JOIN "Business" b ON b.id = le."businessId"
    WHERE le.id = "AttributionEvent"."leadEntityId" AND (le."businessId" IS NULL OR b."ownerId" = auth.uid()::text)
  ));

-- 10. Supervisor Execution Runs
DROP POLICY IF EXISTS "supervisor_run_owner_all" ON "SupervisorRun";
CREATE POLICY "supervisor_run_owner_all" ON "SupervisorRun"
  FOR ALL TO authenticated
  USING ("businessId" IS NULL OR EXISTS (SELECT 1 FROM "Business" b WHERE b.id = "SupervisorRun"."businessId" AND b."ownerId" = auth.uid()::text));
