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
