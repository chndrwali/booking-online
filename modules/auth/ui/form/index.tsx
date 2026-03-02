"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoginFormValues,
  loginSchema,
  RegisterFormValues,
  registerSchema,
} from "@/lib/form-schema";
import { signIn, signUp } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { PasswordInput } from "@/components/custom/password-input";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { appToast } from "@/components/custom/app-toast";
import Image from "next/image";

type AuthFormProps = {
  variant: "login" | "register";
};

// ────────────────────────────────────────────
// Config per variant
// ────────────────────────────────────────────
const variantConfig = {
  login: {
    title: "MASUK KE AKUN ANDA",
    description: "Masukkan email dan kata sandi Anda untuk mengakses aplikasi",
    submitLabel: "Masuk",
    footerText: "Belum punya akun?",
    footerLinkText: "Daftar sekarang",
    footerLinkHref: "/register",
  },
  register: {
    title: "BUAT AKUN, GRATIS!",
    description: "Masukkan info Anda untuk memulai pendaftaran",
    submitLabel: "Daftar",
    footerText: "Sudah punya akun?",
    footerLinkText: "Masuk di sini",
    footerLinkHref: "/login",
  },
} as const;

// ────────────────────────────────────────────
// AuthForm
// ────────────────────────────────────────────
export const AuthForm = ({ variant }: AuthFormProps) => {
  const isLogin = variant === "login";
  const config = variantConfig[variant];

  const router = useRouter();
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormValues | RegisterFormValues>({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
    defaultValues: {
      email: "",
      password: "",
      ...(isLogin ? {} : { name: "" }),
    },
  });

  const onSubmit = async (values: LoginFormValues | RegisterFormValues) => {
    setError(undefined);

    if (isLogin) {
      const loginValues = values as LoginFormValues;
      await signIn.email(
        {
          email: loginValues.email,
          password: loginValues.password,
          rememberMe: loginValues.remember ?? true,
          callbackURL: "/onboarding",
        },
        {
          onRequest: () => setLoading(true),
          onSuccess: () => {
            setLoading(false);
            appToast.success("Berhasil masuk!");
            router.push("/onboarding");
          },
          onError: (ctx) => {
            setLoading(false);
            setError(ctx.error.message);
            appToast.error(`${ctx.error.message}`);
          },
          onSettled: () => setLoading(false),
        },
      );
    } else {
      const registerValues = values as RegisterFormValues;
      await signUp.email(
        {
          email: registerValues.email,
          password: registerValues.password,
          name: registerValues.name,
          callbackURL: "/login",
        },
        {
          onRequest: () => setLoading(true),
          onSuccess: () => {
            setLoading(false);
            appToast.success("Registrasi berhasil! Silakan masuk.");
            router.push("/login");
          },
          onError: (ctx) => {
            setLoading(false);
            appToast.error(`${ctx.error.message}`);
            setError(ctx.error.message);
          },
          onSettled: () => setLoading(false),
        },
      );
    }
  };

  return (
    <Card className="w-full max-w-lg border-none shadow-none bg-transparent">
      <CardHeader className="items-center text-center">
        <div className="flex flex-col items-center gap-2 mb-2">
          <Image
            src="/logo/logo.png"
            alt="Jantra Logo"
            width={56}
            height={56}
            className="object-contain"
            priority
          />
          <h1 className="text-2xl font-bold tracking-tight">Jantra</h1>
          <p className="text-sm text-muted-foreground italic">
            dari janji menjadi kepastian
          </p>
        </div>
        <CardTitle className="text-xl font-bold pt-4">{config.title}</CardTitle>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name field — register only */}
            {!isLogin && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan nama lengkap"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Email field */}
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

            {/* Password field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kata Sandi</FormLabel>
                  <FormControl>
                    <PasswordInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Masukkan kata sandi anda"
                      required
                      disabled={loading}
                      {...(!isLogin && { showRules: true, showStrength: true })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Remember me + Forgot password — login only */}
            {isLogin && (
              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="remember"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-y-0 space-x-1">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value ?? false}
                          onChange={field.onChange}
                          className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
                          disabled={loading}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal cursor-pointer">
                        Ingat saya
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Lupa kata sandi?
                </Link>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Spinner /> : config.submitLabel}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              {config.footerText}{" "}
              <Link
                href={config.footerLinkHref}
                className="text-primary cursor-pointer hover:underline"
              >
                {config.footerLinkText}
              </Link>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
