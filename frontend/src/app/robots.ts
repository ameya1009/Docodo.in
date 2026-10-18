import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/llms.txt", "/llms-full.txt", "/api/ai-agents/register", "/api/ai-agents/auth"],
        disallow: ["/api/auth/", "/dashboard/", "/checkout/test"],
      },
      {
        userAgent: [
          "GPTBot",
          "ClaudeBot",
          "PerplexityBot",
          "Google-Extended",
          "Amazonbot",
          "FacebookBot",
          "Bytespider",
          "cohere-ai",
        ],
        allow: [
          "/",
          "/llms.txt",
          "/llms-full.txt",
          "/api/ai-agents/register",
          "/api/ai-agents/auth",
          "/book/",
          "/pricing",
          "/features",
        ],
        disallow: ["/api/auth/", "/dashboard/", "/checkout/test"],
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
  };
}
