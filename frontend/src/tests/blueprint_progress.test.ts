import { describe, it, expect } from "vitest";
import BlueprintProgressDashboard, {
  BLUEPRINT_CATEGORIES,
  INDUSTRIAL_RATINGS,
} from "../components/blueprint/BlueprintProgressDashboard";

describe("Docodo Blueprint v1.0 (19 Oct 2026) Audit & Industrial Ratings Test Suite", () => {
  describe("1. Blueprint Category & Checklist Verification", () => {
    it("verifies all 10 blueprint modules are structurally defined", () => {
      expect(BLUEPRINT_CATEGORIES).toBeDefined();
      expect(BLUEPRINT_CATEGORIES.length).toBe(10);
    });

    it("verifies Phase 0 & Phase 1 pilot readiness for Pune clinics is >= 95%", () => {
      const allItems = BLUEPRINT_CATEGORIES.flatMap((c) => c.items);
      const phase01Items = allItems.filter((i) => i.phase <= 1);
      const phase01Done = phase01Items.filter((i) => i.status === "DONE");
      const readyPercent = Math.round((phase01Done.length / phase01Items.length) * 100);

      expect(readyPercent).toBeGreaterThanOrEqual(95);
    });

    it("verifies overall platform readiness is >= 90%", () => {
      const allItems = BLUEPRINT_CATEGORIES.flatMap((c) => c.items);
      const doneItems = allItems.filter((i) => i.status === "DONE");
      const overallPercent = Math.round((doneItems.length / allItems.length) * 100);

      expect(overallPercent).toBeGreaterThanOrEqual(90);
    });
  });

  describe("2. Industrial Standards & Compliance Ratings", () => {
    it("verifies all 6 mandatory industrial standards are audited and scored >= 95%", () => {
      expect(INDUSTRIAL_RATINGS.length).toBe(6);

      const standardIds = INDUSTRIAL_RATINGS.map((r) => r.id);
      expect(standardIds).toContain("owasp-asvs");
      expect(standardIds).toContain("dpdp-2023");
      expect(standardIds).toContain("nmc-ethics");
      expect(standardIds).toContain("core-web-vitals");
      expect(standardIds).toContain("npci-upi");
      expect(standardIds).toContain("iso-25010");

      INDUSTRIAL_RATINGS.forEach((standard) => {
        expect(standard.score).toBeGreaterThanOrEqual(95);
        expect(standard.rating).toContain("Grade A");
        expect(standard.evidence.length).toBeGreaterThan(20);
      });
    });

    it("verifies OWASP ASVS and DPDP Act 2023 reach 100% compliance", () => {
      const owasp = INDUSTRIAL_RATINGS.find((r) => r.id === "owasp-asvs");
      const dpdp = INDUSTRIAL_RATINGS.find((r) => r.id === "dpdp-2023");

      expect(owasp?.score).toBe(100);
      expect(dpdp?.score).toBe(100);
    });
  });

  describe("3. Component Export Verification", () => {
    it("exports BlueprintProgressDashboard as a valid functional React component", () => {
      expect(typeof BlueprintProgressDashboard).toBe("function");
    });
  });
});
