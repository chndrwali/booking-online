import { createTRPCRouter, baseProcedure, sellerProcedure } from "@/trpc/init";
import { serviceSchema, serviceUpdateSchema } from "@/lib/form-schema";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const listInputSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(10),
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  sortBy: z
    .enum(["createdAt", "name", "price", "isActive"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

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

  /** Seller: List layanan milik seller dengan pagination, search, sort */
  list: sellerProcedure.input(listInputSchema).query(async ({ ctx, input }) => {
    const { page, limit, search, isActive, sortBy, sortOrder } = input;
    const skip = (page - 1) * limit;

    const where = {
      sellerId: ctx.auth.user.id,
      ...(isActive !== undefined && { isActive }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          {
            shortDescription: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        ],
      }),
    };

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.service.count({ where }),
    ]);

    return {
      items: services,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
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

  /** Seller: Delete layanan */
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

      return prisma.service.delete({
        where: { id: input.id },
      });
    }),

  /** Seller: Bulk delete layanan */
  bulkDelete: sellerProcedure
    .input(z.object({ ids: z.array(z.string()).min(1) }))
    .mutation(async ({ ctx, input }) => {
      const result = await prisma.service.deleteMany({
        where: {
          id: { in: input.ids },
          sellerId: ctx.auth.user.id,
        },
      });
      return { deletedCount: result.count };
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
