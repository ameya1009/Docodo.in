/**
 * Docodo Autonomous Revenue OS — Sales Agent & Conversation Intelligence
 * Operates like a trained Docodo sales representative across 12 conversation states.
 */

import { productCatalogAgent, DocodoProduct } from "./ProductCatalogAgent";
import { solutionMatchingAgent } from "./SolutionMatchingAgent";
import { proposalAgent, ClientProposal } from "./PricingAgent";
import { CanonicalLead } from "./types";

export type ConversationState =
  | "new"
  | "qualification"
  | "needs_discovery"
  | "solution_presented"
  | "pricing"
  | "objection"
  | "negotiation"
  | "ready_to_buy"
  | "payment_pending"
  | "won"
  | "lost"
  | "nurture";

export interface ConversationMessage {
  id: string;
  sender: "LEAD" | "AI_SALES_REP" | "HUMAN_STAFF";
  text: string;
  timestamp: string;
  detectedIntent?: string;
}

export interface SalesConversationSession {
  sessionId: string;
  leadId: string;
  businessName: string;
  state: ConversationState;
  messages: ConversationMessage[];
  identifiedBottlenecks: string[];
  matchedProduct?: DocodoProduct;
  generatedProposal?: ClientProposal;
  paymentLinkUrl?: string;
  isHumanTakeover: boolean;
  notes: string[];
}

export class SalesAgent {
  public handleCustomerMessage(
    session: SalesConversationSession,
    userMessage: string
  ): { reply: string; newState: ConversationState; actionRequired?: string } {
    const text = userMessage.toLowerCase().trim();
    session.messages.push({
      id: `msg_${Date.now()}`,
      sender: "LEAD",
      text: userMessage,
      timestamp: new Date().toISOString(),
    });

    // 1. Check for Opt-Out / Stop
    if (text === "stop" || text === "unsubscribe" || text === "not interested") {
      session.state = "lost";
      const reply = "Understood! We have completely unsubscribed your number and will not reach out again. Have a great day!";
      session.messages.push({ id: `msg_ai_${Date.now()}`, sender: "AI_SALES_REP", text: reply, timestamp: new Date().toISOString() });
      return { reply, newState: "lost", actionRequired: "SUPPRESS_LEAD" };
    }

    // 2. Check for Objections
    if (text.includes("too expensive") || text.includes("price") || text.includes("cost")) {
      session.state = "objection";
      const reply = "I completely understand budget is top of mind. Many of our clients felt the same initially, but found that capturing just 2 extra salon appointments per month completely covered the entire Docodo subscription. Would you like to see our ROI breakdown for your location?";
      session.messages.push({ id: `msg_ai_${Date.now()}`, sender: "AI_SALES_REP", text: reply, timestamp: new Date().toISOString() });
      return { reply, newState: "objection" };
    }

    // 3. Ready to Buy / Payment Request
    if (text.includes("how to start") || text.includes("send payment") || text.includes("get started") || text.includes("ready")) {
      session.state = "ready_to_buy";
      const prod = session.matchedProduct || productCatalogAgent.getProduct("prod_growth_bundle") || productCatalogAgent.getAllProducts()[0];
      const paymentLink = `https://docodo.in/pay/quick_${session.leadId}?product=${prod.id}`;
      session.paymentLinkUrl = paymentLink;
      const reply = `Fantastic! I've set up your activation link for ${prod.name}. You can complete secure activation here: ${paymentLink}. Once confirmed, our engineering team immediately starts your workspace provisioning!`;
      session.state = "payment_pending";
      session.messages.push({ id: `msg_ai_${Date.now()}`, sender: "AI_SALES_REP", text: reply, timestamp: new Date().toISOString() });
      return { reply, newState: "payment_pending", actionRequired: "TRACK_PAYMENT" };
    }

    // 4. Needs Discovery & Qualification
    if (session.state === "new" || session.state === "qualification" || session.state === "needs_discovery") {
      if (text.includes("booking") || text.includes("whatsapp") || text.includes("lead") || text.includes("customer")) {
        const prod = text.includes("whatsapp")
          ? productCatalogAgent.getProduct("prod_whatsapp_ai")
          : productCatalogAgent.getProduct("prod_booking_engine");
        session.matchedProduct = prod || productCatalogAgent.getAllProducts()[0];
        session.state = "solution_presented";
        const reply = `That is very common for growing businesses in ${session.businessName}. Most inquiries are lost because customers want immediate slot confirmation without back-and-forth messaging. We built ${session.matchedProduct.name} specifically to solve this. Would you like a 2-minute live demo link or a customized proposal?`;
        session.messages.push({ id: `msg_ai_${Date.now()}`, sender: "AI_SALES_REP", text: reply, timestamp: new Date().toISOString() });
        return { reply, newState: "solution_presented" };
      }

      // Default discovery prompt
      session.state = "needs_discovery";
      const reply = `Thanks for reaching out! To give you the exact best recommendation for ${session.businessName}, are you currently taking bookings mostly via WhatsApp, phone calls, or through a website?`;
      session.messages.push({ id: `msg_ai_${Date.now()}`, sender: "AI_SALES_REP", text: reply, timestamp: new Date().toISOString() });
      return { reply, newState: "needs_discovery" };
    }

    // Default fallback
    const reply = `Thanks for your response! Docodo helps local businesses automate bookings and 5-star Google reviews 24/7. Shall we set up a quick 5-minute walkthrough for ${session.businessName}?`;
    session.messages.push({ id: `msg_ai_${Date.now()}`, sender: "AI_SALES_REP", text: reply, timestamp: new Date().toISOString() });
    return { reply, newState: session.state };
  }
}

export const salesAgent = new SalesAgent();
