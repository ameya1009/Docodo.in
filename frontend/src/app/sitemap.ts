import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: Array<{ path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }> = [
    { path: "", priority: 1.0, changeFrequency: "daily" },
    { path: "/care-plans", priority: 0.9, changeFrequency: "weekly" },
    { path: "/tools", priority: 0.9, changeFrequency: "weekly" },
    { path: "/tools/whatsapp-nurturer", priority: 0.8, changeFrequency: "weekly" },
    { path: "/tools/content-repurposer", priority: 0.8, changeFrequency: "weekly" },
    { path: "/audit", priority: 0.8, changeFrequency: "weekly" },
    { path: "/case-studies", priority: 0.8, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
    { path: "/privacy", priority: 0.6, changeFrequency: "monthly" },
    { path: "/terms", priority: 0.6, changeFrequency: "monthly" },
    { path: "/refund-policy", priority: 0.6, changeFrequency: "monthly" },
    { path: "/auth/signup", priority: 0.9, changeFrequency: "monthly" },
    { path: "/auth/login", priority: 0.7, changeFrequency: "monthly" },
    { path: "/book/docodo-wellness-mumbai", priority: 0.8, changeFrequency: "daily" },
  ];

  return routes.map((route) => ({
    url: `${SITE_CONFIG.url}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
