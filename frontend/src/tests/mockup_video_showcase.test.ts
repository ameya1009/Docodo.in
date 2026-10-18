import { describe, it, expect } from "vitest";
import React from "react";
import MockupVideoShowcaseDefault, {
  MockupVideoShowcase,
  WORKFLOW_STEPS,
  TOTAL_DURATION
} from "../components/sections/MockupVideoShowcase";
import HeroInteractiveShowcaseDefault, {
  HeroInteractiveShowcase
} from "../components/sections/HeroInteractiveShowcase";
import { HeroScene } from "../components/3d/HeroScene";
import {
  KineticQuantumCore,
  ClinicalHelixCore,
  MedicalBeaconCross,
  ConstellationField,
  GridPlane
} from "../components/3d/SceneElements";

describe("Mockup Video Showcase & 3D Decommissioning Tests", () => {
  describe("1. Component Architecture & Backward Compatibility", () => {
    it("exports MockupVideoShowcase as a valid React component and default export", () => {
      expect(typeof MockupVideoShowcase).toBe("function");
      expect(typeof MockupVideoShowcaseDefault).toBe("function");
      expect(MockupVideoShowcase).toBe(MockupVideoShowcaseDefault);
    });

    it("exports HeroInteractiveShowcase as an alias wrapper for backward compatibility", () => {
      expect(typeof HeroInteractiveShowcase).toBe("function");
      expect(typeof HeroInteractiveShowcaseDefault).toBe("function");
      expect(HeroInteractiveShowcase).toBe(HeroInteractiveShowcaseDefault);
    });
  });

  describe("2. Clean 3D / WebGL Decommissioning", () => {
    it("verifies HeroScene returns null to prevent WebGL context initialization", () => {
      const result = HeroScene({});
      expect(result).toBeNull();
    });

    it("verifies all legacy 3D scene elements return null with zero Three.js canvas overhead", () => {
      expect(KineticQuantumCore()).toBeNull();
      expect(ClinicalHelixCore()).toBeNull();
      expect(MedicalBeaconCross()).toBeNull();
      expect(ConstellationField()).toBeNull();
      expect(GridPlane()).toBeNull();
    });
  });

  describe("3. Static Verification of Zero WebGL & Three.js Imports in Hero Section", () => {
    it("ensures 02-Hero does not import Three.js, Canvas, or WebGL", async () => {
      const fs = await import("fs");
      const path = await import("path");
      const heroFilePath = path.resolve(__dirname, "../components/sections/02-Hero.tsx");
      const heroCode = fs.readFileSync(heroFilePath, "utf8");

      expect(heroCode).not.toContain("@react-three");
      expect(heroCode).not.toContain("from \"three\"");
      expect(heroCode).not.toContain("HeroScene");
      expect(heroCode).toContain("MockupVideoShowcase");
    });

    it("ensures MockupVideoShowcase does not import Three.js, Fiber, or WebGL", async () => {
      const fs = await import("fs");
      const path = await import("path");
      const showcaseFilePath = path.resolve(__dirname, "../components/sections/MockupVideoShowcase.tsx");
      const showcaseCode = fs.readFileSync(showcaseFilePath, "utf8");

      expect(showcaseCode).not.toContain("@react-three");
      expect(showcaseCode).not.toContain("from \"three\"");
      expect(showcaseCode).not.toContain("WebGL");
      expect(showcaseCode).toContain("WORKFLOW_STEPS");
    });
  });

  describe("4. Clinical SaaS Workflow Specifications", () => {
    it("verifies the 4 critical clinic demonstration steps are modeled in WORKFLOW_STEPS", () => {
      expect(WORKFLOW_STEPS).toBeDefined();
      expect(WORKFLOW_STEPS.length).toBe(4);

      expect(WORKFLOW_STEPS[0].title).toBe("1. 15-Min Onboarding");
      expect(WORKFLOW_STEPS[0].id).toBe("onboarding");

      expect(WORKFLOW_STEPS[1].title).toBe("2. Patient Calendar");
      expect(WORKFLOW_STEPS[1].id).toBe("calendar");

      expect(WORKFLOW_STEPS[2].title).toBe("3. UPI & WhatsApp Confirmation");
      expect(WORKFLOW_STEPS[2].id).toBe("whatsapp");

      expect(WORKFLOW_STEPS[3].title).toBe("4. Clinic Revenue Analytics");
      expect(WORKFLOW_STEPS[3].id).toBe("revenue");
    });

    it("calculates accurate total duration across all workflow steps", () => {
      const calculatedDuration = WORKFLOW_STEPS.reduce((acc, step) => acc + step.duration, 0);
      expect(TOTAL_DURATION).toBe(calculatedDuration);
      expect(TOTAL_DURATION).toBeGreaterThan(0);
    });

    it("contains DPDP Act and doctor practice references", () => {
      const allTaglines = WORKFLOW_STEPS.map((s) => s.tagline).join(" ");
      expect(allTaglines).toContain("MCI Registration");
      expect(allTaglines).toContain("Zero Double-Bookings");
      expect(allTaglines).toContain("DPDP Encryption");
      expect(allTaglines).toContain("Zero Aggregator Commission");
    });
  });
});

