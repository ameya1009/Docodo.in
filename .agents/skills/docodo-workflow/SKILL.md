---
name: docodo-workflow
description: >-
  Comprehensive guide, operational playbook, and full-stack runbook for building,
  maintaining, and scaling Docodo.in (the 15-minute booking & CRM operating system
  for Indian local service businesses).
---

# Docodo.in Full-Stack Workflow & Architectural Playbook

## Overview
Docodo (docodo.in) is an all-in-one booking storefront, CRM, and simple automation platform purpose-built for Indian local service businesses (salons, spas, clinics, gyms, trainers, tutors, and freelancers).

--------------------------------------------------------------------------------

## Architectural Hierarchy

```
                    DOCODO.IN
                       │
          ┌────────────┴────────────┐
          │                         │
    MARKETING SITE              SAAS APP
     (Public Pages)          (Merchant Hub)
          │                         │
     Learn / Buy                  Login
          │                         │
          │                     Dashboard
          │                         │
          └────────────┬────────────┘
                       │
                  BACKEND API
                       │
                  DATABASE
              (PostgreSQL)
       ┌───────────────┼───────────────┐
       │               │               │
    Bookings       Customers       Enquiries
       │               │               │
       └───────────────┼───────────────┘
                       │
                AUTOMATION LAYER
                       │
             ┌─────────┼─────────┐
             │         │         │
          WhatsApp   Email     Payments
```

--------------------------------------------------------------------------------

## Core Production Rules & Guardrails

### 1. 15-Minute Setup Standard
* Business creation, service catalogue generation, and availability schedule must complete in an atomic Prisma transaction under 15 minutes.
* Default live URL format: `docodo.in/book/{slug}`.

### 2. Double-Booking Prevention
* Booking creation in `src/lib/actions/booking.ts` MUST always run inside `isolationLevel: "Serializable"` transactions.
* Enforce 15-minute ghost-slot locks during checkout.

### 3. PostgreSQL Connection Pooling
* Always use `@prisma/adapter-pg` with native `pg.Pool` manager.
* Enable SSL auto-negotiation (`rejectUnauthorized: false`) for cloud databases (Supabase, Neon, AWS RDS, Railway, Render).
* Maintain `max: 10`, `connectionTimeoutMillis: 10000`, `idleTimeoutMillis: 30000`.

### 4. Zero-Cost Multi-Provider AI Cascade
* Maintain the 5-tier fallback cascade:
  `Groq (Llama 3.3 70B) -> Gemini 2.5 Flash -> Meta AI / OpenCode -> Cerebras -> Deterministic Local Heuristic`
* Apply automatic 60-second cooldowns upon HTTP 429 rate limits.
* Support Indian dialects (Hindi, Marathi, Hinglish, English) with non-clinical safety guardrails.
* Support 1-click human handoff via `Conversation.isBotPaused`.

### 5. Cryptographic Security & Anti-Abuse
* Enforce timing-safe constant-time comparison (`crypto.timingSafeEqual`) on all Razorpay webhooks and payment captures.
* Apply token bucket rate limiting on public `/book` and `/enquiry` actions.

--------------------------------------------------------------------------------

## Standard Quality Gate Commands

Before pushing any changes or declaring a task complete:

```bash
# 1. Typecheck (0 errors)
npx tsc --noEmit

# 2. Automated Test Suite (100% pass)
.\node_modules\.bin\vitest.cmd run

# 3. Turbopack Production Build (0 errors)
npm run build

# 4. Sync Git Remote
git add .
git commit -m "feat/fix: description"
git push origin main
```

--------------------------------------------------------------------------------

## Multi-Agent Corporate Operating System & Governance

Docodo operates under a circular multi-agent execution pipeline composed of 8 specialized agents:

```
[CEO Request]
      │
      ▼
[1. Product Manager (CPO)] ──(Generates Task List)──► [2. Chief Systems Architect]
                                                              │ (Validates ADR)
                                                              ▼
[4. QA Gatekeeper] ◄──────(Submits Code Diffs)─────── [3. Fullstack Engineer]
        │
   [Score < 85] ──► (Rejection Loop back to Step 3)
   [Score ≥ 85]
        │
        ├─────────────────────────────┐
        ▼                             ▼
[5. DevOps Agent]              [6. Growth / Marketing]
(Deploys & Verifies Edge)      (Activates WhatsApp Loops)
        │                             │
        └──────────────┬──────────────┘
                       ▼
              [7. CFO Agent]
              (Audits Unit Margins)
```

### Agent Roster & Invocable Subagent IDs

1. **`chief_architect` (Executive / Chief Systems Architect)**:
   - Modular monolith governance, sub-1500ms serverless timeout cap, zero data loss, dynamic vertical code splitting, asynchronous message queues (QStash/Inngest).
2. **`cpo_agent` (Principal Product Manager)**:
   - 15-minute setup guardian: $\le 7$ inputs, $\le 5$ screen transitions, 100% mobile-first execution, task list specs.
3. **`fullstack_engineer` (Senior Fullstack & Distributed Systems Engineer)**:
   - Zero incomplete code, timing-safe HMAC Razorpay verification, Idempotency-Key table, Redis SETNX slot pre-locking (900s TTL), multi-tenant composite indexing.
4. **`frontend_architect` (Lead UI/UX & Client Performance Engineer)**:
   - Sub-200ms TTFB, 0.00 CLS, FCP $\le 0.8\text{s}$ on 4G, zero SSR hydration mismatches, bottom 40% thumb interaction zones.
5. **`ruthless_qa_reviewer` / `qa_gatekeeper` (Principal QA & Performance Evaluator)**:
   - Final veto power across 4 scoring rubrics: Computational Efficiency, Concurrency & Data Integrity, Modularity & Bundle Size, The 15-Minute Promise. Strict score $\ge 85/100$ threshold required for production approval.
6. **`devops_economist` (DevOps & Infrastructure Economist)**:
   - Compute cost $\le ₹10$ per 1,000 bookings, PgBouncer/Supabase poolers, SWR edge caching, zero bundle inflation.
7. **`growth_engine` (Head of Product-Led Growth & B2B Sales)**:
   - CAC $\to ₹0$, dynamic "Powered by Docodo" WhatsApp viral loop on every booking confirmation, 15-minute abandoned checkout recovery.
8. **`financial_analyst` / `cfo_analyst` (Chief Financial Officer & Unit Economist)**:
   - Unit economics sensitivity modeling under 100, 1,000, and 50,000 active businesses, WhatsApp 24-hour service window cost arbitrage, transaction margin protection ($\text{Margin} > 0$).
