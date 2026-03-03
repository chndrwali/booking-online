"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { updateUser } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import {
  MultiStepFormProvider,
  StepContent,
  StepIndicator,
  StepNavigation,
  type StepConfig,
} from "@/modules/auth/ui/component/multi-step-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, ShoppingBag, Sparkles, Phone, Store } from "lucide-react";
import { appToast } from "@/components/custom/app-toast";
import { AvatarImageUpload } from "@/components/custom/avatar-image-upload";

const steps: StepConfig[] = [
  { id: "welcome", title: "Kenalan" },
  { id: "role", title: "Peran" },
  { id: "profile", title: "Profil" },
];

interface OnboardingFormData {
  name: string;
  role: "seller" | "buyer" | "";
  phone: string;
  image: string;
}

export function OnboardingForm({ initialName }: { initialName?: string }) {
  const router = useRouter();
  const trpc = useTRPC();

  const [formData, setFormData] = useState<OnboardingFormData>({
    name: initialName || "",
    role: "",
    phone: "",
    image: "",
  });

  const completeMutation = useMutation(
    trpc.onboarding.complete.mutationOptions({
      onSuccess: async (_, variables) => {
        // Force session cookie refresh by updating the user name via Better Auth
        await updateUser({
          name: variables.name,
          image: variables.image || undefined,
        });
        appToast.success("Selamat datang di Jantra! 🎉");
        router.push("/onboarding/redirect");
      },
      onError: (error) => {
        appToast.error(error.message);
      },
    }),
  );

  const handleComplete = () => {
    if (!formData.name || !formData.role) {
      appToast.error("Lengkapi semua data yang diperlukan");
      return;
    }
    completeMutation.mutate({
      name: formData.name,
      role: formData.role as "seller" | "buyer",
      phone: formData.phone || "",
      image: formData.image || "",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-0 shadow-xl">
        <CardHeader className="space-y-4 pb-2">
          {/* Logo */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <Image
                src="/logo/logo.png"
                alt="Jantra Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
              <span className="text-xl font-bold tracking-tight text-foreground/90">
                Jantra
              </span>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex justify-center">
            <MultiStepFormProvider steps={steps} onComplete={handleComplete}>
              <div className="w-full space-y-6">
                <StepIndicator steps={steps} className="justify-center" />

                <CardContent className="px-0 pb-0">
                  {/* Step 1: Welcome + Name */}
                  <StepContent stepIndex={0}>
                    <div className="space-y-6">
                      <div className="text-center space-y-2">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-violet-500/10 to-indigo-500/10">
                          <Sparkles className="h-7 w-7 text-violet-500" />
                        </div>
                        <h2 className="text-2xl font-bold">
                          Selamat datang! 👋
                        </h2>
                        <p className="text-muted-foreground">
                          Kenalan yuk biar kami bisa bantu lebih baik
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="flex items-center gap-2"
                        >
                          <User className="h-4 w-4" />
                          Siapa nama kamu?
                        </Label>
                        <Input
                          id="name"
                          placeholder="Masukkan nama lengkap"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          className="h-12 text-base"
                          autoFocus
                        />
                      </div>
                    </div>
                  </StepContent>

                  {/* Step 2: Role Selection */}
                  <StepContent stepIndex={1}>
                    <div className="space-y-6">
                      <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold">
                          Kamu mau ngapain? 🤔
                        </h2>
                        <p className="text-muted-foreground">
                          Pilih peran yang sesuai dengan kebutuhanmu
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, role: "buyer" }))
                          }
                          className={`group flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all hover:shadow-md ${
                            formData.role === "buyer"
                              ? "border-violet-500 bg-violet-500/5 shadow-md"
                              : "border-muted hover:border-violet-500/50"
                          }`}
                        >
                          <div
                            className={`rounded-full p-3 transition-colors ${
                              formData.role === "buyer"
                                ? "bg-violet-500 text-white"
                                : "bg-muted text-muted-foreground group-hover:bg-violet-500/10 group-hover:text-violet-500"
                            }`}
                          >
                            <ShoppingBag className="h-6 w-6" />
                          </div>
                          <div className="text-center">
                            <p className="font-semibold">Pembeli</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Booking layanan & jasa
                            </p>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, role: "seller" }))
                          }
                          className={`group flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all hover:shadow-md ${
                            formData.role === "seller"
                              ? "border-violet-500 bg-violet-500/5 shadow-md"
                              : "border-muted hover:border-violet-500/50"
                          }`}
                        >
                          <div
                            className={`rounded-full p-3 transition-colors ${
                              formData.role === "seller"
                                ? "bg-violet-500 text-white"
                                : "bg-muted text-muted-foreground group-hover:bg-violet-500/10 group-hover:text-violet-500"
                            }`}
                          >
                            <Store className="h-6 w-6" />
                          </div>
                          <div className="text-center">
                            <p className="font-semibold">Penjual</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Tawarkan jasa & layanan
                            </p>
                          </div>
                        </button>
                      </div>
                    </div>
                  </StepContent>

                  {/* Step 3: Additional Profile Info */}
                  <StepContent stepIndex={2}>
                    <div className="space-y-6">
                      <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold">Sedikit lagi! 🚀</h2>
                        <p className="text-muted-foreground">
                          Lengkapi profilmu biar makin keren
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="phone"
                            className="flex items-center gap-2"
                          >
                            <Phone className="h-4 w-4" />
                            Nomor Telepon
                          </Label>
                          <Input
                            id="phone"
                            placeholder="0812xxxxxxxx"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }
                            className="h-12"
                          />
                          <p className="text-xs text-muted-foreground">
                            Opsional — untuk konfirmasi booking
                          </p>
                        </div>

                        <div className="space-y-4">
                          <Label className="flex items-center gap-2">
                            Foto Profil
                          </Label>
                          <AvatarImageUpload
                            value={formData.image}
                            onChange={(url) =>
                              setFormData((prev) => ({ ...prev, image: url }))
                            }
                            onRemove={() =>
                              setFormData((prev) => ({ ...prev, image: "" }))
                            }
                            name={formData.name}
                          />
                          <p className="text-xs text-center text-muted-foreground">
                            Opsional — bisa ditambahkan nanti
                          </p>
                        </div>
                      </div>
                    </div>
                  </StepContent>

                  <StepNavigation
                    onSubmit={handleComplete}
                    isSubmitting={completeMutation.isPending}
                    submitLabel="Mulai Sekarang"
                  />
                </CardContent>
              </div>
            </MultiStepFormProvider>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
