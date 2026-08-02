import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

export const authConfig: NextAuthConfig = {
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

      // Protect dashboard and onboarding routes
      if (pathname.startsWith("/dashboard") || pathname.startsWith("/onboarding")) {
        if (!isLoggedIn) {
          return false; // Automatically redirects to signIn page
        }
        return true;
      }

      // Redirect logged-in users away from auth pages
      if (pathname.startsWith("/auth/") && isLoggedIn) {
        return NextResponse.redirect(new URL("/dashboard", url));
      }

      return true;
    },
  },
};
