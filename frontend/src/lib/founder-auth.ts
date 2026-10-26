import { cookies } from "next/headers";
import crypto from "crypto";
import { auth } from "@/lib/auth";

let devEphemeralSecret: string | null = null;
let devEphemeralPassword: string | null = null;

export const FOUNDER_CONFIG = {
  get email(): string {
    return process.env.FOUNDER_EMAIL || "ameyakshirsagar@docodo.in";
  },
  get whatsapp(): string {
    return process.env.FOUNDER_WHATSAPP || "+919284310604";
  },
  cookieName: "docodo_founder_session",
  get secret(): string {
    if (process.env.FOUNDER_SECRET) {
      return process.env.FOUNDER_SECRET;
    }
    if (process.env.AUTH_SECRET) {
      return process.env.AUTH_SECRET;
    }
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "[founder-auth] Critical: FOUNDER_SECRET or AUTH_SECRET environment variable is required in production."
      );
    }
    if (!devEphemeralSecret) {
      devEphemeralSecret = crypto.randomBytes(32).toString("hex");
      console.warn("[founder-auth] No FOUNDER_SECRET found. Generated ephemeral development secret.");
    }
    return devEphemeralSecret;
  },
};

/**
 * Retrieves founder password from environment or generates cryptographically random ephemeral fallback in development.
 * Never allows static plaintext fallback in production.
 */
export function getFounderPassword(): string {
  if (process.env.FOUNDER_PASSWORD) {
    return process.env.FOUNDER_PASSWORD;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "[founder-auth] Critical: FOUNDER_PASSWORD environment variable is required in production."
    );
  }
  if (!devEphemeralPassword) {
    devEphemeralPassword = crypto.randomBytes(16).toString("hex");
    console.warn(`[founder-auth] No FOUNDER_PASSWORD set. Generated ephemeral dev password: ${devEphemeralPassword}`);
  }
  return devEphemeralPassword;
}

/**
 * Verify founder email and password with timing-safe comparison
 */
export function verifyFounderCredentials(email: string, pass: string): boolean {
  const normalizedEmail = email.trim().toLowerCase();
  const validEmail = FOUNDER_CONFIG.email.toLowerCase();

  if (normalizedEmail !== validEmail) {
    return false;
  }

  let validPassword: string;
  try {
    validPassword = getFounderPassword();
  } catch (err) {
    console.error("[founder-auth] Authentication check rejected:", err);
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
