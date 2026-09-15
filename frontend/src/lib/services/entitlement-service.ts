/**
 * CENTRAL DOCODO ENTITLEMENT SERVICE
 * 
 * Enforces server-side feature access, usage limits, atomic consumption tracking,
 * and billing period resolution.
 * 
 * No frontend-only checks. No fake unlimited states.
 */

import { prisma } from "@/lib/prisma";
import { 
  PLANS_CONFIG, 
  PLAN_IDS, 
  FEATURE_KEYS, 
  SUBSCRIPTION_STATES,
  PILOT_BOOKING_LIMIT,
  resolvePlan,
  PlanId
} from "@/lib/plans-config";

export class EntitlementError extends Error {
  public statusCode = 403;
  public featureKey?: string;
  public planId?: string;

  constructor(message: string, featureKey?: string, planId?: string) {
    super(message);
    this.name = "EntitlementError";
    this.featureKey = featureKey;
    this.planId = planId;
  }
}

/**
 * Computes calendar monthly billing period for Pilot, or subscription period for paid plans.
 */
export function calculateBillingPeriod(baseDate: Date = new Date(), planId: string = PLAN_IDS.PILOT): { periodStart: Date; periodEnd: Date } {
  if (planId === PLAN_IDS.PILOT) {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const periodStart = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
    const nextMonth = new Date(Date.UTC(year, month + 1, 1, 0, 0, 0, 0));
    const periodEnd = new Date(nextMonth.getTime() - 1);
    return { periodStart, periodEnd };
  } else {
    const periodStart = new Date(baseDate);
    const periodEnd = new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    return { periodStart, periodEnd };
  }
}

/**
 * Retrieves the business's active subscription. If none exists, creates a Pilot subscription.
 */
export async function getBusinessSubscription(businessId: string, client: any = prisma) {
  let sub = null;
  try {
    sub = await client.subscription.findFirst({
      where: { businessId },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.warn("[EntitlementService] Querying subscription table:", err);
  }

  const now = new Date();

  if (!sub) {
    const { periodStart, periodEnd } = calculateBillingPeriod(now, PLAN_IDS.PILOT);
    try {
      sub = await client.subscription.create({
        data: {
          businessId,
          planId: PLAN_IDS.PILOT,
          status: SUBSCRIPTION_STATES.ACTIVE,
          provider: "SYSTEM",
          currentPeriodStart: periodStart,
          currentPeriodEnd: periodEnd,
        },
      });
      await recalculateEntitlements(businessId, client);
    } catch (createErr) {
      return {
        id: `sub_virtual_pilot_${businessId}`,
        businessId,
        planId: PLAN_IDS.PILOT,
        status: SUBSCRIPTION_STATES.ACTIVE,
        provider: "SYSTEM",
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd,
      };
    }
  }

  // Monthly rollover for Pilot
  if (sub.planId === PLAN_IDS.PILOT && new Date(sub.currentPeriodEnd) < now) {
    const { periodStart, periodEnd } = calculateBillingPeriod(now, PLAN_IDS.PILOT);
    try {
      sub = await client.subscription.update({
        where: { id: sub.id },
        data: {
          currentPeriodStart: periodStart,
          currentPeriodEnd: periodEnd,
        },
      });
    } catch {
      sub.currentPeriodStart = periodStart;
      sub.currentPeriodEnd = periodEnd;
    }
  }

  // Check if paid plan expired
  if (sub.planId !== PLAN_IDS.PILOT && new Date(sub.currentPeriodEnd) < now) {
    try {
      sub = await client.subscription.update({
        where: { id: sub.id },
        data: { status: SUBSCRIPTION_STATES.EXPIRED },
      });
      const { periodStart, periodEnd } = calculateBillingPeriod(now, PLAN_IDS.PILOT);
      sub = await client.subscription.create({
        data: {
          businessId,
          planId: PLAN_IDS.PILOT,
          status: SUBSCRIPTION_STATES.ACTIVE,
          provider: "SYSTEM",
          currentPeriodStart: periodStart,
          currentPeriodEnd: periodEnd,
        },
      });
      await recalculateEntitlements(businessId, client);
    } catch (downgradeErr) {
      console.warn("[EntitlementService] Handling expired subscription:", downgradeErr);
    }
  }

  return sub;
}

/**
 * Checks if a business has access to a specific feature key.
 */
export async function hasFeature(businessId: string, featureKey: string, client: any = prisma): Promise<boolean> {
  try {
    const entitlement = await client.businessEntitlement.findUnique({
      where: {
        businessId_featureKey: {
          businessId,
          featureKey,
        },
      },
    });

    if (entitlement) {
      if (!entitlement.expiresAt || new Date(entitlement.expiresAt) > new Date()) {
        return entitlement.value === "true" || entitlement.value === "UNLIMITED" || Number(entitlement.value) > 0;
      }
    }
  } catch {
    // Continue
  }

  const sub = await getBusinessSubscription(businessId, client);
  const plan = resolvePlan(sub.planId);
  const planVal = plan.entitlements[featureKey];

  if (typeof planVal === "boolean") return planVal;
  if (planVal === "UNLIMITED") return true;
  if (typeof planVal === "number") return planVal > 0;
  return false;
}

/**
 * Retrieves the numeric or UNLIMITED limit for a feature.
 */
export async function getLimit(businessId: string, featureKey: string, client: any = prisma): Promise<number | "UNLIMITED"> {
  try {
    const entitlement = await client.businessEntitlement.findUnique({
      where: {
        businessId_featureKey: {
          businessId,
          featureKey,
        },
      },
    });

    if (entitlement) {
      if (!entitlement.expiresAt || new Date(entitlement.expiresAt) > new Date()) {
        if (entitlement.value === "UNLIMITED") return "UNLIMITED";
        const num = Number(entitlement.value);
        if (!isNaN(num)) return num;
      }
    }
  } catch {
    // Continue
  }

  const sub = await getBusinessSubscription(businessId, client);
  const plan = resolvePlan(sub.planId);
  const planLimit = plan.entitlements[featureKey];

  if (planLimit === "UNLIMITED") return "UNLIMITED";
  if (typeof planLimit === "number") return planLimit;
  return 0;
}

/**
 * Retrieves current period usage and progress for a metric.
 */
export async function getUsage(businessId: string, metric: string = "BOOKINGS_COUNT", client: any = prisma) {
  const sub = await getBusinessSubscription(businessId, client);
  const plan = resolvePlan(sub.planId);
  const limit = plan.bookingLimit;

  const periodStart = new Date(sub.currentPeriodStart);
  const periodEnd = new Date(sub.currentPeriodEnd);

  let usageCount = 0;

  try {
    const record = await client.usageRecord.findFirst({
      where: {
        businessId,
        metric,
        periodStart: { lte: new Date() },
        periodEnd: { gte: new Date() },
      },
    });

    if (record) {
      usageCount = record.count;
    } else {
      const dbCount = await client.booking.count({
        where: {
          businessId,
          createdAt: {
            gte: periodStart,
            lte: periodEnd,
          },
          status: { not: "CANCELLED" },
        },
      });
      usageCount = dbCount;

      await client.usageRecord.upsert({
        where: {
          businessId_metric_periodStart_periodEnd: {
            businessId,
            metric,
            periodStart,
            periodEnd,
          },
        },
        update: { count: dbCount },
        create: {
          businessId,
          metric,
          periodStart,
          periodEnd,
          count: dbCount,
        },
      }).catch((err: any) => { console.error('[entitlement]', err); throw err; });
    }
  } catch (err) {
    try {
      usageCount = await client.booking.count({
        where: {
          businessId,
          createdAt: { gte: periodStart, lte: periodEnd },
          status: { not: "CANCELLED" },
        },
      });
    } catch {
      usageCount = 0;
    }
  }

  const numericLimit = limit === "UNLIMITED" ? Infinity : limit;
  const remaining = limit === "UNLIMITED" ? Infinity : Math.max(0, limit - usageCount);
  const percentUsed = limit === "UNLIMITED" ? 0 : Math.min(100, Math.round((usageCount / limit) * 100));

  return {
    count: usageCount,
    limit,
    remaining,
    percentUsed,
    periodStart,
    periodEnd,
    planId: plan.id,
    planName: plan.name,
    subscriptionStatus: sub.status,
  };
}

/**
 * Checks if consuming units is permissible under the active plan and limits.
 */
export async function canConsume(
  businessId: string,
  metric: string = "BOOKINGS_COUNT",
  delta: number = 1,
  client: any = prisma
): Promise<{ allowed: boolean; remaining: number; limit: number | "UNLIMITED"; current: number }> {
  const usage = await getUsage(businessId, metric, client);

  if (usage.limit === "UNLIMITED") {
    return {
      allowed: true,
      remaining: Infinity,
      limit: "UNLIMITED",
      current: usage.count,
    };
  }

  const willReach = usage.count + delta;
  const allowed = willReach <= usage.limit;
  const remaining = Math.max(0, usage.limit - usage.count);

  return {
    allowed,
    remaining,
    limit: usage.limit,
    current: usage.count,
  };
}

/**
 * Atomically increments usage for the current billing period.
 */
export async function recordUsage(
  businessId: string,
  metric: string = "BOOKINGS_COUNT",
  delta: number = 1,
  client: any = prisma
) {
  const sub = await getBusinessSubscription(businessId, client);
  const periodStart = new Date(sub.currentPeriodStart);
  const periodEnd = new Date(sub.currentPeriodEnd);

  try {
    const record = await client.usageRecord.upsert({
      where: {
        businessId_metric_periodStart_periodEnd: {
          businessId,
          metric,
          periodStart,
          periodEnd,
        },
      },
      update: {
        count: { increment: delta },
      },
      create: {
        businessId,
        metric,
        periodStart,
        periodEnd,
        count: delta,
      },
    });
    return record;
  } catch (err) {
    console.warn("[EntitlementService] UsageRecord upsert handled:", err);
    return { count: delta };
  }
}

/**
 * Strict authorization guard. Throws EntitlementError if feature is not active.
 */
export async function requireFeature(businessId: string, featureKey: string, client: any = prisma) {
  const allowed = await hasFeature(businessId, featureKey, client);
  if (!allowed) {
    const sub = await getBusinessSubscription(businessId, client);
    throw new EntitlementError(
      `Feature '${featureKey}' is not available on your current ${sub.planId.toUpperCase()} plan. Please upgrade to unlock this capability.`,
      featureKey,
      sub.planId
    );
  }
}

/**
 * Synchronizes the BusinessEntitlement table rows with the active subscription and overrides.
 */
export async function recalculateEntitlements(businessId: string, client: any = prisma) {
  let sub = null;
  try {
    sub = await client.subscription.findFirst({
      where: { businessId, status: SUBSCRIPTION_STATES.ACTIVE },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return;
  }

  if (!sub) return;

  const plan = resolvePlan(sub.planId);

  let conciergeGrant = null;
  try {
    conciergeGrant = await client.conciergeOrder.findFirst({
      where: {
        businessId,
        growthStart: { lte: new Date() },
        growthEnd: { gte: new Date() },
      },
    });
  } catch {
    // Continue
  }

  const effectivePlan = conciergeGrant ? PLANS_CONFIG[PLAN_IDS.GROWTH] : plan;

  for (const [key, val] of Object.entries(effectivePlan.entitlements)) {
    const valueStr = String(val);
    try {
      await client.businessEntitlement.upsert({
        where: {
          businessId_featureKey: {
            businessId,
            featureKey: key,
          },
        },
        update: {
          value: valueStr,
          source: conciergeGrant ? "CONCIERGE" : "PLAN",
          expiresAt: conciergeGrant ? conciergeGrant.growthEnd : null,
        },
        create: {
          businessId,
          featureKey: key,
          value: valueStr,
          source: conciergeGrant ? "CONCIERGE" : "PLAN",
          expiresAt: conciergeGrant ? conciergeGrant.growthEnd : null,
        },
      });
    } catch {
      // Continue
    }
  }
}
