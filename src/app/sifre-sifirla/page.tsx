"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api";

// ─── Schemas ────────────────────────────────────────────────────────────────

const forgotSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi girin."),
});

const resetSchema = z.object({
  newPassword: z.string().min(8, "Şifre en az 8 karakter olmalıdır."),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Şifreler eşleşmiyor.",
  path: ["confirmPassword"],
});

type ForgotValues = z.infer<typeof forgotSchema>;
type ResetValues = z.infer<typeof resetSchema>;

// ─── Forgot Password Form ────────────────────────────────────────────────────

function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<ForgotValues>({ resolver: zodResolver(forgotSchema) });

  async function onSubmit(values: ForgotValues) {
    try {
      await apiFetch("/auth/forgot-password", {
        method: "POST",
        body: { email: values.email },
      });
      setSent(true);
    } catch {
      // Güvenlik gereği hata da gösterme — generic mesaj yeterli
      setSent(true);
    }
  }

  if (sent) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
          ✉️
        </div>
        <h2 className="text-lg font-semibold text-foreground">E-posta Gönderildi</h2>
        <p className="text-sm text-muted-foreground">
          Eğer bu e-posta adresine kayıtlı bir hesap varsa, şifre sıfırlama bağlantısı gönderildi.
          Gelen kutunuzu kontrol edin (spam klasörünü de).
        </p>
        <Button variant="outline" asChild className="mt-2">
          <Link href="/giris">Giriş Sayfasına Dön</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="email">E-posta Adresi</Label>
        <Input
          id="email"
          type="email"
          placeholder="ornek@mail.com"
          className="h-11 rounded-xl"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
        {isSubmitting ? "Gönderiliyor…" : "Sıfırlama Bağlantısı Gönder"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/giris" className="font-medium text-primary hover:underline">
          ← Giriş sayfasına dön
        </Link>
      </p>
    </form>
  );
}

// ─── Reset Password Form ──────────────────────────────────────────────────────

function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [done, setDone] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<ResetValues>({ resolver: zodResolver(resetSchema) });

  async function onSubmit(values: ResetValues) {
    try {
      await apiFetch("/auth/reset-password", {
        method: "POST",
        body: { token, newPassword: values.newPassword },
      });
      setDone(true);
      toast.success("Şifreniz güncellendi!");
      setTimeout(() => router.push("/giris"), 2000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "İşlem başarısız.";
      toast.error(msg);
    }
  }

  if (done) {
    return (
      <div className="space-y-3 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-2xl">✅</div>
        <p className="font-semibold text-foreground">Şifreniz güncellendi!</p>
        <p className="text-sm text-muted-foreground">Giriş sayfasına yönlendiriliyorsunuz…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="newPassword">Yeni Şifre</Label>
        <Input
          id="newPassword"
          type="password"
          placeholder="En az 8 karakter"
          className="h-11 rounded-xl"
          {...register("newPassword")}
        />
        {errors.newPassword && (
          <p className="text-xs text-destructive">{errors.newPassword.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Şifrenizi tekrar girin"
          className="h-11 rounded-xl"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
        {isSubmitting ? "Kaydediliyor…" : "Şifremi Güncelle"}
      </Button>
    </form>
  );
}

// ─── Inner (reads useSearchParams) ───────────────────────────────────────────

function SifreSifirlaInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return (
    <div className="rounded-3xl border border-border bg-white p-8 shadow-sm">
      <div className="mb-7 space-y-1.5">
        <h1 className="text-2xl font-bold text-foreground">
          {token ? "Yeni Şifre Belirle" : "Şifremi Unuttum"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {token
            ? "Hesabınız için yeni bir şifre belirleyin."
            : "Kayıtlı e-posta adresinize sıfırlama bağlantısı göndereceğiz."}
        </p>
      </div>

      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <ForgotPasswordForm />
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SifreSifirlaPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-5 py-12">
      <div className="w-full max-w-md">
        <Suspense
          fallback={
            <div className="rounded-3xl border border-border bg-white p-8 shadow-sm">
              <div className="h-8 w-48 animate-pulse rounded bg-muted" />
              <div className="mt-3 h-4 w-72 animate-pulse rounded bg-muted" />
              <div className="mt-8 space-y-4">
                <div className="h-11 animate-pulse rounded-xl bg-muted" />
                <div className="h-11 animate-pulse rounded-xl bg-muted" />
              </div>
            </div>
          }
        >
          <SifreSifirlaInner />
        </Suspense>
      </div>
    </main>
  );
}
