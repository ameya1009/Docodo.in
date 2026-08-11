import { describe, it, expect } from "vitest";
import { BusinessDiscoverySchema, ConfirmDiscoveredProfileSchema } from "../lib/validations/discovery";
import {
  synthesizeBusinessProfile,
  calculateActivationScore,
  calculateTimeToFirstBooking,
  recordInstrumentationEvent,
} from "../lib/engines/discovery-engine";

describe("Business Discovery Engine & PMF Telemetry Suite", () => {
  describe("1. Validation Schema Rigor", () => {
    it("successfully validates standard 3-field discovery input", () => {
      const result = BusinessDiscoverySchema.safeParse({
        name: "Aura Luxury Hair Studio",
        city: "Mumbai",
        businessType: "Salon",
      });
      expect(result.success).toBe(true);
    });

    it("rejects abbreviated or invalid business category types", () => {
      const result = BusinessDiscoverySchema.safeParse({
        name: "X",
        city: "Pune",
        businessType: "InvalidType",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThanOrEqual(1);
      }
    });
  });

  describe("2. AI & Zero-Config Profile Synthesis", () => {
    it("generates realistic Indian INR services and working hours for Salon category in < 5 minutes style", () => {
      const profile = synthesizeBusinessProfile({
        name: "Luxe Glow Salon",
        city: "Bengaluru",
        businessType: "Salon",
      });

      expect(profile.name).toBe("Luxe Glow Salon");
      expect(profile.city).toBe("Bengaluru");
      expect(profile.services.length).toBe(3);
      expect(profile.services[0].price).toBeGreaterThan(100);
      expect(profile.services[0].duration).toBeGreaterThan(0);
      expect(profile.seoTitle).toContain("Luxe Glow Salon");
      expect(profile.workingHours.length).toBe(7);
      
      // Assure Sunday is closed by default for work-life harmony
      const sunday = profile.workingHours.find((h) => h.day === "SUN");
      expect(sunday?.isOpen).toBe(false);
    });

    it("tailors specialized offerings for medical clinics and spas", () => {
      const clinic = synthesizeBusinessProfile({
        name: "Apex Wellness Clinic",
        city: "New Delhi",
        businessType: "Clinic",
      });
      expect(clinic.tagline).toContain("New Delhi");
      expect(clinic.services.some((s) => s.name.toLowerCase().includes("consultation"))).toBe(true);
    });
  });

  describe("3. PMF Outcome Funnel Metrics", () => {
    it("accurately scores activation percentage milestones", () => {
      expect(calculateActivationScore({ websiteLive: true })).toBe(20);
      expect(calculateActivationScore({ websiteLive: true, bookingActive: true })).toBe(40);
      expect(
        calculateActivationScore({
          websiteLive: true,
          bookingActive: true,
          linkShared: true,
          firstBooking: true,
          googleConnected: true,
          whatsappEnabled: true,
        })
      ).toBe(100);
    });

    it("computes precise Time To First Booking duration in seconds", () => {
      const start = "2026-08-05T10:00:00.000Z";
      const firstBooked = "2026-08-05T10:14:30.000Z"; // Exactly 14m 30s = 870 seconds
      
      const seconds = calculateTimeToFirstBooking(start, firstBooked);
      expect(seconds).toBe(870);
      expect(seconds!).toBeLessThan(900); // Proving under 15 minutes promise!
    });

    it("records structural telemetry events with valid ISO timestamps", () => {
      const event = recordInstrumentationEvent("discovery_triggered", { test: true });
      expect(event.event).toBe("discovery_triggered");
      expect(new Date(event.timestamp).getTime()).not.toBeNaN();
    });
  });
});
