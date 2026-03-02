import { Suspense } from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Lock, ArrowRight, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/utils";

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
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          Belum ada layanan tersedia
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <Link key={service.id} href={`/services/${service.id}`}>
          <Card className="group overflow-hidden border-0 shadow-md transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer h-full">
            {service.image ? (
              <div className="aspect-video w-full overflow-hidden bg-gradient-to-br from-violet-500/10 to-indigo-500/10">
                <img
                  src={service.image}
                  alt={service.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            ) : (
              <div className="aspect-video w-full bg-gradient-to-br from-violet-500/10 to-indigo-500/10 flex items-center justify-center">
                <Calendar className="h-12 w-12 text-violet-500/40" />
              </div>
            )}
            <CardHeader className="pb-2">
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {service.name}
              </CardTitle>
              {service.seller.name && (
                <p className="text-sm text-muted-foreground">
                  oleh {service.seller.name}
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {service.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {service.description}
                </p>
              )}
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="gap-1">
                  <Clock className="h-3 w-3" />
                  {service.duration} menit
                </Badge>
                <span className="font-bold text-lg bg-linear-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  {formatRupiah(service.price)}
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm text-primary font-medium pt-1">
                Booking Sekarang
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-indigo-500/5" />
        <div className="container mx-auto px-4 py-20 md:py-28 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-2 text-sm backdrop-blur">
              <Lock className="h-4 w-4 text-violet-500" />
              <span>Slot terkunci setelah bayar DP</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Booking{" "}
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Tanpa Ghosting
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Pilih jadwal, bayar DP, dan slot langsung terkunci. Tidak ada lagi
              pelanggan yang tidak datang.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button size="lg" className="gap-2" asChild>
                <a href="#services">
                  Lihat Layanan
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Login Seller</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">Cara Kerja</h2>
        <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
          {[
            {
              step: "1",
              title: "Pilih Layanan & Jadwal",
              desc: "Pilih layanan dan slot waktu yang tersedia",
            },
            {
              step: "2",
              title: "Bayar DP",
              desc: "Lakukan pembayaran DP untuk mengunci jadwal Anda",
            },
            {
              step: "3",
              title: "Slot Terkunci",
              desc: "Jadwal Anda terkonfirmasi dan tidak bisa diambil orang lain",
            },
          ].map((item) => (
            <div key={item.step} className="text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-bold text-lg">
                {item.step}
              </div>
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold">Layanan Tersedia</h2>
          <p className="text-muted-foreground mt-2">
            Pilih layanan dan mulai booking sekarang
          </p>
        </div>
        <Suspense
          fallback={
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse border-0 shadow-md">
                  <div className="aspect-video bg-muted" />
                  <CardHeader>
                    <div className="h-5 w-32 rounded bg-muted" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 w-24 rounded bg-muted" />
                  </CardContent>
                </Card>
              ))}
            </div>
          }
        >
          <ServiceList />
        </Suspense>
      </section>
    </div>
  );
}
