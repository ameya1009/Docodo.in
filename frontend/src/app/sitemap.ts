import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/metadata";
import { VERTICALS } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseRoutes: Array<{ path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }> = [
    { path: "", priority: 1.0, changeFrequency: "daily" },
    { path: "/features", priority: 0.9, changeFrequency: "weekly" },
    { path: "/how-it-works", priority: 0.9, changeFrequency: "weekly" },
    { path: "/pricing", priority: 0.9, changeFrequency: "weekly" },
    { path: "/solutions", priority: 0.9, changeFrequency: "weekly" },
    { path: "/demo", priority: 0.9, changeFrequency: "weekly" },
    { path: "/care-plans", priority: 0.9, changeFrequency: "weekly" },
    { path: "/tools", priority: 0.9, changeFrequency: "weekly" },
    { path: "/tools/whatsapp-nurturer", priority: 0.8, changeFrequency: "weekly" },
    { path: "/tools/content-repurposer", priority: 0.8, changeFrequency: "weekly" },
    { path: "/audit", priority: 0.8, changeFrequency: "weekly" },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
    { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
    { path: "/case-studies", priority: 0.8, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
    { path: "/privacy", priority: 0.6, changeFrequency: "monthly" },
    { path: "/terms", priority: 0.6, changeFrequency: "monthly" },
    { path: "/refund-policy", priority: 0.6, changeFrequency: "monthly" },
    { path: "/auth/signup", priority: 0.9, changeFrequency: "monthly" },
    { path: "/auth/login", priority: 0.7, changeFrequency: "monthly" },
    { path: "/book/docodo-wellness-mumbai", priority: 0.8, changeFrequency: "daily" },
  ];

  const verticalRoutes = VERTICALS.map((v) => ({
    path: `/for/${v.slug}`,
    priority: 0.85,
    changeFrequency: "weekly" as const,
  }));

  const allRoutes = [...baseRoutes, ...verticalRoutes];

  return allRoutes.map((route) => ({
    url: `${SITE_CONFIG.url}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}

