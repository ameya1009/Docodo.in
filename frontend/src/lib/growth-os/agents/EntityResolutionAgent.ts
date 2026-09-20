import { DiscoveredRecord } from "../adapters/types";
import { CanonicalLead } from "./types";

export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeDomain(urlOrDomain?: string): string | undefined {
  if (!urlOrDomain) return undefined;
  let domain = urlOrDomain.toLowerCase().trim();
  domain = domain.replace(/^https?:\/\//, "");
  domain = domain.replace(/^www\./, "");
  domain = domain.split("/")[0].split("?")[0];
  return domain || undefined;
}

export function normalizePhone(rawPhone?: string): string | undefined {
  if (!rawPhone) return undefined;
  let digits = rawPhone.replace(/\D/g, "");
  // Strip leading 0 if 11 digits (e.g. 09822011223 -> 9822011223)
  if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  return digits.length >= 7 ? `+${digits}` : undefined;
}

const COMMON_STOPWORDS = new Set([
  "salon",
  "spa",
  "studio",
  "clinic",
  "lounge",
  "bar",
  "pvt",
  "ltd",
  "private",
  "limited",
  "llp",
  "inc",
  "co",
  "and",
  "the",
  "in",
  "pune",
  "mumbai",
]);

export function calculateStringSimilarity(s1: string, s2: string): number {
  const n1 = normalizeString(s1);
  const n2 = normalizeString(s2);
  if (n1 === n2) return 1.0;
  if (!n1 || !n2) return 0.0;

  // Jaccard token similarity
  const tokens1 = n1.split(" ").filter(Boolean);
  const tokens2 = n2.split(" ").filter(Boolean);
  const t1 = new Set(tokens1);
  const t2 = new Set(tokens2);

  const intersection = new Set([...t1].filter((x) => t2.has(x)));
  const union = new Set([...t1, ...t2]);
  const jaccard = union.size > 0 ? intersection.size / union.size : 0;

  // Significant token overlap (excluding generic stopwords)
  const sigTokens1 = tokens1.filter((t) => !COMMON_STOPWORDS.has(t) && t.length > 2);
  const sigTokens2 = tokens2.filter((t) => !COMMON_STOPWORDS.has(t) && t.length > 2);

  if (sigTokens1.length > 0 && sigTokens2.length > 0) {
    const sigIntersection = sigTokens1.filter((t) => sigTokens2.includes(t));
    const sigOverlapRatio = (sigIntersection.length * 2) / (sigTokens1.length + sigTokens2.length);

    if (sigOverlapRatio >= 0.8 && sigIntersection.length >= 1) {
      return Math.max(jaccard, 0.85);
    }
  }

  // Exact substring check only if the shorter string is long enough and shares significant length
  const shorter = n1.length <= n2.length ? n1 : n2;
  const longer = n1.length > n2.length ? n1 : n2;

  if (shorter.length >= 6 && longer.includes(shorter)) {
    const lengthRatio = shorter.length / longer.length;
    if (lengthRatio >= 0.6) {
      return Math.max(jaccard, 0.82);
    }
  }

  return jaccard;
}

export interface MatchScoreResult {
  confidence: number;
  matchReasons: string[];
}

export function evaluateEntityMatch(
  lead: CanonicalLead,
  record: DiscoveredRecord
): MatchScoreResult {
  const reasons: string[] = [];
  let score = 0;

  // 1. Exact domain match
  const recDomain = normalizeDomain(record.websiteUrl || record.normalizedDomain);
  if (recDomain && lead.normalizedDomain && recDomain === lead.normalizedDomain) {
    score += 0.95;
    reasons.push(`Exact domain match: ${recDomain}`);
  }

  // 2. Exact phone match
  const recPhone = normalizePhone(record.phone || record.normalizedPhone);
  if (recPhone && lead.normalizedPhone && recPhone === lead.normalizedPhone) {
    score += 0.92;
    reasons.push(`Exact phone match: ${recPhone}`);
  }

  // 3. Name Similarity
  const nameSim = calculateStringSimilarity(lead.canonicalName, record.rawName);
  if (nameSim >= 0.8) {
    score += nameSim * 0.7;
    reasons.push(`High name similarity (${Math.round(nameSim * 100)}%): "${lead.canonicalName}" ~ "${record.rawName}"`);
  } else if (nameSim >= 0.5) {
    score += nameSim * 0.4;
    reasons.push(`Moderate name similarity (${Math.round(nameSim * 100)}%)`);
  }

  // 4. Locality match bonus
  if (record.city && lead.city && normalizeString(record.city) === normalizeString(lead.city)) {
    score += 0.15;
    reasons.push(`Matching city: ${record.city}`);
  }

  const confidence = Math.min(1.0, score);
  return { confidence, matchReasons: reasons };
}

export class EntityResolutionAgent {
  private autoMergeThreshold = 0.8;

  public static normalizePhone(rawPhone?: string): string | undefined {
    return normalizePhone(rawPhone);
  }

  public static normalizeDomain(urlOrDomain?: string): string | undefined {
    return normalizeDomain(urlOrDomain);
  }

  public static calculateSimilarity(
    e1: { name: string; domain?: string; phone?: string; city?: string },
    e2: { name: string; domain?: string; phone?: string; city?: string }
  ): number {
    if (e1.domain && e2.domain && e1.domain === e2.domain) return 0.95;
    if (e1.phone && e2.phone && e1.phone === e2.phone) return 0.92;
    return calculateStringSimilarity(e1.name, e2.name);
  }

  public resolveEntities(records: DiscoveredRecord[]): CanonicalLead[] {
    const canonicalLeads: CanonicalLead[] = [];

    for (const record of records) {
      let matchedLead: CanonicalLead | null = null;
      let highestConfidence = 0;

      for (const candidate of canonicalLeads) {
        const { confidence } = evaluateEntityMatch(candidate, record);
        if (confidence > highestConfidence && confidence >= this.autoMergeThreshold) {
          highestConfidence = confidence;
          matchedLead = candidate;
        }
      }

      if (matchedLead) {
        // Merge footprint into matched canonical lead
        matchedLead.identities.push(record);
        if (!matchedLead.normalizedDomain) {
          matchedLead.normalizedDomain = normalizeDomain(record.websiteUrl || record.normalizedDomain);
        }
        if (!matchedLead.normalizedPhone) {
          matchedLead.normalizedPhone = normalizePhone(record.phone || record.normalizedPhone);
        }
        if (!matchedLead.address && record.address) {
          matchedLead.address = record.address;
        }
        matchedLead.confidenceScore = Math.max(matchedLead.confidenceScore, highestConfidence);
        matchedLead.updatedAt = new Date().toISOString();
      } else {
        // Create new canonical lead
        const domain = normalizeDomain(record.websiteUrl || record.normalizedDomain);
        const phone = normalizePhone(record.phone || record.normalizedPhone);
        const newLead: CanonicalLead = {
          id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          canonicalName: record.rawName.replace(/^@/, "").replace(/^u\//, "").trim(),
          normalizedDomain: domain,
          normalizedPhone: phone,
          city: record.city || "Pune",
          state: record.state || "Maharashtra",
          country: record.country || "IN",
          address: record.address,
          category: record.category || "Local Business",
          icpScore: 50,
          crmStage: "discovered",
          confidenceScore: record.sourceConfidence || 0.9,
          primarySource: record.platform,
          identities: [record],
          opportunities: [],
          scoreBreakdown: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        canonicalLeads.push(newLead);
      }
    }

    return canonicalLeads;
  }
}

export const entityResolutionAgent = new EntityResolutionAgent();
