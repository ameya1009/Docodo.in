import { z } from "zod";

export const CreateCustomerSchema = z.object({
  businessId: z.string().min(1, "Business ID required"),
  name: z.string().min(2, "Customer name must be at least 2 characters").max(70, "Name too long"),
  phone: z.string().min(10, "Valid 10-digit phone number required").max(15, "Phone number too long"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
  tags: z.array(z.string()).default(["New Lead"]),
  source: z.enum(["BOOKING", "WHATSAPP", "REFERRAL", "WALK_IN", "INSTAGRAM"]).default("WHATSAPP"),
});

export const UpdateCustomerNotesSchema = z.object({
  customerId: z.string().min(1, "Customer ID required"),
  notes: z.string().max(1000, "Notes too long"),
});

export const UpdateCustomerTagsSchema = z.object({
  customerId: z.string().min(1, "Customer ID required"),
  tags: z.array(z.string().min(1, "Tag cannot be empty")).max(20, "Maximum 20 tags allowed"),
});

export type CreateCustomerInput = z.infer<typeof CreateCustomerSchema>;
export type UpdateCustomerNotesInput = z.infer<typeof UpdateCustomerNotesSchema>;
export type UpdateCustomerTagsInput = z.infer<typeof UpdateCustomerTagsSchema>;
