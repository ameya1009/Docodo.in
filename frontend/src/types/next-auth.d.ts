import type { DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      businessId?: string;
      businessSlug?: string;
      onboardingComplete?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    businessId?: string;
    businessSlug?: string;
    onboardingComplete?: boolean;
  }
}
