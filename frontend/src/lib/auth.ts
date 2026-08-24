import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { authConfig } from "./auth.config";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
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
        const user = await prisma.user.findUnique({ where: { email } });
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
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
        const business = await prisma.business.findFirst({
          where: { ownerId: user.id },
          select: { id: true, slug: true, onboardingComplete: true },
        });
        token.businessId = business?.id ?? undefined;
        token.businessSlug = business?.slug ?? undefined;
        token.onboardingComplete = business?.onboardingComplete ?? false;
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
