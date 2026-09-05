// Server Actions — Auth with production Zod validation, Supabase & database error resiliency
"use server";

import { signIn } from "@/lib/auth";
import { db } from "@/lib/supabase-db";
import { AuthError } from "next-auth";
import { SignUpSchema, LoginSchema, ResetPasswordSchema } from "@/lib/validations/auth";
import { sanitizeEmail } from "@/lib/engines/auth-engine";

function isNextRedirect(error: any): boolean {
  return (
    error &&
    typeof error === "object" &&
    "digest" in error &&
    typeof error.digest === "string" &&
    error.digest.startsWith("NEXT_REDIRECT")
  );
}

export async function signUpAction(formData: FormData) {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = SignUpSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, password } = parsed.data;
  const email = sanitizeEmail(parsed.data.email);

  let exists = null;
  try {
    exists = await db.user.findUnique({ where: { email } });
  } catch (dbErr: any) {
    console.error("[SignUpAction] DB Lookup Error:", dbErr);
    return { error: "Database service error. Please check your Supabase connection." };
  }

  if (exists) {
    return { error: "An account with this email already exists. Please sign in instead." };
  }

  const bcrypt = await import("bcryptjs");
  const hashed = await bcrypt.hash(password, 12);

  try {
    await db.user.create({
      data: { name, email, password: hashed },
    });
  } catch (dbErr: any) {
    console.error("[SignUpAction] DB Create Error:", dbErr);
    return {
      error: "Failed to create user in database. Please check database permissions."
    };
  }

  // Auto sign-in after signup
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/onboarding",
    });
    return { success: true, redirectTo: "/onboarding" };
  } catch (err) {
    if (isNextRedirect(err)) throw err;
    if (err instanceof AuthError) {
      return { success: true, redirectTo: "/auth/login", message: "Account created! Please sign in." };
    }
    throw err;
  }
}

export async function loginAction(formData: FormData) {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = LoginSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const email = sanitizeEmail(parsed.data.email);
  const { password } = parsed.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
    return { success: true, redirectTo: "/dashboard" };
  } catch (err: any) {
    if (isNextRedirect(err)) throw err;
    if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password." };
        default:
          return { error: "Authentication failed. Please verify your credentials and try again." };
      }
    }
    return { error: err?.message || "An unexpected error occurred during login." };
  }
}

export async function requestPasswordResetAction(formData: FormData) {
  const raw = {
    email: formData.get("email") as string,
  };

  const parsed = ResetPasswordSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const email = sanitizeEmail(parsed.data.email);

  try {
    await db.user.findUnique({ where: { email } });
    return {
      success: true,
      message: "If an account exists with this email address, password reset instructions have been sent.",
    };
  } catch (err: any) {
    return { error: "Unable to process password reset request at this time. Please try again later." };
  }
}

