import { createTRPCRouter, buyerProcedure } from "@/trpc/init";
import prisma from "@/lib/prisma";
import { z } from "zod";

export const buyerRouter = createTRPCRouter({
  /** Buyer: Get profil lengkap */
  getProfile: buyerProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findUnique({
      where: { id: ctx.auth.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
      },
    });
    return user;
  }),

  /** Buyer: List booking milik buyer */
  bookings: buyerProcedure
    .input(
      z
        .object({
          status: z
            .enum(["PENDING", "PAID", "CANCELLED", "EXPIRED"])
            .optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const bookings = await prisma.booking.findMany({
        where: {
          buyerId: ctx.auth.user.id,
          ...(input?.status ? { status: input.status } : {}),
        },
        include: {
          service: {
            select: {
              id: true,
              name: true,
              price: true,
              duration: true,
              image: true,
              seller: { select: { name: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      return bookings;
    }),

  /** Buyer: Statistik booking */
  stats: buyerProcedure.query(async ({ ctx }) => {
    const [total, paid, pending, cancelled] = await Promise.all([
      prisma.booking.count({
        where: { buyerId: ctx.auth.user.id },
      }),
      prisma.booking.count({
        where: { buyerId: ctx.auth.user.id, status: "PAID" },
      }),
      prisma.booking.count({
        where: { buyerId: ctx.auth.user.id, status: "PENDING" },
      }),
      prisma.booking.count({
        where: {
          buyerId: ctx.auth.user.id,
          status: { in: ["CANCELLED", "EXPIRED"] },
        },
      }),
    ]);

    const paidBookings = await prisma.booking.findMany({
      where: { buyerId: ctx.auth.user.id, status: "PAID" },
      include: { service: { select: { price: true } } },
    });
    const totalSpent = paidBookings.reduce(
      (sum, b) => sum + b.service.price,
      0,
    );

    return { total, paid, pending, cancelled, totalSpent };
  }),

  /** Buyer: Update profil */
  updateProfile: buyerProcedure
    .input(
      z.object({
        name: z.string().min(1, "Nama wajib diisi"),
        phone: z.string().optional(),
        image: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updated = await prisma.user.update({
        where: { id: ctx.auth.user.id },
        data: {
          name: input.name,
          phone: input.phone || null,
          image: input.image || null,
        },
      });
      return updated;
    }),
});
