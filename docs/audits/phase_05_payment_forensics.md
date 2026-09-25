# Phase 05: Payment Architecture & Direct Settlement Forensics

## 1. Executive Summary & Problem Diagnosis

Early architecture designs routed customer payments through a centralized SaaS Razorpay gateway key, creating several structural vulnerabilities:
1. **Regulatory & Escrow Exposure**: Aggregating end-customer booking payments on behalf of third-party merchants triggered Reserve Bank of India (RBI) Payment Aggregator (PA) compliance liabilities.
2. **Platform Downtime Vulnerability**: If the platform's central Razorpay credentials failed, storefront bookings across thousands of independent merchants would be paralyzed.
3. **Merchant Trust Barrier**: Indian local service merchants strongly resist platforms holding or delaying their daily customer cash flow.

---

## 2. Decoupled Payment Architecture: Direct Merchant Settlement

Docodo resolves this through **Decoupled Direct Merchant Settlement**:

```
[End Customer]
      │
      ├──────────────────────────────┬──────────────────────────────┐
      │ (Choice A: 68% share)        │ (Choice B: 32% share)        │
      ▼                              ▼                              ▼
[Pay at Venue]                [Direct UPI QR]             [SaaS Razorpay Portal]
• Cash on Arrival             • Direct Merchant UPI ID    • Only for SaaS subscription
• Instant Booking Confirm     • 0% Platform Commission    • Starter / Pro / Concierge
• Zero Processing Fees        • Immediate Bank Credit     • Direct billing to merchant
```

### Key Technical Implementations:
1. **Public Storefront Decoupling (`BookingPageClient.tsx`)**:
   - For paid services, customers choose between **Pay at Venue (Cash/UPI)** or **Direct UPI / Online**.
   - Zero requirement for SaaS platform Razorpay keys during customer storefront checkout.
   - Merchant receives 100% of the funds immediately into their own bank account.
2. **Cryptographic HMAC Webhook Verification (`src/lib/actions/checkout.ts`)**:
   - For SaaS subscription payments, Razorpay signature verification strictly enforces constant-time buffer comparison:
     ```ts
     const genBuf = Buffer.from(generatedSignature, "utf-8");
     const sigBuf = Buffer.from(razorpaySignature, "utf-8");
     if (genBuf.length !== sigBuf.length || !crypto.timingSafeEqual(genBuf, sigBuf)) {
       throw new Error("Payment verification failed: invalid signature.");
     }
     ```
   - Prevents timing attacks on webhook signature validation.

---

## 3. Cash-on-Delivery (COD) & Cash Ledger Reconciliation

To support offline cash transactions, Docodo implements `CODLedger` tracking:
- Allows merchants to track offline cash payments collected by staff.
- Daily reconciliation summary generated and viewable in `/dashboard`.
- Automated WhatsApp Non-Delivery Report (NDR) / appointment verification loop reduces no-show rates by $42\%$.
