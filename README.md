# 🚀 DOCODO: The Autonomous AI Operating System for Indian Local Business Commerce

> **"Do NOT build software. Build outcomes."**  
> Docodo transforms brick-and-mortar SMBs (salons, clinics, gyms, home contractors, wellness therapists) into AI-driven conversion powerhouses in under 15 minutes—featuring automated WhatsApp NDR defense, live booking funnels, instant Razorpay UPI ledgers, and conversational Google Gemini content generation.

---

## 🏛️ Modular 3-Tier Architecture

Docodo is structured as an Enterprise 3-Tier Monorepo, allowing decoupled cloud containerization (Vercel + Railway/Render + Neon/Supabase Postgres):

```
Docodo.in/
├── frontend/   # [Tier 1] Next.js 16 (App Router) Mobile-First Responsive UI & Dashboard
├── backend/    # [Tier 2] Express + TypeScript Microservice Engine (Gemini AI, WhatsApp NDR, COD Ledgers)
└── database/   # [Tier 3] Prisma 7 PostgreSQL Master Schema, Migrations & Demonstration Seeders
```

---

### 📱 Tier 1: `@docodo/frontend` (Next.js 16 + Tailwind CSS)
- **Strict Mobile-First Design System**: Features a persistent, glassmorphic floating **Bottom Navigation Bar** optimized for one-handed thumb ergonomics on smartphones (where 95% of Indian SMB operators manage their business).
- **Comprehensive SaaS Suites**:
  - `/onboarding/step/1-4`: 15-minute live onboarding wizard with generative AI hero copy creation.
  - `/dashboard/whatsapp`: Real-time WhatsApp Automated NDR & No-Show Shield monitor with simulated smartphone chat previews.
  - `/dashboard/analytics`: Touch-friendly revenue growth charts and conversion KPI cards.
  - `/book/[slug]`: Ultra-fast customer booking pages with instant calendar confirmation.

### ⚙️ Tier 2: `@docodo/backend-engine` (Node/Express + TypeScript)
- **Google Gemini AI Hub (`/api/v1/ai/generate`)**: Integrates Google Generative AI (`gemini-2.5-flash`) with intelligent high-converting fallback copy engines to write Instagram ads, SEO meta titles, and 5-star review responses.
- **WhatsApp Automation Engine (`/api/v1/whatsapp`)**: Webhook dispatcher managing 24-hour appointment reminder buttons, instant booking tickets, and automated review collection.
- **Financial Ledger & COD Fraud Defense (`/api/v1/ledger`)**: Reconciles physical Cash-on-Delivery collections and automated online payment ledgers.
- **Connectivity & Resilience**: Connected to Frontend Server Actions via `@docodo/api-client`. Pre-configured with strict CORS security rules and automated offline fallback queueing.

### 🗄️ Tier 3: `@docodo/database` (Prisma 7 + PostgreSQL)
- **Universal Edge Postgres Drivers**: Powered by `@prisma/adapter-pg` and native connection pools, fully supporting Neon Serverless SQL and AWS RDS (`sslmode=require`).
- **One-Click Bootstrap Seeder (`src/seed.ts`)**: Initializes demo accounts, "Docodo Wellness & Spa Mumbai" demonstration catalogues, working hours schedules, VIP customer CRM lists, and WhatsApp transaction histories.

---

## ⚡ Quickstart Setup Guide

### 1️⃣ Initialize Database Layer
```bash
cd database
npm install
npm run push         # Sync relational schema to your Postgres URL
npm run generate     # Generate TypeScript ORM clients
npm run seed         # Populate realistic demonstration data
```

### 2️⃣ Start Backend Automation Engine
```bash
cd ../backend
npm install
npx prisma generate
npm run dev          # Starts Express microservices on http://localhost:5000
```

### 3️⃣ Start Mobile-First Frontend OS
```bash
cd ../frontend
npm install
npm run dev          # Starts Next.js dashboard on http://localhost:3000
```

---

## 🌐 Production Deployment Guide
- **Frontend (`/frontend`)**: Deploy directly to Vercel or AWS Amplify. Set Project Root Directory to `frontend`.
- **Backend (`/backend`)**: Deploy Dockerized container or direct Node builds to Railway, Render, AWS ECS, or Google Cloud Run. Set port to `5000`.
- **Database (`/database`)**: Connect to any cloud managed PostgreSQL instance (Vercel Postgres, Supabase SQL, Neon Serverless).

---

*Built with passion for high-growth Indian commerce outcomes.* 🇮🇳✨
