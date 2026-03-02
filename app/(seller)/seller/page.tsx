"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarCheck,
  Clock,
  DollarSign,
  TrendingUp,
  XCircle,
} from "lucide-react";

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function SellerDashboardPage() {
  const trpc = useTRPC();
  const { data: stats, isLoading } = useQuery(
    trpc.booking.stats.queryOptions(),
  );

  const cards = [
    {
      title: "Total Booking",
      value: stats?.total ?? 0,
      icon: TrendingUp,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Booking Terbayar",
      value: stats?.paid ?? 0,
      icon: CalendarCheck,
      gradient: "from-emerald-500 to-green-500",
    },
    {
      title: "Menunggu Bayar",
      value: stats?.pending ?? 0,
      icon: Clock,
      gradient: "from-amber-500 to-orange-500",
    },
    {
      title: "Dibatalkan",
      value: stats?.cancelled ?? 0,
      icon: XCircle,
      gradient: "from-rose-500 to-red-500",
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Ringkasan booking dan pendapatan Anda
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title} className="overflow-hidden border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div
                className={`rounded-lg bg-gradient-to-br ${card.gradient} p-2`}
              >
                <card.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 w-24 animate-pulse rounded bg-muted" />
              ) : (
                <div className="text-2xl font-bold">{card.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Card */}
      <Card className="border-0 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Pendapatan
          </CardTitle>
          <div className="rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 p-2">
            <DollarSign className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-8 w-40 animate-pulse rounded bg-muted" />
          ) : (
            <div className="text-3xl font-bold">
              {formatRupiah(stats?.revenue ?? 0)}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
