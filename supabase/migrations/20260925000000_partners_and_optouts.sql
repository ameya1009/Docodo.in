-- ============================================================
-- DOCODO PARTNER AFFILIATE PROGRAM & DPDP ACT 2023 COMPLIANCE
-- Creates Partner, Referral, CommissionLedger, and OptOutLog tables,
-- ensures compliance columns exist on Customer & Booking,
-- and configures Row Level Security (RLS) tenant isolation policies.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── 1. Supporting Columns on Existing Tables ─────────────────
ALTER TABLE IF EXISTS "Customer" ADD COLUMN IF NOT EXISTS "optedOut" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE IF EXISTS "Customer" ADD COLUMN IF NOT EXISTS "optOutAt" TIMESTAMP(3);
ALTER TABLE IF EXISTS "Booking"  ADD COLUMN IF NOT EXISTS "reminder2hSent" BOOLEAN NOT NULL DEFAULT false;

-- ── 2. OptOutLog (DPDP Act 2023 Compliance) ──────────────────
CREATE TABLE IF NOT EXISTS "OptOutLog" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "businessId" TEXT NOT NULL REFERENCES "Business"("id") ON DELETE CASCADE,
    "customerPhone" TEXT NOT NULL,
    "channel" TEXT NOT NULL DEFAULT 'WHATSAPP',
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_optoutlog_biz_phone" ON "OptOutLog"("businessId", "customerPhone");
CREATE INDEX IF NOT EXISTS "idx_optoutlog_createdAt" ON "OptOutLog"("createdAt");

-- ── 3. Partner (Affiliate Revenue Sharing) ────────────────────
CREATE TABLE IF NOT EXISTS "Partner" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "phone" TEXT NOT NULL,
    "referralCode" TEXT NOT NULL UNIQUE,
    "upiId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "commissionRate" DOUBLE PRECISION NOT NULL DEFAULT 20.0,
    "totalEarned" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "totalPaid" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_partner_referral_code" ON "Partner"("referralCode");
CREATE INDEX IF NOT EXISTS "idx_partner_status" ON "Partner"("status");

-- ── 4. Referral (Clinic Onboarding Attribution) ──────────────
CREATE TABLE IF NOT EXISTS "Referral" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "partnerId" TEXT NOT NULL REFERENCES "Partner"("id") ON DELETE CASCADE,
    "businessId" TEXT,
    "clinicName" TEXT NOT NULL,
    "doctorName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "convertedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_referral_partner_id" ON "Referral"("partnerId");
CREATE INDEX IF NOT EXISTS "idx_referral_status" ON "Referral"("status");

-- ── 5. CommissionLedger (Automated Payout Tracking) ──────────
CREATE TABLE IF NOT EXISTS "CommissionLedger" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "partnerId" TEXT NOT NULL REFERENCES "Partner"("id") ON DELETE CASCADE,
    "referralId" TEXT REFERENCES "Referral"("id") ON DELETE SET NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "payoutDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_commission_partner_status" ON "CommissionLedger"("partnerId", "status");

-- ── 6. Row Level Security (RLS) Enablement ───────────────────
ALTER TABLE IF EXISTS "OptOutLog"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Partner"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Referral"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "CommissionLedger" ENABLE ROW LEVEL SECURITY;

-- ── 7. Role Grants ───────────────────────────────────────────
GRANT SELECT, INSERT, UPDATE, DELETE ON
  "OptOutLog",
  "Partner",
  "Referral",
  "CommissionLedger"
TO authenticated;

GRANT ALL ON
  "OptOutLog",
  "Partner",
  "Referral",
  "CommissionLedger"
TO service_role;

-- ── 8. Tenant Isolation & Access Policies ─────────────────────
-- OptOutLog: Tenant scoped to business owner
DROP POLICY IF EXISTS "optout_owner_all" ON "OptOutLog";
CREATE POLICY "optout_owner_all" ON "OptOutLog"
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM "Business" b WHERE b.id = "OptOutLog"."businessId" AND b."ownerId" = auth.uid()::text));

-- Partner: Authenticated users can query partner data
DROP POLICY IF EXISTS "partner_auth_all" ON "Partner";
CREATE POLICY "partner_auth_all" ON "Partner"
  FOR ALL TO authenticated
  USING (true);

-- Referral: Scoped to business owner or open affiliate referral
DROP POLICY IF EXISTS "referral_auth_all" ON "Referral";
CREATE POLICY "referral_auth_all" ON "Referral"
  FOR ALL TO authenticated
  USING ("businessId" IS NULL OR EXISTS (SELECT 1 FROM "Business" b WHERE b.id = "Referral"."businessId" AND b."ownerId" = auth.uid()::text));

-- CommissionLedger: Authenticated users can view commissions
DROP POLICY IF EXISTS "commission_auth_all" ON "CommissionLedger";
CREATE POLICY "commission_auth_all" ON "CommissionLedger"
  FOR ALL TO authenticated
  USING (true);
