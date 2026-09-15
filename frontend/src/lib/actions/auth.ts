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
    if (err instanceof AuthError) {
      return { success: true, redirectTo: "/auth/login", message: "Account created! Please sign in." };
    }
    // Even if auto-sign-in has an issue, account creation succeeded
    return { success: true, redirectTo: "/auth/login", message: "Account created successfully! Please sign in." };
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
    const user = await db.user.findUnique({ where: { email } });
    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 3600 * 1000); // 1 hour expiration

      try {
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

      // P0-7: Actually send the email via Resend instead of console.log
      if (resend) {
        await resend.emails.send({
          from: "Docodo <noreply@docodo.in>",
          to: [email],
          subject: "Reset your Docodo password",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
              <h2 style="color: #0f172a; margin-bottom: 8px;">Reset your password</h2>
              <p style="color: #475569; font-size: 15px;">Hi there,</p>
              <p style="color: #475569; font-size: 15px;">We received a request to reset the password for your Docodo account. Click the button below to choose a new password. This link expires in 1 hour.</p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${resetUrl}" style="background-color: #2563EB; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
                  Reset Password
                </a>
              </div>
              <p style="color: #94a3b8; font-size: 13px;">If you did not request a password reset, you can safely ignore this email. Your password will not change.</p>
              <p style="color: #94a3b8; font-size: 13px;">Or copy this link: ${resetUrl}</p>
            </div>
          `,
        }).catch((err) => console.error("[Password Reset] Resend email failed:", err));
      } else {
        console.warn("[Password Reset] RESEND_API_KEY not configured — email not sent. Reset URL:", resetUrl);
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

    // Hash the new password and update the user
    const bcrypt = await import("bcryptjs");
    const hashed = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { email: sanitized },
      data: { password: hashed },
    });

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
