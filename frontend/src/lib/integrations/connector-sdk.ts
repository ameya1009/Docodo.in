/**
 * DOCODO BUSINESS OPERATING SYSTEM — CONNECTOR SDK
 * Inspired by Make and n8n integration interfaces.
 * Provides a standardized contract for all third-party and internal connectors.
 */

export interface ConnectorTrigger {
  id: string;
  name: string;
  description: string;
}

export interface ConnectorAction {
  id: string;
  name: string;
  description: string;
  inputs: { name: string; type: "string" | "number" | "boolean" | "json"; required: boolean }[];
}

export interface IntegrationConnector {
  id: string;
  name: string;
  category: "COMMUNICATION" | "PAYMENT" | "CALENDAR" | "MARKETING" | "AI";
  status: "CONNECTED" | "DISCONNECTED" | "AVAILABLE";
  authType: "OAUTH2" | "API_KEY" | "WEBHOOK" | "ZERO_COST_INTENT";
  triggers: ConnectorTrigger[];
  actions: ConnectorAction[];
  isProductionReady: boolean;
  docUrl: string;
}

export const DOCODO_INTEGRATIONS_REGISTRY: IntegrationConnector[] = [
  {
    id: "whatsapp",
    name: "WhatsApp Business & Direct wa.me",
    category: "COMMUNICATION",
    status: "CONNECTED",
    authType: "ZERO_COST_INTENT",
    triggers: [
      { id: "msg_received", name: "Incoming Message", description: "Customer replies or asks a question" },
      { id: "booking_clicked", name: "Booking Link Clicked", description: "Customer taps booking CTA in chat" },
    ],
    actions: [
      {
        id: "send_text",
        name: "Send WhatsApp Message",
        description: "Sends an appointment confirmation, reminder, or response",
        inputs: [
          { name: "phone", type: "string", required: true },
          { name: "message", type: "string", required: true },
        ],
      },
      {
        id: "send_reminder",
        name: "Send 24h Reminder",
        description: "Dispatches pre-formatted appointment reminder",
        inputs: [
          { name: "bookingId", type: "string", required: true },
        ],
      },
    ],
    isProductionReady: true,
    docUrl: "/dashboard/whatsapp",
  },
  {
    id: "razorpay",
    name: "Razorpay Payments & Subscriptions",
    category: "PAYMENT",
    status: "CONNECTED",
    authType: "API_KEY",
    triggers: [
      { id: "payment_captured", name: "Payment Captured", description: "Customer successfully paid online via UPI/Card" },
      { id: "subscription_halted", name: "Subscription Halted", description: "Merchant recurring subscription failed" },
    ],
    actions: [
      {
        id: "create_order",
        name: "Create Payment Order",
        description: "Generates tamper-proof Razorpay order token",
        inputs: [
          { name: "amountPaise", type: "number", required: true },
          { name: "receiptId", type: "string", required: true },
        ],
      },
    ],
    isProductionReady: true,
    docUrl: "/checkout",
  },
  {
    id: "google_calendar",
    name: "Google Calendar Sync",
    category: "CALENDAR",
    status: "AVAILABLE",
    authType: "OAUTH2",
    triggers: [
      { id: "slot_busy", name: "Slot Marked Busy", description: "Event added to personal Google Calendar" },
    ],
    actions: [
      {
        id: "create_event",
        name: "Create Calendar Appointment",
        description: "Adds confirmed booking to staff Google Calendar",
        inputs: [
          { name: "title", type: "string", required: true },
          { name: "startTime", type: "string", required: true },
          { name: "endTime", type: "string", required: true },
        ],
      },
    ],
    isProductionReady: true,
    docUrl: "/dashboard/settings",
  },
  {
    id: "google_reviews",
    name: "Google Business Profile Reviews",
    category: "MARKETING",
    status: "AVAILABLE",
    authType: "API_KEY",
    triggers: [
      { id: "new_review", name: "New Review Received", description: "Customer posts review on Google Maps" },
    ],
    actions: [
      {
        id: "send_review_link",
        name: "Dispatch Review Request",
        description: "Sends direct review link with thank you message",
        inputs: [
          { name: "customerPhone", type: "string", required: true },
        ],
      },
    ],
    isProductionReady: true,
    docUrl: "/dashboard/automations",
  },
  {
    id: "gemini_ai",
    name: "Google Gemini 1.5 Flash AI Engine",
    category: "AI",
    status: "CONNECTED",
    authType: "API_KEY",
    triggers: [
      { id: "ai_intent_detected", name: "Intent Detected", description: "Customer asks pricing or availability query" },
    ],
    actions: [
      {
        id: "generate_copy",
        name: "Generate Marketing Copy",
        description: "Produces Instagram caption or promo campaign in Hindi/English",
        inputs: [
          { name: "topic", type: "string", required: true },
          { name: "tone", type: "string", required: false },
        ],
      },
    ],
    isProductionReady: true,
    docUrl: "/dashboard/ai-content",
  },
];
