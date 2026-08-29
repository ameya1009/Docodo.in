import { describe, it, expect } from "vitest";
import { generateAIResponse, getAvailableAIProviders, BusinessContext } from "../lib/engines/ai-engine";

describe("AI Round-Robin & Fallback Assistant Engine Tests", () => {
  const mockContext: BusinessContext = {
    businessName: "Aura Luxury Spa & Clinic",
    industry: "Wellness & Aesthetics",
    address: "Bandra West, Mumbai",
    city: "Mumbai",
    bookingSlug: "aura-luxury-spa",
    services: [
      { name: "Swedish Full Body Massage", price: 1499, duration: 60, description: "Relaxing deep tissue therapy" },
      { name: "Hydra Glow Facial", price: 1999, duration: 45, description: "Skin rejuvenating treatment" },
    ],
    workingHours: [
      { day: "MON", openTime: "09:00", closeTime: "20:00", isOpen: true },
      { day: "TUE", openTime: "09:00", closeTime: "20:00", isOpen: true },
      { day: "WED", openTime: "09:00", closeTime: "20:00", isOpen: true },
      { day: "THU", openTime: "09:00", closeTime: "20:00", isOpen: true },
      { day: "FRI", openTime: "09:00", closeTime: "20:00", isOpen: true },
      { day: "SAT", openTime: "09:00", closeTime: "21:00", isOpen: true },
      { day: "SUN", openTime: "10:00", closeTime: "18:00", isOpen: true },
    ],
    knowledgeBase: [
      { question: "Do you accept Google Pay or Card?", answer: "Yes, we accept all UPI apps and credit cards.", category: "PRICING" },
    ],
  };

  it("extracts configured providers or handles empty environment gracefully", () => {
    const providers = getAvailableAIProviders();
    expect(Array.isArray(providers)).toBe(true);
  });

  it("answers pricing inquiries using heuristic fallback when no LLM keys exist", async () => {
    const res = await generateAIResponse("What is the cost or fee for facial?", mockContext);
    expect(res.text).toContain("Hydra Glow Facial");
    expect(res.text).toContain("1999");
    expect(res.text).toContain("https://www.docodo.in/book/aura-luxury-spa");
  });

  it("answers timing/opening hours inquiries accurately", async () => {
    const res = await generateAIResponse("Kab open rehta hai? Timings kya hai?", mockContext);
    expect(res.text).toContain("09:00");
    expect(res.text).toContain("https://www.docodo.in/book/aura-luxury-spa");
  });

  it("answers location inquiries with registered address", async () => {
    const res = await generateAIResponse("Where is your clinic located?", mockContext);
    expect(res.text).toContain("Bandra West, Mumbai");
  });

  it("triggers human hand-off assurance when patient asks for doctor or staff", async () => {
    const res = await generateAIResponse("I need to speak to doctor / receptionist urgently", mockContext);
    expect(res.text.toLowerCase()).toContain("staff");
  });
});
