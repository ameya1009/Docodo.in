# 🚀 Docodo.in: The Booking & CRM Operating System for Indian Local Businesses

> **"Turn Indian local service businesses (salons, clinics, gyms, spas, consultancies) into high-converting, automated booking engines in 15 minutes."**

Docodo.in provides local Indian business owners with instant online booking funnels (`/book/[slug]`), direct merchant settlement (0% platform fee direct UPI/cash), automated WhatsApp reminder and lead capture pipelines, multi-provider AI assistants, and customer CRM lifetime value tracking.

---

## 🏛️ Real Architecture: Next.js 16 Modular Monolith

Docodo is architected as a high-performance **Next.js 16 modular monolith** optimized for Vercel edge/serverless execution and PostgreSQL database pooling.

```text
Docodo.in/
├── frontend/                     # Next.js 16 (App Router) Unified Full-Stack Application
│   ├── prisma/                   # Prisma 7 PostgreSQL Schema & Seeder
│   │   ├── schema.prisma         # Relational data model (Multi-tenant Business, Bookings, Customers, CRM, Subscriptions)
│   │   └── seed.ts               # Demo data seeder for local businesses
│   └── src/
│       ├── app/                  # Next.js App Router (30+ Pages & API Routes)
│       │   ├── (auth)/           # Authentication flows (NextAuth v5 + credentials/Google)
│       │   ├── api/              # Serverless API Routes
│       │   │   ├── create-order/ # Docodo SaaS subscription order creation
│       │   │   ├── verify-payment/# HMAC-SHA256 signature verification & auto-provisioning
│       │   │   ├── webhooks/     # Razorpay & WhatsApp Meta Cloud webhooks
│       │   │   └── cron/         # 24-hour pre-appointment reminder workers
│       │   ├── book/[slug]/      # Public mobile-optimized customer booking page
│       │   ├── checkout/         # SaaS plan checkout (Starter, Growth, Concierge)
│       │   ├── dashboard/        # Merchant Operating System (Bookings, CRM, WhatsApp, Growth OS)
│       │   └── onboarding/       # 15-minute business setup wizard
│       ├── components/           # React 19 UI component system (Tailwind CSS, Framer Motion, Radix UI)
│       ├── lib/                  # Core domain engines & server actions
│       │   ├── actions/          # Next.js Server Actions (Bookings, CRM, AI, Auth)
│       │   ├── engines/          # Booking engine, multi-provider AI fallback cascade
│       │   ├── growth-os/        # Omnichannel discovery & content studio (with Simulation Mode)
│       │   ├── prisma.ts         # Resilient PostgreSQL pool with @prisma/adapter-pg
│       │   └── razorpay.ts       # Razorpay platform integration
│       └── tests/                # 17 Vitest test suites (115 unit & integration tests)
├── docs/                         # System specifications, runbooks, and audit registers
└── .agents/                      # Autonomous agent roles & workflow playbooks
```

---

## 💳 Payment Architecture & Separation

Docodo strictly isolates platform SaaS subscriptions from merchant appointment revenues:

1. **Docodo SaaS Subscriptions** (Starter ₹999/mo, Growth ₹2,499/mo, Concierge ₹4,999/₹9,999 setup):
   - Billed via Docodo's central platform Razorpay gateway (`/checkout` $\to$ `/api/create-order` $\to$ `/api/verify-payment`).
   - Secured with timing-safe HMAC-SHA256 verification (`crypto.timingSafeEqual`).
   - Auto-provisions user business accounts and tier entitlements upon verified payment.

2. **Merchant Client Bookings** (Haircuts, doctor visits, personal training):
   - End-customers booking on `/book/[slug]` pay **directly to the merchant** (0% platform fee).
   - Defaults to **Pay at Venue** (Cash / In-person UPI QR scan) or **Direct UPI** to merchant's registered business phone/VPA.
   - Merchant funds never touch Docodo's central Razorpay account.

---

## 🤖 Multi-Provider AI Fallback Cascade

Docodo powers customer chats, WhatsApp auto-replies, and marketing copy generation through an autonomous zero-downtime AI cascade:

```
Groq Llama 3.3 70B ──(HTTP 429/Error)──> Google Gemini 2.5 Flash ──> Cerebras Llama 3.3 ──> Meta AI / OpenCode ──> Local Heuristic Fallback
```

- Automatic 60s provider cooldowns on rate limits.
- Supports English, Hindi, and Hinglish for Indian customer conversations.
- Instant 1-click human staff takeover (`isBotPaused`).

---

## ⚡ Local Development Setup

### 1. Prerequisites
- Node.js 20+
- PostgreSQL 15+ (or cloud instance via Supabase, Neon, or Railway)

### 2. Install Dependencies & Generate Prisma Client
```bash
cd frontend
npm install
npx prisma generate
```

### 3. Configure Environment Variables
Copy `.env.example` to `frontend/.env.local` and configure your credentials:
```bash
cp .env.example frontend/.env.local
```

### 4. Run Migrations & Start Development Server
```bash
cd frontend
npx prisma db push
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Verification & Test Suite

Run the full automated Vitest test suite (17 suites, 115 tests):
```bash
cd frontend
npm test
```

Run TypeScript compilation check:
```bash
cd frontend
npx tsc --noEmit
```

---

## 🌐 Production Deployment (Vercel)

1. Connect the repository to **Vercel**.
2. Set **Root Directory** to `frontend`.
3. Set **Framework Preset** to `Next.js`.
4. Configure environment variables (`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`, etc.).
5. Deploy.

---

## 📄 License
MIT License. Built for high-growth Indian commerce outcomes. 🇮🇳
