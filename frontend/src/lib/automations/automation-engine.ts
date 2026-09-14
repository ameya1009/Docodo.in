/**
 * DOCODO BUSINESS OPERATING SYSTEM — AUTOMATION ENGINE
 * Inspired by Make and n8n product principles.
 * Supports ready-to-run templates, natural-language workflow generation,
 * and observable execution tracking.
 */

export interface AutomationNode {
  id: string;
  type: "TRIGGER" | "ACTION" | "CONDITION" | "DELAY" | "AI" | "NOTIFICATION" | "WEBHOOK";
  name: string;
  config: Record<string, any>;
}

export interface AutomationTemplate {
  id: string;
  name: string;
  category: "SALON" | "CLINIC" | "GYM" | "SPA" | "GENERAL";
  description: string;
  trigger: string;
  actions: string[];
  nodes: AutomationNode[];
  isActive: boolean;
  metrics: {
    runsCount: number;
    successRate: number;
  };
}

export interface AutomationExecutionRecord {
  id: string;
  automationId: string;
  automationName: string;
  businessId: string;
  triggerEvent: string;
  startedAt: string;
  completedAt?: string;
  durationMs: number;
  status: "SUCCESS" | "RUNNING" | "FAILED" | "RETRYING";
  steps: {
    nodeId: string;
    nodeName: string;
    status: "SUCCESS" | "FAILED" | "SKIPPED";
    output?: string;
  }[];
  error?: string;
}

export const PREBUILT_AUTOMATION_TEMPLATES: AutomationTemplate[] = [
  {
    id: "auto-booking-confirmation-reminder",
    name: "Booking Confirmation & 24h WhatsApp Reminder",
    category: "GENERAL",
    description: "Sends immediate WhatsApp appointment receipt when booked, then triggers an automated reminder 24 hours before the appointment.",
    trigger: "BOOKING_CREATED",
    actions: ["Send WhatsApp Confirmation", "Wait until 24h before", "Send Pre-Slot Reminder"],
    isActive: true,
    metrics: { runsCount: 428, successRate: 99.4 },
    nodes: [
      { id: "node-1", type: "TRIGGER", name: "New Booking Created", config: { event: "BOOKING_CREATED" } },
      { id: "node-2", type: "NOTIFICATION", name: "Send Instant WhatsApp Confirmation", config: { channel: "WHATSAPP", template: "instant_confirm" } },
      { id: "node-3", type: "DELAY", name: "Wait Until 24 Hours Before Slot", config: { hoursBefore: 24 } },
      { id: "node-4", type: "NOTIFICATION", name: "Send 24h Reminder with Location Pin", config: { channel: "WHATSAPP", template: "reminder_24h" } },
    ],
  },
  {
    id: "auto-review-collection",
    name: "Post-Service Google Review Collection",
    category: "SALON",
    description: "Waits 2 hours after appointment completion, then sends a polite WhatsApp message asking for a 5-star Google review.",
    trigger: "BOOKING_COMPLETED",
    actions: ["Delay 2 Hours", "Send Review Request Link", "Log Review Opportunity"],
    isActive: true,
    metrics: { runsCount: 312, successRate: 98.8 },
    nodes: [
      { id: "node-1", type: "TRIGGER", name: "Appointment Marked Completed", config: { event: "BOOKING_COMPLETED" } },
      { id: "node-2", type: "DELAY", name: "Delay 2 Hours", config: { durationHours: 2 } },
      { id: "node-3", type: "NOTIFICATION", name: "Send Google Review Request", config: { channel: "WHATSAPP", template: "review_request" } },
    ],
  },
  {
    id: "auto-inactive-customer-reactivation",
    name: "30-Day Inactive Customer Re-Engagement",
    category: "SALON",
    description: "Identifies clients who haven't returned for 30+ days and creates a personalized reactivation discount draft for 1-click owner approval.",
    trigger: "CUSTOMER_INACTIVE_30D",
    actions: ["Detect Inactivity", "Generate AI Discount Copy", "Owner 1-Click WhatsApp Blast"],
    isActive: true,
    metrics: { runsCount: 154, successRate: 97.5 },
    nodes: [
      { id: "node-1", type: "TRIGGER", name: "Customer Inactive > 30 Days", config: { days: 30 } },
      { id: "node-2", type: "AI", name: "Generate Personalized Comeback Offer", config: { tone: "warm", discountPct: 15 } },
      { id: "node-3", type: "NOTIFICATION", name: "Send Re-Engagement Message", config: { channel: "WHATSAPP", requiresApproval: true } },
    ],
  },
  {
    id: "auto-new-lead-nurture",
    name: "Instant Enquiry AI Qualification & Follow-up",
    category: "CLINIC",
    description: "When a prospective patient submits a website enquiry, AI answers FAQs instantly and alerts the receptionist for consultation booking.",
    trigger: "LEAD_CREATED",
    actions: ["Score Lead", "AI Knowledge Answer", "Alert Receptionist"],
    isActive: true,
    metrics: { runsCount: 94, successRate: 100 },
    nodes: [
      { id: "node-1", type: "TRIGGER", name: "New Lead Created", config: { event: "LEAD_CREATED" } },
      { id: "node-2", type: "AI", name: "AI Lead Qualification & Intent Score", config: { model: "gemini-1.5-flash" } },
      { id: "node-3", type: "NOTIFICATION", name: "Instant WhatsApp Acknowledgment", config: { channel: "WHATSAPP" } },
    ],
  },
  {
    id: "auto-no-show-recovery",
    name: "No-Show Recovery & Compassionate Reschedule",
    category: "GENERAL",
    description: "When an appointment is missed, automatically sends a gentle rebooking link to rescue the lost revenue without confrontation.",
    trigger: "BOOKING_NO_SHOW",
    actions: ["Detect Missed Slot", "Send Reschedule Link", "Free up Calendar"],
    isActive: false,
    metrics: { runsCount: 45, successRate: 95.5 },
    nodes: [
      { id: "node-1", type: "TRIGGER", name: "Appointment Marked No-Show", config: { event: "BOOKING_NO_SHOW" } },
      { id: "node-2", type: "NOTIFICATION", name: "Send Friendly Reschedule Link", config: { channel: "WHATSAPP" } },
    ],
  },
];

/**
 * Natural Language Automation Parser
 * Converts plain English/Hinglish intent into a valid AutomationTemplate node graph.
 */
export function parseNaturalLanguageAutomation(prompt: string): AutomationTemplate {
  const cleanPrompt = prompt.toLowerCase();
  
  let trigger = "BOOKING_CREATED";
  let triggerName = "When a Booking is Created";

  if (cleanPrompt.includes("cancel") || cleanPrompt.includes("cancelled")) {
    trigger = "BOOKING_CANCELLED";
    triggerName = "When a Booking is Cancelled";
  } else if (cleanPrompt.includes("complete") || cleanPrompt.includes("finished") || cleanPrompt.includes("after service")) {
    trigger = "BOOKING_COMPLETED";
    triggerName = "When an Appointment Completes";
  } else if (cleanPrompt.includes("inactive") || cleanPrompt.includes("not returned") || cleanPrompt.includes("30 days")) {
    trigger = "CUSTOMER_INACTIVE_30D";
    triggerName = "When Customer is Inactive for 30+ Days";
  } else if (cleanPrompt.includes("lead") || cleanPrompt.includes("enquiry") || cleanPrompt.includes("inquiry")) {
    trigger = "LEAD_CREATED";
    triggerName = "When a New Lead or Enquiry is Submitted";
  }

  const nodes: AutomationNode[] = [
    { id: "node-1", type: "TRIGGER", name: triggerName, config: { event: trigger } },
  ];

  if (cleanPrompt.includes("confirm") || cleanPrompt.includes("receipt")) {
    nodes.push({
      id: `node-${nodes.length + 1}`,
      type: "NOTIFICATION",
      name: "Send Instant WhatsApp Confirmation",
      config: { channel: "WHATSAPP" },
    });
  }

  if (cleanPrompt.includes("remind") || cleanPrompt.includes("1 day") || cleanPrompt.includes("24 hour")) {
    nodes.push({
      id: `node-${nodes.length + 1}`,
      type: "DELAY",
      name: "Wait Until 24 Hours Before Appointment",
      config: { hoursBefore: 24 },
    });
    nodes.push({
      id: `node-${nodes.length + 1}`,
      type: "NOTIFICATION",
      name: "Send WhatsApp Pre-Appointment Reminder",
      config: { channel: "WHATSAPP" },
    });
  }

  if (cleanPrompt.includes("review") || cleanPrompt.includes("feedback") || cleanPrompt.includes("google")) {
    nodes.push({
      id: `node-${nodes.length + 1}`,
      type: "NOTIFICATION",
      name: "Request 5-Star Google Review",
      config: { channel: "WHATSAPP" },
    });
  }

  if (cleanPrompt.includes("discount") || cleanPrompt.includes("offer") || cleanPrompt.includes("promo")) {
    nodes.push({
      id: `node-${nodes.length + 1}`,
      type: "AI",
      name: "Generate Personalized Comeback Offer via Gemini AI",
      config: { model: "gemini-1.5-flash" },
    });
  }

  return {
    id: `custom-auto-${Date.now()}`,
    name: prompt.length > 50 ? `${prompt.substring(0, 47)}...` : prompt,
    category: "GENERAL",
    description: `Custom automation generated from: "${prompt}"`,
    trigger,
    actions: nodes.filter((n) => n.type !== "TRIGGER").map((n) => n.name),
    nodes,
    isActive: true,
    metrics: { runsCount: 1, successRate: 100 },
  };
}
