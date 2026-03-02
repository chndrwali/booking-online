import prisma from "@/lib/prisma";

/**
 * Expire semua booking yang sudah lewat batas waktu pembayaran (15 menit)
 * dan masih berstatus PENDING.
 * Dipanggil sebelum query slot availability untuk memastikan data akurat.
 */
export async function expireStaleBookings(serviceId?: string) {
  const now = new Date();

  const where = {
    status: "PENDING" as const,
    expiredAt: { lt: now },
    ...(serviceId ? { serviceId } : {}),
  };

  const result = await prisma.booking.updateMany({
    where,
    data: { status: "EXPIRED" },
  });

  return result.count;
}
