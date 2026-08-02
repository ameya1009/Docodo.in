// Server Actions — Auth
"use server";

import { signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { AuthError } from "next-auth";

const signUpSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function signUpAction(formData: FormData) {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = signUpSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, email, password } = parsed.data;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return { error: "An account with this email already exists." };

  const bcrypt = await import("bcryptjs");
  const hashed = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: { name, email, password: hashed },
  });

  // Auto sign-in after signup
  try {
    await signIn("credentials", { email, password, redirectTo: "/onboarding" });
  } catch (err) {
    if (err instanceof AuthError) return { error: "Signup succeeded but login failed. Please log in." };
    throw err;
  }
}

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (err) {
    if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password." };
        default:
          return { error: "Something went wrong. Please try again." };
      }
    }
    throw err;
  }
}
