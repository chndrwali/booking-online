"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function StatusDisplay({ status }: { status: string }) {
  switch (status) {
    case "PAID":
      return (
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="rounded-full bg-emerald-500/10 p-4">
            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-emerald-500">
            Booking Terkonfirmasi
          </h2>
          <p className="text-muted-foreground">
            Pembayaran berhasil. Jadwal Anda sudah terkunci.
          </p>
        </div>
      );
    case "PENDING":
      return (
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="rounded-full bg-amber-500/10 p-4">
            <Clock className="h-12 w-12 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-amber-500">
            Menunggu Pembayaran
          </h2>
          <p className="text-muted-foreground">
            Selesaikan pembayaran dalam 15 menit agar slot terkunci.
          </p>
        </div>
      );
    case "EXPIRED":
      return (
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="rounded-full bg-gray-500/10 p-4">
            <AlertCircle className="h-12 w-12 text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-500">
            Booking Kadaluarsa
          </h2>
          <p className="text-muted-foreground">
            Waktu pembayaran sudah habis. Silakan buat booking baru.
          </p>
        </div>
      );
    case "CANCELLED":
      return (
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="rounded-full bg-red-500/10 p-4">
            <XCircle className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-red-500">
            Booking Dibatalkan
          </h2>
          <p className="text-muted-foreground">Booking ini telah dibatalkan.</p>
        </div>
      );
    default:
      return null;
  }
}

export default function BookingStatusPage() {
  const params = useParams();
  const bookingId = params.id as string;
  const trpc = useTRPC();

  const { data: booking, isLoading } = useQuery(
    trpc.booking.getById.queryOptions(
      { id: bookingId },
      { refetchInterval: 5000 }, // Poll setiap 5 detik untuk update status
    ),
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="h-16 w-16 animate-pulse rounded-full bg-muted mx-auto" />
          <div className="h-6 w-48 animate-pulse rounded bg-muted mx-auto" />
          <div className="h-4 w-64 animate-pulse rounded bg-muted mx-auto" />
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full border-0 shadow-md">
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-bold">Booking tidak ditemukan</h2>
            <Button className="mt-4" asChild>
              <Link href="/">Kembali ke Beranda</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-lg mx-auto border-0 shadow-lg">
          <CardHeader>
            <StatusDisplay status={booking.status} />
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Booking Details */}
            <div className="space-y-3 rounded-lg bg-muted/50 p-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Layanan</span>
                <span className="font-medium">{booking.service.name}</span>
              </div>
              {booking.service.seller?.name && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Penyedia
                  </span>
                  <span className="font-medium">
                    {booking.service.seller.name}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tanggal</span>
                <span className="font-medium">
                  {format(new Date(booking.startTime), "EEEE, dd MMMM yyyy", {
                    locale: localeId,
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Waktu</span>
                <span className="font-medium">
                  {format(new Date(booking.startTime), "HH:mm")} -{" "}
                  {format(new Date(booking.endTime), "HH:mm")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Harga</span>
                <span className="font-bold text-primary">
                  {formatRupiah(booking.service.price)}
                </span>
              </div>
            </div>

            {/* Customer Info */}
            <div className="space-y-3 rounded-lg bg-muted/50 p-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Nama</span>
                <span className="font-medium">{booking.buyerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="font-medium">{booking.buyerEmail}</span>
              </div>
            </div>

            {/* Actions */}
            {booking.status === "PENDING" && booking.paymentLink && (
              <Button
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                size="lg"
                asChild
              >
                <a
                  href={booking.paymentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Lanjut Bayar
                </a>
              </Button>
            )}

            {(booking.status === "EXPIRED" ||
              booking.status === "CANCELLED") && (
              <Button className="w-full" size="lg" variant="outline" asChild>
                <Link href={`/services/${booking.serviceId}`}>
                  Buat Booking Baru
                </Link>
              </Button>
            )}

            <div className="text-center">
              <Badge variant="outline" className="text-xs">
                ID: {booking.id}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
