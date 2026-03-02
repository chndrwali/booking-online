import { Suspense } from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Clock, Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/utils";

export const metadata = {
  title: "Layanan",
  description: "Daftar layanan yang tersedia di Jantra",
};

async function ServiceList() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    include: {
      seller: { select: { name: true, image: true } },
    },
  });

  if (services.length === 0) {
    return (
      <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
        <p className="text-muted-foreground text-lg">
          Belum ada layanan tersedia saat ini.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <Link key={service.id} href={`/services/${service.id}`}>
          <Card className="group overflow-hidden border-border/50 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 cursor-pointer h-full bg-background/50 backdrop-blur-sm">
            {service.image ? (
              <div className="aspect-video w-full overflow-hidden bg-gradient-to-br from-violet-500/10 to-indigo-500/10 relative">
                <img
                  src={service.image}
                  alt={service.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
            ) : (
              <div className="aspect-video w-full bg-gradient-to-br from-violet-500/5 to-indigo-500/5 flex items-center justify-center relative overflow-hidden">
                <Calendar className="h-12 w-12 text-violet-500/30 transition-transform duration-500 group-hover:scale-110 group-hover:text-violet-500/50" />
              </div>
            )}
            <CardHeader className="pb-3 pt-5">
              <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-1">
                {service.name}
              </CardTitle>
              {service.seller.name && (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary/50" />
                  {service.seller.name}
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {service.description ? (
                <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                  {service.description}
                </p>
              ) : (
                <div className="min-h-[40px]" />
              )}
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <Badge
                  variant="secondary"
                  className="gap-1 bg-secondary/50 font-medium h-7"
                >
                  <Clock className="h-3 w-3" />
                  {service.duration} mnt
                </Badge>
                <span className="font-bold text-lg bg-linear-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  {formatRupiah(service.price)}
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm text-primary font-medium pt-2 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                Pesan Sekarang
                <ArrowRight className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <Badge
            variant="outline"
            className="mb-4 text-violet-600 border-violet-200 bg-violet-50 dark:bg-violet-500/10 dark:border-violet-500/20 dark:text-violet-400"
          >
            Eksplorasi Katalog
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Layanan <span className="text-primary">Tersedia</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Temukan dan pesan layanan terbaik dari para profesional terpercaya
            kami. Jadwal pasti, tanpa drama.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card
                  key={i}
                  className="animate-pulse border-border/50 shadow-sm"
                >
                  <div className="aspect-video bg-muted/50" />
                  <CardHeader className="space-y-2">
                    <div className="h-5 w-2/3 rounded bg-muted/70" />
                    <div className="h-4 w-1/3 rounded bg-muted/50" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="h-4 w-full rounded bg-muted/40" />
                      <div className="h-4 w-4/5 rounded bg-muted/40" />
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <div className="h-6 w-20 rounded-full bg-muted/50" />
                      <div className="h-6 w-24 rounded bg-muted/60" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          }
        >
          <ServiceList />
        </Suspense>
      </div>
    </div>
  );
}
