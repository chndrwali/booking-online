"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserAvatarProfile } from "@/components/custom/user-avatar-profile";
import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { appToast } from "@/components/custom/app-toast";
import { SingleImageUpload } from "@/components/custom/image-upload";

export default function ProfilePage() {
  const trpc = useTRPC();

  const { data: profile, isLoading } = useQuery(
    trpc.buyer.getProfile.queryOptions(),
  );

  const [name, setName] = useState(profile?.name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [image, setImage] = useState(profile?.image || "");

  // Reset form when profile data loads
  const profileId = profile?.id;
  if (profileId && name === "" && profile?.name) {
    setName(profile.name);
    setPhone(profile.phone || "");
    setImage(profile.image || "");
  }

  const updateProfile = useMutation(
    trpc.buyer.updateProfile.mutationOptions({
      onSuccess: () => {
        appToast.success("Berhasil");
      },
      onError: (error) => {
        appToast.error(error.message || "Gagal");
      },
    }),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({ name, phone, image });
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profil Saya</h1>
        <p className="text-muted-foreground">Kelola informasi profil Anda</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="border-0 shadow-md md:col-span-1">
          <CardContent className="flex flex-col items-center pt-8 pb-6 space-y-4">
            <UserAvatarProfile
              className="h-24 w-24 rounded-full ring-4 ring-primary/10"
              email={profile?.email || ""}
              name={profile?.name || ""}
              imageUrl={profile?.image || ""}
            />
            <div className="text-center">
              <h3 className="font-semibold text-lg">{profile?.name || "—"}</h3>
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="border-0 shadow-md md:col-span-2">
          <CardHeader>
            <CardTitle>Informasi Profil</CardTitle>
            <CardDescription>
              Perbarui nama, nomor telepon, dan foto profil Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={profile?.email || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Email tidak dapat diubah
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Nomor Telepon</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Foto Profil</Label>
                <SingleImageUpload
                  value={image}
                  onChange={(url) => setImage(url)}
                  onRemove={() => setImage("")}
                />
              </div>

              <Button
                type="submit"
                disabled={updateProfile.isPending}
                className="gap-2"
              >
                {updateProfile.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Simpan Perubahan
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
