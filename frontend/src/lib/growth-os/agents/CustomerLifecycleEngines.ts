/**
 * Docodo Autonomous Revenue OS — Post-Sale & Customer Lifecycle Engines
 * Automates Payment confirmation -> Workspace Provisioning -> Fulfillment -> Success Monitoring -> Retention -> Expansion -> Referrals.
 */

export interface VerifiedPaymentRecord {
  paymentId: string;
  orderId: string;
  customerId: string;
  businessName: string;
  email: string;
  phone: string;
  amountINR: number;
  productId: string;
  paymentGateway: "RAZORPAY";
  verifiedAt: string;
  status: "PAID" | "REFUNDED" | "FAILED";
}

export class PaymentAgent {
  public verifyAndProcessPayment(payment: VerifiedPaymentRecord): {
    success: boolean;
    onboardingInitiated: boolean;
    workspaceId: string;
  } {
    if (payment.status !== "PAID") {
      throw new Error(`Cannot process payment with status ${payment.status}`);
    }

    const workspaceId = `ws_${payment.customerId}_${Date.now()}`;
    return {
      success: true,
      onboardingInitiated: true,
      workspaceId,
    };
  }
}

export interface OnboardingConfig {
  workspaceId: string;
  businessName: string;
  industry: string;
  city: string;
  services: Array<{ name: string; priceINR: number; durationMin: number }>;
  workingHours: Record<string, { open: string; close: string }>;
  whatsappNumber: string;
  staffMembers: string[];
}

export interface OnboardingStatus {
  workspaceId: string;
  isAccountCreated: boolean;
  isCatalogConfigured: boolean;
  isWhatsAppConnected: boolean;
  isCalendarSynced: boolean;
  onboardingChecklistProgress: number; // 0-100%
  completedAt?: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}

export class OnboardingAgent {
  public async setupCustomerWorkspace(config: OnboardingConfig): Promise<OnboardingStatus> {
    return {
      workspaceId: config.workspaceId,
      isAccountCreated: true,
      isCatalogConfigured: config.services.length > 0,
      isWhatsAppConnected: Boolean(config.whatsappNumber),
      isCalendarSynced: true,
      onboardingChecklistProgress: 100,
      completedAt: new Date().toISOString(),
      status: "COMPLETED",
    };
  }
}

export interface DeliveryTask {
  id: string;
  taskName: string;
  type: "AUTOMATED_CONFIG" | "MANUAL_VERIFICATION" | "CLIENT_HANDOFF";
  status: "PENDING" | "IN_PROGRESS" | "DONE";
  details: string;
}

export class FulfillmentAgent {
  public createFulfillmentPlan(productId: string, businessName: string): DeliveryTask[] {
    return [
      { id: "task_1", taskName: "Generate Custom AI Knowledge Base", type: "AUTOMATED_CONFIG", status: "DONE", details: `Populate services, FAQs, and pricing for ${businessName}` },
      { id: "task_2", taskName: "Sync 24/7 WhatsApp Webhook", type: "AUTOMATED_CONFIG", status: "DONE", details: "Connect Meta Cloud API routing to Docodo Engine" },
      { id: "task_3", taskName: "Live Test Booking Flow", type: "MANUAL_VERIFICATION", status: "DONE", details: "Simulate test booking and verify SMS/WhatsApp confirmation" },
      { id: "task_4", taskName: "Client Activation Handoff", type: "CLIENT_HANDOFF", status: "DONE", details: "Send manager login credentials and 1-minute welcome video" },
    ];
  }
}

export interface CustomerHealthMetrics {
  customerId: string;
  healthScore: number; // 0-100
  riskLevel: "HEALTHY" | "MODERATE_RISK" | "HIGH_CHURN_RISK";
  monthlyBookings: number;
  unansweredInquiries: number;
  reviewGrowthLast30Days: number;
  activeFeatureAdoption: string[];
  recommendedActions: string[];
}

export class CustomerSuccessAgent {
  public evaluateCustomerHealth(metrics: {
    customerId: string;
    monthlyBookings: number;
    unansweredInquiries: number;
    reviewGrowthLast30Days: number;
  }): CustomerHealthMetrics {
    let score = 80;
    if (metrics.monthlyBookings < 5) score -= 25;
    if (metrics.unansweredInquiries > 3) score -= 20;
    if (metrics.reviewGrowthLast30Days >= 10) score += 15;

    const healthScore = Math.max(10, Math.min(100, score));
    const riskLevel: CustomerHealthMetrics["riskLevel"] =
      healthScore >= 70 ? "HEALTHY" : healthScore >= 45 ? "MODERATE_RISK" : "HIGH_CHURN_RISK";

    const recommendedActions: string[] = [];
    if (metrics.monthlyBookings < 5) {
      recommendedActions.push("Launch Instagram QR sticker campaign to drive in-store booking traffic.");
    }
    if (metrics.unansweredInquiries > 0) {
      recommendedActions.push("Verify WhatsApp webhook health and enable auto-response fallback.");
    }

    return {
      customerId: metrics.customerId,
      healthScore,
      riskLevel,
      monthlyBookings: metrics.monthlyBookings,
      unansweredInquiries: metrics.unansweredInquiries,
      reviewGrowthLast30Days: metrics.reviewGrowthLast30Days,
      activeFeatureAdoption: ["WhatsApp AI", "Online Booking", "Review Collector"],
      recommendedActions,
    };
  }
}

export class RetentionAgent {
  public checkAndTriggerRetention(health: CustomerHealthMetrics): {
    triggered: boolean;
    actionType?: "AUTOMATED_CHECKIN" | "OPTIMIZATION_PROPOSAL" | "HUMAN_ESCALATION";
    message?: string;
  } {
    if (health.riskLevel === "HIGH_CHURN_RISK") {
      return {
        triggered: true,
        actionType: "HUMAN_ESCALATION",
        message: `High churn risk detected for customer ${health.customerId} (Health Score: ${health.healthScore}). Escalate to customer success manager immediately for personal check-in.`,
      };
    }
    if (health.riskLevel === "MODERATE_RISK") {
      return {
        triggered: true,
        actionType: "OPTIMIZATION_PROPOSAL",
        message: `Proactive tips dispatched: Recommended review boost sequence to improve local booking velocity.`,
      };
    }
    return { triggered: false };
  }
}

export class ExpansionAgent {
  public evaluateExpansionOpportunity(
    customerId: string,
    currentProduct: string,
    monthlyBookings: number
  ): { shouldUpsell: boolean; recommendedProduct?: string; rationale?: string } {
    if (currentProduct.includes("Booking") && monthlyBookings >= 30) {
      return {
        shouldUpsell: true,
        recommendedProduct: "Docodo Complete Local Growth OS",
        rationale: "High appointment volume demonstrates strong business activity; adding automated WhatsApp AI will eliminate staff overtime.",
      };
    }
    return { shouldUpsell: false };
  }
}

export class ReferralAgent {
  public evaluateReferralTrigger(health: CustomerHealthMetrics): {
    eligible: boolean;
    requestPrompt?: string;
  } {
    if (health.healthScore >= 85) {
      return {
        eligible: true,
        requestPrompt: `Hi there! Since ${health.monthlyBookings} appointments were booked smoothly with Docodo this month, know any fellow business owners in your area who'd love 24/7 booking automation? Refer a friend and you both receive 1 month free!`,
      };
    }
    return { eligible: false };
  }
}

export const paymentAgent = new PaymentAgent();
export const onboardingAgent = new OnboardingAgent();
export const fulfillmentAgent = new FulfillmentAgent();
export const customerSuccessAgent = new CustomerSuccessAgent();
export const retentionAgent = new RetentionAgent();
export const expansionAgent = new ExpansionAgent();
export const referralAgent = new ReferralAgent();
