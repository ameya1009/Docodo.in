import { describe, it, expect } from "vitest";
import {
  BusinessInfoSchema,
  BusinessStyleSchema,
  BusinessThemeSchema,
  LaunchEngineStepSchema,
} from "../lib/validations/onboarding";
import {
  getDefaultServices,
  generateSEOMetadata,
  getFallbackAIContent,
} from "../lib/engines/business-launch";

describe("Priority 1: Business Launch Engine - Validation & Business Logic Tests", () => {
  describe("BusinessInfoSchema Validation", () => {
    it("accepts valid Indian merchant profile inputs", () => {
      const input = {
        name: "Aura Wellness Salon",
        industry: "salon",
        phone: "9876543210",
        email: "contact@aurasalon.in",
        city: "Mumbai",
      };
      const result = BusinessInfoSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it("rejects short phone numbers under 10 digits", () => {
      const input = {
        name: "Aura Wellness",
        industry: "salon",
        phone: "123",
      };
      const result = BusinessInfoSchema.safeParse(input);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("10-digit");
      }
    });

    it("rejects invalid email formats", () => {
      const input = {
        name: "Aura Wellness",
        industry: "salon",
        phone: "9876543210",
        email: "not-an-email",
      };
      const result = BusinessInfoSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe("BusinessStyleSchema Validation", () => {
    it("validates permitted theme styling tokens", () => {
      expect(BusinessStyleSchema.safeParse({ businessId: "biz_123", style: "luxury" }).success).toBe(true);
      expect(BusinessStyleSchema.safeParse({ businessId: "biz_123", style: "invalid-style" }).success).toBe(false);
    });
  });

  describe("BusinessThemeSchema Validation", () => {
    it("enforces strict hex color formatting for design system tokens", () => {
      const validTheme = {
        businessId: "biz_123",
        primaryColor: "#C8F135",
        accentColor: "#00FFAA",
        fontHeading: "Unbounded",
        fontBody: "DM Sans",
        darkMode: true,
      };
      expect(BusinessThemeSchema.safeParse(validTheme).success).toBe(true);

      const invalidColorTheme = { ...validTheme, primaryColor: "neon-green" };
      expect(BusinessThemeSchema.safeParse(invalidColorTheme).success).toBe(false);
    });
  });

  describe("Business Launch Engine Domain Logic", () => {
    it("generates proper salon service offerings with durations and prices", () => {
      const salonServices = getDefaultServices("salon");
      expect(salonServices.length).toBeGreaterThan(0);
      expect(salonServices[0].name).toBe("Haircut & Style");
      expect(salonServices[0].duration).toBe(45);
      expect(salonServices[0].price).toBe(400);
    });

    it("returns general professional fallback services for custom industries", () => {
      const customServices = getDefaultServices("pet grooming");
      expect(customServices.length).toBe(2);
      expect(customServices[0].name).toBe("Professional Consultation");
      expect(customServices[0].price).toBe(500);
    });

    it("builds production SEO metadata strings cleanly from merchant profiles", () => {
      const seo = generateSEOMetadata("Vogue Spa", "spa", "Bangalore");
      expect(seo.seoTitle).toBe("Vogue Spa | Top Rated spa");
      expect(seo.seoDesc).toContain("Bangalore");
      expect(seo.seoDesc).toContain("WhatsApp confirmation");
    });

    it("produces localized AI content copy without mock placeholders", () => {
      const content = getFallbackAIContent("Dental Care", "dentist", "Delhi", "Connaught Place");
      expect(content.description).toContain("Delhi");
      expect(content.instagramPost).toContain("#delhi");
      expect(content.seoMeta).toBe("Best dentist in Delhi | Dental Care");
    });
  });
});
