"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  CalendarCheck,
  Clock,
  XCircle,
  AlertTriangle,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const statusConfig = {
  PAID: {
    label: "Terbayar",
    icon: CalendarCheck,
    variant: "default" as const,
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  PENDING: {
    label: "Menunggu",
    icon: Clock,
    variant: "secondary" as const,
    className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  CANCELLED: {
    label: "Dibatalkan",
    icon: XCircle,
    variant: "destructive" as const,
    className: "bg-red-500/10 text-red-600 border-red-500/20",
  },
  EXPIRED: {
    label: "Kadaluarsa",
    icon: AlertTriangle,
    variant: "outline" as const,
    className: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  },
};

const filterOptions = [
  { label: "Semua", value: undefined },
  { label: "Terbayar", value: "PAID" as const },
  { label: "Menunggu", value: "PENDING" as const },
  { label: "Dibatalkan", value: "CANCELLED" as const },
  { label: "Kadaluarsa", value: "EXPIRED" as const },
];

export default function BuyerBookingsPage() {
  const [statusFilter, setStatusFilter] = useState<
    "PAID" | "PENDING" | "CANCELLED" | "EXPIRED" | undefined
  >(undefined);

  const trpc = useTRPC();
  const { data: bookings, isLoading } = useQuery(
    trpc.buyer.bookings.queryOptions(
      statusFilter ? { status: statusFilter } : undefined,
    ),
  );

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Riwayat Booking</h1>
        <p className="text-muted-foreground">
          Daftar semua booking dan pembayaran Anda
        </p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((opt) => (
          <button
            key={opt.label}
            onClick={() => setStatusFilter(opt.value)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors border",
              statusFilter === opt.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:bg-muted",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-5 w-48 rounded bg-muted" />
                    <div className="h-4 w-32 rounded bg-muted" />
                  </div>
                  <div className="h-6 w-20 rounded-full bg-muted" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : bookings && bookings.length > 0 ? (
        <div className="grid gap-4">
          {bookings.map((booking) => {
            const config = statusConfig[booking.status];
            const StatusIcon = config.icon;
            return (
              <Card
                key={booking.id}
                className="border-0 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">
                          {booking.service.name}
                        </h3>
                        <Badge
                          variant={config.variant}
                          className={cn("gap-1", config.className)}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {config.label}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CalendarCheck className="h-3.5 w-3.5" />
                          {format(
                            new Date(booking.startTime),
                            "EEEE, dd MMMM yyyy",
                            { locale: id },
                          )}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {format(new Date(booking.startTime), "HH:mm")} -{" "}
                          {format(new Date(booking.endTime), "HH:mm")}
                        </span>
                        {booking.service.seller?.name && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {booking.service.seller.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">
                        {formatRupiah(booking.service.price)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {booking.service.duration} menit
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-dashed shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CalendarCheck className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-lg font-medium">
              Belum ada booking
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Booking Anda akan muncul di sini setelah melakukan pemesanan
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
