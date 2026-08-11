import { z } from "zod";

export const BUSINESS_TYPE_OPTIONS = [
  { label: "Hair & Beauty Salon", value: "Salon" },
  { label: "Luxury Spa & Wellness", value: "Spa" },
  { label: "Medical & Aesthetic Clinic", value: "Clinic" },
  { label: "Dental Care Studio", value: "Dentist" },
  { label: "Fitness Gym & Crossfit", value: "Gym" },
  { label: "Yoga & Meditation Studio", value: "Yoga Studio" },
  { label: "Nail & Makeup Studio", value: "Beauty Studio" },
  { label: "Other Appointment Business", value: "Other Local Service" },
] as const;

export const BusinessDiscoverySchema = z.object({
  name: z
    .string()
    .min(2, "Business name must contain at least 2 characters")
    .max(100, "Business name exceeds maximum length of 100 characters")
    .trim(),
  city: z
    .string()
    .min(2, "Please enter your target municipal city or township")
    .max(60, "City name is too long")
    .trim(),
  businessType: z.enum([
    "Salon",
    "Spa",
    "Clinic",
    "Dentist",
    "Gym",
    "Yoga Studio",
    "Beauty Studio",
    "Other Local Service",
  ], {
    message: "Please select a supported appointment-based service category",
  }),
});

export type BusinessDiscoveryInput = z.infer<typeof BusinessDiscoverySchema>;

export const DiscoveredServiceSchema = z.object({
  name: z.string().min(2),
  price: z.number().positive(),
  duration: z.number().int().positive(), // in minutes
  description: z.string().optional(),
});

export const ConfirmDiscoveredProfileSchema = z.object({
  name: z.string().min(2),
  city: z.string().min(2),
  businessType: z.string().min(2),
  tagline: z.string().max(160).optional(),
  description: z.string().max(600).optional(),
  address: z.string().max(300).optional(),
  phone: z.string().min(10).max(15).optional(),
  services: z.array(DiscoveredServiceSchema).min(1, "At least one booking service offering is required"),
});

export type ConfirmDiscoveredProfileInput = z.infer<typeof ConfirmDiscoveredProfileSchema>;
