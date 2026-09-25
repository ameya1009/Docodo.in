# Phase 04: Backend Systems, Database Concurrency & Serverless Execution Audit

## 1. Backend Architecture Overview

Docodo's backend is implemented using Next.js 16 Server Actions and Route Handlers, designed for stateless serverless deployment with robust resilience layers.

---

## 2. Server Action Audit & Transaction Isolation

### Booking Creation Action (`src/lib/actions/booking.ts`):
- **Concurrency Isolation**: Executes inside a `prisma.$transaction` configured with `isolationLevel: "Serializable"`.
- **Double-Booking Prevention**:
  ```ts
  // Atomic slot availability check & write
  const existingConflict = await tx.booking.findFirst({
    where: {
      businessId,
      date,
      startTime,
      status: { not: "CANCELLED" },
    },
  });
  if (existingConflict) {
    throw new Error("This slot has just been reserved. Please select another time.");
  }
  ```
- **Upsert Customer CRM Record**: Automatically creates or updates the customer record in the same atomic transaction, calculating aggregate visit count and lifetime value.

### Enquiry Capture Action (`src/lib/actions/enquiry.ts`):
- Sanitizes incoming phone numbers, validates length ($\ge 10$ digits), and records public enquiries with automatic merchant notification triggers.

---

## 3. Database Connection Pooling & Resilience Proxy

### Connection Pool Configuration (`src/lib/prisma.ts`):
```ts
const pool = new Pool({
  connectionString: dbUrl,
  ssl: isCloudPostgres ? { rejectUnauthorized: false } : undefined,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 3000,
});
```

### Resilient Supabase REST Fallback (`src/lib/supabase-db.ts`):
- If the primary PostgreSQL pooler returns connection errors (`P1001`, `ECONNREFUSED`, `ETIMEDOUT`), the proxy catches the exception and dynamically routes the query via PostgREST / Supabase JS client.
- **Service Role Key Priority**: `supabaseAdmin` prioritizes `process.env.SUPABASE_SERVICE_ROLE_KEY` over publishable/anon keys to ensure unrestricted backend access during edge execution.

---

## 4. Webhook Ingestion & Dead Letter Queue

### WebhookQueueManager (`src/lib/webhooks/queue.ts`):
- Implements an in-memory & database-backed queue for asynchronous payment and messaging webhooks.
- **Retry Mechanism**: Exponential backoff with up to 3 retry attempts for transient network failures.
- **Zero Data Loss Guarantee**: Unprocessable payloads are persisted in a dead-letter log table for forensic inspection without dropping events.
