# Phase 01: Git Regression & Root Cause Forensic Analysis

## 1. Executive Summary

This forensic git audit traces the evolution of the Docodo.in codebase across key milestones, diagnosing historical points of instability, regression patterns, and establishing permanent architectural guardrails against recurrence.

---

## 2. Commit Log Chronology & Forensic Analysis

| Commit SHA | Type | Substance of Change | Forensic Assessment |
| :--- | :--- | :--- | :--- |
| `784c118` | `fix(dashboard)` | Resolved post-login data loading exception & enabled universal multi-format file imports (CSV, XLSX, vCard). | **Fixed Regression**: Prevented unhandled null exception when new users lack associated business containers. |
| `06d8fb1` | `feat(revenue-os)` | Added interactive RevenueOS mission commander with live execution log streams. | **Enhancement**: Empowered merchants with automated reactivation, abandoned recovery, and review collection loops. |
| `635445d` | `feat(growth-os)` | Dynamic LeadGraph visual explorer with multi-entity lookup & reachability scoring. | **Enhancement**: Visualized high-density Pune MSME clusters for targeted outreach. |
| `0ab1e34` | `feat(growth-os)` | Added interactive Pune clinics campaign client with multi-channel copy preview & dispatch. | **Campaign Activation**: Provided one-click WhatsApp/SMS/Email previews with localized Marathi/Hindi/English templates. |
| `ab06bb0` | `feat(arch)` | Implemented zero-data-loss `WebhookQueueManager` & modular CRM vertical registry. | **Architectural Hardening**: Guarded asynchronous webhook processing against serverless restarts. |
| `4605f9e` | `fix(prod)` | Finalized order creation fallback & founder auth env resolution. | **Stabilization**: Handled edge cases during rapid merchant onboarding. |
| `61d9569` | `fix(prod)` | Auto-provision business container on direct checkout, added Growth OS RLS policies, and implemented real Supabase REST subscription queries. | **Core Fix**: Eliminated foreign-key violation traps on instant checkouts. |
| `fca26f1` | `chore(cleanup)` | Removed stale metadata scratch artifacts and purged dead files. | **Hygiene**: Cleaned repository root to reduce bundle overhead. |
| `fa67c3e` | `fix(ui)` | Connected opportunity matrix CTAs, upgraded tools hub directory, and added verified footer social links. | **UX Hardening**: Eliminated broken links and placeholder anchors. |
| `d9f8f31` | `fix(p0)` | Complete final P0 production remediation across all 16 architectural phases. | **Milestone**: Systematic resolution of early-stage platform blockers. |

---

## 3. Historical Root Cause Diagnoses

### Issue 1: Database Socket Starvation under Serverless Scaling
- **Symptom**: Intermittent `P1001: Can't reach database server at localhost:5432` during serverless cold starts and traffic surges.
- **Root Cause**: Serverless lambda functions spawning direct unpooled TCP connections to PostgreSQL, quickly exceeding maximum connection limits.
- **Remediation**: 
  1. Configured `@prisma/adapter-pg` with native `pg.Pool` connection manager (`max: 10`, `idleTimeoutMillis: 30000`, `connectionTimeoutMillis: 3000`).
  2. Implemented the dynamic `PrismaClient` proxy in `src/lib/prisma.ts` that detects socket exhaustion errors (`isDbConnectionError`) and automatically routes queries through the Supabase REST API via `src/lib/supabase-db.ts`.

### Issue 2: Centralized Payment Routing Bottleneck (SaaS Platform Key)
- **Symptom**: Storefront transactions failing when platform Razorpay keys were unconfigured or hit rate limits; customer funds aggregated into SaaS platform account creating regulatory escrow liability.
- **Root Cause**: Forced payment routing through a single platform Razorpay account rather than direct merchant-to-customer settlement.
- **Remediation**: Decoupled storefront payment flows into Direct Merchant Settlement (Direct UPI QR / Pay at Venue), providing 0% commission direct merchant payments with zero platform escrow exposure.

### Issue 3: WhatsApp Meta Graph API Window Expiration
- **Symptom**: Transactional booking confirmations failing to deliver to customers outside the 24-hour customer-initiated conversation window.
- **Root Cause**: Attempting to send freeform `type: "text"` messages instead of pre-approved Meta Graph API `type: "template"` payloads.
- **Remediation**: Implemented `DocodoBackendAPI.buildWhatsAppTemplatePayload` and dual-mode dispatch logic in `api-client.ts` (`type: "template"` with fallback to `type: "text"`).

---

## 4. Anti-Regression Guardrails

1. **Automated Continuous Testing**: Mandatory 100% test pass threshold across all 17 Vitest test suites prior to deployment.
2. **Strict Type Safety**: `npx tsc --noEmit` enforced with 0 acceptable type errors or unvalidated `any` casts.
3. **Idempotent Migration Strategy**: All database schema changes versioned through Prisma migrations with corresponding Supabase REST fallback handlers.
