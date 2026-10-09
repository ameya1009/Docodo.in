# Docodo.in — Remediation & Production Execution Plan

**Document Reference:** `docs/audit/REMEDIATION_PLAN.md`  
**Review Standard:** DevSecOps & Product Remediation Roadmap  
**Date:** 10 October 2026  
**Auditor:** Principal Software Architect & Release Manager  

---

## 1. Remediation Status & Phased Roadmap

This remediation plan establishes a clear, risk-mitigated progression from completed code fixes to real-world commercial pilot execution and scale.

```mermaid
gantt
    title Docodo.in Engineering & Commercial Roadmap
    dateFormat YYYY-MM-DD
    section Phase 0 (Completed)
    Code Audit & Vulnerability Fixes    :done, 2026-10-08, 2026-10-10
    Vitest & Pytest Automated Suites     :done, 2026-10-09, 2026-10-10
    Turbopack Build Stabilization        :done, 2026-10-09, 2026-10-10
    section Phase 1 (Immediate Pilot)
    Supabase RLS Policy Migration        :active, 2026-10-10, 2026-10-12
    Vercel Live Env Credentials Setup    :2026-10-11, 2026-10-13
    10-Merchant Controlled Pilot Run     :2026-10-14, 2026-10-28
    section Phase 2 (Growth & Scale)
    WhatsApp 2-Way Rescheduling Bot      :2026-10-25, 2026-11-10
    Multi-Staff & Resource Scheduling    :2026-11-05, 2026-11-20
    Programmatic Local SEO Rollout       :2026-11-15, 2026-12-05
```

---

## 2. Completed Fixes Summary (Phase 0)

| Issue ID | Component | Severity | Root Cause | Remediated Code / File | Status |
| :--- | :--- | :---: | :--- | :--- | :---: |
| **ONB-001** | `/onboarding` | P0 | Guest users hit missing credentials and redirect failure on Steps 4 & 5 | `src/app/onboarding/page.tsx`<br/>`src/lib/actions/onboarding.ts` | **FIXED** |
| **PAY-001** | `/checkout` | P0 | Guest SaaS subscribers had no user account created upon payment | `src/app/checkout/page.tsx`<br/>`src/lib/queue/webhook-queue.ts` | **FIXED** |
| **BKG-001** | `/book/[slug]` | P0 | Pay-at-Venue bookings expired after 15m, causing double-bookings | `src/app/book/[slug]/BookingPageClient.tsx`<br/>`src/lib/actions/booking.ts` | **FIXED** |
| **WHK-001** | Webhooks | P1 | Asynchronous worker promises froze on serverless lambda completion | `src/app/api/webhooks/razorpay/route.ts` | **FIXED** |
| **SEC-001** | API v1 | P1 | Public `business.id` was accepted as `x-api-key` (BOLA/IDOR) | `src/app/api/v1/bookings/route.ts` | **FIXED** |
| **PYT-001** | Offline App | P2 | Missing pythonpath in `pyproject.toml` caused `pytest` import error | Root `pyproject.toml`<br/>`ak/config.py` (Port 8000) | **FIXED** |

---

## 3. Immediate Action Items (Phase 1: Pilot Launch)

### Action 1.1: Supabase RLS Migration Execution
- **Target:** Supabase Cloud PostgreSQL Instance
- **Action:** Open Supabase SQL Editor and execute:
  ```sql
  -- File: supabase/migrations/20260905000001_enable_rls_policies.sql
  ALTER TABLE "Business" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "Booking" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "Customer" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "Service" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "Subscription" ENABLE ROW LEVEL SECURITY;
  ```
- **Rationale:** Prevents unauthorized PostgREST REST direct reads if publishable anon keys are inspected via browser developer tools.

### Action 1.2: Vercel Production Environment Audit
- **Target:** Vercel Dashboard Settings (`https://vercel.com`)
- **Required Environment Variables:**
  - `DATABASE_URL`: Production Supabase pooled transaction connection string (`postgresql://postgres.[ref]:[pass]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true`).
  - `DIRECT_URL`: Supabase direct session string (`postgresql://postgres.[ref]:[pass]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres`).
  - `NEXTAUTH_SECRET`: Cryptographically random 32-character string.
  - `NEXTAUTH_URL`: `https://www.docodo.in`
  - `NEXT_PUBLIC_APP_URL`: `https://www.docodo.in`
  - `RAZORPAY_KEY_ID`: Live Razorpay key (`rzp_live_...`).
  - `RAZORPAY_KEY_SECRET`: Live Razorpay secret.
  - `RAZORPAY_WEBHOOK_SECRET`: Live webhook secret configured in Razorpay dashboard.

### Action 1.3: End-to-End Live Transaction Verification
- **Target:** Live website `https://www.docodo.in/book/test-merchant`
- **Steps:**
  1. Execute a real ₹10 UPI payment via Google Pay / PhonePe.
  2. Verify webhook delivers HTTP 200, updates booking status to `CONFIRMED`, and sends instant WhatsApp confirmation.
  3. Verify merchant dashboard reflects the booking and revenue within 1 second.

---

## 4. Medium-Term Growth Actions (Phase 2)

1. **Multi-Staff & Resource Scheduling:**
   - Extend the booking selector to allow customers to choose their preferred specialist (e.g., *"Senior Stylist Rahul"* vs *"Stylist Priya"*).
   - Ensure calendar availability automatically accounts for individual staff shift timings and vacations.
2. **Two-Way WhatsApp Automation:**
   - Connect the WhatsApp Business Cloud API to handle customer replies (e.g., replying *"1"* confirms appointment, replying *"2"* opens reschedule link).
3. **Done-For-You (DFY) Concierge Service (₹4,999 One-Time):**
   - Provide a concierge setup where the Docodo operations team manually inputs a salon’s 40-item service menu, prices, staff working hours, and links the page to their Google Maps profile.

---

## 5. Long-Term Scale Actions (Phase 3)

1. **Vernacular Multilingual Support:**
   - Add one-click language switching across the booking storefront into Hindi, Marathi, Gujarati, Tamil, and Kannada.
2. **Programmatic Local Directory Engine:**
   - Generate high-ranking search directory pages (e.g., `docodo.in/salons/pune`, `docodo.in/clinics/mumbai`) to drive direct high-intent traffic to merchants.
3. **Bi-Directional Offline Desktop Sync:**
   - Connect the local Python/SQLite offline desktop engine to the Supabase Postgres database using encrypted change-data-capture (CDC) sync, ensuring salons retain access during internet outages.
