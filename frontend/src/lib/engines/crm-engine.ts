export function parseTags(tagsJson: string | null | undefined): string[] {
  if (!tagsJson) return [];
  try {
    const parsed = JSON.parse(tagsJson);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item));
    }
    return [];
  } catch {
    return [tagsJson];
  }
}

export function serializeTags(tags: string[]): string {
  // Remove duplicates and clean whitespace
  const unique = Array.from(new Set(tags.map((t) => t.trim()).filter((t) => t.length > 0)));
  return JSON.stringify(unique);
}

export type CustomerTier = "New Lead" | "Regular" | "Loyal" | "VIP";

export function calculateCustomerTier(visitCount: number, lifetimeValue: number): CustomerTier {
  if (visitCount >= 10 || lifetimeValue >= 10000) return "VIP";
  if (visitCount >= 5 || lifetimeValue >= 5000) return "Loyal";
  if (visitCount >= 2 || lifetimeValue >= 1000) return "Regular";
  return "New Lead";
}

export function syncCustomerTagsWithTier(
  existingTags: string[],
  visitCount: number,
  lifetimeValue: number
): string[] {
  const tier = calculateCustomerTier(visitCount, lifetimeValue);
  const tiers: CustomerTier[] = ["New Lead", "Regular", "Loyal", "VIP"];

  // Remove any conflicting automated tier tags
  const filtered = existingTags.filter((t) => !tiers.includes(t as CustomerTier));
  
  // Append calculated tier
  filtered.push(tier);

  return Array.from(new Set(filtered));
}
