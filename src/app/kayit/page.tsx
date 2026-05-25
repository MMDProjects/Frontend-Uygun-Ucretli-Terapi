"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerDanisan } from "@/lib/services/auth.service";
import { subscribeNewsletter } from "@/lib/services/public.service";

const schema = z
  .object({
    firstName: z.string().min(2, "Ad en az 2 karakter olmalıdır."),
    lastName: z.string().min(2, "Soyad en az 2 karakter olmalıdır."),
    phone: z.string().min(10, "Geçerli bir telefon numarası girin."),
    email: z.string().email("Geçerli bir e-posta girin."),
    password: z.string().min(8, "Şifre en az 8 karakter olmalıdır."),
    confirmPassword: z.string(),
    kvkkConsent: z.boolean().refine((v) => v, { message: "KVKK onayı zorunludur." }),
    newsletter: z.boolean().optional(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Şifreler eşleşmiyor.",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { kvkkConsent: false, newsletter: false },
  });

  async function onSubmit(values: FormValues) {
    try {
      await registerDanisan({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        password: values.password,
        kvkkConsent: values.kvkkConsent,
      });
      if (values.newsletter) {
        await subscribeNewsletter(values.email).catch(() => {});
      }
      toast.success("Kayıt başarılı! Hoş geldiniz.");
      router.push("/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Kayıt başarısız.";
      setError("root", { message: msg });
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-5 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-border bg-white p-8 shadow-sm">
          <div className="mb-7 space-y-1.5">
            <h1 className="text-2xl font-bold text-foreground">Kayıt Ol</h1>
            <p className="text-sm text-muted-foreground">
              Birkaç adımda hesap oluşturun, hemen başlayın.
            </p>
          </div>

          <form className="space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  Ad <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Adınız"
                  autoComplete="given-name"
                  className="h-11 rounded-2xl"
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className="text-xs text-destructive">{errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Soyad <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Soyadınız"
                  autoComplete="family-name"
                  className="h-11 rounded-2xl"
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p className="text-xs text-destructive">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Telefon <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="05XX XXX XX XX"
                autoComplete="tel"
                className="h-11 rounded-2xl"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                E-posta <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                autoComplete="email"
                className="h-11 rounded-2xl"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Şifre <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="En az 8 karakter"
                  autoComplete="new-password"
                  className="h-11 rounded-2xl pr-11"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Şifre Tekrar <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Şifrenizi tekrar girin"
                  autoComplete="new-password"
                  className="h-11 rounded-2xl pr-11"
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showConfirm ? "Şifreyi gizle" : "Şifreyi göster"}
                >
                  {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="space-y-2.5 pt-1">
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border p-3.5 transition hover:bg-muted/40">
                <input
                  type="checkbox"
                  className="mt-0.5 size-4 shrink-0 accent-primary"
                  {...register("kvkkConsent")}
                />
                <span className="text-xs leading-relaxed text-muted-foreground">
                  <Link href="/kvkk" className="font-semibold text-primary hover:underline">
                    KVKK aydınlatma metnini
                  </Link>{" "}
                  okudum, kişisel verilerimin işlenmesine onay veriyorum.{" "}
                  <span className="text-destructive">*</span>
                </span>
              </label>
              {errors.kvkkConsent && (
                <p className="text-xs text-destructive">{errors.kvkkConsent.message}</p>
              )}

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border p-3.5 transition hover:bg-muted/40">
                <input
                  type="checkbox"
                  className="mt-0.5 size-4 shrink-0 accent-primary"
                  {...register("newsletter")}
                />
                <span className="text-xs leading-relaxed text-muted-foreground">
                  Kampanya ve blog güncellemelerinden haberdar olmak istiyorum. (opsiyonel)
                </span>
              </label>
            </div>

            {errors.root && (
              <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2.5">
                <AlertCircle className="size-4 shrink-0 text-destructive" />
                <p className="text-xs font-medium text-destructive">{errors.root.message}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Kayıt yapılıyor…
                </>
              ) : (
                "Kayıt Ol"
              )}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Zaten hesabınız var mı?{" "}
          <Link href="/giris" className="font-semibold text-primary hover:underline">
            Giriş yapın
          </Link>
        </p>
      </div>
    </main>
  );
}
