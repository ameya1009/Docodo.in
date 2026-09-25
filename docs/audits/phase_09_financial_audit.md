# Phase 09: Financial Analysis, Unit Economics & Sensitivity Modeling

## 1. Executive Summary & Monetization Model

Docodo operates a high-margin B2B SaaS + Done-For-You Concierge model targeted at Indian MSMEs.

### Revenue Streams:
1. **Starter Plan**: ₹499 / month (1 staff, 100 bookings/mo, basic WhatsApp confirmations).
2. **Pro Plan**: ₹1,499 / month (Unlimited bookings, 5 staff, Growth OS, Revenue OS automations).
3. **Enterprise / Concierge Tier**: ₹4,999 / month (Custom domain, dedicated account manager, full catalogue ingestion).

---

## 2. Unit Economics Sensitivity Modeling

We model business unit economics across three scaling milestones: 100, 1,000, and 50,000 active paying businesses.

### Sensitivity Model Matrix:

| Metric | 100 Businesses | 1,000 Businesses | 50,000 Businesses |
| :--- | :---: | :---: | :---: |
| **Blended Monthly ARPU** | ₹1,100 | ₹1,250 | ₹1,350 |
| **Monthly Gross Revenue** | ₹1,10,000 | ₹12,50,000 | ₹6,75,00,000 |
| **Server & DB Infrastructure COGS** | ₹3,500 | ₹22,000 | ₹6,50,000 |
| **WhatsApp Meta Graph API Fees** | ₹2,200 | ₹24,000 | ₹11,00,000 |
| **AI LLM Token Costs (Gemini/Groq)**| ₹1,100 | ₹11,000 | ₹4,80,000 |
| **Payment Gateway Subscription Fees**| ₹2,200 | ₹25,000 | ₹13,50,000 |
| **Total Monthly COGS** | ₹9,000 | ₹82,000 | ₹35,80,000 |
| **Gross Margin (%)** | **91.8%** | **93.4%** | **94.7%** |
| **Monthly Net Contribution** | **₹1,01,000** | **₹11,68,000** | **₹6,39,20,000** |

---

## 3. WhatsApp Cost Arbitrage Strategy

Meta charges for WhatsApp business messages based on conversation categories:
1. **User-Initiated (Service Window)**: Free within 24 hours of customer interaction.
2. **Business-Initiated (Transactional Utility)**: Charged per template dispatch ($\approx ₹0.35$ per message in India).
3. **Marketing Broadcasts**: Charged per marketing template dispatch ($\approx ₹0.85$ per message in India).

### Docodo's Cost-Arbitrage Optimization:
- Over **70% of messages** are timed within the free 24-hour service window triggered by customer booking/enquiry actions.
- Utility templates are strictly batched for confirmations and reminders.
- Net effect: WhatsApp messaging COGS remains $< 4\%$ of top-line subscription revenue.
