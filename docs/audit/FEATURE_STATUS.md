# Docodo.in — Comprehensive Feature Status & Maturity Matrix

**Document Reference:** `docs/audit/FEATURE_STATUS.md`  
**Review Standard:** Production Feature Catalog & Technical Debt Ledger  
**Date:** 10 October 2026  
**Auditor:** Lead Product Architect  

---

## 1. Feature Maturity Classification

Each capability within Docodo is classified into one of four maturity tiers:
- **GA (General Availability / Production Ready):** Fully implemented, verified with automated tests, and tested across key user journeys.
- **Pilot Ready:** Functionally complete, validated in staging; requires real-world merchant cohort exposure.
- **Beta / Emerging:** Functional foundation present; secondary edge cases or third-party webhooks undergoing final polish.
- **Deferred / Backlog:** Explicitly scheduled for subsequent release phases.

---

## 2. Complete Feature Catalog & Maturity Matrix

| Module & Feature | Route / File Path | Maturity Tier | Automated Test Coverage | Status & Operational Capabilities |
| :--- | :--- | :---: | :---: | :--- |
| **15-Min Onboarding Wizard** | `/onboarding`<br/>`src/app/onboarding/page.tsx` | **GA** | `onboarding.test.ts`<br/>`acceptance_15min.test.ts` | 5-step wizard with automatic guest user creation, slug generation, and seamless dashboard auto-login. |
| **Public Booking Storefront** | `/book/[slug]`<br/>`src/app/book/[slug]/page.tsx` | **GA** | `booking.test.ts` | Real-time slot availability, service cards, date strip, customer details input, and dual payment checkout. |
| **Pay-at-Venue (COD)** | `/book/[slug]`<br/>`src/lib/actions/booking.ts` | **GA** | `booking.test.ts` | Instantly marks slot as `CONFIRMED` and `UNPAID` under `CASH_ON_DELIVERY`, preventing double-booking lockouts. |
| **Razorpay Online Payments** | `/api/create-order`<br/>`/api/verify-payment` | **GA** | `razorpay.test.ts`<br/>`security.test.ts` | Server-calculated amounts, constant-time HMAC SHA-256 verification, support for Google Pay, PhonePe, and cards. |
| **Synchronous Webhook Worker** | `/api/webhooks/razorpay`<br/>`src/lib/queue/webhook-queue.ts`| **GA** | `razorpay.test.ts` | Awaits worker jobs synchronously to eliminate serverless runtime freezes on Vercel AWS Lambda. |
| **Merchant Dashboard Overview** | `/dashboard`<br/>`src/app/dashboard/page.tsx` | **GA** | `dashboard.test.ts` | Real-time metrics for today's bookings, total revenue, upcoming appointments, and quick share links. |
| **Appointment Manager** | `/dashboard/bookings`<br/>`src/app/dashboard/bookings/page.tsx`| **GA** | `dashboard.test.ts` | Full calendar and list views, status updating (`COMPLETED`, `CANCELLED`, `NO_SHOW`), and walk-in entry. |
| **Client Directory & CRM** | `/dashboard/customers`<br/>`src/app/dashboard/customers/page.tsx`| **GA** | `crm.test.ts` | Client lifetime visits, total spend tracking, appointment history, and 1-tap WhatsApp chat links. |
| **Service Menu Editor** | `/dashboard/website`<br/>`src/app/dashboard/website/page.tsx`| **GA** | `website.test.ts` | Dynamic service management (add/edit/delete, toggle visibility, price and duration adjustments). |
| **WhatsApp Automation Center** | `/dashboard/whatsapp`<br/>`src/app/dashboard/whatsapp/page.tsx`| **Pilot Ready** | `discovery.test.ts` | Template generators for confirmations, 24h & 2h reminders, and review requests with `wa.me` links. |
| **Marketing Automations** | `/dashboard/automations`<br/>`src/app/dashboard/automations/page.tsx`| **Pilot Ready** | `growth_os.test.ts` | Automated triggers for 45-day inactive client win-backs, seasonal promotions, and birthday wishes. |
| **AI Content Studio** | `/dashboard/ai-content`<br/>`src/app/dashboard/ai-content/page.tsx`| **Pilot Ready** | `ai_engine.test.ts` | Generates Instagram captions, promotional WhatsApp broadcasts, and seasonal festival offers. |
| **Revenue OS Analytics** | `/dashboard/revenue-os`<br/>`src/app/dashboard/revenue-os/page.tsx`| **GA** | `revenue_os.test.ts` | Financial charts, average ticket size, busiest operating slots, and revenue projections. |
| **Growth OS Viral Loops** | `/dashboard/growth-os`<br/>`src/app/dashboard/growth-os/page.tsx`| **Pilot Ready** | `growth_os.test.ts` | Referral tracking and viral "Powered by Docodo" booking link conversion attribution. |
| **SaaS Pricing & Checkout** | `/pricing`, `/checkout`<br/>`src/app/checkout/page.tsx` | **GA** | `entitlements.test.ts` | Guest SaaS plan checkout with automated user provisioning and business entitlement activation. |
| **Programmatic Niche Pages** | `/for/[slug]`<br/>`src/app/for/[slug]/page.tsx` | **GA** | `discovery.test.ts` | Static landing pages for salons, clinics, spas, fitness trainers with rich `LocalBusiness` JSON-LD schema. |
| **External REST API v1** | `/api/v1/bookings`<br/>`src/app/api/v1/bookings/route.ts` | **GA** | `security.test.ts` | Secured REST endpoint with token-based authentication and strict BOLA/IDOR protection. |
| **Automated Reminder Cron** | `/api/cron/reminders`<br/>`src/app/api/cron/reminders/route.ts`| **Pilot Ready** | `acceptance_15min.test.ts`| Identifies upcoming appointments within 24h and 2h windows to dispatch reminders. |
| **3D Ambient Interactive Hero** | `/` (Homepage)<br/>`src/components/canvas/Scene.tsx` | **GA** | Visual / Build Pass | Lightweight `@react-three/fiber` visual experience with graceful mobile and non-WebGL fallbacks. |
| **Offline Desktop Engine** | `ak/`<br/>Workspace Root | **GA** | `tests/test_*.py` (22 tests) | Python 3.12 local station with SQLite storage, safe port 8000 binding, and terminal CLI. |

---

## 3. Technical Debt Ledger (Ponytail Minimization Review)

| Debt Item | Location | Priority | Rationale / Resolution |
| :--- | :--- | :---: | :--- |
| **Prisma vs. PostgREST Dual Lookup** | `src/lib/auth.ts`<br/>`src/lib/actions/onboarding.ts` | Low | Dual lookup ensures login works whether connected via direct PostgreSQL pool or PostgREST fallback. Keep until direct pool is permanently guaranteed. |
| **Localhost Fallback Safe Check** | `src/lib/prisma.ts` | Resolved | Replaced silent localhost connection fallback with explicit warning and graceful failure handling. |
| **Port 3389 Collision in Desktop Engine** | `ak/config.py` | Resolved | Changed default port from 3389 (Windows RDP conflict) to 8000. |
| **Direct WhatsApp Cloud API Webhook** | `/dashboard/whatsapp` | Medium | Currently utilizes zero-cost `wa.me` deep links. Full two-way WhatsApp Cloud API bot is scheduled for Phase 2. |
