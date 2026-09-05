import { cookies } from "next/headers";
import crypto from "crypto";
import { auth } from "@/lib/auth";

export const FOUNDER_CONFIG = {
  email: "ameyakshirsagar@docodo.in",
  whatsapp: "+919284310604",
  cookieName: "docodo_founder_session",
  secret: process.env.FOUNDER_SECRET || process.env.AUTH_SECRET || "docodo_founder_superadmin_master_secret_key_2026",
};

/**
 * Verify founder email and password
 */
export function verifyFounderCredentials(email: string, pass: string): boolean {
  const normalizedEmail = email.trim().toLowerCase();
  const validEmail = FOUNDER_CONFIG.email.toLowerCase();
  const validPassword = process.env.FOUNDER_PASSWORD || "Ameya@02";

  if (normalizedEmail !== validEmail) {
    return false;
  }

  // Timing safe comparison to prevent timing attacks
  const passBuffer = Buffer.from(pass);
  const targetBuffer = Buffer.from(validPassword);
  if (passBuffer.length !== targetBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(passBuffer, targetBuffer);
}

/**
 * Generate HMAC signed token for founder session
 */
export function createFounderToken(email: string): string {
  const issuedAt = Date.now();
  const payload = `${email}:${issuedAt}`;
  const signature = crypto
    .createHmac("sha256", FOUNDER_CONFIG.secret)
    .update(payload)
    .digest("hex");

  return Buffer.from(JSON.stringify({ payload, signature })).toString("base64url");
}

/**
 * Verify HMAC signed token
 */
export function verifyFounderToken(tokenString: string): boolean {
  try {
    const raw = Buffer.from(tokenString, "base64url").toString("utf-8");
    const { payload, signature } = JSON.parse(raw);

    const [email, timestampStr] = payload.split(":");
    if (email.toLowerCase() !== FOUNDER_CONFIG.email.toLowerCase()) {
      return false;
    }

    const issuedAt = parseInt(timestampStr, 10);
    const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
    if (isNaN(issuedAt) || Date.now() - issuedAt > maxAge) {
      return false;
    }

    const expectedSignature = crypto
      .createHmac("sha256", FOUNDER_CONFIG.secret)
      .update(payload)
      .digest("hex");

    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSignature);
    if (sigBuf.length !== expBuf.length) return false;

    return crypto.timingSafeEqual(sigBuf, expBuf);
  } catch {
    return false;
  }
}

/**
 * Server-side check if current request is from verified founder
 */
export async function isFounderAuthenticated(): Promise<boolean> {
  // 1. Check founder cookie
  const cookieStore = await cookies();
  const token = cookieStore.get(FOUNDER_CONFIG.cookieName)?.value;
  if (token && verifyFounderToken(token)) {
    return true;
  }

  // 2. Check NextAuth session email
  try {
    const session = await auth();
    if (session?.user?.email?.toLowerCase() === FOUNDER_CONFIG.email.toLowerCase()) {
      return true;
    }
  } catch {
    // NextAuth session lookup failed or not present
  }

  return false;
}
