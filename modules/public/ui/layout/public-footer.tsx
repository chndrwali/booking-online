"use client";

import Link from "next/link";
import { ArrowRight, Github, Instagram, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

const socialMedia = [
  {
    id: 1,
    Icon: Github,
    link: "https://github.com/chndrwali", // Replace with actual links if needed
  },
  {
    id: 2,
    Icon: Instagram,
    link: "https://instagram.com/chndrwali",
  },
];

export const PublicFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full pt-20 pb-10 relative overflow-hidden flex flex-col items-center justify-center">
      {/* Subtle Background Glow instead of Grid */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-64 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="flex flex-col items-center relative z-10 w-full max-w-4xl px-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-violet-600 to-indigo-600 text-white shadow-lg">
            <Lock className="h-6 w-6" />
          </div>
        </div>

        <h1 className="font-bold text-3xl md:text-5xl text-center text-foreground leading-tight">
          Pesan jasa dengan{" "}
          <span className="bg-linear-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            pasti
          </span>{" "}
          dan aman.
        </h1>

        <p className="text-muted-foreground md:mt-8 my-5 text-center text-lg max-w-2xl">
          Jantra mengubah janji menjadi kepastian. Bayar DP dengan aman, jadwal
          terkunci, bebas khawatir ghosting.
        </p>

        <div className="mt-4">
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 text-base h-12"
          >
            <Link href="/login">
              Mulai Sekarang <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex mt-20 w-full border-t border-border pt-8 md:flex-row flex-col justify-between items-center relative z-10">
        <div className="flex items-center gap-2 mb-4 md:mb-0 text-muted-foreground">
          <span className="font-bold text-foreground">Jantra</span>
          <span>&copy; {currentYear}. Hak Cipta Dilindungi.</span>
          <span>Made with ❤️ by Candra Wali Sanjaya</span>
        </div>

        <div className="flex items-center gap-4">
          {socialMedia.map((info) => (
            <Link
              key={info.id}
              href={info.link}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="w-10 h-10 flex justify-center items-center rounded-full bg-muted/50 hover:bg-muted border border-border transition-all">
                <info.Icon className="size-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};
