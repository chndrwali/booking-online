import { createTRPCRouter, baseProcedure, sellerProcedure } from "@/trpc/init";
import { serviceSchema, serviceUpdateSchema } from "@/lib/form-schema";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const serviceRouter = createTRPCRouter({
  /** Seller: Buat layanan baru */
  create: sellerProcedure
    .input(serviceSchema)
    .mutation(async ({ ctx, input }) => {
      const service = await prisma.service.create({
        data: {
          ...input,
          image: input.image || null,
          sellerId: ctx.auth.user.id,
        },
      });
      return service;
    }),

  /** Seller: List semua layanan milik seller */
  list: sellerProcedure.query(async ({ ctx }) => {
    const services = await prisma.service.findMany({
      where: { sellerId: ctx.auth.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { bookings: { where: { status: "PAID" } } } },
      },
    });
    return services;
  }),

  /** Seller: Update layanan */
  update: sellerProcedure
    .input(serviceUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      // Pastikan service milik seller ini
      const existing = await prisma.service.findFirst({
        where: { id, sellerId: ctx.auth.user.id },
      });
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Layanan tidak ditemukan",
        });
      }

      return prisma.service.update({
        where: { id },
        data: {
          ...data,
          image: data.image || null,
        },
      });
    }),

  /** Seller: Soft delete layanan (isActive = false) */
  delete: sellerProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await prisma.service.findFirst({
        where: { id: input.id, sellerId: ctx.auth.user.id },
      });
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Layanan tidak ditemukan",
        });
      }

      return prisma.service.update({
        where: { id: input.id },
        data: { isActive: false },
      });
    }),

  /** Public: Detail layanan */
  getById: baseProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const service = await prisma.service.findFirst({
        where: { id: input.id, isActive: true },
        include: {
          seller: { select: { id: true, name: true, image: true } },
        },
      });
      if (!service) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Layanan tidak ditemukan",
        });
      }
      return service;
    }),

  /** Public: List semua layanan aktif */
  listPublic: baseProcedure.query(async () => {
    return prisma.service.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      include: {
        seller: { select: { id: true, name: true, image: true } },
      },
    });
  }),
});
