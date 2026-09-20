import { CanonicalLead } from "./types";
import { EmailAdapter } from "../adapters/EmailAdapter";
import { WhatsAppAdapter } from "../adapters/WhatsAppAdapter";
import { OutreachPayload, OutreachResult } from "../adapters/types";

export type OutreachMode = "DRAFT_ONLY" | "APPROVAL_REQUIRED" | "AUTO_SEND_WHERE_PERMITTED";

export interface OutreachDraft {
  id: string;
  leadId: string;
  businessName: string;
  channel: "email" | "whatsapp" | "linkedin" | "instagram_dm" | "x_dm";
  recipient: string;
  subject?: string;
  body: string;
  evidenceCitations: string[];
  status: "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "SENT" | "OPT_OUT" | "FAILED";
  mode: OutreachMode;
  createdAt: string;
}

export class OutreachAgent {
  private emailAdapter = new EmailAdapter();
  private whatsAppAdapter = new WhatsAppAdapter();
  private draftStore: OutreachDraft[] = [];
  private suppressionList: Set<string> = new Set(); // phone/email/handles opted out

  public generatePersonalizedDraft(
    lead: CanonicalLead,
    channel: OutreachDraft["channel"] = "whatsapp",
    mode: OutreachMode = "APPROVAL_REQUIRED"
  ): OutreachDraft {
    const citations: string[] = [];
    const bestOpp = lead.opportunities[0];

    if (bestOpp) {
      citations.push(`${bestOpp.problem}: ${bestOpp.evidence}`);
    }

    let recipient = lead.normalizedPhone || "";
    if (channel === "email") {
      recipient = lead.identities.find((i) => i.email)?.email || `contact@${lead.normalizedDomain || "business.in"}`;
    } else if (channel === "instagram_dm") {
      recipient = lead.identities.find((i) => i.platform === "instagram")?.handle || `@${lead.canonicalName.toLowerCase().replace(/\s+/g, "")}`;
    } else if (channel === "linkedin") {
      recipient = lead.identities.find((i) => i.platform === "linkedin")?.profileUrl || `https://linkedin.com/company/${lead.canonicalName.toLowerCase().replace(/\s+/g, "-")}`;
    } else if (channel === "x_dm") {
      recipient = lead.identities.find((i) => i.platform === "x")?.handle || `@${lead.canonicalName.toLowerCase().replace(/\s+/g, "")}`;
    }

    let subject: string | undefined;
    let body = "";

    if (channel === "whatsapp") {
      body = `Hi ${lead.canonicalName} team! 👋 Noticed your great presence in ${lead.city}. We built Docodo to help local businesses automatically book appointments on WhatsApp 24/7 without manual messaging delays. Would you be open to a 2-min interactive preview for ${lead.canonicalName}? (Reply STOP to opt out)`;
    } else if (channel === "email") {
      subject = `Quick question regarding appointments at ${lead.canonicalName}`;
      body = `Hi ${lead.canonicalName} Team,\n\nI came across ${lead.canonicalName} while researching leading service businesses in ${lead.city}.\n\n${
        bestOpp ? `We noticed ${bestOpp.evidence.toLowerCase()}` : "We noticed you could easily increase online appointment conversions."
      }\n\nDocodo Growth OS connects your discovery channels with instant WhatsApp calendar scheduling and 5-star Google review automation.\n\nWould you be open to checking out a 2-minute live demo link tailored for ${lead.canonicalName}?\n\nBest regards,\nDocodo Growth Team\n(To unsubscribe, reply 'unsubscribe')`;
    } else if (channel === "instagram_dm") {
      body = `Hi @${lead.canonicalName}! Love your work in ${lead.city}. We built an instant AI booking receptionist that connects to Instagram and WhatsApp so you never lose high-intent clients. Happy to share a quick preview! (Reply STOP to opt out)`;
    } else if (channel === "linkedin") {
      body = `Hi ${lead.canonicalName} leadership team, came across your expansion in ${lead.city}. We assist multi-location service brands in automating appointment scheduling and review funnels via Docodo Growth OS. Would love to share a short case study.`;
    } else {
      body = `Hi @${lead.canonicalName}! Quick note from the Docodo team in ${lead.city} — we help local businesses automate booking flows and Google reviews. Happy to connect!`;
    }

    const draft: OutreachDraft = {
      id: `draft_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      leadId: lead.id,
      businessName: lead.canonicalName,
      channel,
      recipient,
      subject,
      body,
      evidenceCitations: citations,
      status: mode === "DRAFT_ONLY" ? "DRAFT" : "PENDING_APPROVAL",
      mode,
      createdAt: new Date().toISOString(),
    };

    this.draftStore.push(draft);
    return draft;
  }

  public approveDraft(draftId: string): OutreachDraft | null {
    const draft = this.draftStore.find((d) => d.id === draftId);
    if (draft && (draft.status === "PENDING_APPROVAL" || draft.status === "DRAFT")) {
      draft.status = "APPROVED";
      return draft;
    }
    return null;
  }

  public optOutRecipient(recipientAddress: string): void {
    this.suppressionList.add(recipientAddress.toLowerCase().trim());
  }

  public isSuppressed(recipientAddress: string): boolean {
    return this.suppressionList.has(recipientAddress.toLowerCase().trim());
  }

  public async dispatchOutreach(draftId: string): Promise<OutreachResult> {
    const draft = this.draftStore.find((d) => d.id === draftId);
    if (!draft) {
      return { success: false, status: "FAILED", error: "Draft not found" };
    }

    if (this.isSuppressed(draft.recipient)) {
      draft.status = "OPT_OUT";
      return { success: false, status: "OPT_OUT", error: "Recipient is in suppression / opt-out list" };
    }

    if (draft.status !== "APPROVED" && draft.mode !== "AUTO_SEND_WHERE_PERMITTED") {
      return {
        success: false,
        status: "FAILED",
        error: "Dispatch blocked: Human approval required before sending outbound message.",
      };
    }

    const payload: OutreachPayload = {
      recipient: draft.recipient,
      channel: draft.channel,
      subject: draft.subject,
      body: draft.body,
      evidenceCitations: draft.evidenceCitations,
    };

    let result: OutreachResult;
    if (draft.channel === "email") {
      result = await this.emailAdapter.sendOutreach(payload);
    } else if (draft.channel === "whatsapp") {
      result = await this.whatsAppAdapter.sendOutreach(payload);
    } else {
      // Social DM simulated / direct dispatch
      result = {
        success: true,
        messageId: `${draft.channel}_msg_${Date.now()}`,
        sentAt: new Date().toISOString(),
        status: "SENT",
      };
    }

    if (result.success) {
      draft.status = "SENT";
    } else {
      draft.status = "FAILED";
    }

    return result;
  }

  public getDrafts(): OutreachDraft[] {
    return [...this.draftStore];
  }

  public static isSuppressed(recipient: string, suppressionList: string[]): boolean {
    const normalized = recipient.toLowerCase().trim();
    return suppressionList.some((s) => s.toLowerCase().trim() === normalized);
  }
}

export const outreachAgent = new OutreachAgent();
