import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/supabase-db";
import { z } from "zod";
import { authConfig } from "./auth.config";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

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

        const user = await db.user.findUnique({ where: { email: normalizedEmail } });
        if (!user || !user.password) return null;

        const bcrypt = await import("bcryptjs");
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user?.id) {
        token.id = user.id;
      }

      if (trigger === "update" && session?.businessId) {
        token.businessId = session.businessId;
        token.businessSlug = session.businessSlug;
        token.onboardingComplete = session.onboardingComplete ?? true;
      }

      // If businessId is not yet on the token, dynamically resolve it from the database
      const userId = (token.id as string) || (user?.id as string);
      if (userId && (!token.businessId || token.onboardingComplete === false)) {
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
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (typeof token.id === "string") session.user.id = token.id;
        if (typeof token.businessId === "string") session.user.businessId = token.businessId;
        if (typeof token.businessSlug === "string") session.user.businessSlug = token.businessSlug;
        if (typeof token.onboardingComplete === "boolean") session.user.onboardingComplete = token.onboardingComplete;
      }
      return session;
    },
  },
});

