export interface WebsiteSectionsConfig {
  hero: boolean;
  services: boolean;
  about: boolean;
  gallery: boolean;
  testimonials: boolean;
  faq: boolean;
  contact: boolean;
  booking_cta: boolean;
  [key: string]: boolean;
}

export function getDefaultWebsiteSections(): WebsiteSectionsConfig {
  return {
    hero: true,
    services: true,
    about: true,
    gallery: true,
    testimonials: true,
    faq: false,
    contact: true,
    booking_cta: true,
  };
}

export function parseWebsiteConfig(jsonStr: string | null | undefined): WebsiteSectionsConfig {
  const defaults = getDefaultWebsiteSections();
  if (!jsonStr) return defaults;
  try {
    const parsed = JSON.parse(jsonStr);
    if (typeof parsed === "object" && parsed !== null) {
      return { ...defaults, ...parsed };
    }
    return defaults;
  } catch {
    return defaults;
  }
}

export function serializeWebsiteConfig(config: Partial<WebsiteSectionsConfig>): string {
  const merged = { ...getDefaultWebsiteSections(), ...config };
  return JSON.stringify(merged);
}

export function generateEmbedSnippet(slug: string, domain: string = "https://docodo.in"): string {
  const cleanSlug = slug || "your-business";
  return `<iframe src="${domain}/book/${cleanSlug}?embed=true" width="100%" height="850" frameborder="0" style="border:none; overflow:hidden; border-radius:12px;" scrolling="no"></iframe>`;
}
