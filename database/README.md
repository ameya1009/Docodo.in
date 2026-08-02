# @docodo/database Tier

This directory houses the master **Enterprise Database Tier** for the Docodo SaaS Platform, utilizing **Prisma 7** and **PostgreSQL** (`@prisma/adapter-pg` Edge driver architecture).

## Directory Architecture
- `prisma/schema.prisma`: Master relational data models shared between Frontend (Next.js) and Backend (Express AI/WhatsApp engine).
- `prisma.config.ts`: Connection profile defaults for Edge environments.
- `src/seed.ts`: Automated data bootstrapping script generating demo businesses, services, customers, and AI logs.

## Quickstart Commands
Navigate to this directory (`/database`) and execute:

```bash
# Install database migration tools and TypeScript drivers
npm install

# Push latest schema models directly to your PostgreSQL cloud instance
npm run push

# Generate Prisma Client types
npm run generate

# Populate database with realistic demonstration Indian SMB workflows
npm run seed
```

## Supported Cloud Providers
- Vercel Postgres / Neon Serverless SQL (`sslmode=require` supported)
- AWS RDS / Aurora PostgreSQL
- Supabase SQL Engine
- Railway / Render Postgres instances
