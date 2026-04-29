"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Phone, Shield, Bell } from "lucide-react";

import { useAuthStore } from "@/lib/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilimPage() {
  const { isAuthenticated, displayName } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/giris?redirect=/profilim");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <>
      <section className="border-b border-border/70 bg-[#cce1de] pt-[calc(var(--site-header-height)+2rem)] pb-8">
        <div className="page-shell">
          <div className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white shadow-md">
              {displayName?.charAt(0) ?? "K"}
            </div>
            <div className="space-y-3">
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-primary-hover sm:text-5xl">
                {displayName ?? "Danışan"}
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-8">Danışan Hesabı</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#e6f0ee] py-10">
        <div className="page-shell grid gap-6 lg:grid-cols-[1fr_280px]">
          {/* Sol: Form */}
          <div className="space-y-5">
            <div className="surface-card !rounded-[2rem] p-6">
              <h2 className="mb-5 text-base font-bold text-primary-hover">Kişisel Bilgiler</h2>
              <form className="space-y-4" noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="first-name" className="text-sm font-medium">
                      Ad <span className="text-destructive">*</span>
                    </Label>
                    <Input id="first-name" defaultValue="Selin" className="h-10 rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="last-name" className="text-sm font-medium">
                      Soyad <span className="text-destructive">*</span>
                    </Label>
                    <Input id="last-name" defaultValue="Karaca" className="h-10 rounded-xl" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-medium">
                    E-posta
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      defaultValue="selin.karaca@ornek.com"
                      className="h-10 rounded-xl pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Telefon
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+90 5__ ___ __ __"
                      className="h-10 rounded-xl pl-9"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit">Değişiklikleri Kaydet</Button>
                </div>
              </form>
            </div>

            {/* Şifre değiştirme */}
            <div className="surface-card !rounded-[2rem] p-6">
              <h2 className="mb-1 text-base font-bold text-primary-hover">Şifre</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Şifrenizi sıfırlamak için e-posta bağlantısı gönderilebilir.
              </p>
              <Button variant="outline" asChild>
                <Link href="/sifre-sifirla">Şifre Sıfırla</Link>
              </Button>
            </div>
          </div>

          {/* Sağ: Ayarlar */}
          <div className="space-y-4">
            <div className="surface-card !rounded-[2rem] p-5">
              <h2 className="mb-4 text-sm font-bold text-primary-hover">Bildirim Tercihleri</h2>
              <div className="space-y-3">
                {[
                  { label: "Talep güncellemeleri", checked: true },
                  { label: "Test hatırlatmaları", checked: true },
                  { label: "Bülten", checked: false },
                ].map(({ label, checked }) => (
                  <label key={label} className="flex cursor-pointer items-center justify-between gap-2">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <input type="checkbox" defaultChecked={checked} className="size-4 accent-primary" />
                  </label>
                ))}
              </div>
            </div>

            <div className="surface-card !rounded-[2rem] p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary-hover">
                <Shield className="size-4" />
                KVKK
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Kişisel verileriniz KVKK kapsamında işlenmektedir.
              </p>
              <Link href="/kvkk" className="mt-2 block text-xs font-medium text-primary hover:underline">
                Aydınlatma Metnini Oku →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
