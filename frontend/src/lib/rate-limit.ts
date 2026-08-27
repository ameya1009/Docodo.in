/**
 * In-Memory & Redis-Compatible Token Bucket Rate Limiter
 * Protects public booking, enquiry, and authentication endpoints against bot attacks and DDoS.
 */

interface RateLimitRecord {
  tokens: number;
  lastRefill: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

export interface RateLimitOptions {
  intervalMs?: number; // Time window in ms (default: 60,000ms = 1 min)
  maxTokens?: number;  // Max requests per window (default: 10)
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): { allowed: boolean; remaining: number; resetInMs: number } {
  const intervalMs = options.intervalMs ?? 60_000;
  const maxTokens = options.maxTokens ?? 15;
  const now = Date.now();

  let record = rateLimitMap.get(identifier);

  if (!record) {
    record = { tokens: maxTokens - 1, lastRefill: now };
    rateLimitMap.set(identifier, record);
    return { allowed: true, remaining: maxTokens - 1, resetInMs: intervalMs };
  }

  // Refill tokens based on elapsed time
  const elapsed = now - record.lastRefill;
  if (elapsed > intervalMs) {
    record.tokens = maxTokens;
    record.lastRefill = now;
  }

  if (record.tokens > 0) {
    record.tokens -= 1;
    return {
      allowed: true,
      remaining: record.tokens,
      resetInMs: Math.max(0, intervalMs - elapsed),
    };
  }

  return {
    allowed: false,
    remaining: 0,
    resetInMs: Math.max(0, intervalMs - elapsed),
  };
}
