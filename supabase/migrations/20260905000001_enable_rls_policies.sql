-- ============================================================
-- DOCODO COMPLETE ROW LEVEL SECURITY (RLS) & TENANT ISOLATION
-- Covers all 26 tables in the schema.
-- service_role (Prisma/server) bypasses RLS by design in Supabase/PostgreSQL.
-- ============================================================

-- ── 1. Re-enable RLS on ALL 26 tables ────────────────────────
ALTER TABLE IF EXISTS "User"                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Account"              ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Session"              ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "VerificationToken"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Business"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "WorkingHours"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Service"              ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Staff"                ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Booking"              ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Customer"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Enquiry"              ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Subscription"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Plan"                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "PlanFeature"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "BusinessEntitlement"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "UsageRecord"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "ConciergeOrder"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "WebhookEvent"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "KnowledgeBase"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Conversation"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "ChatMessage"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "AIContent"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "WhatsAppLog"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "CODLedger"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "NDRDispute"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "AIKeyPool"            ENABLE ROW LEVEL SECURITY;

-- ── 2. Role Grants ───────────────────────────────────────────
-- anon: Read-only access to published public storefront data
GRANT SELECT ON "Business"     TO anon;
GRANT SELECT ON "Service"      TO anon;
GRANT SELECT ON "WorkingHours" TO anon;
GRANT SELECT ON "Plan"         TO anon;
GRANT SELECT ON "PlanFeature"  TO anon;

-- authenticated: standard CRUD on owned tenant data
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- service_role: bypasses RLS, full access for backend server
GRANT ALL ON ALL TABLES    IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL ROUTINES  IN SCHEMA public TO service_role;

-- ── 3. Tenant Isolation Policies ─────────────────────────────

-- Business
DROP POLICY IF EXISTS "business_owner_select"  ON "Business";
DROP POLICY IF EXISTS "business_owner_update"  ON "Business";
DROP POLICY IF EXISTS "business_anon_select"   ON "Business";

CREATE POLICY "business_owner_select" ON "Business"
  FOR SELECT TO authenticated
  USING (auth.uid()::text = "ownerId");

CREATE POLICY "business_owner_update" ON "Business"
  FOR UPDATE TO authenticated
  USING (auth.uid()::text = "ownerId");

CREATE POLICY "business_anon_select" ON "Business"
  FOR SELECT TO anon
  USING ("isPublished" = true);

-- Service
DROP POLICY IF EXISTS "service_owner_all"   ON "Service";
DROP POLICY IF EXISTS "service_anon_select" ON "Service";

CREATE POLICY "service_owner_all" ON "Service"
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM "Business" b WHERE b.id = "Service"."businessId" AND b."ownerId" = auth.uid()::text));

CREATE POLICY "service_anon_select" ON "Service"
  FOR SELECT TO anon
  USING ("isActive" = true AND EXISTS (SELECT 1 FROM "Business" b WHERE b.id = "Service"."businessId" AND b."isPublished" = true));

-- WorkingHours
DROP POLICY IF EXISTS "wh_owner_all"   ON "WorkingHours";
DROP POLICY IF EXISTS "wh_anon_select" ON "WorkingHours";

CREATE POLICY "wh_owner_all" ON "WorkingHours"
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM "Business" b WHERE b.id = "WorkingHours"."businessId" AND b."ownerId" = auth.uid()::text));

CREATE POLICY "wh_anon_select" ON "WorkingHours"
  FOR SELECT TO anon
  USING (EXISTS (SELECT 1 FROM "Business" b WHERE b.id = "WorkingHours"."businessId" AND b."isPublished" = true));

-- Staff
DROP POLICY IF EXISTS "staff_owner_all" ON "Staff";
CREATE POLICY "staff_owner_all" ON "Staff"
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM "Business" b WHERE b.id = "Staff"."businessId" AND b."ownerId" = auth.uid()::text));

-- Booking
DROP POLICY IF EXISTS "booking_owner_all" ON "Booking";
CREATE POLICY "booking_owner_all" ON "Booking"
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM "Business" b WHERE b.id = "Booking"."businessId" AND b."ownerId" = auth.uid()::text));

-- Customer
DROP POLICY IF EXISTS "customer_owner_all" ON "Customer";
CREATE POLICY "customer_owner_all" ON "Customer"
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM "Business" b WHERE b.id = "Customer"."businessId" AND b."ownerId" = auth.uid()::text));

-- Enquiry
DROP POLICY IF EXISTS "enquiry_owner_all" ON "Enquiry";
CREATE POLICY "enquiry_owner_all" ON "Enquiry"
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM "Business" b WHERE b.id = "Enquiry"."businessId" AND b."ownerId" = auth.uid()::text));

-- Subscription & Entitlements
DROP POLICY IF EXISTS "subscription_owner_all" ON "Subscription";
DROP POLICY IF EXISTS "entitlement_owner_all"  ON "BusinessEntitlement";
DROP POLICY IF EXISTS "usage_owner_all"        ON "UsageRecord";
DROP POLICY IF EXISTS "concierge_owner_all"    ON "ConciergeOrder";

CREATE POLICY "subscription_owner_all" ON "Subscription"
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM "Business" b WHERE b.id = "Subscription"."businessId" AND b."ownerId" = auth.uid()::text));

CREATE POLICY "entitlement_owner_all" ON "BusinessEntitlement"
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM "Business" b WHERE b.id = "BusinessEntitlement"."businessId" AND b."ownerId" = auth.uid()::text));

CREATE POLICY "usage_owner_all" ON "UsageRecord"
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM "Business" b WHERE b.id = "UsageRecord"."businessId" AND b."ownerId" = auth.uid()::text));

CREATE POLICY "concierge_owner_all" ON "ConciergeOrder"
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM "Business" b WHERE b.id = "ConciergeOrder"."businessId" AND b."ownerId" = auth.uid()::text));

-- Operations & Logs
DROP POLICY IF EXISTS "cod_owner_all"         ON "CODLedger";
DROP POLICY IF EXISTS "ndr_owner_all"         ON "NDRDispute";
DROP POLICY IF EXISTS "aicontent_owner_all"   ON "AIContent";
DROP POLICY IF EXISTS "whatsapplog_owner_all" ON "WhatsAppLog";
DROP POLICY IF EXISTS "kb_owner_all"          ON "KnowledgeBase";
DROP POLICY IF EXISTS "conv_owner_all"        ON "Conversation";
DROP POLICY IF EXISTS "chat_owner_all"        ON "ChatMessage";

CREATE POLICY "cod_owner_all" ON "CODLedger"
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM "Business" b WHERE b.id = "CODLedger"."businessId" AND b."ownerId" = auth.uid()::text));

CREATE POLICY "ndr_owner_all" ON "NDRDispute"
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM "Business" b WHERE b.id = "NDRDispute"."businessId" AND b."ownerId" = auth.uid()::text));

CREATE POLICY "aicontent_owner_all" ON "AIContent"
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM "Business" b WHERE b.id = "AIContent"."businessId" AND b."ownerId" = auth.uid()::text));

CREATE POLICY "whatsapplog_owner_all" ON "WhatsAppLog"
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM "Business" b WHERE b.id = "WhatsAppLog"."businessId" AND b."ownerId" = auth.uid()::text));

CREATE POLICY "kb_owner_all" ON "KnowledgeBase"
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM "Business" b WHERE b.id = "KnowledgeBase"."businessId" AND b."ownerId" = auth.uid()::text));

CREATE POLICY "conv_owner_all" ON "Conversation"
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM "Business" b WHERE b.id = "Conversation"."businessId" AND b."ownerId" = auth.uid()::text));

CREATE POLICY "chat_owner_all" ON "ChatMessage"
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM "Conversation" c
    JOIN "Business" b ON b.id = c."businessId"
    WHERE c.id = "ChatMessage"."conversationId" AND b."ownerId" = auth.uid()::text
  ));

-- User / Session
DROP POLICY IF EXISTS "user_self_select" ON "User";
DROP POLICY IF EXISTS "user_self_update" ON "User";
CREATE POLICY "user_self_select" ON "User" FOR SELECT TO authenticated USING (auth.uid()::text = id);
CREATE POLICY "user_self_update" ON "User" FOR UPDATE TO authenticated USING (auth.uid()::text = id);

-- Plans & Features (Public Read)
DROP POLICY IF EXISTS "plan_read_all"        ON "Plan";
DROP POLICY IF EXISTS "planfeature_read_all" ON "PlanFeature";
CREATE POLICY "plan_read_all"        ON "Plan"        FOR SELECT USING (true);
CREATE POLICY "planfeature_read_all" ON "PlanFeature" FOR SELECT USING (true);

-- Internal Tables (service_role only: WebhookEvent, AIKeyPool)
-- No user policies needed — service_role bypasses RLS
