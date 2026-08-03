import { describe, it, expect } from "vitest";
import { CreateCustomerSchema, UpdateCustomerTagsSchema } from "../lib/validations/crm";
import { parseTags, serializeTags, calculateCustomerTier, syncCustomerTagsWithTier } from "../lib/engines/crm-engine";

describe("Priority 4: CRM Engine - Validation & Segmentation Tests", () => {
  describe("CreateCustomerSchema Validation", () => {
    it("validates lead profile creation payloads accurately", () => {
      const payload = {
        businessId: "biz_777",
        name: "Anjali Gupta",
        phone: "9876543210",
        email: "anjali@corp.in",
        source: "WHATSAPP" as const,
      };
      expect(CreateCustomerSchema.safeParse(payload).success).toBe(true);
    });

    it("rejects incomplete phone numbers and malformed source types", () => {
      const invalid = {
        businessId: "biz_777",
        name: "Anjali",
        phone: "1234",
      };
      expect(CreateCustomerSchema.safeParse(invalid).success).toBe(false);
    });
  });

  describe("CRM Domain Engine (crm-engine)", () => {
    it("parses and serializes JSON array tag strings cleanly without duplicates", () => {
      const tags = parseTags('["VIP", "Loyal", "VIP", "WhatsApp Lead"]');
      expect(tags).toContain("VIP");
      expect(tags).toContain("WhatsApp Lead");

      const serialized = serializeTags(["VIP ", "Loyal", " VIP", ""]);
      expect(serialized).toBe('["VIP","Loyal"]');
    });

    it("calculates customer value tiers dynamically from visits and expenditure", () => {
      expect(calculateCustomerTier(1, 400)).toBe("New Lead");
      expect(calculateCustomerTier(3, 1200)).toBe("Regular");
      expect(calculateCustomerTier(6, 4500)).toBe("Loyal");
      expect(calculateCustomerTier(2, 15000)).toBe("VIP"); // VIP by spend
      expect(calculateCustomerTier(12, 2000)).toBe("VIP"); // VIP by visits
    });

    it("automatically synchronizes lead tags with real time value tiers", () => {
      const original = ["New Lead", "WhatsApp Lead", "Discount Eligible"];
      // Customer has now spent 12,000 INR -> should become VIP, and 'New Lead' should be removed!
      const updated = syncCustomerTagsWithTier(original, 4, 12000);
      expect(updated).toContain("VIP");
      expect(updated).not.toContain("New Lead");
      expect(updated).toContain("WhatsApp Lead");
    });
  });
});
