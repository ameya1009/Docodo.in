# @docodo/backend-engine Tier

This directory houses the **Enterprise Backend & Automation Engine** for the Docodo SaaS Platform, built with **Node.js, Express, and TypeScript**. It provides background task orchestration, third-party webhook processing, and artificial intelligence generation.

## Core Services & Capabilities
1. **Google Gemini AI Hub (`/api/v1/ai/generate`)**: Connects directly to Google's generative models (`@google/generative-ai`) to produce conversion-optimized website copy, Instagram captions, WhatsApp promotional campaigns, and review replies.
2. **WhatsApp NDR & Marketing Broadcasts (`/api/v1/whatsapp`)**: Orchestrates Cloud API marketing blasts, automated appointment 24-hour confirmations, and real-time interactive Cash-on-Delivery (COD) fraud verification messages.
3. **Financial & Reconciliation Ledger (`/api/v1/ledger`)**: Tracks physical payments, dispute resolutions, and automated accounting syncs.

## Setup & Execution
Navigate to this directory (`/backend`) and run:

```bash
# Install server microservice dependencies
npm install

# Generate local database client types
npx prisma generate

# Run in development mode with live reload
npm run dev

# Build production TypeScript output
npm run build
```

## Frontend Connectivity & CORS
The backend API is pre-configured with secure **CORS policies** accepting incoming traffic from `http://localhost:3000` (local Next.js frontend) and the live production domain (`https://docodo.in`). Frontend server actions communicate with this layer via the unified `@docodo/api-client` sdk.
