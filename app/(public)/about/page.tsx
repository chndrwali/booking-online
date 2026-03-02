import { ShieldCheck, Clock, Users, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  GsapPageTransition,
  GsapReveal,
} from "@/components/custom/gsap-animator";

export const metadata = {
  title: "Tentang Kami",
  description: "Mengenal lebih dekat Jantra dan visi kami",
};

export default function AboutPage() {
  const features = [
    {
      icon: ShieldCheck,
      title: "Transaksi Aman",
      description:
        "Pembayaran DP terjamin keamanannya menggunakan sistem payment gateway terpercaya.",
    },
    {
      icon: Clock,
      title: "Jadwal Pasti",
      description:
        "Slot waktu yang Anda pesan akan langsung terkunci dan tidak dapat diambil orang lain.",
    },
    {
      icon: Users,
      title: "Profesional Terverifikasi",
      description:
        "Hanya penyedia jasa yang telah terverifikasi yang dapat menawarkan layanannya.",
    },
    {
      icon: Zap,
      title: "Proses Cepat",
      description:
        "Booking bisa dilakukan dalam hitungan menit tanpa harus antri atau menunggu balasan pesan.",
    },
  ];

  return (
    <GsapPageTransition className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Intro Section */}
        <GsapReveal direction="up" className="text-center space-y-6 mb-24">
          <Badge
            variant="outline"
            className="mb-4 text-indigo-600 border-indigo-200 bg-indigo-50 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-400"
          >
            Cerita Kami
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Dari Janji Menjadi{" "}
            <span className="bg-linear-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Kepastian
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Berawal dari keresahan akan budaya &quot;ghosting&quot; dalam dunia
            jasa digital dan konvensional, Jantra hadir untuk memberikan garansi
            kepastian bagi kedua belah pihak.
          </p>
        </GsapReveal>

        {/* Mission Section */}
        <GsapReveal
          direction="up"
          className="grid md:grid-cols-2 gap-12 items-center mb-24"
        >
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Misi Kami</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Kami membangun ekosistem di mana kepercayaan dibangun melalui
                sistem, bukan sekadar janji manis. Dengan memberlakukan sistem
                Down Payment (DP), kami menyaring pelanggan yang benar-benar
                serius.
              </p>
              <p>
                Bagi penyedia layanan, ini berarti efisiensi waktu dan energi
                tanpa harus menghadapi pembatalan sepihak di menit-menit
                terakhir. Bagi pelanggan, ini adalah jaminan bahwa waktu yang
                telah mereka amankan akan dihormati.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square md:aspect-auto md:h-[400px] w-full bg-linear-to-br from-violet-500/10 to-indigo-500/10 rounded-3xl overflow-hidden relative shadow-lg border border-border/50">
              <div className="absolute inset-0 bg-[url('/footer.svg')] opacity-20 dark:opacity-10 mix-blend-overlay" />
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="text-center space-y-4 bg-background/80 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-border/50">
                  <ShieldCheck className="w-12 h-12 text-primary mx-auto" />
                  <p className="font-medium text-lg">
                    &quot;Menciptakan lingkungan profesional yang bebas dari
                    risiko ketidakpastian.&quot;
                  </p>
                </div>
              </div>
            </div>
            {/* Decorative blobs */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl -z-10" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-violet-500/20 rounded-full blur-2xl -z-10" />
          </div>
        </GsapReveal>

        {/* Values Section */}
        <GsapReveal direction="up" className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Kenapa Memilih Jantra?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Kami mengutamakan kualitas, keamanan, dan kepastian dalam setiap
              interaksi antara penyedia jasa dan pelanggan.
            </p>
          </div>

          <GsapReveal
            stagger={0.2}
            direction="up"
            className="grid sm:grid-cols-2 gap-6"
          >
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-border/50 bg-background hover:bg-muted/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-primary">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </GsapReveal>
        </GsapReveal>
      </div>
    </GsapPageTransition>
  );
}
