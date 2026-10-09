# Docodo.in (`https://docodo.in`)
> The 15-minute booking storefront, CRM, and automation operating system for Indian local service businesses.

[![Build & Typecheck](https://img.shields.io/badge/Next.js-16%20Turbopack-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![ORM](https://img.shields.io/badge/Prisma-7.9-2D3748?style=flat-square&logo=prisma)](https://prisma.io)
[![Database](https://img.shields.io/badge/PostgreSQL-Supabase%20Cloud-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com)
[![Payments](https://img.shields.io/badge/Razorpay-Standard%20Checkout-02042B?style=flat-square&logo=razorpay)](https://razorpay.com)
[![Tests](https://img.shields.io/badge/Vitest-115%2F115%20Passing-6E9F18?style=flat-square&logo=vitest)](https://vitest.dev)

---

## Architecture Overview

```
                                 DOCODO.IN
                                     │
                 ┌───────────────────┴───────────────────┐
                 ▼                                       ▼
        MARKETING STOREFRONT                       MERCHANT HUB
         (Public Pages & SEO)                    (NextAuth v5 JWT)
                 │                                       │
            /book/[slug]                             /dashboard
                 │                                       │
                 └───────────────────┬───────────────────┘
                                     ▼
                          NEXT.JS SERVER ACTIONS
                                     │
                   ┌─────────────────┴─────────────────┐
                   ▼                                   ▼
          RESILIENT DB PROXY                  EXTERNAL AUTOMATIONS
          (PgPool ↔ Supabase)                 (Razorpay / WhatsApp)
```

---

## Key Features

1. **15-Minute Merchant Onboarding:**
   - Atomic business creation, service catalog setup, and working-hour schedules under a unified multi-tenant schema.
   - Public booking portals at `docodo.in/book/{slug}`.

2. **Concurrency & Double-Booking Shield:**
   - Server-level verification preventing overlapping booking intervals on active slots.
   - Idempotency key tracking and ghost-slot locking.

3. **Multi-Tenant Security & Anti-IDOR:**
   - Strict session-derived business resolution (`requireAuthBusiness`).
   - Constant-time HMAC-SHA256 signature verification (`crypto.timingSafeEqual`) for Razorpay webhooks.

4. **Zero-Failure WhatsApp Workflow:**
   - Dual-engine: Instant fallback to zero-cost `wa.me` click-to-chat links with pre-filled booking confirmations, plus Meta Graph API cloud dispatch when tokens are present.

---

## Directory Structure

```text
src/
├── app/                     # Next.js App Router (64 static, dynamic & API routes)
│   ├── api/                 # Serverless endpoints (Auth, Webhooks, Razorpay, Health)
│   ├── book/[slug]/         # Live public appointment booking storefront
│   ├── dashboard/           # Authenticated merchant control center
│   └── (marketing)/         # High-converting landing & programmatic SEO routes
├── components/              # Modular UI components, layout sidebars & action centers
├── lib/
│   ├── actions/             # Secure Next.js Server Actions (Auth, Bookings, CRM)
│   ├── engines/             # Pure algorithmic business logic & analytics calculators
│   ├── prisma.ts            # Resilient database connection proxy
│   └── supabase-db.ts       # Cloud failover client
└── tests/                   # 17 comprehensive Vitest suites (115 passing tests)
```

---

## Getting Started

### 1. Prerequisites
- **Node.js** `>= 20.x`
- **PostgreSQL** database (Supabase, Neon, or local Postgres)

### 2. Installation
```bash
git clone https://github.com/ameya1009/Docodo.in.git
cd Docodo.in/frontend
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env.local` and configure your credentials:
```bash
NEXTAUTH_URL="https://docodo.in"
NEXT_PUBLIC_APP_URL="https://docodo.in"
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

### 4. Database Initialization
```bash
npx prisma generate
npx prisma db push
npm run seed
```

### 5. Running the App
```bash
# Start Turbopack development server
npm run dev

# Run automated test suites (115 tests)
npm test

# Build for production
npm run build
```

---

## Quality Gate Checklist

Every pull request must satisfy:
- [x] **Typecheck:** `npx tsc --noEmit` (0 errors)
- [x] **Test Suite:** `npm test` (100% pass rate)
- [x] **Turbopack Build:** `npm run build` (Clean exit code 0)
- [x] **Health Check:** `GET /api/health` returns `200 OK`
