import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Alamat email tidak valid"),
  password: z.string().min(8, "Kata sandi minimal 8 karakter"),
  remember: z.boolean().optional(),
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Nama minimal 2 karakter"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Alamat email tidak valid"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Kata sandi minimal 8 karakter"),
    confirmPassword: z
      .string()
      .min(8, "Konfirmasi kata sandi minimal 8 karakter"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

// Type auth form
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

// ─── LockSlot Schemas ──────────────────────────────────────

export const serviceSchema = z.object({
  name: z.string().min(2, "Nama layanan minimal 2 karakter"),
  description: z.string().optional(),
  duration: z.number().int().min(15, "Durasi minimal 15 menit"),
  price: z.number().int().min(1000, "Harga minimal Rp 1.000"),
  image: z.string().url().optional().or(z.literal("")),
});

export const serviceUpdateSchema = serviceSchema.partial().extend({
  id: z.string(),
  isActive: z.boolean().optional(),
});

export const bookingSchema = z.object({
  serviceId: z.string(),
  buyerName: z.string().min(2, "Nama minimal 2 karakter"),
  buyerEmail: z.string().email("Email tidak valid"),
  buyerPhone: z.string().min(10, "Nomor telepon minimal 10 digit"),
  startTime: z.string().datetime(), // ISO 8601
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;
export type ServiceUpdateFormValues = z.infer<typeof serviceUpdateSchema>;
export type BookingFormValues = z.infer<typeof bookingSchema>;
