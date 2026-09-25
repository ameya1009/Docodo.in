# Production Runbook & Incident Response Operating Procedures

## 1. Incident Severity Definitions & Escalation SLAs

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   INCIDENT ESCALATION MATRIX                                     │
│                                                                                                  │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐                │
│   │   SEV-0      │     │   SEV-1      │     │   SEV-2      │     │   SEV-3      │                │
│   │ (Critical)   │     │   (High)     │     │  (Medium)    │     │   (Low)      │                │
│   │ Ack: < 5 min │     │ Ack: < 15 min│     │ Ack: < 1 hr  │     │ Ack: < 4 hr  │                │
│   │ Fix: < 30 min│     │ Fix: < 2 hrs │     │ Fix: < 8 hrs │     │ Fix: Next Rel│                │
│   └──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘                │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

- **SEV-0 (Critical Blocker)**: Core booking engine down across all merchants; database completely unreachable; payment double-charges.
- **SEV-1 (High Degradation)**: Merchant dashboard login failing; WhatsApp notifications failing; single-merchant storefront corrupted.
- **SEV-2 (Moderate Failure)**: AI marketing copy generator returning fallbacks; analytics dashboard reporting delays.
- **SEV-3 (Minor Bug)**: Cosmetic UI alignment issue; non-blocking logging discrepancy.

---

## 2. Emergency Operational Runbooks

### Runbook A: Database Socket Drop & Connection Saturation
1. **Detection**: Logs show multiple `P1001: Can't reach database server` or high error rates on server actions.
2. **Immediate Mitigation**:
   - Check if the Resilient ES6 Proxy has engaged PostgREST fallback (`[Prisma Resilient Proxy] Database socket unreachable`).
   - If PostgreSQL pool is saturated, navigate to Supabase Dashboard $\to$ Database $\to$ Connection Pooler $\to$ Verify PgBouncer mode is set to `Transaction`.
   - If direct database is hung, terminate idle connections:
     ```sql
     SELECT pg_terminate_backend(pid) 
     FROM pg_stat_activity 
     WHERE state = 'idle' AND state_change < current_timestamp - INTERVAL '5 minutes';
     ```
3. **Verification**: Execute health check probe `curl https://docodo.in/api/health` $\to$ Expect `{"status":"ok"}`.

---

### Runbook B: Razorpay Webhook Replay Storm or Signature Failures
1. **Detection**: Alerts indicate high HTTP 400/401 on `/api/webhooks/razorpay` or spike in webhook retries.
2. **Immediate Mitigation**:
   - Check secret consistency in Vercel Environment Variables (`RAZORPAY_WEBHOOK_SECRET`).
   - Verify that `WebhookEvent` unique constraint is deduplicating replays without returning HTTP 500:
     ```sql
     SELECT count(*), "eventId" FROM "WebhookEvent" GROUP BY "eventId" HAVING count(*) > 1;
     -- Should return 0 rows
     ```
   - In Razorpay Dashboard $\to$ Settings $\to$ Webhooks $\to$ Inspect failed delivery payloads and HMAC headers.
3. **Resolution**: If legitimate events were skipped due to transient network failure, run the reconciliation script:
   ```bash
   node scripts/reconcile-subscriptions.js
   ```

---

### Runbook C: Meta WhatsApp Cloud API Outage / HTTP 429
1. **Detection**: Customer booking confirmations failing; `WhatsAppLog` shows status `FAILED`.
2. **Immediate Mitigation**:
   - Inspect Meta Business Suite $\to$ WhatsApp Manager $\to$ Phone Numbers $\to$ Quality Rating.
   - Verify access token validity in environment variables (`WHATSAPP_CLOUD_API_TOKEN`).
   - If Meta Cloud API is down globally, the system gracefully falls back to SMS/Email notifications via `src/lib/notifications.ts`.
3. **Recovery**: Once Meta restores service, retry pending notifications from `WhatsAppLog` where `status = 'FAILED'`.

---

### Runbook D: AI Inference Cascade Degradation
1. **Detection**: Groq Cloud API latency exceeds 2000ms or returns HTTP 429.
2. **Automatic Self-Healing**:
   - The engine automatically transitions from Tier 1 (Groq) to Tier 2 (Gemini 2.5 Flash) and Tier 3 (Meta AI).
   - If all cloud APIs fail, Tier 5 (Local Deterministic Heuristic) generates template-based copy instantly.
3. **Manual Override**: Toggle `FORCE_LOCAL_AI=true` in environment variables if total external network isolation is required.

---

## 3. Instant Rollback Procedures

### 1. Vercel Instant Edge Rollback (< 30 seconds):
If a breaking deployment reaches production:
1. Open Vercel Dashboard $\to$ Project `Docodo.in` $\to$ Deployments.
2. Locate the previous healthy deployment hash.
3. Click **"Instant Rollback"** $\to$ Promotes previous immutable deployment build to edge production traffic within 5 seconds.

### 2. Git Release Rollback:
```bash
# Roll back main branch to last verified production tag
git checkout main
git revert HEAD -m 1
git push origin main
```

### 3. Database Point-in-Time Recovery (PITR):
- Supabase provides 7-day continuous PITR.
- Navigate to Supabase Project $\to$ Backends $\to$ Backups $\to$ Restore to timestamp $T_{-15\text{ mins}}$.

---

## 4. Post-Incident Review Protocol (PIR)

Within 24 hours of any SEV-0 or SEV-1 incident:
1. Document precise timeline of detection, response, and resolution.
2. Identify root cause using the *5 Whys* methodology.
3. Write automated Vitest regression test replicating the failure mode.
4. Update Master Issue Register (`docs/audits/master_issue_register.md`).
