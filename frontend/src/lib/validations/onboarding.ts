import { z } from "zod";

export const BusinessInfoSchema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters").max(80, "Name too long"),
  industry: z.string().min(2, "Please select an industry"),
  phone: z.string().min(10, "Valid 10-digit mobile number required").max(15, "Phone number too long"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  address: z.string().max(200, "Address too long").optional(),
  city: z.string().max(80, "City name too long").optional(),
  about: z.string().max(1000, "Description exceeds maximum length").optional(),
  instagram: z.string().max(100).optional(),
  facebook: z.string().max(100).optional(),
  whatsapp: z.string().max(20).optional(),
});

export const BusinessStyleSchema = z.object({
  businessId: z.string().min(1, "Business ID required"),
  style: z.enum(["modern", "luxury", "minimal", "elegant", "premium", "classic"]),
});

export const BusinessThemeSchema = z.object({
  businessId: z.string().min(1, "Business ID required"),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
  fontHeading: z.string().min(1, "Heading font required"),
  fontBody: z.string().min(1, "Body font required"),
  darkMode: z.boolean(),
});

export const LaunchEngineStepSchema = z.object({
  businessId: z.string().min(1, "Business ID is required for launch engine execution"),
});

export type BusinessInfoInput = z.infer<typeof BusinessInfoSchema>;
export type BusinessStyleInput = z.infer<typeof BusinessStyleSchema>;
export type BusinessThemeInput = z.infer<typeof BusinessThemeSchema>;
