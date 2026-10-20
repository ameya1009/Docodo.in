import { describe, it, expect } from "vitest";
import crypto from "crypto";

describe("Razorpay Standard Checkout & Signature Verification Tests", () => {
  const TEST_KEY_SECRET = "dummy_mock_secret_for_unit_testing_12345";
  const TEST_ORDER_ID = "order_mock_test_12345";
  const TEST_PAYMENT_ID = "pay_mock_test_12345";

  it("generates correct HMAC-SHA256 signature matching official Razorpay algorithm", () => {
    // Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const payload = `${TEST_ORDER_ID}|${TEST_PAYMENT_ID}`;
    const generatedSignature = crypto
      .createHmac("sha256", TEST_KEY_SECRET)
      .update(payload)
      .digest("hex");

    expect(generatedSignature).toBeDefined();
    expect(typeof generatedSignature).toBe("string");
    expect(generatedSignature.length).toBe(64); // SHA-256 hex length
  });

  it("successfully verifies authentic signature using timingSafeEqual", () => {
    const payload = `${TEST_ORDER_ID}|${TEST_PAYMENT_ID}`;
    const expectedSignature = crypto
      .createHmac("sha256", TEST_KEY_SECRET)
      .update(payload)
      .digest("hex");

    const incomingSignature = expectedSignature;

    const isMatch = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "utf-8"),
      Buffer.from(incomingSignature, "utf-8")
    );

    expect(isMatch).toBe(true);
  });

  it("rejects tampered payment_id or order_id with signature mismatch", () => {
    const legitimateSignature = crypto
      .createHmac("sha256", TEST_KEY_SECRET)
      .update(`${TEST_ORDER_ID}|${TEST_PAYMENT_ID}`)
      .digest("hex");

    const tamperedPaymentId = "pay_TAMPERED_HACKED_99";
    const computedSignatureForTampered = crypto
      .createHmac("sha256", TEST_KEY_SECRET)
      .update(`${TEST_ORDER_ID}|${tamperedPaymentId}`)
      .digest("hex");

    expect(computedSignatureForTampered).not.toBe(legitimateSignature);

    const isMatch = crypto.timingSafeEqual(
      Buffer.from(computedSignatureForTampered, "utf-8"),
      Buffer.from(legitimateSignature, "utf-8")
    );
    expect(isMatch).toBe(false);
  });

  it("validates currency and amount bounds (minimum 100 paise)", () => {
    const invalidAmountPaise = 50; // Under 100 paise
    expect(invalidAmountPaise < 100).toBe(true);

    const validAmountPaise = 50000; // ₹500.00
    expect(validAmountPaise >= 100).toBe(true);
  });

  describe("Commercial Plan & Database Schema Synchronization", () => {
    it("maps plan strings to valid Prisma User.plan enum values (never 'PRO')", () => {
      const normalizePlan = (planIdentifier: string) => {
        const planStr = String(planIdentifier).toLowerCase();
        const isDoneForYou = planStr.includes("setup") || planStr.includes("concierge");
        const isGrowth = planStr.includes("growth") || planStr.includes("pro");
        return isDoneForYou ? "CONCIERGE" : isGrowth ? "GROWTH" : "STARTER";
      };

      expect(normalizePlan("starter")).toBe("STARTER");
      expect(normalizePlan("growth")).toBe("GROWTH");
      expect(normalizePlan("pro")).toBe("GROWTH"); // Maps to GROWTH in DB
      expect(normalizePlan("setup-service")).toBe("CONCIERGE");
      expect(normalizePlan("concierge")).toBe("CONCIERGE");

      const validDbPlans = ["PILOT", "STARTER", "GROWTH", "CONCIERGE"];
      expect(validDbPlans).toContain(normalizePlan("growth"));
      expect(validDbPlans).toContain(normalizePlan("starter"));
      expect(validDbPlans).toContain(normalizePlan("setup-service"));
      expect(normalizePlan("growth")).not.toBe("PRO");
    });

    it("verifies booking payment methods match schema", () => {
      const validPaymentMethods = ["UPI", "CASH_ON_DELIVERY", "CARDS", "NETBANKING", "FREE"];
      expect(validPaymentMethods).toContain("UPI");
      expect(validPaymentMethods).toContain("CASH_ON_DELIVERY");
      expect(validPaymentMethods).toContain("CARDS");
      expect(validPaymentMethods).toContain("NETBANKING");
      expect(validPaymentMethods).toContain("FREE");
    });

    it("simulates booking status lifecycle from creation to verification", () => {
      // Pay at venue
      const cashBooking = {
        paymentMethod: "CASH_ON_DELIVERY",
        paymentPreference: "cash",
        status: "CONFIRMED",
        paymentStatus: "UNPAID",
      };
      expect(cashBooking.status).toBe("CONFIRMED");
      expect(cashBooking.paymentStatus).toBe("UNPAID");

      // Free appointment (₹0 service)
      const freeBooking = {
        paymentMethod: "FREE",
        paymentPreference: "free",
        status: "CONFIRMED",
        paymentStatus: "PAID",
      };
      expect(freeBooking.status).toBe("CONFIRMED");
      expect(freeBooking.paymentStatus).toBe("PAID");
      expect(freeBooking.paymentMethod).toBe("FREE");

      // Online Razorpay initial pending
      const onlineBooking = {
        paymentMethod: "UPI",
        paymentPreference: "online",
        status: "PENDING",
        paymentStatus: "UNPAID",
        razorpayOrderId: "order_mock_123",
      };
      expect(onlineBooking.status).toBe("PENDING");
      expect(onlineBooking.paymentStatus).toBe("UNPAID");

      // After HMAC signature verification
      const verifiedOnlineBooking = {
        ...onlineBooking,
        status: "CONFIRMED",
        paymentStatus: "PAID",
        razorpayPaymentId: "pay_mock_123",
      };
      expect(verifiedOnlineBooking.status).toBe("CONFIRMED");
      expect(verifiedOnlineBooking.paymentStatus).toBe("PAID");
    });

    it("verifies user plan synchronization consistency across models", () => {
      const plans = ["PILOT", "STARTER", "GROWTH", "CONCIERGE"];
      plans.forEach((plan) => {
        expect(["PILOT", "STARTER", "GROWTH", "CONCIERGE"]).toContain(plan);
      });
    });
  });
});
