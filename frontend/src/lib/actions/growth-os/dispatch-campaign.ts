"use server";

import { PuneClinicsCampaignEngine, PersonalizedOutreachDraft } from "@/lib/growth-os/campaigns/pune_clinics_100";
import { adapterRegistry } from "@/lib/growth-os/adapters/AdapterRegistry";
import { OutreachPayload } from "@/lib/growth-os/adapters/types";

export interface BatchDispatchResult {
  totalProcessed: number;
  emailsDispatched: number;
  whatsappDispatched: number;
  suppressedCount: number;
  errors: string[];
  dispatchedDrafts: PersonalizedOutreachDraft[];
}

export async function getPuneClinicsDraftsAction(): Promise<PersonalizedOutreachDraft[]> {
  return PuneClinicsCampaignEngine.generateAllPersonalizedDrafts();
}

export async function dispatchPuneClinicsBatchAction(
  batchLimit: number = 20,
  suppressionList: string[] = []
): Promise<BatchDispatchResult> {
  const allDrafts = PuneClinicsCampaignEngine.generateAllPersonalizedDrafts();
  const selectedBatch = allDrafts.slice(0, batchLimit);

  const emailAdapter = adapterRegistry.getAdapter("email");
  const whatsAppAdapter = adapterRegistry.getAdapter("whatsapp");

  let emailsDispatched = 0;
  let whatsappDispatched = 0;
  let suppressedCount = 0;
  const errors: string[] = [];

  for (const draft of selectedBatch) {
    // Check opt-out suppression
    if (suppressionList.includes(draft.email) || suppressionList.includes(draft.phone)) {
      suppressedCount++;
      continue;
    }

    try {
      // 1. Dispatch Email
      if (emailAdapter && emailAdapter.sendOutreach) {
        const emailPayload: OutreachPayload = {
          recipient: draft.email,
          channel: "email",
          subject: draft.emailSubject,
          body: draft.emailBody,
          metadata: { clinicId: draft.id, specialty: draft.specialty },
        };
        const emailRes = await emailAdapter.sendOutreach(emailPayload);
        if (emailRes.success) emailsDispatched++;
      }

      // 2. Dispatch WhatsApp
      if (whatsAppAdapter && whatsAppAdapter.sendOutreach) {
        const waPayload: OutreachPayload = {
          recipient: draft.phone,
          channel: "whatsapp",
          body: draft.whatsappMessage,
          metadata: { clinicId: draft.id, doctor: draft.doctor },
        };
        const waRes = await whatsAppAdapter.sendOutreach(waPayload);
        if (waRes.success) whatsappDispatched++;
      }

      draft.status = "SENT";
    } catch (err: any) {
      errors.push(`Failed for ${draft.clinicName}: ${err?.message}`);
    }
  }

  return {
    totalProcessed: selectedBatch.length,
    emailsDispatched,
    whatsappDispatched,
    suppressedCount,
    errors,
    dispatchedDrafts: selectedBatch,
  };
}
