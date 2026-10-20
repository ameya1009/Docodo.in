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
    const { prisma } = await import("@/lib/prisma");
    exists = await prisma.user.findUnique({ where: { email } }).catch(() => null);
  } catch {
    exists = null;
  }

  if (!exists) {
    try {
      exists = await db.user.findUnique({ where: { email } }).catch(() => null);
    } catch (dbErr: any) {
      console.warn("[SignUpAction] DB Lookup Warning:", dbErr);
    }
  }

  if (exists) {
    return { error: "An account with this email already exists. Please sign in instead." };
  }

  const bcrypt = await import("bcryptjs");
  const hashed = await bcrypt.hash(password, 12);

  let createdId: string | undefined;
  try {
    const { prisma } = await import("@/lib/prisma");
    const created = await prisma.user.create({
      data: { name, email, password: hashed, role: "OWNER", plan: "PILOT" },
    });
    createdId = created.id;
  } catch (pErr) {
    console.warn("[SignUpAction] Prisma create fallback:", pErr);
  }

  try {
    await db.user.create({
      data: { id: createdId, name, email, password: hashed, role: "OWNER", plan: "PILOT" },
    });
  } catch (dbErr: any) {
    console.warn("[SignUpAction] Supabase DB create error (handled):", dbErr);
    if (!createdId) {
      return {
        error: "Failed to create user in database. Please verify your connection."
      };
    }
  }

  // Auto sign-in after signup with redirect: false for seamless client router navigation
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: true, redirectTo: "/onboarding" };
  } catch (err: any) {
    if (isNextRedirect(err)) {
      return { success: true, redirectTo: "/onboarding" };
    }
    return { success: true, redirectTo: "/auth/login?registered=true", message: "Account created successfully! Please sign in." };
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
      redirect: false,
    });
    return { success: true, redirectTo: "/dashboard" };
  } catch (err: any) {
    if (isNextRedirect(err)) {
      return { success: true, redirectTo: "/dashboard" };
    }
    if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password. Please check your credentials." };
        default:
          return { error: "Authentication failed. Please verify your credentials and try again." };
      }
    }
    return { error: err?.message || "An unexpected error occurred during login." };
  }
}


import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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
    let user = null;
    try {
      user = await prisma.user.findUnique({ where: { email } });
    } catch {
      user = null;
    }
    if (!user) {
      try {
        user = await db.user.findUnique({ where: { email } });
      } catch {
        user = null;
      }
    }

    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 3600 * 1000); // 1 hour expiration

      try {
        await prisma.verificationToken.deleteMany({
          where: { identifier: email },
        }).catch(() => null);

        await prisma.verificationToken.create({
          data: {
            identifier: email,
            token: resetToken,
            expires,
          },
        });
      } catch (tokenErr) {
        console.warn("[Password Reset] Could not persist token to DB:", tokenErr);
      }

      const appUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "https://docodo.in";
      const resetUrl = `${appUrl}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

      const { generateForgotPasswordHtml } = await import("@/lib/services/invoice-email-service");
      const html = generateForgotPasswordHtml({ resetUrl, email });

      if (resend) {
        await resend.emails.send({
          from: "Docodo Security <security@docodo.in>",
          to: [email],
          subject: "Reset your Docodo Clinical OS password",
          html,
        }).catch((err) => console.error("[Password Reset] Resend email failed:", err));
      } else {
        console.warn("[Password Reset] RESEND_API_KEY not configured — email logged in sandbox mode. Reset URL:", resetUrl);
      }
    }

    return {
      success: true,
      message: "If an account exists with this email address, password reset instructions have been sent.",
    };
  } catch (err: any) {
    return { error: "Unable to process password reset request at this time. Please try again later." };
  }
}

export async function resetPasswordAction(token: string, email: string, newPassword: string) {
  if (!token || !email || !newPassword) {
    return { error: "Token, email and new password are all required." };
  }
  if (newPassword.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  try {
    const sanitized = sanitizeEmail(email);

    // Find and validate the token
    const resetToken = await prisma.verificationToken.findUnique({
      where: { identifier_token: { identifier: sanitized, token } },
    });

    if (!resetToken) {
      return { error: "Invalid or expired reset link. Please request a new one." };
    }
    if (resetToken.expires < new Date()) {
      await prisma.verificationToken.delete({
        where: { identifier_token: { identifier: sanitized, token } },
      }).catch(() => null);
      return { error: "This reset link has expired. Please request a new one." };
    }

    // Hash the new password and update the user in both Prisma and Supabase
    const bcrypt = await import("bcryptjs");
    const hashed = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { email: sanitized },
      data: { password: hashed },
    }).catch(() => null);

    try {
      await db.user.update({
        where: { email: sanitized },
        data: { password: hashed },
      });
    } catch (sbErr) {
      console.warn("[Reset Password] Supabase update handled:", sbErr);
    }

    // Delete the used token
    await prisma.verificationToken.delete({
      where: { identifier_token: { identifier: sanitized, token } },
    }).catch(() => null);

    return { success: true };
  } catch (err: any) {
    console.error("[Reset Password] Error:", err);
    return { error: "Unable to reset password at this time. Please try again." };
  }
}
