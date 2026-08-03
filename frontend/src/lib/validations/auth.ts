import { z } from "zod";

export const SignUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(60, "Name cannot exceed 60 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password exceeds allowable length"),
});

export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password cannot be empty"),
});

export const ResetPasswordSchema = z.object({
  email: z.string().email("Please enter your registered email address"),
});

export type SignUpInput = z.infer<typeof SignUpSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
