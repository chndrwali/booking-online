import Link from "next/link";
import { Lock, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const steps = [
    {
      step: "1",
      title: "Pilih Layanan & Jadwal",
      desc: "Eksplorasi layanan terbaik dari profesional kami dan pilih waktu yang paling pas untuk Anda.",
    },
    {
      step: "2",
      title: "Bayar DP dengan Aman",
      desc: "Lakukan pembayaran Down Payment (DP) dengan aman melalui sistem yang terintegrasi.",
    },
    {
      step: "3",
      title: "Slot Langsung Terkunci",
      desc: "Jadwal Anda langsung terkonfirmasi otomatis dan tidak bisa diambil alih orang lain.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36 lg:pb-40 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 bg-[url('/footer.svg')] opacity-5 dark:opacity-[0.02] mix-blend-overlay pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/5 px-4 py-2 text-sm font-medium text-violet-600 dark:text-violet-400 backdrop-blur-md shadow-sm">
              <Lock className="h-4 w-4" />
              <span>Sistem Booking Anti-Ghosting Pertama</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
              Ubah Janji Menjadi{" "}
              <span className="bg-linear-to-r from-violet-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent relative isolate">
                Kepastian
              </span>
            </h1>

            <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Pilih jadwal profesional favoritmu, bayar DP, dan slot langsung
              terkunci. Bebaskan dirimu dari drama antri dan pembatalan sepihak.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Button
                size="lg"
                className="h-14 px-8 text-base rounded-full shadow-[0_0_40px_-10px_rgba(124,58,237,0.5)] hover:shadow-[0_0_60px_-15px_rgba(124,58,237,0.7)] transition-all duration-300 w-full sm:w-auto"
                asChild
              >
                <Link href="/services">
                  Eksplorasi Layanan
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-base rounded-full border-border hover:bg-muted w-full sm:w-auto"
                asChild
              >
                <Link href="/about">Pelajari Lebih Lanjut</Link>
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 pt-12 text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                Pembayaran Aman
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                Konfirmasi Instan
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-24 bg-muted/30 border-y border-border/50 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Semudah 1-2-3
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Proses pemesanan yang transparan dan aman, dirancang khusus untuk
              memberikan ketenangan pikiran bagi Anda.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-[45px] left-[15%] right-[15%] h-[2px] bg-linear-to-r from-violet-500/10 via-indigo-500/20 to-violet-500/10" />

            {steps.map((item, index) => (
              <div
                key={item.step}
                className="relative group text-center space-y-6"
              >
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-background border border-border/50 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-2 relative z-10">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-linear-to-br from-violet-600 to-indigo-600 text-white font-bold text-2xl shadow-inner">
                    {item.step}
                  </div>
                </div>
                <div className="space-y-3 px-4">
                  <h3 className="font-semibold text-xl">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-violet-600/5 dark:bg-violet-600/10" />
        <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Siap untuk jadwal yang{" "}
            <span className="text-primary border-b-2 border-primary/30 pb-1">
              pasti
            </span>
            ?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Bergabunglah dengan ribuan pengguna lain yang telah membuktikan
            keandalan sistem booking Jantra.
          </p>
          <div className="pt-8">
            <Button
              size="lg"
              className="h-14 px-10 text-lg rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
              asChild
            >
              <Link href="/services">Mulai Booking Sekarang</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
