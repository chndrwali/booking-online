import { createTRPCRouter, baseProcedure, sellerProcedure } from "@/trpc/init";
import { bookingSchema } from "@/lib/form-schema";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createMayarPayment } from "@/lib/mayar";
import { expireStaleBookings } from "@/lib/expire-bookings";
import { addMinutes } from "date-fns";
import config from "@/lib/config-env";

const BOOKING_EXPIRE_MINUTES = 15;

export const bookingRouter = createTRPCRouter({
  /** Public: Buat booking + create Mayar payment → return payment link */
  create: baseProcedure.input(bookingSchema).mutation(async ({ input }) => {
    const { serviceId, buyerName, buyerEmail, buyerPhone, startTime } = input;

    // 1. Expire stale bookings terlebih dahulu
    await expireStaleBookings(serviceId);

    // 2. Ambil data service
    const service = await prisma.service.findFirst({
      where: { id: serviceId, isActive: true },
    });
    if (!service) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Layanan tidak ditemukan",
      });
    }

    // 3. Hitung startTime dan endTime
    const start = new Date(startTime);
    const end = addMinutes(start, service.duration);
    const expiredAt = addMinutes(new Date(), BOOKING_EXPIRE_MINUTES);

    // 4. Cek apakah slot sudah diambil (PENDING atau PAID)
    const existingBooking = await prisma.booking.findFirst({
      where: {
        serviceId,
        startTime: start,
        status: { in: ["PENDING", "PAID"] },
      },
    });
    if (existingBooking) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Slot waktu ini sudah dipesan",
      });
    }

    // 5. Buat booking sebagai PENDING
    const booking = await prisma.booking.create({
      data: {
        serviceId,
        buyerName,
        buyerEmail,
        buyerPhone,
        startTime: start,
        endTime: end,
        expiredAt,
        status: "PENDING",
      },
    });

    // 6. Create Mayar payment
    try {
      const mayarResponse = await createMayarPayment({
        name: buyerName,
        email: buyerEmail,
        amount: service.price,
        mobile: buyerPhone,
        description: `Booking ${service.name} - ${start.toLocaleDateString("id-ID")} ${start.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`,
        redirectURL: `${config.env.nextPublicUrl}/booking/${booking.id}`,
        expiredAt: expiredAt.toISOString(),
      });

      // 7. Update booking dengan payment info
      const updatedBooking = await prisma.booking.update({
        where: { id: booking.id },
        data: {
          paymentId: mayarResponse.data.id,
          paymentLink: mayarResponse.data.link,
        },
      });

      return {
        booking: updatedBooking,
        paymentLink: mayarResponse.data.link,
      };
    } catch {
      // Rollback: hapus booking jika payment gagal
      await prisma.booking.delete({ where: { id: booking.id } });
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Gagal membuat pembayaran. Silakan coba lagi.",
      });
    }
  }),

  /** Public: Get booked slots by service + date */
  getByDate: baseProcedure
    .input(
      z.object({
        serviceId: z.string(),
        date: z.string(), // YYYY-MM-DD
      }),
    )
    .query(async ({ input }) => {
      // Expire stale bookings dulu
      await expireStaleBookings(input.serviceId);

      const startOfDay = new Date(`${input.date}T00:00:00`);
      const endOfDay = new Date(`${input.date}T23:59:59`);

      const bookings = await prisma.booking.findMany({
        where: {
          serviceId: input.serviceId,
          startTime: { gte: startOfDay, lte: endOfDay },
          status: { in: ["PENDING", "PAID"] },
        },
        select: {
          id: true,
          startTime: true,
          endTime: true,
          status: true,
        },
        orderBy: { startTime: "asc" },
      });

      return bookings;
    }),

  /** Public: Detail booking + status */
  getById: baseProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const booking = await prisma.booking.findUnique({
        where: { id: input.id },
        include: {
          service: {
            select: {
              id: true,
              name: true,
              duration: true,
              price: true,
              seller: { select: { name: true } },
            },
          },
        },
      });

      if (!booking) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Booking tidak ditemukan",
        });
      }

      // Auto-expire check
      if (booking.status === "PENDING" && booking.expiredAt < new Date()) {
        await prisma.booking.update({
          where: { id: booking.id },
          data: { status: "EXPIRED" },
        });
        return { ...booking, status: "EXPIRED" as const };
      }

      return booking;
    }),

  /** Seller: List all bookings untuk layanan seller */
  listBySeller: sellerProcedure
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
          service: { sellerId: ctx.auth.user.id },
          ...(input?.status ? { status: input.status } : {}),
        },
        include: {
          service: { select: { id: true, name: true, price: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      return bookings;
    }),

  /** Seller: Statistik booking */
  stats: sellerProcedure.query(async ({ ctx }) => {
    const [total, paid, pending, cancelled] = await Promise.all([
      prisma.booking.count({
        where: { service: { sellerId: ctx.auth.user.id } },
      }),
      prisma.booking.count({
        where: { service: { sellerId: ctx.auth.user.id }, status: "PAID" },
      }),
      prisma.booking.count({
        where: { service: { sellerId: ctx.auth.user.id }, status: "PENDING" },
      }),
      prisma.booking.count({
        where: {
          service: { sellerId: ctx.auth.user.id },
          status: { in: ["CANCELLED", "EXPIRED"] },
        },
      }),
    ]);

    // Revenue (sum of paid bookings)
    const revenueResult = await prisma.booking.findMany({
      where: { service: { sellerId: ctx.auth.user.id }, status: "PAID" },
      include: { service: { select: { price: true } } },
    });
    const revenue = revenueResult.reduce(
      (sum: number, b: { service: { price: number } }) => sum + b.service.price,
      0,
    );

    return { total, paid, pending, cancelled, revenue };
  }),
});
