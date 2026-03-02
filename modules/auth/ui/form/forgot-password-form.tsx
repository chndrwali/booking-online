"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { requestPasswordReset } from "@/lib/auth-client";
import {
  ForgotPasswordFormValues,
  forgotPasswordSchema,
} from "@/lib/form-schema";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { appToast } from "@/components/custom/app-toast";
import { CheckCircle2 } from "lucide-react";

export const ForgotPasswordForm = () => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setError(undefined);

    await requestPasswordReset(
      {
        email: values.email,
        redirectTo: "/reset-password",
      },
      {
        onRequest: () => setLoading(true),
        onSuccess: () => {
          setLoading(false);
          setSuccess(true);
          appToast.success("Tautan atur ulang kata sandi terkirim!");
        },
        onError: (ctx) => {
          setLoading(false);
          setError(ctx.error.message);
          appToast.error(`${ctx.error.message}`);
        },
        onSettled: () => setLoading(false),
      },
    );
  };

  if (success) {
    return (
      <Card className="w-full max-w-lg border-none shadow-none bg-transparent">
        <CardContent className="flex flex-col items-center gap-4 pt-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-xl font-bold">Email Terkirim!</CardTitle>
          <CardDescription className="text-base">
            Kami telah mengirimkan tautan untuk mengatur ulang kata sandi ke
            email Anda. Silakan periksa kotak masuk atau folder spam Anda.
          </CardDescription>
          <Button
            variant="outline"
            className="mt-2"
            onClick={() => {
              setSuccess(false);
              form.reset();
            }}
          >
            Kirim Ulang
          </Button>
          <Link href="/login" className="text-sm text-primary hover:underline">
            Kembali ke halaman masuk
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg border-none shadow-none bg-transparent">
      <CardHeader>
        <CardTitle className="text-xl font-bold">LUPA KATA SANDI</CardTitle>
        <CardDescription>
          Masukkan alamat email Anda yang terdaftar dan kami akan mengirimkan
          tautan untuk mengatur ulang kata sandi Anda.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan alamat email anda"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Spinner /> : "Kirim Tautan Atur Ulang"}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              Ingat kata sandi Anda?{" "}
              <Link
                href="/login"
                className="text-primary cursor-pointer hover:underline"
              >
                Kembali untuk masuk
              </Link>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
