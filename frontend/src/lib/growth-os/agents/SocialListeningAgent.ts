import { DiscoveredRecord, PlatformSource } from "../adapters/types";
import { SocialIntentSignal } from "./types";

export class SocialListeningAgent {
  public analyzeSignal(
    platform: PlatformSource,
    author: string,
    text: string
  ): SocialIntentSignal {
    const lower = text.toLowerCase();

    let entityType: SocialIntentSignal["entityType"] = "general_user";
    let intentClass = "general_inquiry";
    let sentiment: SocialIntentSignal["sentiment"] = "neutral";
    let isLead = false;
    let recommendedAction = "Monitor discussion";

    // 1. Entity Classification
    if (
      lower.includes("my salon") ||
      lower.includes("my clinic") ||
      lower.includes("our spa") ||
      lower.includes("our business") ||
      lower.includes("we run a") ||
      lower.includes("my business") ||
      lower.includes("as an owner") ||
      lower.includes("our studio")
    ) {
      entityType = "potential_customer";
    } else if (lower.includes("existing user") || lower.includes("using docodo") || lower.includes("already a client")) {
      entityType = "existing_customer";
    } else if (lower.includes("competitor") || lower.includes("alternate to") || lower.includes("vs fresha") || lower.includes("vs zenoti")) {
      entityType = "competitor";
    } else if (lower.includes("industry trend") || lower.includes("market growth") || lower.includes("wellness sector")) {
      entityType = "industry_discussion";
    }

    // 2. Comprehensive 12 Signal Categories
    if (
      lower.includes("need more customers") ||
      lower.includes("get more clients") ||
      lower.includes("lead generation") ||
      lower.includes("inquiries") ||
      lower.includes("stagnant growth")
    ) {
      intentClass = "lead_gen";
      isLead = true;
      recommendedAction = "Draft Docodo Acquisition & CRM proposal";
    } else if (
      lower.includes("website") ||
      lower.includes("landing page") ||
      lower.includes("bounce rate") ||
      lower.includes("site doesn't convert")
    ) {
      intentClass = "website_conversion";
      isLead = true;
      recommendedAction = "Offer Docodo AI Storefront audit & demo";
    } else if (
      lower.includes("booking") ||
      lower.includes("appointment") ||
      lower.includes("calendar") ||
      lower.includes("scheduling") ||
      lower.includes("double booked")
    ) {
      intentClass = "booking_funnel";
      isLead = true;
      recommendedAction = "Draft Docodo Instant Booking & WhatsApp integration pitch";
    } else if (
      lower.includes("whatsapp") ||
      lower.includes("dm") ||
      lower.includes("follow up") ||
      lower.includes("nobody replies") ||
      lower.includes("missed calls")
    ) {
      intentClass = "whatsapp_automation";
      isLead = true;
      recommendedAction = "Draft Docodo WhatsApp AI Receptionist demo";
    } else if (
      lower.includes("google maps") ||
      lower.includes("seo") ||
      lower.includes("reviews") ||
      lower.includes("rank") ||
      lower.includes("rating")
    ) {
      intentClass = "local_seo";
      isLead = true;
      recommendedAction = "Draft Docodo Review Engine & Local SEO audit";
    } else if (
      lower.includes("customer complaint") ||
      lower.includes("bad service") ||
      lower.includes("unhappy customer")
    ) {
      intentClass = "customer_complaint";
      isLead = false;
      recommendedAction = "Monitor customer feedback loop";
    } else if (
      lower.includes("retention") ||
      lower.includes("repeat client") ||
      lower.includes("churn") ||
      lower.includes("never came back")
    ) {
      intentClass = "customer_retention";
      isLead = true;
      recommendedAction = "Propose Docodo Automated Re-engagement sequence";
    } else if (
      lower.includes("opening new branch") ||
      lower.includes("expanding to") ||
      lower.includes("hiring stylists") ||
      lower.includes("new location")
    ) {
      intentClass = "business_expansion";
      isLead = true;
      recommendedAction = "Pitch Docodo Multi-Location Expansion Suite";
    } else if (
      lower.includes("social media is dead") ||
      lower.includes("no time to post") ||
      lower.includes("content ideas") ||
      lower.includes("inactive page")
    ) {
      intentClass = "content_gap";
      isLead = true;
      recommendedAction = "Showcase Docodo 30-Day Omnichannel Content Engine";
    }

    // 3. Sentiment Analysis
    if (
      lower.includes("frustrated") ||
      lower.includes("hate") ||
      lower.includes("lose") ||
      lower.includes("terrible") ||
      lower.includes("worst") ||
      lower.includes("broken")
    ) {
      sentiment = "negative";
    } else if (
      lower.includes("great") ||
      lower.includes("love") ||
      lower.includes("recommend") ||
      lower.includes("success") ||
      lower.includes("excited")
    ) {
      sentiment = "positive";
    }

    return {
      id: `signal_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      platform,
      author,
      content: text,
      intentClass,
      entityType,
      sentiment,
      isLead,
      recommendedAction,
      timestamp: new Date().toISOString(),
    };
  }

  public scanRecords(records: DiscoveredRecord[]): SocialIntentSignal[] {
    const signals: SocialIntentSignal[] = [];
    for (const r of records) {
      if (r.snippet) {
        signals.push(this.analyzeSignal(r.platform, r.rawName, r.snippet));
      }
    }
    return signals;
  }
}

export const socialListeningAgent = new SocialListeningAgent();
