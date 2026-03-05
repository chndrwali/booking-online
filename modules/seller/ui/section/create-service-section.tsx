"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { appToast } from "@/components/custom/app-toast";
import { AddServiceForm } from "@/modules/seller/ui/form/add-service-form";

export const CreateServiceSection = () => {
  const trpc = useTRPC();
  const router = useRouter();

  const createMutation = useMutation(
    trpc.service.create.mutationOptions({
      onSuccess: () => {
        appToast.success("Layanan berhasil dibuat!");
        router.push("/seller/services");
      },
      onError: (error) => {
        appToast.error(error.message);
      },
    }),
  );

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/seller/services">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Buat Layanan Baru
          </h1>
          <p className="text-muted-foreground">
            Isi detail layanan yang Anda tawarkan
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Detail Layanan</CardTitle>
          <CardDescription>
            Informasi ini akan ditampilkan di halaman publik
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddServiceForm onSubmit={(data) => createMutation.mutate(data)} />
        </CardContent>
      </Card>
    </div>
  );
};
