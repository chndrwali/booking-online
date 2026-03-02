"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { useState } from "react";

type BookingStatus = "PENDING" | "PAID" | "CANCELLED" | "EXPIRED";

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function getStatusBadge(status: string) {
  const variants: Record<
    string,
    {
      variant: "default" | "secondary" | "destructive" | "outline";
      label: string;
    }
  > = {
    PAID: { variant: "default", label: "Terbayar" },
    PENDING: { variant: "outline", label: "Menunggu" },
    CANCELLED: { variant: "destructive", label: "Dibatalkan" },
    EXPIRED: { variant: "secondary", label: "Kadaluarsa" },
  };
  const cfg = variants[status] || {
    variant: "secondary" as const,
    label: status,
  };
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

export default function SellerBookingsPage() {
  const trpc = useTRPC();
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "ALL">(
    "ALL",
  );

  const queryInput =
    statusFilter === "ALL"
      ? undefined
      : { status: statusFilter as BookingStatus };

  const { data: bookings, isLoading } = useQuery(
    trpc.booking.listBySeller.queryOptions(queryInput),
  );

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Daftar Booking</h1>
          <p className="text-muted-foreground">
            Semua booking untuk layanan Anda
          </p>
        </div>
        <Select
          value={statusFilter}
          onValueChange={(val) => setStatusFilter(val as BookingStatus | "ALL")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Semua Status</SelectItem>
            <SelectItem value="PAID">Terbayar</SelectItem>
            <SelectItem value="PENDING">Menunggu</SelectItem>
            <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
            <SelectItem value="EXPIRED">Kadaluarsa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">
            {bookings ? `${bookings.length} Booking` : "Memuat..."}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded bg-muted" />
              ))}
            </div>
          ) : bookings && bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pelanggan</TableHead>
                    <TableHead>Layanan</TableHead>
                    <TableHead>Jadwal</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{booking.buyerName}</div>
                          <div className="text-xs text-muted-foreground">
                            {booking.buyerEmail}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{booking.service.name}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {format(
                              new Date(booking.startTime),
                              "dd MMM yyyy",
                              {
                                locale: localeId,
                              },
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(booking.startTime), "HH:mm")} -{" "}
                            {format(new Date(booking.endTime), "HH:mm")}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatRupiah(booking.service.price)}
                      </TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">Belum ada booking</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
