# Master Issue Register: Prioritized Vulnerabilities, Root Causes & Verified Resolutions

## 1. Executive Summary

This Master Issue Register documents all architectural, security, concurrency, and reliability issues identified across Docodo.in's development and production hardening phases. Every issue is categorized by severity (P0 to P3), analyzed for root cause, documented with code diffs, and verified through automated regression tests.

---

## 2. Issue Severity Classification

| Priority | Definition & Business Impact | SLA for Remediation | Resolution Status |
| :--- | :--- | :--- | :--- |
| **P0 (Critical)** | Data loss, security breach, double-booking, or complete service outage. | Immediate / Blocker | 100% Resolved |
| **P1 (High)** | Concurrency collision, payment processing failure, or onboarding blocker. | $< 24\text{ hours}$ | 100% Resolved |
| **P2 (Medium)** | AI rate limiting, degraded UX, or sub-optimal edge latency. | $< 48\text{ hours}$ | 100% Resolved |
| **P3 (Low)** | Phone number formatting discrepancies or minor cosmetic UI flaws. | Next Sprint | 100% Resolved |

---

## 3. Comprehensive Issue Register Matrix

### Issue 1: Database TCP Socket Exhaustion on Serverless Traffic Spikes [P0]
- **Symptom**: Serverless containers threw `P1001: Can't reach database server` under concurrent booking bursts.
- **Root Cause**: Next.js micro-containers opened unpooled direct TCP sockets, exceeding PostgreSQL connection limits ($> 100$ connections).
- **Permanent Fix**: Implemented `@prisma/adapter-pg` with native `pg.Pool` (`max: 10`, `connectionTimeoutMillis: 3000`) and an ES6 Proxy fallback to Supabase PostgREST HTTP API (`src/lib/supabase-db.ts`).
- **Verification**: `src/tests/security.test.ts` & `src/lib/prisma.ts`.

### Issue 2: Webhook Signature Timing Attack Vulnerability [P0]
- **Symptom**: Potential side-channel timing attack on payment signature verification.
- **Root Cause**: Webhook handler used standard string comparison (`===`), allowing byte-by-byte timing inference.
- **Permanent Fix**: Replaced with `crypto.timingSafeEqual` over fixed-length UTF-8 buffers in `src/lib/razorpay.ts`.
- **Verification**: `src/tests/razorpay.test.ts` (100% pass across all signature verification scenarios).

### Issue 3: Double-Booking Concurrency Collision During Simultaneous Checkouts [P1]
- **Symptom**: Two clients selecting the same 11:00 AM slot simultaneously could both receive booking confirmations.
- **Root Cause**: Read-then-write race condition occurring outside of an atomic transaction boundary.
- **Permanent Fix**: Wrapped slot reservation in `prisma.$transaction(..., { isolationLevel: "Serializable" })` and introduced 15-minute ghost-slot locks during checkout.
- **Verification**: `src/tests/booking.test.ts` (Simultaneous concurrent booking test cases).

### Issue 4: SSR Hydration Mismatch on Dynamic Date & Time Display [P1]
- **Symptom**: React 19 hydration warning on client mount due to server/client timezone difference.
- **Root Cause**: `new Date().toLocaleDateString()` evaluated on UTC server generated different markup than client in `Asia/Kolkata`.
- **Permanent Fix**: Enforced explicit `Asia/Kolkata` timezone normalization in shared formatters and added `suppressHydrationWarning` on root layout element.
- **Verification**: `src/tests/website.test.ts` & clean browser console logs.

### Issue 5: AI Marketing Key Lockout on HTTP 429 Rate Limits [P2]
- **Symptom**: Copy generation failed when third-party AI provider hit monthly/minute rate limits.
- **Root Cause**: Hard dependency on a single AI provider without fallback redundancy.
- **Permanent Fix**: Engineered a 5-tier fallback cascade (`Groq Llama-3.3 70B` $\to$ `Gemini 2.5 Flash` $\to$ `Meta AI` $\to$ `Cerebras` $\to$ `Deterministic Local Heuristic`) with 60-second cooldown circuits.
- **Verification**: `src/tests/ai_engine.test.ts` (Simulated 429 provider failover tests).

### Issue 6: Indian Phone Number Format Fragmentation in CRM [P3]
- **Symptom**: Duplicate customer profiles created for `9876543210`, `+919876543210`, and `09876543210`.
- **Root Cause**: Customer phone strings were inserted raw without normalization.
- **Permanent Fix**: Implemented canonical E.164 phone normalizer regex stripping leading zeros and whitespace, enforcing standard `+91XXXXXXXXXX` format.
- **Verification**: `src/tests/crm.test.ts` (Phone deduplication tests).

---

## 4. Issue Resolution Summary

```
Total Identified Issues: 6
Total Verified Fixes:    6
P0/P1 Open Issues:       0
Master Register Verdict: 100% CLOSED & VERIFIED
```
