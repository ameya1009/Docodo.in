import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  FOUNDER_CONFIG,
  verifyFounderCredentials,
  createFounderToken,
  isFounderAuthenticated,
} from "@/lib/founder-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const authenticated = await isFounderAuthenticated();
  return NextResponse.json({
    authenticated,
    email: authenticated ? FOUNDER_CONFIG.email : null,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action = "login", email, password } = body;

    if (action === "logout") {
      const cookieStore = await cookies();
      cookieStore.delete(FOUNDER_CONFIG.cookieName);
      return NextResponse.json({ success: true, message: "Logged out successfully" });
    }

    if (action === "login") {
      if (!email || !password) {
        return NextResponse.json(
          { success: false, error: "Email and password are required" },
          { status: 400 }
        );
      }

      const isValid = verifyFounderCredentials(email, password);
      if (!isValid) {
        return NextResponse.json(
          { success: false, error: "Invalid founder credentials" },
          { status: 401 }
        );
      }

      const token = createFounderToken(email);
      const cookieStore = await cookies();
      cookieStore.set(FOUNDER_CONFIG.cookieName, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });

      return NextResponse.json({
        success: true,
        message: "Founder authenticated successfully",
        email: FOUNDER_CONFIG.email,
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Authentication error" },
      { status: 500 }
    );
  }
}
