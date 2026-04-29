"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/lib/stores/auth-store";
import { siteConfig } from "@/lib/constants/site";
import Image from "next/image";

export default function UzmanGirisPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setSession } = useAuthStore();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setSession({ isAuthenticated: true, displayName: "Dr. Ayşe Kaya", role: "uzman" });
    router.push("/uzman/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-5 py-12">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src={siteConfig.brandLogoUrl}
              alt="Logo"
              width={40}
              height={40}
              className="size-10 rounded-full object-cover"
            />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">Uzman Girişi</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Uzman panelinize erişin
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-white p-8 shadow-sm">
          <form className="space-y-5" noValidate onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                E-posta <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="doktor@email.com"
                autoComplete="email"
                className="h-11 rounded-2xl"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Şifre <span className="text-destructive">*</span>
                </Label>
                <Link
                  href="/sifre-sifirla"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Şifremi unuttum
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="h-11 rounded-2xl pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Giriş yapılıyor…
                </>
              ) : (
                "Giriş Yap"
              )}
            </Button>
          </form>
        </div>

        <div className="mt-6 space-y-3 text-center">
          <p className="text-sm text-muted-foreground">
            Uzman hesabınız yok mu?{" "}
            <Link href="/uzman-basvurusu" className="font-semibold text-primary hover:underline">
              Başvurun
            </Link>
          </p>
          <p className="text-xs text-muted-foreground">
            Danışan olarak giriş yapmak mı istiyorsunuz?{" "}
            <Link href="/giris" className="font-medium text-primary hover:underline">
              Danışan Girişi
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
