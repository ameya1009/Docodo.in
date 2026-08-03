import { z } from "zod";

export const CreateBookingSchema = z.object({
  businessId: z.string().min(1, "Business ID required"),
  serviceId: z.string().min(1, "Please select a service"),
  staffId: z.string().optional(),
  customerName: z.string().min(2, "Name must be at least 2 characters").max(60, "Name too long"),
  customerPhone: z.string().min(10, "Please enter a valid 10-digit phone number").max(15, "Phone number too long"),
  customerEmail: z.string().email("Invalid email format").optional().or(z.literal("")),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM 24hr format"),
  notes: z.string().max(300, "Notes cannot exceed 300 characters").optional(),
  paymentMethod: z.enum(["UPI", "CASH_ON_DELIVERY", "CARDS", "NETBANKING"]).default("UPI"),
});

export const GetAvailableSlotsSchema = z.object({
  businessId: z.string().min(1, "Business ID required"),
  serviceId: z.string().min(1, "Service ID required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
});

export const UpdateBookingStatusSchema = z.object({
  bookingId: z.string().min(1, "Booking ID required"),
  status: z.enum(["CONFIRMED", "PENDING", "COMPLETED", "CANCELLED", "NO_SHOW", "NDR_HOLD"]),
  internalNotes: z.string().max(500).optional(),
});

export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;
export type GetAvailableSlotsInput = z.infer<typeof GetAvailableSlotsSchema>;
export type UpdateBookingStatusInput = z.infer<typeof UpdateBookingStatusSchema>;
