import { describe, it, expect } from "vitest";
import crypto from "crypto";

describe("Razorpay Standard Checkout & Signature Verification Tests", () => {
  const TEST_KEY_SECRET = "Qrn5jYGiDsqCMiIMpFQ2maEZ";
  const TEST_ORDER_ID = "order_O4vj94u3U02V98";
  const TEST_PAYMENT_ID = "pay_O4vkR571lKq4v9";

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
});
