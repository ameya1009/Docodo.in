-- ============================================================
-- P0-4 FIX: Enable RLS and apply tenant-scoped access policies
-- Replaces the previous DISABLE ROW LEVEL SECURITY migration.
-- service_role (Prisma/server) bypasses RLS by design in Postgres/Supabase.
-- ============================================================

-- Re-enable RLS on all core tables
ALTER TABLE IF EXISTS "User"               ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Account"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Session"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "VerificationToken"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Business"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Service"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Booking"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Customer"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Enquiry"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "KnowledgeBase"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Conversation"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "ChatMessage"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "AIKeyPool"          ENABLE ROW LEVEL SECURITY;

-- ── Minimal role grants (service_role already bypasses RLS) ──────────────────
-- anon: only needs to read published businesses/services for the public booking widget
GRANT SELECT ON "Business" TO anon;
GRANT SELECT ON "Service"  TO anon;
-- authenticated role (Supabase Auth JWT users) gets standard CRUD on their own data
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
-- service_role gets everything (used by Prisma on the server)
GRANT ALL ON ALL TABLES    IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL ROUTINES  IN SCHEMA public TO service_role;

-- ── Business: owner can manage their own record ──────────────────────────────
DROP POLICY IF EXISTS "business_owner_select"  ON "Business";
DROP POLICY IF EXISTS "business_owner_update"  ON "Business";
DROP POLICY IF EXISTS "business_anon_select"   ON "Business";

CREATE POLICY "business_owner_select" ON "Business"
  FOR SELECT TO authenticated
  USING (auth.uid()::text = "ownerId");

CREATE POLICY "business_owner_update" ON "Business"
  FOR UPDATE TO authenticated
  USING (auth.uid()::text = "ownerId");

-- Public visitors can read published businesses (for /book/[slug])
CREATE POLICY "business_anon_select" ON "Business"
  FOR SELECT TO anon
  USING ("isPublished" = true);

-- ── Service: scoped to business owner ────────────────────────────────────────
DROP POLICY IF EXISTS "service_owner_all"   ON "Service";
DROP POLICY IF EXISTS "service_anon_select" ON "Service";

CREATE POLICY "service_owner_all" ON "Service"
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM "Business" b
      WHERE b.id = "Service"."businessId"
        AND b."ownerId" = auth.uid()::text
    )
  );

CREATE POLICY "service_anon_select" ON "Service"
  FOR SELECT TO anon
  USING (
    "isActive" = true AND
    EXISTS (SELECT 1 FROM "Business" b WHERE b.id = "Service"."businessId" AND b."isPublished" = true)
  );

-- ── Booking: business-owner scoped ───────────────────────────────────────────
DROP POLICY IF EXISTS "booking_owner_all" ON "Booking";

CREATE POLICY "booking_owner_all" ON "Booking"
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM "Business" b
      WHERE b.id = "Booking"."businessId"
        AND b."ownerId" = auth.uid()::text
    )
  );

-- ── Customer: business-owner scoped ──────────────────────────────────────────
DROP POLICY IF EXISTS "customer_owner_all" ON "Customer";

CREATE POLICY "customer_owner_all" ON "Customer"
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM "Business" b
      WHERE b.id = "Customer"."businessId"
        AND b."ownerId" = auth.uid()::text
    )
  );

-- ── Enquiry: business-owner scoped ───────────────────────────────────────────
DROP POLICY IF EXISTS "enquiry_owner_all" ON "Enquiry";

CREATE POLICY "enquiry_owner_all" ON "Enquiry"
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM "Business" b
      WHERE b.id = "Enquiry"."businessId"
        AND b."ownerId" = auth.uid()::text
    )
  );

-- ── User: each user sees only themselves ─────────────────────────────────────
DROP POLICY IF EXISTS "user_self_select" ON "User";
DROP POLICY IF EXISTS "user_self_update" ON "User";

CREATE POLICY "user_self_select" ON "User"
  FOR SELECT TO authenticated
  USING (auth.uid()::text = id);

CREATE POLICY "user_self_update" ON "User"
  FOR UPDATE TO authenticated
  USING (auth.uid()::text = id);

-- ── Session / Account / VerificationToken: user-scoped ───────────────────────
DROP POLICY IF EXISTS "session_owner_all"            ON "Session";
DROP POLICY IF EXISTS "account_owner_all"            ON "Account";
DROP POLICY IF EXISTS "verification_token_owner_all" ON "VerificationToken";

CREATE POLICY "session_owner_all" ON "Session"
  FOR ALL TO authenticated
  USING (auth.uid()::text = "userId");

CREATE POLICY "account_owner_all" ON "Account"
  FOR ALL TO authenticated
  USING (auth.uid()::text = "userId");

CREATE POLICY "verification_token_owner_all" ON "VerificationToken"
  FOR ALL TO authenticated
  USING (auth.uid()::text = identifier);

-- ── KnowledgeBase / Conversation / ChatMessage: business-scoped ──────────────
DROP POLICY IF EXISTS "kb_owner_all"   ON "KnowledgeBase";
DROP POLICY IF EXISTS "conv_owner_all" ON "Conversation";
DROP POLICY IF EXISTS "chat_owner_all" ON "ChatMessage";

CREATE POLICY "kb_owner_all" ON "KnowledgeBase"
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM "Business" b
      WHERE b.id = "KnowledgeBase"."businessId"
        AND b."ownerId" = auth.uid()::text
    )
  );

CREATE POLICY "conv_owner_all" ON "Conversation"
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM "Business" b
      WHERE b.id = "Conversation"."businessId"
        AND b."ownerId" = auth.uid()::text
    )
  );

CREATE POLICY "chat_owner_all" ON "ChatMessage"
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM "Conversation" c
      JOIN "Business" b ON b.id = c."businessId"
      WHERE c.id = "ChatMessage"."conversationId"
        AND b."ownerId" = auth.uid()::text
    )
  );

-- AIKeyPool: service_role only (no authenticated/anon access)
-- No policies needed — service_role bypasses RLS

