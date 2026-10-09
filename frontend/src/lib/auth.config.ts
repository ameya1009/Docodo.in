import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

export const authConfig: NextAuthConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "docodo-production-auth-secret-key-32-chars-minimum",
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  providers: [], // Configured in auth.ts with DB adapters and credentials
  callbacks: {
    authorized({ auth, request: { nextUrl, url } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      // Protect dashboard routes with explicit host redirect to avoid localhost fallback
      if (pathname.startsWith("/dashboard")) {
        if (!isLoggedIn) {
          const redirectUrl = new URL("/auth/login", nextUrl.origin);
          redirectUrl.searchParams.set("callbackUrl", pathname);
          return NextResponse.redirect(redirectUrl);
        }
        return true;
      }

      // Redirect logged-in users away from auth pages
      if (pathname.startsWith("/auth/") && isLoggedIn) {
        return NextResponse.redirect(new URL("/dashboard", nextUrl.origin));
      }

      return true;
    },
  },
};
