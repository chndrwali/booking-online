import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { TRPCError } from "@trpc/server";

export const onboardingSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  role: z.enum(["seller", "buyer"], {
    message: "Pilih peran Anda",
  }),
  phone: z
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .optional()
    .or(z.literal("")),
  image: z.string().url("URL gambar tidak valid").optional().or(z.literal("")),
});

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;

export const onboardingRouter = createTRPCRouter({
  /** Complete onboarding — update user profile + mark as onboarded */
  complete: protectedProcedure
    .input(onboardingSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.auth.user.id;

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User tidak ditemukan",
        });
      }

      // Update user in database
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          name: input.name,
          role: input.role,
          phone: input.phone || null,
          image: input.image || null,
          onboarded: true,
        },
      });

      return updatedUser;
    }),

  /** Check if current user has completed onboarding */
  status: protectedProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findUnique({
      where: { id: ctx.auth.user.id },
      select: { onboarded: true, role: true, name: true },
    });
    return {
      onboarded: user?.onboarded ?? false,
      role: user?.role,
      name: user?.name,
    };
  }),
});
