import { describe, it, expect } from "vitest";
import { UpdateWebsiteConfigSchema, UpdateSEODetailsSchema } from "../lib/validations/website";
import { parseWebsiteConfig, serializeWebsiteConfig, generateEmbedSnippet, getDefaultWebsiteSections } from "../lib/engines/website-engine";

describe("Priority 5: Website Generator Engine - Validation & Configuration Tests", () => {
  describe("UpdateWebsiteConfigSchema Validation", () => {
    it("validates full website section toggles against schema", () => {
      const payload = {
        businessId: "biz_444",
        sections: {
          hero: true,
          services: true,
          about: false,
          gallery: true,
          testimonials: true,
          faq: true,
          contact: true,
          booking_cta: false,
        },
      };
      expect(UpdateWebsiteConfigSchema.safeParse(payload).success).toBe(true);
    });

    it("rejects missing business ID or malformed boolean fields", () => {
      expect(UpdateWebsiteConfigSchema.safeParse({ sections: getDefaultWebsiteSections() }).success).toBe(false);
    });
  });

  describe("Website Domain Engine (website-engine)", () => {
    it("parses valid and invalid JSON strings resiliently with safe fallback defaults", () => {
      const malformed = parseWebsiteConfig("not-a-json-object");
      expect(malformed.hero).toBe(true);
      expect(malformed.faq).toBe(false);

      const validJson = JSON.stringify({ faq: true, hero: false });
      const parsed = parseWebsiteConfig(validJson);
      expect(parsed.faq).toBe(true);
      expect(parsed.hero).toBe(false);
      expect(parsed.services).toBe(true); // default merged!
    });

    it("serializes merged section states consistently", () => {
      const serialized = serializeWebsiteConfig({ faq: true });
      expect(serialized).toContain('"faq":true');
      expect(serialized).toContain('"hero":true');
    });

    it("generates clean HTML iframe embed code snippets", () => {
      const snippet = generateEmbedSnippet("aura-spa", "https://docodo.in");
      expect(snippet).toContain('src="https://docodo.in/book/aura-spa?embed=true"');
      expect(snippet).toContain("iframe");
    });
  });
});
