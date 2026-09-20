"use server";

import { outreachAgent, OutreachMode } from "../../growth-os/agents/OutreachAgent";
import { CanonicalLead } from "../../growth-os/agents/types";

export async function createOutreachDraftAction(
  lead: CanonicalLead,
  channel: "whatsapp" | "email" | "instagram_dm" = "whatsapp",
  mode: OutreachMode = "APPROVAL_REQUIRED"
) {
  try {
    const draft = outreachAgent.generatePersonalizedDraft(lead, channel, mode);
    return { success: true, draft };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to create draft" };
  }
}

export async function approveOutreachDraftAction(draftId: string) {
  try {
    const draft = outreachAgent.approveDraft(draftId);
    if (!draft) return { success: false, error: "Draft not found or already processed" };
    return { success: true, draft };
  } catch (error: any) {
    return { success: false, error: error?.message || "Approval failed" };
  }
}

export async function dispatchOutreachAction(draftId: string) {
  try {
    const result = await outreachAgent.dispatchOutreach(draftId);
    return result;
  } catch (error: any) {
    return { success: false, status: "FAILED" as const, error: error?.message || "Outreach dispatch failed" };
  }
}

export async function getOutreachDraftsAction() {
  try {
    const drafts = outreachAgent.getDrafts();
    return { success: true, drafts };
  } catch (error: any) {
    return { success: false, drafts: [] };
  }
}
