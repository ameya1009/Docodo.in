/**
 * DOCODO COMMERCIAL PLANS & ENTITLEMENTS SPECIFICATION (SINGLE SOURCE OF TRUTH)
 * 
 * Strict mapping of Commercial Plans:
 * 1. PILOT / COMMUNITY: ₹0 / forever (50 bookings/month server-enforced limit)
 * 2. STARTER: ₹999 / month (Unlimited bookings, branded storefront, CRM LTV, online payments)
 * 3. GROWTH: ₹2,499 / month (Multi-staff, rooms, 24h reminders, review sequences, AI marketing, analytics)
 * 4. DONE-FOR-YOU SETUP (CONCIERGE): ₹4,999 one-time (Specialist onboarding + 30-day Growth entitlement)
 */

export const PLAN_IDS = {
  PILOT: "pilot",
  STARTER: "starter",
  GROWTH: "growth",
  CONCIERGE: "setup-service",
} as const;

export type PlanId = (typeof PLAN_IDS)[keyof typeof PLAN_IDS];

export const SUBSCRIPTION_STATES = {
  TRIAL: "TRIAL",
  ACTIVE: "ACTIVE",
  PAST_DUE: "PAST_DUE",
  CANCELLED: "CANCELLED",
  EXPIRED: "EXPIRED",
  PAYMENT_FAILED: "PAYMENT_FAILED",
} as const;

export type SubscriptionState = (typeof SUBSCRIPTION_STATES)[keyof typeof SUBSCRIPTION_STATES];

export const FEATURE_KEYS = {
  // Booking capabilities
  CUSTOM_BOOKING_PAGE: "CUSTOM_BOOKING_PAGE",
  BOOKINGS_MONTHLY_LIMIT: "BOOKINGS_MONTHLY_LIMIT",
  BOOKINGS_UNLIMITED: "BOOKINGS_UNLIMITED",
  SERVICE_PRICE_CATALOG: "SERVICE_PRICE_CATALOG",
  AVAILABILITY_HOURS: "AVAILABILITY_HOURS",
  BRANDED_STOREFRONT: "BRANDED_STOREFRONT",
  FULL_BOOKING_DASHBOARD: "FULL_BOOKING_DASHBOARD",

  // CRM & Leads
  CRM_BASIC: "CRM_BASIC",
  CRM_LTV: "CRM_LTV",
  ENQUIRY_PIPELINE: "ENQUIRY_PIPELINE",

  // Communications & Notifications
  WHATSAPP_CTA: "WHATSAPP_CTA",
  WHATSAPP_CONFIRMATIONS: "WHATSAPP_CONFIRMATIONS",
  EMAIL_CONFIRMATIONS: "EMAIL_CONFIRMATIONS",
  PREVISIT_REMINDERS: "PREVISIT_REMINDERS",
  REVIEW_AUTOMATION: "REVIEW_AUTOMATION",
  PRIORITY_WHATSAPP_SUPPORT: "PRIORITY_WHATSAPP_SUPPORT",

  // Payments & Compliance
  INDIA_DATA_PROTECTION: "INDIA_DATA_PROTECTION",
  RAZORPAY_PAYMENTS: "RAZORPAY_PAYMENTS",

  // Growth & Team Operations
  MULTI_STAFF: "MULTI_STAFF",
  ROOM_ASSIGNMENT: "ROOM_ASSIGNMENT",
  ROUND_ROBIN: "ROUND_ROBIN",
  AI_MARKETING: "AI_MARKETING",
  INSTAGRAM_CONTENT: "INSTAGRAM_CONTENT",
  WHATSAPP_MARKETING: "WHATSAPP_MARKETING",
  REVENUE_ANALYTICS: "REVENUE_ANALYTICS",
  CONVERSION_REPORTS: "CONVERSION_REPORTS",
  AI_ASSISTANT: "AI_ASSISTANT",
  ACCOUNT_MANAGER: "ACCOUNT_MANAGER",

  // Concierge Operations
  CONCIERGE_ONBOARDING: "CONCIERGE_ONBOARDING",
} as const;

export type FeatureKey = (typeof FEATURE_KEYS)[keyof typeof FEATURE_KEYS];

export interface CommercialPlan {
  id: PlanId;
  name: string;
  badge: string;
  price: number; // in INR
  displayPrice: string;
  billingInterval: "FOREVER" | "MONTHLY" | "ONE_TIME";
  displayPeriod: string;
  description: string;
  bookingLimit: number | "UNLIMITED";
  features: string[];
  entitlements: Record<string, boolean | number | string>;
  popular?: boolean;
  cta: string;
  ctaHref: string;
}

export const PILOT_BOOKING_LIMIT = 50;

export const PLANS_CONFIG: Record<PlanId, CommercialPlan> = {
  [PLAN_IDS.PILOT]: {
    id: PLAN_IDS.PILOT,
    name: "Pilot / Community",
    badge: "Free for Pilots",
    price: 0,
    displayPrice: "₹0",
    billingInterval: "FOREVER",
    displayPeriod: "forever",
    description: "For testing Docodo and getting your business online with zero upfront cost.",
    bookingLimit: PILOT_BOOKING_LIMIT,
    features: [
      "Custom booking page (docodo.in/book/your-business)",
      "Maximum 50 bookings / month",
      "Full Service & Price catalog",
      "Working hours & availability management",
      "Customer database (CRM)",
      "Instant WhatsApp booking link CTA",
      "Indian data protection architecture (DPDP Act)",
    ],
    entitlements: {
      [FEATURE_KEYS.CUSTOM_BOOKING_PAGE]: true,
      [FEATURE_KEYS.BOOKINGS_MONTHLY_LIMIT]: PILOT_BOOKING_LIMIT,
      [FEATURE_KEYS.BOOKINGS_UNLIMITED]: false,
      [FEATURE_KEYS.SERVICE_PRICE_CATALOG]: true,
      [FEATURE_KEYS.AVAILABILITY_HOURS]: true,
      [FEATURE_KEYS.CRM_BASIC]: true,
      [FEATURE_KEYS.WHATSAPP_CTA]: true,
      [FEATURE_KEYS.INDIA_DATA_PROTECTION]: true,

      // Starter & Growth locked
      [FEATURE_KEYS.BRANDED_STOREFRONT]: false,
      [FEATURE_KEYS.FULL_BOOKING_DASHBOARD]: false,
      [FEATURE_KEYS.CRM_LTV]: false,
      [FEATURE_KEYS.ENQUIRY_PIPELINE]: false,
      [FEATURE_KEYS.WHATSAPP_CONFIRMATIONS]: false,
      [FEATURE_KEYS.EMAIL_CONFIRMATIONS]: false,
      [FEATURE_KEYS.RAZORPAY_PAYMENTS]: false,
      [FEATURE_KEYS.PRIORITY_WHATSAPP_SUPPORT]: false,
      [FEATURE_KEYS.MULTI_STAFF]: false,
      [FEATURE_KEYS.ROOM_ASSIGNMENT]: false,
      [FEATURE_KEYS.PREVISIT_REMINDERS]: false,
      [FEATURE_KEYS.REVIEW_AUTOMATION]: false,
      [FEATURE_KEYS.AI_MARKETING]: false,
      [FEATURE_KEYS.INSTAGRAM_CONTENT]: false,
      [FEATURE_KEYS.WHATSAPP_MARKETING]: false,
      [FEATURE_KEYS.REVENUE_ANALYTICS]: false,
      [FEATURE_KEYS.CONVERSION_REPORTS]: false,
      [FEATURE_KEYS.ROUND_ROBIN]: false,
      [FEATURE_KEYS.AI_ASSISTANT]: false,
      [FEATURE_KEYS.ACCOUNT_MANAGER]: false,
    },
    popular: false,
    cta: "Join Pilot Program (Free)",
    ctaHref: "/auth/signup",
  },

  [PLAN_IDS.STARTER]: {
    id: PLAN_IDS.STARTER,
    name: "Starter",
    badge: "Most Popular for Solo Pros",
    price: 999,
    displayPrice: "₹999",
    billingInterval: "MONTHLY",
    displayPeriod: "per month",
    description: "Everything a growing local business needs to automate bookings and CRM.",
    bookingLimit: "UNLIMITED",
    features: [
      "Unlimited bookings & services",
      "Custom branded booking storefront",
      "Full Booking Management Dashboard",
      "Customer CRM with Lifetime Spend (LTV)",
      "Enquiry pipeline (New, Contacted, Booked)",
      "Automated WhatsApp confirmations",
      "Automated email confirmations",
      "Razorpay UPI/online payments integration",
      "Priority WhatsApp support",
    ],
    entitlements: {
      [FEATURE_KEYS.CUSTOM_BOOKING_PAGE]: true,
      [FEATURE_KEYS.BOOKINGS_MONTHLY_LIMIT]: "UNLIMITED",
      [FEATURE_KEYS.BOOKINGS_UNLIMITED]: true,
      [FEATURE_KEYS.SERVICE_PRICE_CATALOG]: true,
      [FEATURE_KEYS.AVAILABILITY_HOURS]: true,
      [FEATURE_KEYS.CRM_BASIC]: true,
      [FEATURE_KEYS.WHATSAPP_CTA]: true,
      [FEATURE_KEYS.INDIA_DATA_PROTECTION]: true,

      [FEATURE_KEYS.BRANDED_STOREFRONT]: true,
      [FEATURE_KEYS.FULL_BOOKING_DASHBOARD]: true,
      [FEATURE_KEYS.CRM_LTV]: true,
      [FEATURE_KEYS.ENQUIRY_PIPELINE]: true,
      [FEATURE_KEYS.WHATSAPP_CONFIRMATIONS]: true,
      [FEATURE_KEYS.EMAIL_CONFIRMATIONS]: true,
      [FEATURE_KEYS.RAZORPAY_PAYMENTS]: true,
      [FEATURE_KEYS.PRIORITY_WHATSAPP_SUPPORT]: true,

      // Growth features locked
      [FEATURE_KEYS.MULTI_STAFF]: false,
      [FEATURE_KEYS.ROOM_ASSIGNMENT]: false,
      [FEATURE_KEYS.PREVISIT_REMINDERS]: false,
      [FEATURE_KEYS.REVIEW_AUTOMATION]: false,
      [FEATURE_KEYS.AI_MARKETING]: false,
      [FEATURE_KEYS.INSTAGRAM_CONTENT]: false,
      [FEATURE_KEYS.WHATSAPP_MARKETING]: false,
      [FEATURE_KEYS.REVENUE_ANALYTICS]: false,
      [FEATURE_KEYS.CONVERSION_REPORTS]: false,
      [FEATURE_KEYS.ROUND_ROBIN]: false,
      [FEATURE_KEYS.AI_ASSISTANT]: false,
      [FEATURE_KEYS.ACCOUNT_MANAGER]: false,
    },
    popular: true,
    cta: "Subscribe to Starter (₹999/mo)",
    ctaHref: "/checkout?plan=starter",
  },

  [PLAN_IDS.GROWTH]: {
    id: PLAN_IDS.GROWTH,
    name: "Growth",
    badge: "For Established Clinics & Salons",
    price: 2499,
    displayPrice: "₹2,499",
    billingInterval: "MONTHLY",
    displayPeriod: "per month",
    description: "Advanced AI automation, multi-staff allocation, and automated review collection.",
    bookingLimit: "UNLIMITED",
    features: [
      "Everything in Starter plan",
      "Multi-staff scheduling & room assignment",
      "Automated 24-hour pre-visit reminders",
      "Automated Google Review collection sequences",
      "AI marketing content generator (Instagram & WhatsApp)",
      "Revenue analytics & booking conversion reports",
      "Multi-provider round-robin allocation",
      "Contextual AI Assistant with knowledge base",
      "Dedicated account manager workflow on WhatsApp",
    ],
    entitlements: {
      [FEATURE_KEYS.CUSTOM_BOOKING_PAGE]: true,
      [FEATURE_KEYS.BOOKINGS_MONTHLY_LIMIT]: "UNLIMITED",
      [FEATURE_KEYS.BOOKINGS_UNLIMITED]: true,
      [FEATURE_KEYS.SERVICE_PRICE_CATALOG]: true,
      [FEATURE_KEYS.AVAILABILITY_HOURS]: true,
      [FEATURE_KEYS.CRM_BASIC]: true,
      [FEATURE_KEYS.WHATSAPP_CTA]: true,
      [FEATURE_KEYS.INDIA_DATA_PROTECTION]: true,

      [FEATURE_KEYS.BRANDED_STOREFRONT]: true,
      [FEATURE_KEYS.FULL_BOOKING_DASHBOARD]: true,
      [FEATURE_KEYS.CRM_LTV]: true,
      [FEATURE_KEYS.ENQUIRY_PIPELINE]: true,
      [FEATURE_KEYS.WHATSAPP_CONFIRMATIONS]: true,
      [FEATURE_KEYS.EMAIL_CONFIRMATIONS]: true,
      [FEATURE_KEYS.RAZORPAY_PAYMENTS]: true,
      [FEATURE_KEYS.PRIORITY_WHATSAPP_SUPPORT]: true,

      [FEATURE_KEYS.MULTI_STAFF]: true,
      [FEATURE_KEYS.ROOM_ASSIGNMENT]: true,
      [FEATURE_KEYS.PREVISIT_REMINDERS]: true,
      [FEATURE_KEYS.REVIEW_AUTOMATION]: true,
      [FEATURE_KEYS.AI_MARKETING]: true,
      [FEATURE_KEYS.INSTAGRAM_CONTENT]: true,
      [FEATURE_KEYS.WHATSAPP_MARKETING]: true,
      [FEATURE_KEYS.REVENUE_ANALYTICS]: true,
      [FEATURE_KEYS.CONVERSION_REPORTS]: true,
      [FEATURE_KEYS.ROUND_ROBIN]: true,
      [FEATURE_KEYS.AI_ASSISTANT]: true,
      [FEATURE_KEYS.ACCOUNT_MANAGER]: true,
    },
    popular: false,
    cta: "Subscribe to Growth (₹2,499/mo)",
    ctaHref: "/checkout?plan=growth",
  },

  [PLAN_IDS.CONCIERGE]: {
    id: PLAN_IDS.CONCIERGE,
    name: "Done-For-You Setup",
    badge: "Concierge Onboarding",
    price: 4999,
    displayPrice: "₹4,999",
    billingInterval: "ONE_TIME",
    displayPeriod: "one-time",
    description: "We set up your entire business, upload your services, configure hours, and train your staff.",
    bookingLimit: "UNLIMITED",
    features: [
      "1-on-1 Onboarding Specialist assigned (Ameya Kshirsagar)",
      "Complete service catalogue & menu upload",
      "Operating hours & break configuration",
      "Custom QR code & printable counter-stand design",
      "WhatsApp Business profile optimization",
      "Staff training video call (30 mins)",
      "Includes 1 Month (30 Days) of Growth Plan",
    ],
    entitlements: {
      ...({} as any),
      [FEATURE_KEYS.CONCIERGE_ONBOARDING]: true,
    },
    popular: false,
    cta: "Get Done-For-You Setup (₹4,999)",
    ctaHref: "/checkout?plan=setup-service",
  },
};

// Populate Concierge with full Growth entitlements
PLANS_CONFIG[PLAN_IDS.CONCIERGE].entitlements = {
  ...PLANS_CONFIG[PLAN_IDS.GROWTH].entitlements,
  [FEATURE_KEYS.CONCIERGE_ONBOARDING]: true,
};

/**
 * Single source of truth array export for UI pricing tables and checkout (Section 30)
 */
export const PRICING_PLANS = [
  {
    id: PLANS_CONFIG[PLAN_IDS.PILOT].id,
    name: PLANS_CONFIG[PLAN_IDS.PILOT].name,
    badge: PLANS_CONFIG[PLAN_IDS.PILOT].badge,
    price: PLANS_CONFIG[PLAN_IDS.PILOT].displayPrice,
    period: PLANS_CONFIG[PLAN_IDS.PILOT].displayPeriod,
    description: PLANS_CONFIG[PLAN_IDS.PILOT].description,
    features: PLANS_CONFIG[PLAN_IDS.PILOT].features,
    cta: PLANS_CONFIG[PLAN_IDS.PILOT].cta,
    ctaHref: PLANS_CONFIG[PLAN_IDS.PILOT].ctaHref,
    popular: PLANS_CONFIG[PLAN_IDS.PILOT].popular,
  },
  {
    id: PLANS_CONFIG[PLAN_IDS.STARTER].id,
    name: PLANS_CONFIG[PLAN_IDS.STARTER].name,
    badge: PLANS_CONFIG[PLAN_IDS.STARTER].badge,
    price: PLANS_CONFIG[PLAN_IDS.STARTER].displayPrice,
    period: PLANS_CONFIG[PLAN_IDS.STARTER].displayPeriod,
    description: PLANS_CONFIG[PLAN_IDS.STARTER].description,
    features: PLANS_CONFIG[PLAN_IDS.STARTER].features,
    cta: PLANS_CONFIG[PLAN_IDS.STARTER].cta,
    ctaHref: PLANS_CONFIG[PLAN_IDS.STARTER].ctaHref,
    popular: PLANS_CONFIG[PLAN_IDS.STARTER].popular,
  },
  {
    id: PLANS_CONFIG[PLAN_IDS.GROWTH].id,
    name: PLANS_CONFIG[PLAN_IDS.GROWTH].name,
    badge: PLANS_CONFIG[PLAN_IDS.GROWTH].badge,
    price: PLANS_CONFIG[PLAN_IDS.GROWTH].displayPrice,
    period: PLANS_CONFIG[PLAN_IDS.GROWTH].displayPeriod,
    description: PLANS_CONFIG[PLAN_IDS.GROWTH].description,
    features: PLANS_CONFIG[PLAN_IDS.GROWTH].features,
    cta: PLANS_CONFIG[PLAN_IDS.GROWTH].cta,
    ctaHref: PLANS_CONFIG[PLAN_IDS.GROWTH].ctaHref,
    popular: PLANS_CONFIG[PLAN_IDS.GROWTH].popular,
  },
  {
    id: PLANS_CONFIG[PLAN_IDS.CONCIERGE].id,
    name: PLANS_CONFIG[PLAN_IDS.CONCIERGE].name,
    badge: PLANS_CONFIG[PLAN_IDS.CONCIERGE].badge,
    price: PLANS_CONFIG[PLAN_IDS.CONCIERGE].displayPrice,
    period: PLANS_CONFIG[PLAN_IDS.CONCIERGE].displayPeriod,
    description: PLANS_CONFIG[PLAN_IDS.CONCIERGE].description,
    features: PLANS_CONFIG[PLAN_IDS.CONCIERGE].features,
    cta: PLANS_CONFIG[PLAN_IDS.CONCIERGE].cta,
    ctaHref: PLANS_CONFIG[PLAN_IDS.CONCIERGE].ctaHref,
    popular: PLANS_CONFIG[PLAN_IDS.CONCIERGE].popular,
  },
];

/**
 * Commercial milestone notifications for Pilot tier conversion (Section 37)
 */
export const PILOT_USAGE_MILESTONES = [
  {
    count: 25,
    threshold: 0.5,
    title: "Strong Momentum!",
    message: "You've already processed 25 bookings with Docodo.",
    action: "View Starter Plan",
    actionHref: "/checkout?plan=starter",
  },
  {
    count: 40,
    threshold: 0.8,
    title: "Approaching Pilot Limit",
    message: "Your business is getting traction. Starter removes the 50-booking limit.",
    action: "Upgrade to Starter",
    actionHref: "/checkout?plan=starter",
  },
  {
    count: 45,
    threshold: 0.9,
    title: "5 Bookings Remaining",
    message: "Only 5 Pilot bookings remaining for this monthly cycle.",
    action: "Upgrade to Starter",
    actionHref: "/checkout?plan=starter",
  },
  {
    count: 50,
    threshold: 1.0,
    title: "Pilot Limit Reached",
    message: "Pilot booking limit reached. Upgrade to continue accepting online bookings.",
    action: "Upgrade to Starter Now",
    actionHref: "/checkout?plan=starter",
  },
] as const;

/**
 * Concierge Onboarding Steps State Machine (Section 26)
 */
export const CONCIERGE_ONBOARDING_STEPS = [
  { id: "PAYMENT_RECEIVED", label: "Payment Received", order: 1 },
  { id: "ONBOARDING_PENDING", label: "Onboarding Pending", order: 2 },
  { id: "SPECIALIST_ASSIGNED", label: "Specialist Assigned", order: 3 },
  { id: "BUSINESS_DETAILS_COLLECTED", label: "Business Details Collected", order: 4 },
  { id: "SERVICES_UPLOADED", label: "Services Uploaded", order: 5 },
  { id: "HOURS_CONFIGURED", label: "Hours Configured", order: 6 },
  { id: "BOOKING_PAGE_READY", label: "Booking Page Ready", order: 7 },
  { id: "QR_READY", label: "Printable QR Stand Ready", order: 8 },
  { id: "WHATSAPP_OPTIMIZED", label: "WhatsApp Optimized", order: 9 },
  { id: "TRAINING_COMPLETED", label: "Training Completed", order: 10 },
  { id: "COMPLETED", label: "Launch Completed", order: 11 },
] as const;

export type ConciergeStepId = (typeof CONCIERGE_ONBOARDING_STEPS)[number]["id"];

/**
 * Helper to resolve plan by any identifier (case-insensitive)
 */
export function resolvePlan(identifier?: string | null): CommercialPlan {
  if (!identifier) return PLANS_CONFIG[PLAN_IDS.PILOT];
  const clean = identifier.toLowerCase().trim();

  if (clean.includes("concierge") || clean.includes("setup") || clean === "setup-service") {
    return PLANS_CONFIG[PLAN_IDS.CONCIERGE];
  }
  if (clean.includes("growth") || clean.includes("pro") || clean.includes("enterprise")) {
    return PLANS_CONFIG[PLAN_IDS.GROWTH];
  }
  if (clean.includes("starter")) {
    return PLANS_CONFIG[PLAN_IDS.STARTER];
  }
  return PLANS_CONFIG[PLAN_IDS.PILOT];
}
