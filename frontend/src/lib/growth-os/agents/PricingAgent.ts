/**
 * Docodo Autonomous Revenue OS — Pricing & Proposal Engines
 * Generates transparent quotations adhering to discount guardrails and builds formal client proposals.
 */

import { productCatalogAgent, DocodoProduct } from "./ProductCatalogAgent";
import { CanonicalLead } from "./types";

export interface QuotationCalculation {
  productId: string;
  productName: string;
  billingFrequency: "MONTHLY" | "ANNUAL";
  basePriceINR: number;
  setupFeeINR: number;
  discountPercent: number;
  discountINR: number;
  finalPriceINR: number;
  totalInitialPaymentINR: number;
  requiresFounderApproval: boolean;
  approvalReason?: string;
}

export class PricingAgent {
  public calculateQuote(
    productId: string,
    billingFrequency: "MONTHLY" | "ANNUAL" = "MONTHLY",
    requestedDiscountPercent: number = 0
  ): QuotationCalculation {
    const product = productCatalogAgent.getProduct(productId) || productCatalogAgent.getAllProducts()[0];
    const basePrice = billingFrequency === "ANNUAL" ? product.pricing.annualINR : product.pricing.monthlyINR;
    const setupFee = product.pricing.setupFeeINR;

    const maxAllowedDiscount = product.pricing.maxDiscountPercent;
    let requiresApproval = false;
    let approvalReason: string | undefined;

    if (requestedDiscountPercent > maxAllowedDiscount) {
      requiresApproval = true;
      approvalReason = `Requested discount (${requestedDiscountPercent}%) exceeds product limit (${maxAllowedDiscount}%).`;
    }

    const appliedDiscountPercent = Math.min(requestedDiscountPercent, 50); // Cap sanity max
    const discountINR = Math.round((basePrice * appliedDiscountPercent) / 100);
    const finalPriceINR = basePrice - discountINR;
    const totalInitialPaymentINR = finalPriceINR + setupFee;

    return {
      productId: product.id,
      productName: product.name,
      billingFrequency,
      basePriceINR: basePrice,
      setupFeeINR: setupFee,
      discountPercent: appliedDiscountPercent,
      discountINR,
      finalPriceINR,
      totalInitialPaymentINR,
      requiresFounderApproval: requiresApproval,
      approvalReason,
    };
  }
}

export interface ClientProposal {
  id: string;
  leadId: string;
  businessName: string;
  proposedProduct: string;
  scope: string[];
  timelineDays: number;
  deliverables: string[];
  quote: QuotationCalculation;
  paymentTerms: string;
  nextSteps: string[];
  markdownContent: string;
  createdAt: string;
}

export class ProposalAgent {
  private pricingAgent = new PricingAgent();

  public generateProposal(lead: CanonicalLead, productId: string, discountPercent: number = 0): ClientProposal {
    const quote = this.pricingAgent.calculateQuote(productId, "MONTHLY", discountPercent);
    const product = productCatalogAgent.getProduct(productId) || productCatalogAgent.getAllProducts()[0];

    const proposalId = `prop_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const timeline = product.implementationTimeDays;

    const scope = [
      `Deploy and configure ${product.name} tailored for ${lead.canonicalName}`,
      "Set up custom services, staff calendars, and working hours",
      "Connect WhatsApp / Google / Website integrations",
      "Conduct full end-to-end booking and notification test",
      "Provide 1-on-1 staff onboarding walkthrough",
    ];

    const deliverables = product.features.map((f) => `Done-for-you ${f}`);

    const markdownContent = `# Business Proposal for ${lead.canonicalName}

**Prepared by:** Docodo Growth Engineering Team  
**Date:** ${new Date().toISOString().split("T")[0]}  
**Target Solution:** ${product.name}  

---

## 1. Executive Summary & Scope
Docodo will implement ${product.name} to eliminate appointment scheduling friction, automate inquiry response, and drive predictable local bookings for ${lead.canonicalName} in ${lead.city}.

## 2. Deliverables
${deliverables.map((d) => `- ${d}`).join("\n")}

## 3. Implementation Timeline
- Total setup time: **${timeline} business day(s)** from payment confirmation.
- 100% turnkey setup managed by Docodo engineers.

## 4. Investment
- **Monthly Subscription:** ₹${quote.finalPriceINR.toLocaleString("en-IN")}/mo${quote.discountPercent > 0 ? ` (${quote.discountPercent}% discount applied)` : ""}
- **One-time Setup & Onboarding:** ₹${quote.setupFeeINR.toLocaleString("en-IN")}
- **Total Initial Payment:** ₹${quote.totalInitialPaymentINR.toLocaleString("en-IN")}

## 5. Next Steps
1. Review and approve this proposal.
2. Complete secure payment via verified Razorpay link.
3. System automatically provisions your workspace and begins onboarding setup.
`;

    return {
      id: proposalId,
      leadId: lead.id,
      businessName: lead.canonicalName,
      proposedProduct: product.name,
      scope,
      timelineDays: timeline,
      deliverables,
      quote,
      paymentTerms: "Monthly recurring subscription + one-time setup fee. Cancel anytime with 0 lock-in.",
      nextSteps: [
        "Confirm package selection",
        "Generate Razorpay payment link",
        "Execute automated workspace onboarding",
      ],
      markdownContent,
      createdAt: new Date().toISOString(),
    };
  }
}

export const pricingAgent = new PricingAgent();
export const proposalAgent = new ProposalAgent();
