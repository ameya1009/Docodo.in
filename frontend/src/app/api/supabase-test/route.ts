import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Verify Supabase client instantiation
    return NextResponse.json({
      status: "ok",
      supabaseConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error?.message || "Supabase initialization check failed" },
      { status: 500 }
    );
  }
}
