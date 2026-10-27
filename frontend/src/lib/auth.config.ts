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

      // Resolve canonical origin: enforce https://docodo.in if origin is localhost, 127.0.0.1, or missing
      const rawOrigin = (nextUrl.origin && !nextUrl.origin.includes("localhost") && !nextUrl.origin.includes("127.0.0.1"))
        ? nextUrl.origin
        : (process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "https://docodo.in");
      const canonicalOrigin = (!rawOrigin || rawOrigin.includes("localhost") || rawOrigin.includes("127.0.0.1"))
        ? "https://docodo.in"
        : rawOrigin;

      // Protect dashboard routes with explicit host redirect to avoid localhost fallback
      if (pathname.startsWith("/dashboard")) {
        if (!isLoggedIn) {
          const redirectUrl = new URL("/auth/login", canonicalOrigin);
          redirectUrl.searchParams.set("callbackUrl", pathname);
          return NextResponse.redirect(redirectUrl);
        }
        return true;
      }

      // Redirect logged-in users away from login/signup auth pages
      if ((pathname === "/auth/login" || pathname === "/auth/signup") && isLoggedIn) {
        return NextResponse.redirect(new URL("/dashboard", canonicalOrigin));
      }

      return true;
    },
  },
};
