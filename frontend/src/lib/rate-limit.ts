/**
 * In-Memory & Redis-Compatible Token Bucket Rate Limiter
 * Protects public booking, enquiry, and authentication endpoints against bot attacks and DDoS.
 * Includes automatic TTL cleanup to prevent unbounded memory growth under high concurrency.
 */

interface RateLimitRecord {
  tokens: number;
  lastRefill: number;
  intervalMs: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();
let lastCleanupTime = Date.now();
export const CLEANUP_INTERVAL_MS = 60_000;
export const MAX_ENTRIES_BEFORE_SWEEP = 2_000;
export const SWEEP_COOLDOWN_MS = 10_000;
export const HARD_CAP_MAX_ENTRIES = 5_000;

export interface RateLimitOptions {
  intervalMs?: number; // Time window in ms (default: 60,000ms = 1 min)
  maxTokens?: number;  // Max requests per window (default: 15)
}

/**
 * Purges expired rate limit records from memory.
 * A record is considered expired if elapsed time exceeds 2x intervalMs.
 * Returns the number of evicted records.
 */
export function cleanupRateLimits(maxAgeMultiplier: number = 2): number {
  const now = Date.now();
  let evicted = 0;
  for (const [key, record] of rateLimitMap.entries()) {
    const ttl = (record.intervalMs || 60_000) * maxAgeMultiplier;
    if (now - record.lastRefill > ttl) {
      rateLimitMap.delete(key);
      evicted++;
    }
  }
  lastCleanupTime = now;
  return evicted;
}

/**
 * Returns the current number of tracked rate limit records (for metrics & tests).
 */
export function getRateLimitMapSize(): number {
  return rateLimitMap.size;
}

/**
 * Clears all rate limit records (useful for test resets).
 */
export function clearRateLimits(): void {
  rateLimitMap.clear();
  lastCleanupTime = Date.now();
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): { allowed: boolean; remaining: number; resetInMs: number } {
  const intervalMs = options.intervalMs ?? 60_000;
  const maxTokens = options.maxTokens ?? 15;
  const now = Date.now();

  // Automatic TTL sweep with debounce cooldown to prevent event-loop freezing under high concurrency bursts
  const timeSinceLastCleanup = now - lastCleanupTime;
  if (
    timeSinceLastCleanup > CLEANUP_INTERVAL_MS ||
    (rateLimitMap.size > MAX_ENTRIES_BEFORE_SWEEP && timeSinceLastCleanup > SWEEP_COOLDOWN_MS)
  ) {
    cleanupRateLimits();
  }

  // Hard cap safeguard: under DDoS / massive bot floods, evict oldest entries in O(1)
  if (rateLimitMap.size >= HARD_CAP_MAX_ENTRIES && !rateLimitMap.has(identifier)) {
    const oldestKey = rateLimitMap.keys().next().value;
    if (oldestKey !== undefined) {
      rateLimitMap.delete(oldestKey);
    }
  }

  let record = rateLimitMap.get(identifier);

  if (!record) {
    record = { tokens: maxTokens - 1, lastRefill: now, intervalMs };
    rateLimitMap.set(identifier, record);
    return { allowed: true, remaining: maxTokens - 1, resetInMs: intervalMs };
  }

  // Refill tokens based on elapsed time
  const elapsed = now - record.lastRefill;
  if (elapsed > intervalMs) {
    record.tokens = maxTokens;
    record.lastRefill = now;
    record.intervalMs = intervalMs;
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
