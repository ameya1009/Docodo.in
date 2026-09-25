# DOCODO.IN — MASTER BLOCKER REGISTER (P0 - P3)

**Document Reference:** `docs/audits/MASTER_BLOCKER_REGISTER.md`  
**Classification:** Zero-Trust Post-Execution Issue Registry  
**Repository:** `ameya1009/Docodo.in` (`main`)  

---

## 1. Master Blocker Classification Table

| Priority | Issue ID | Component / File | Problem Description | Customer Impact | Revenue Impact | Security Impact | Exact Fix / Current Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **P0** | — | — | **NO P0 BLOCKERS DETECTED** | None | None | None | **CLEAR FOR PRODUCTION** |
| **P1** | BLK-P1-01 | `lib/growth-os/adapters/` | Social media auto-publishing (Instagram, LinkedIn) returns simulated results pending live Meta/LinkedIn Developer OAuth app approvals. | Manual social posting needed until OAuth keys added. | Minor delays in organic lead expansion. | None (safe simulation). | Configure production OAuth app credentials in `.env.local` upon Meta App Review approval. |
| **P1** | BLK-P1-02 | `lib/queue/webhook-queue.ts` | Upstash QStash tokens are optional; queue currently uses serverless asynchronous microtasks. | Minor retry latency if Vercel serverless worker restarts. | Zero data loss; webhook logged before queueing. | None. | Provide `QSTASH_TOKEN` and `QSTASH_URL` for multi-region queue workers. |
| **P2** | BLK-P2-01 | `lib/actions/auth.ts` | SMS OTP auth not implemented; auth uses Email/Password credentials + verification tokens. | Users must use email for password resets rather than mobile SMS. | Negligible for web users. | None. | Integrate Indian SMS gateway (Fast2SMS / MSG91) for 1-click mobile phone login. |
| **P2** | BLK-P2-02 | `app/book/[slug]` | Custom merchant domain CNAME mapping not automated via self-serve dashboard. | Merchants use `docodo.in/book/slug` rather than custom domain `clinic.com`. | None on initial onboarding. | None. | Implement Vercel Custom Domains API hook for Growth/Concierge tiers. |
| **P3** | BLK-P3-01 | `app/auth/reset-password/page.tsx` (L47) | Invalid token error link references `/auth/forgot-password` instead of `/auth/forgot`. | Minor navigation confusion on expired password links. | None. | None. | Update link href to `/auth/forgot`. |

---

## 2. Priority Definitions

- **P0 (Critical / Blocker):** Directly blocks security, tenant isolation, payment collection, or core booking functionality. (Must fix before real customers — **0 remaining**).
- **P1 (High / Pre-Scale):** Third-party live API credential setups (Meta/LinkedIn OAuth, QStash multi-region queueing) that enhance automated workflows.
- **P2 (Medium / Improvement):** Polish enhancements such as SMS OTP login and self-service custom CNAME provisioning.
- **P3 (Low / Cosmetic):** Minor navigation links and UI text refinements.
