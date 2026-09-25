# Phase 07: Security Architecture, Multi-Tenant Isolation & Anti-Abuse Audit

## 1. Multi-Tenant Data Isolation & Access Controls

Docodo operates a multi-tenant database schema where data segregation is maintained at both the application layer (Prisma query scoping) and database layer (PostgreSQL Row Level Security).

### Tenancy Enforcement Rules:
1. **Query-Level Scoping**: Every database read and write explicitly includes `where: { businessId }` or `where: { ownerId }`.
2. **Owner-Only Dashboard Access**: Next.js middleware and server actions verify user session authentication before returning business telemetry or CRM customer records.
3. **Public Storefront Boundaries**: Public `/book/[slug]` and `/enquiry` endpoints expose only published services and non-sensitive business metadata (working hours, business name, phone).

---

## 2. Cryptographic Security & Webhook Hardening

- **Timing-Safe HMAC Verification**: All incoming Razorpay payment capture webhooks utilize `crypto.timingSafeEqual` over SHA-256 HMAC digests, completely eliminating side-channel timing attacks.
- **Service Role Key Hierarchy**:
  - `SUPABASE_SERVICE_ROLE_KEY`: Reserved strictly for server-side trusted operations in `src/lib/supabase-db.ts`.
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Restricted to client-side read-only operations with Row Level Security (RLS) enforcement.

---

## 3. Anti-Abuse & Rate Limiting

- **Token Bucket Rate Limiting**: Applied to public booking requests and lead enquiry submissions to prevent brute-force automated slot exhaustion attacks.
- **Input Sanitization & Schema Validation**:
  - Phone numbers: Validated against strict E.164 / Indian 10-digit mobile formats.
  - Names and text inputs: Trimmed and sanitized against cross-site scripting (XSS) and injection vectors.
- **No-Password Leakage**: Passwords hashed using bcrypt/argon2 standards with salt; zero plain-text storage across all environments.
