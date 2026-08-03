import { z } from "zod";

export const WebsiteSectionsSchema = z.object({
  hero: z.boolean().default(true),
  services: z.boolean().default(true),
  about: z.boolean().default(true),
  gallery: z.boolean().default(true),
  testimonials: z.boolean().default(true),
  faq: z.boolean().default(false),
  contact: z.boolean().default(true),
  booking_cta: z.boolean().default(true),
});

export const UpdateWebsiteConfigSchema = z.object({
  businessId: z.string().min(1, "Business ID required"),
  sections: WebsiteSectionsSchema,
});

export const UpdateSEODetailsSchema = z.object({
  businessId: z.string().min(1, "Business ID required"),
  seoTitle: z.string().min(3, "Title must be at least 3 characters").max(100, "Title too long"),
  seoDesc: z.string().max(250, "SEO description cannot exceed 250 characters").optional(),
});

export type WebsiteSections = z.infer<typeof WebsiteSectionsSchema>;
export type UpdateWebsiteConfigInput = z.infer<typeof UpdateWebsiteConfigSchema>;
export type UpdateSEODetailsInput = z.infer<typeof UpdateSEODetailsSchema>;
