import { describe, it, expect } from "vitest";
import { PuneClinicsCampaignEngine, PUNE_CLINICS_RAW_DATA } from "../lib/growth-os/campaigns/pune_clinics_100";
import { dispatchPuneClinicsBatchAction } from "../lib/actions/growth-os/dispatch-campaign";

describe("Docodo Growth OS — Pune Clinics 100-Lead Campaign Verification", () => {
  it("ingests exactly 100 raw clinic records from the directory", () => {
    expect(PUNE_CLINICS_RAW_DATA.length).toBe(100);
  });

  it("verifies data integrity across all 100 records (Doctor, Clinic, Locality, Phone, Email)", () => {
    for (const record of PUNE_CLINICS_RAW_DATA) {
      expect(record.id).toBeGreaterThanOrEqual(1);
      expect(record.id).toBeLessThanOrEqual(100);
      expect(record.clinicName.length).toBeGreaterThan(5);
      expect(record.doctor.startsWith("Dr.")).toBe(true);
      expect(record.locality.length).toBeGreaterThan(2);
      expect(record.phone.startsWith("+91")).toBe(true);
      expect(record.email).toMatch(/^contact@cliniczone\d+\.com$/);
      expect(typeof record.hasWeb).toBe("boolean");
      expect(typeof record.hasWA).toBe("boolean");
      expect(record.digitalStack.length).toBeGreaterThan(0);
    }
  });

  it("synthesizes personalized multi-channel outreach drafts for all 100 clinics", () => {
    const drafts = PuneClinicsCampaignEngine.generateAllPersonalizedDrafts();
    expect(drafts.length).toBe(100);

    for (const draft of drafts) {
      expect(draft.emailSubject.length).toBeGreaterThan(10);
      expect(draft.emailBody).toContain(draft.doctor);
      expect(draft.emailBody).toContain(draft.clinicName);
      expect(draft.emailBody).toContain(draft.locality);
      expect(draft.whatsappMessage).toContain(draft.doctor);
      expect(draft.linkedinMessage.length).toBeGreaterThan(20);
      expect(draft.auditPreviewUrl).toContain(`https://docodo.in/preview/clinic_${draft.id}`);
      expect(draft.customDeal.length).toBeGreaterThan(5);
      expect(draft.status).toBe("READY_TO_SEND");
    }
  });

  it("executes batch dispatch action with opt-out suppression", async () => {
    const suppressionList = ["contact@cliniczone1.com", "+919823010002"];
    const result = await dispatchPuneClinicsBatchAction(10, suppressionList);

    expect(result.totalProcessed).toBe(10);
    expect(result.suppressedCount).toBe(2);
    expect(result.emailsDispatched).toBe(8);
    expect(result.whatsappDispatched).toBe(8);
    expect(result.errors.length).toBe(0);
  });
});
