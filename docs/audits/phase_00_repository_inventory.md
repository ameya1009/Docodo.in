# Phase 00: Comprehensive Repository Inventory & Architecture Structure

## 1. Executive Summary

Docodo (`docodo.in`) is an integrated Next.js 16 (React 19) full-stack booking engine, CRM, and automated marketing operating system architected for Indian local service businesses (salons, clinics, spas, fitness centers, tutors, and consultants).

This repository inventory establishes the canonical baseline of all directories, source files, data schemas, server actions, client storefront interfaces, and automated test suites.

---

## 2. Directory Structure & Workspace Layout

```
Docodo.in/
├── .agents/                          # Agentic skills, workflows, and execution playbooks
│   └── skills/docodo-workflow/       # Multi-agent corporate operating system runbook
├── docs/                             # Documentation and persistent architectural audits
│   └── audits/                       # Phase 00 to 10 persistent forensic audit reports
├── database/                         # Database schema and seed assets
│   ├── schema.prisma                 # Canonical Prisma PostgreSQL schema
│   ├── migrations/                   # SQL migration files
│   └── seeds/                        # Pune clinics campaign and demo seed data
├── frontend/                         # Next.js 16 Web Application Monorepo
│   ├── public/                       # Static branding assets, icons, manifest
│   ├── src/
│   │   ├── app/                      # App Router routes & layouts
│   │   │   ├── (auth)/               # Login, Register, Password Reset routes
│   │   │   ├── (marketing)/          # Landing page, Tools hub, Pricing, Blog
│   │   │   ├── book/[slug]/          # High-converting public booking storefront
│   │   │   ├── dashboard/            # Merchant command center & vertical CRM
│   │   │   │   ├── bookings/         # Real-time booking management
│   │   │   │   ├── customers/        # Customer directory and lifetime value
│   │   │   │   ├── growth-os/        # Omnichannel lead acquisition engine
│   │   │   │   ├── revenue-os/       # Autonomous revenue & retention commander
│   │   │   │   ├── services/         # Service catalogue & pricing manager
│   │   │   │   ├── settings/         # Business profile, working hours, themes
│   │   │   │   └── tools/            # Free MSME utility directory
│   │   │   └── api/                  # Edge webhooks & serverless API handlers
│   │   ├── components/               # Reusable UI component library (shadcn/ui + Tailwind)
│   │   │   ├── ui/                   # Buttons, modals, tabs, tables, inputs
│   │   │   ├── booking/              # Calendar slot picker, checkout sheets
│   │   │   ├── dashboard/            # Metric cards, funnel charts, sidebar
│   │   │   └── shared/               # Navigation, footers, toast notifications
│   │   ├── lib/                      # Core architectural infrastructure
│   │   │   ├── actions/              # Next.js Server Actions (CRUD, Booking, Checkout)
│   │   │   ├── engines/              # Deterministic slot generator & AI copy engines
│   │   │   ├── prisma.ts             # Resilient connection-pooled Prisma client
│   │   │   ├── supabase-db.ts        # Resilient Supabase REST fallback proxy
│   │   │   ├── api-client.ts         # Unified backend API & WhatsApp dispatcher
│   │   │   ├── razorpay.ts           # Razorpay client & webhook verifier
│   │   │   └── utils.ts              # Formatting, currency (INR), cn helper
│   │   └── tests/                    # Automated Vitest test suite (17 suites, 115 tests)
│   ├── package.json                  # Dependencies & script definitions
│   ├── tsconfig.json                 # Strict TypeScript configuration
│   └── vitest.config.ts              # Vitest configuration & environment setup
├── .env.example                      # Production environment template
├── vercel.json                       # Edge routing, headers, and cron configurations
└── README.md                         # Project documentation and developer quickstart
```

---

## 3. Technology Stack & Dependency Matrix

| Layer | Technology | Purpose / Configuration |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.0.0 (Turbopack) | App Router, Server Components, Server Actions |
| **Language** | TypeScript 5.5.4 | Strict type checking (`0` compile errors) |
| **Styling** | Tailwind CSS 3.4.1 | Mobile-first responsive utilities, custom colors |
| **UI Components** | Radix UI + Lucide React | Accessible headless primitives & SVG icons |
| **Animations** | Framer Motion 11.3 | Hardware-accelerated UI transitions |
| **Primary ORM** | Prisma 5.18.0 | Native PostgreSQL pooler via `@prisma/adapter-pg` |
| **Secondary ORM** | `@supabase/supabase-js` 2.45 | Resilient REST fallback proxy for serverless queries |
| **AI Integration** | Google Generative AI (Gemini 2.5 Flash) | Contextual copy, WhatsApp campaigns, SEO generator |
| **Payments** | Direct UPI QR / Razorpay Webhooks | Zero-commission merchant settlement & crypto HMAC verification |
| **Test Runner** | Vitest 4.1.10 | Fast unit, integration, and security test suites |

---

## 4. Key Models and Entities

1. **User**: Authentication, system role (`OWNER`, `STAFF`, `ADMIN`), SaaS subscription plan (`STARTER`, `PRO`, `ENTERPRISE`).
2. **Business**: Multi-tenant business container (`slug`, `name`, `industry`, `workingHours`, `brandingConfig`).
3. **Service**: Catalogue items (`name`, `price`, `duration`, `bufferTime`, `isActive`).
4. **Booking**: Appointment lifecycle (`date`, `startTime`, `endTime`, `status`, `paymentStatus`, `paidAmount`).
5. **Customer**: CRM customer record (`name`, `phone`, `email`, `visitCount`, `lifetimeValue`).
6. **Enquiry**: Lead capture enquiries from storefront and campaign channels.
7. **WhatsAppLog**: Meta Graph API message logs (`SENT`, `DELIVERED`, `READ`, `FAILED`).
8. **GrowthCampaign / LeadGraph**: Targeted customer acquisition and reachability scoring.
9. **CODLedger / ConciergeOrder**: Payment reconciliation and done-for-you concierge service orders.

---

## 5. Architectural Quality Standards

- **0 Type Errors**: Enforced by `npx tsc --noEmit`.
- **100% Test Pass Rate**: 115 passing tests across 17 test suites.
- **Connection Resilience**: Dual-layer architecture gracefully falling back to Supabase REST if PostgreSQL connection limits are reached.
- **15-Minute Promise**: Under 7 inputs and 5 screens from signup to live storefront at `docodo.in/book/{slug}`.
