import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/supabase-db";
import { z } from "zod";
import { authConfig } from "./auth.config";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

if (process.env.NODE_ENV === "production") {
  if (!process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL.includes("localhost")) {
    process.env.NEXTAUTH_URL = "https://docodo.in";
  }
  if (!process.env.AUTH_URL || process.env.AUTH_URL.includes("localhost")) {
    process.env.AUTH_URL = "https://docodo.in";
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  trustHost: true,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "docodo-production-auth-secret-key-32-chars-minimum",
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const normalizedEmail = email.trim().toLowerCase();

        let user: any = null;
        try {
          const { prisma } = await import("@/lib/prisma");
          user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        } catch {
          user = null;
        }

        if (!user) {
          try {
            user = await db.user.findUnique({ where: { email: normalizedEmail } });
          } catch {
            user = null;
          }
        }

        if (!user || !user.password) return null;

        const bcrypt = await import("bcryptjs");
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role || "OWNER",
          plan: user.plan || "PILOT",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user?.id) {
        token.id = user.id;
        token.role = (user as any).role || "OWNER";
        token.plan = (user as any).plan || "PILOT";
      }

      if (trigger === "update" && session?.businessId) {
        token.businessId = session.businessId;
        token.businessSlug = session.businessSlug;
        token.onboardingComplete = session.onboardingComplete ?? true;
        if (session.plan) token.plan = session.plan;
      }

      // If businessId or plan is not yet on the token, dynamically resolve it from the database
      const userId = (token.id as string) || (user?.id as string);
      if (userId && (!token.businessId || !token.plan || token.onboardingComplete === false)) {
        try {
          const { prisma } = await import("@/lib/prisma");
          const [business, userDb] = await Promise.all([
            prisma.business.findFirst({ where: { ownerId: userId } }),
            prisma.user.findUnique({ where: { id: userId }, select: { plan: true, role: true } }),
          ]);
          if (business) {
            token.businessId = business.id;
            token.businessSlug = business.slug;
            token.onboardingComplete = business.onboardingComplete;
          }
          if (userDb?.plan) {
            token.plan = userDb.plan;
          }
        } catch {
          try {
            const business = await db.business.findFirst({
              where: { ownerId: userId },
            });
            if (business) {
              token.businessId = business.id;
              token.businessSlug = business.slug;
              token.onboardingComplete = business.onboardingComplete;
            }
          } catch (err) {
            console.warn("[Auth JWT Callback] Failed resolving business for user:", err);
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (typeof token.id === "string") session.user.id = token.id;
        if (typeof token.businessId === "string") session.user.businessId = token.businessId;
        if (typeof token.businessSlug === "string") session.user.businessSlug = token.businessSlug;
        if (typeof token.onboardingComplete === "boolean") session.user.onboardingComplete = token.onboardingComplete;
        if (typeof token.plan === "string") session.user.plan = token.plan;
        if (typeof token.role === "string") session.user.role = token.role;
      }
      return session;
    },
  },
});

