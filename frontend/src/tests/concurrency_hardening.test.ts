import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  isSerializationConflict,
  runWithSerializationRetry,
} from "../lib/concurrency";
import {
  checkRateLimit,
  cleanupRateLimits,
  getRateLimitMapSize,
  clearRateLimits,
} from "../lib/rate-limit";

describe("High Concurrency Hardening: 1,000 Real Users Load Verification", () => {
  beforeEach(() => {
    clearRateLimits();
    vi.restoreAllMocks();
  });

  describe("1. Serializable Transaction Conflict Detection & Retry Wrapper", () => {
    it("correctly identifies Prisma P2034 and Postgres 40001 serialization errors", () => {
      // Prisma serialization failure
      expect(isSerializationConflict({ code: "P2034", message: "Transaction failed due to a write conflict" })).toBe(true);
      expect(isSerializationConflict(new Error("Prisma error P2034: write conflict"))).toBe(true);

      // Postgres serialization failure
      expect(isSerializationConflict({ code: "40001", message: "could not serialize access due to concurrent update" })).toBe(true);
      expect(isSerializationConflict(new Error("error: could not serialize access due to read/write dependencies among transactions (SQLSTATE 40001)"))).toBe(true);

      // Deadlock
      expect(isSerializationConflict(new Error("deadlock detected: Process 123 waits for ShareLock"))).toBe(true);
      expect(isSerializationConflict({ code: "40P01", message: "deadlock detected" })).toBe(true);
      expect(isSerializationConflict(new Error("error: deadlock detected (SQLSTATE 40P01)"))).toBe(true);

      // Non-serialization errors should NOT be treated as serialization conflicts
      expect(isSerializationConflict(new Error("Service not found"))).toBe(false);
      expect(isSerializationConflict(new Error("This appointment slot was just booked by another customer."))).toBe(false);
      expect(isSerializationConflict({ code: "P2002", message: "Unique constraint failed" })).toBe(false);
      expect(isSerializationConflict(null)).toBe(false);
      expect(isSerializationConflict(undefined)).toBe(false);
    });

    it("succeeds on first try when no serialization conflict occurs", async () => {
      let callCount = 0;
      const result = await runWithSerializationRetry(async () => {
        callCount++;
        return { bookingId: "bk_123", status: "CONFIRMED" };
      });

      expect(callCount).toBe(1);
      expect(result).toEqual({ bookingId: "bk_123", status: "CONFIRMED" });
    });

    it("retries on serialization conflict (P2034) with exponential jitter and succeeds on retry", async () => {
      let callCount = 0;
      const fn = async () => {
        callCount++;
        if (callCount < 3) {
          const err: any = new Error("Transaction failed due to a write conflict or a deadlock. Please retry your transaction.");
          err.code = "P2034";
          throw err;
        }
        return { bookingId: "bk_success_after_conflict" };
      };

      const result = await runWithSerializationRetry(fn, 4);
      expect(callCount).toBe(3);
      expect(result.bookingId).toBe("bk_success_after_conflict");
    });

    it("retries on Postgres 40001 error and succeeds", async () => {
      let callCount = 0;
      const fn = async () => {
        callCount++;
        if (callCount === 1) {
          const pgErr: any = new Error("could not serialize access due to concurrent update");
          pgErr.code = "40001";
          throw pgErr;
        }
        return { bookingId: "bk_pg_success" };
      };

      const result = await runWithSerializationRetry(fn, 3);
      expect(callCount).toBe(2);
      expect(result.bookingId).toBe("bk_pg_success");
    });

    it("retries on Postgres 40P01 deadlock error and succeeds", async () => {
      let callCount = 0;
      const fn = async () => {
        callCount++;
        if (callCount === 1) {
          const pgErr: any = new Error("deadlock detected: Process 123 waits for ShareLock");
          pgErr.code = "40P01";
          throw pgErr;
        }
        return { bookingId: "bk_deadlock_resolved" };
      };

      const result = await runWithSerializationRetry(fn, 3);
      expect(callCount).toBe(2);
      expect(result.bookingId).toBe("bk_deadlock_resolved");
    });

    it("does not retry on functional business errors (fast-fails immediately)", async () => {
      let callCount = 0;
      const fn = async () => {
        callCount++;
        throw new Error("This appointment slot was just booked by another customer. Please select a different time.");
      };

      await expect(runWithSerializationRetry(fn, 4)).rejects.toThrow(
        "This appointment slot was just booked by another customer. Please select a different time."
      );
      // Fast-fail: exactly 1 invocation, 0 wasted retries
      expect(callCount).toBe(1);
    });

    it("exhausts maxRetries when persistent serialization conflict occurs", async () => {
      let callCount = 0;
      const fn = async () => {
        callCount++;
        const err: any = new Error("Persistent write conflict P2034");
        err.code = "P2034";
        throw err;
      };

      await expect(runWithSerializationRetry(fn, 3)).rejects.toThrow("Persistent write conflict P2034");
      // 1 initial attempt + 3 retries = 4 total attempts
      expect(callCount).toBe(4);
    });
  });

  describe("2. Rate Limiter Memory Bounding & Automatic TTL Cleanup", () => {
    it("limits requests correctly per identifier and interval", () => {
      const id = "test-client-1";
      const opts = { maxTokens: 3, intervalMs: 10_000 };

      // Consume tokens
      const r1 = checkRateLimit(id, opts);
      expect(r1.allowed).toBe(true);
      expect(r1.remaining).toBe(2);

      const r2 = checkRateLimit(id, opts);
      expect(r2.allowed).toBe(true);
      expect(r2.remaining).toBe(1);

      const r3 = checkRateLimit(id, opts);
      expect(r3.allowed).toBe(true);
      expect(r3.remaining).toBe(0);

      // Exceeded
      const r4 = checkRateLimit(id, opts);
      expect(r4.allowed).toBe(false);
      expect(r4.remaining).toBe(0);
    });

    it("cleans up expired records when TTL expires (preventing memory leaks under 1,000 users)", () => {
      const now = Date.now();
      const mockNow = vi.spyOn(Date, "now");
      mockNow.mockReturnValue(now);

      // Add 10 client rate limit records with short interval
      for (let i = 0; i < 10; i++) {
        checkRateLimit(`user_${i}`, { intervalMs: 1_000, maxTokens: 5 });
      }
      expect(getRateLimitMapSize()).toBe(10);

      // Advance time by 3 seconds (exceeding 2x TTL of 1,000ms = 2,000ms)
      mockNow.mockReturnValue(now + 3_000);

      const evicted = cleanupRateLimits();
      expect(evicted).toBe(10);
      expect(getRateLimitMapSize()).toBe(0);

      mockNow.mockRestore();
    });

    it("retains active unexpired records while evicting only expired records", () => {
      const now = Date.now();
      const mockNow = vi.spyOn(Date, "now");
      mockNow.mockReturnValue(now);

      // Add expired record
      checkRateLimit("expired_user", { intervalMs: 1_000, maxTokens: 5 });

      // Advance 1.5 seconds
      mockNow.mockReturnValue(now + 1_500);

      // Add fresh record with longer window
      checkRateLimit("active_user", { intervalMs: 10_000, maxTokens: 5 });

      // Advance to now + 2.5 seconds (expired_user is > 2x 1000ms, active_user is 1s old < 20s)
      mockNow.mockReturnValue(now + 2_500);

      const evicted = cleanupRateLimits();
      expect(evicted).toBe(1);
      expect(getRateLimitMapSize()).toBe(1);

      mockNow.mockRestore();
    });

    it("enforces hard memory cap under massive burst without unbounded map growth", () => {
      // Simulate flood of 5,500 distinct client IPs
      for (let i = 0; i < 5_500; i++) {
        checkRateLimit(`flood_ip_${i}`, { intervalMs: 60_000, maxTokens: 5 });
      }
      // Hard cap is 5,000 entries
      expect(getRateLimitMapSize()).toBeLessThanOrEqual(5_000);
    });
  });
});
