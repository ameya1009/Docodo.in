/**
 * Concurrency & Transaction Resilience Utilities
 * 
 * Provides database serialization failure detection (Postgres 40001, 40P01, Prisma P2034)
 * and exponential backoff retry loops with randomized jitter to withstand 1,000 concurrent real users.
 */

export function isSerializationConflict(err: any): boolean {
  if (!err) return false;
  const code = String(err.code || "");
  const msg = typeof err === "string" ? err : String(err.message || err.stack || "");
  return (
    code === "P2034" ||
    code === "40001" ||
    code === "40P01" ||
    msg.includes("P2034") ||
    msg.includes("40001") ||
    msg.includes("40P01") ||
    msg.includes("could not serialize access") ||
    msg.includes("write conflict") ||
    msg.includes("deadlock detected")
  );
}

/**
 * Executes a function within an exponential backoff retry loop with randomized jitter
 * specifically catching serialization failures (P2034 / 40001 / 40P01) under high concurrency.
 */
export async function runWithSerializationRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 4
): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err: any) {
      attempt++;
      if (attempt > maxRetries || !isSerializationConflict(err)) {
        throw err;
      }
      // Exponential backoff + randomized jitter between 25ms and 150ms
      const baseDelay = Math.min(200, 25 * Math.pow(2, attempt - 1));
      const jitter = Math.floor(Math.random() * 126) + 25; // 25ms to 150ms
      const delay = baseDelay + jitter;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}
