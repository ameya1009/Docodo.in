import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/auth/", "/dashboard/settings/sensitive", "/checkout/test"],
      },
      {
        userAgent: ["Googlebot", "Bingbot", "Applebot", "GPTBot", "ClaudeBot", "PerplexityBot"],
        allow: "/",
        disallow: ["/checkout/test"],
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
  };
}
