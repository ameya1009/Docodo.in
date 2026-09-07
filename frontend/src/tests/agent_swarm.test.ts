import { describe, it, expect, vi } from "vitest";
import {
  runAutonomousGrowthAgent,
  AGENT_REGISTRY,
} from "../lib/engines/autonomous-agent-swarm";

// Mock AI response for fast and deterministic unit testing
vi.mock("../lib/engines/ai-engine", () => ({
  generateAIResponse: vi.fn(async (prompt: string) => ({
    text: `Mocked AI Generation for prompt: ${prompt.slice(0, 50)}...`,
    providerUsed: "GROQ" as const,
  })),
}));

describe("Autonomous Agent Growth Swarm Suite", () => {
  it("has registry definitions for Reddit, Quora, Medium, Social Media, and Google Maps", () => {
    expect(AGENT_REGISTRY.REDDIT).toBeDefined();
    expect(AGENT_REGISTRY.QUORA).toBeDefined();
    expect(AGENT_REGISTRY.MEDIUM).toBeDefined();
    expect(AGENT_REGISTRY.GOOGLE_MAPS_TARGETER).toBeDefined();
    expect(AGENT_REGISTRY.WHATSAPP_DIAGNOSTICS).toBeDefined();
  });

  it("executes Reddit growth agent job and formats community target subreddits", async () => {
    const result = await runAutonomousGrowthAgent({
      channel: "REDDIT",
      industry: "Salons & Spas",
      targetCity: "Pune",
    });

    expect(result.channel).toBe("REDDIT");
    expect(result.status).toBe("READY_TO_DISPATCH");
    expect(result.targetPlatforms).toContain("r/smallbusiness");
    expect(result.targetPlatforms).toContain("r/pune");
    expect(result.metrics.estimatedReach).toBeDefined();
  });

  it("executes Quora problem-solving agent job with high-intent topics", async () => {
    const result = await runAutonomousGrowthAgent({
      channel: "QUORA",
      industry: "Dental Clinics",
    });

    expect(result.channel).toBe("QUORA");
    expect(result.status).toBe("READY_TO_DISPATCH");
    expect(result.targetPlatforms).toContain("Appointment Booking Systems");
    expect(result.title).toContain("Quora");
  });

  it("executes Medium thought-leadership publisher job", async () => {
    const result = await runAutonomousGrowthAgent({
      channel: "MEDIUM",
      industry: "SMB Booking OS",
    });

    expect(result.channel).toBe("MEDIUM");
    expect(result.targetPlatforms).toContain("Medium.com");
    expect(result.status).toBe("READY_TO_DISPATCH");
  });

  it("executes Google Maps Targeter lead extraction", async () => {
    const result = await runAutonomousGrowthAgent({
      channel: "GOOGLE_MAPS_TARGETER",
      targetCity: "Mumbai",
      industry: "Luxury Spas",
    });

    expect(result.channel).toBe("GOOGLE_MAPS_TARGETER");
    expect(result.title).toContain("Mumbai");
    expect(result.targetPlatforms).toContain("Google Maps Local Business Listings");
  });

  it("runs live WhatsApp diagnostics without throwing errors", async () => {
    const result = await runAutonomousGrowthAgent({
      channel: "WHATSAPP_DIAGNOSTICS",
    });

    expect(result.channel).toBe("WHATSAPP_DIAGNOSTICS");
    expect(result.status).toBe("DIAGNOSED_ONLINE");
    expect(result.actionableContent).toContain("+919284310604");
    expect(result.actionableContent).toContain("/api/webhooks/whatsapp");
  });
});
