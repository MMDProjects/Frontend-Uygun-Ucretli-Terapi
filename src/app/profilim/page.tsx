"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Phone, Shield, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/lib/stores/auth-store";
import { getMyProfile, updateMyProfile, type UserProfile } from "@/lib/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  firstName: z.string().min(2, "Ad en az 2 karakter olmalıdır."),
  lastName: z.string().min(2, "Soyad en az 2 karakter olmalıdır."),
  phone: z.string().regex(/^[0-9]{10,11}$/, "Geçerli bir telefon numarası girin.").or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

export default function ProfilimPage() {
  const { isAuthenticated, displayName, setSession } = useAuthStore();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } =
    useForm<FormValues>({ resolver: zodResolver(schema) });

  function loadProfile() {
    setLoadError(null);
    getMyProfile()
      .then((data) => {
        setProfile(data);
        reset({ firstName: data.firstName, lastName: data.lastName, phone: data.phone ?? "" });
      })
      .catch((e: unknown) => {
        setLoadError(e instanceof Error ? e.message : "Profil bilgileri yüklenemedi.");
      });
  }

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/giris?redirect=/profilim");
      return;
    }
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, router, reset]);

  if (!isAuthenticated) return null;

  async function onSubmit(values: FormValues) {
    try {
      const updated = await updateMyProfile(values);
      setProfile(updated);
      reset({ firstName: updated.firstName, lastName: updated.lastName, phone: updated.phone ?? "" });
      // Auth store display name güncelle
      setSession({
        userId: updated.id,
        displayName: `${updated.firstName} ${updated.lastName}`.trim(),
        email: updated.email,
        role: updated.role.toLowerCase() as "danisan" | "uzman" | "admin",
      });
      toast.success("Profiliniz güncellendi.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Güncelleme başarısız.");
    }
  }

  const initials = displayName?.charAt(0)?.toUpperCase() ?? "K";

  return (
    <>
      <section className="border-b border-border/70 bg-[#cce1de] pt-[calc(var(--site-header-height)+2rem)] pb-8">
        <div className="page-shell">
          <div className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white shadow-md">
              {initials}
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-semibold tracking-tight text-primary-hover sm:text-4xl">
                {displayName ?? "Danışan"}
              </h1>
              <p className="text-sm text-muted-foreground">{profile?.email ?? ""}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#e6f0ee] py-10">
        <div className="page-shell grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="space-y-5">
            {loadError ? (
              <div className="surface-card !rounded-[2rem] p-6 flex flex-col items-center gap-3 text-center text-sm text-muted-foreground">
                <p>{loadError}</p>
                <button
                  type="button"
                  onClick={loadProfile}
                  className="rounded-xl border border-border bg-white px-4 py-1.5 text-sm font-semibold text-foreground transition hover:bg-muted"
                >
                  Tekrar Dene
                </button>
              </div>
            ) : !profile ? (
              <div className="surface-card !rounded-[2rem] p-6 flex items-center justify-center">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="surface-card !rounded-[2rem] p-6">
                <h2 className="mb-5 text-base font-bold text-primary-hover">Kişisel Bilgiler</h2>
                <form className="space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="firstName">Ad <span className="text-destructive">*</span></Label>
                      <Input id="firstName" className="h-10 rounded-xl" {...register("firstName")} />
                      {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="lastName">Soyad <span className="text-destructive">*</span></Label>
                      <Input id="lastName" className="h-10 rounded-xl" {...register("lastName")} />
                      {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>E-posta</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input value={profile.email} disabled className="h-10 rounded-xl pl-9 bg-muted cursor-not-allowed" />
                    </div>
                    <p className="text-xs text-muted-foreground">E-posta adresi değiştirilemez.</p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Telefon</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="phone" type="tel" placeholder="05XXXXXXXXX" className="h-10 rounded-xl pl-9" {...register("phone")} />
                    </div>
                    {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting || !isDirty}>
                      {isSubmitting ? (
                        <><Loader2 className="mr-2 size-4 animate-spin" />Kaydediliyor…</>
                      ) : "Değişiklikleri Kaydet"}
                    </Button>
                  </div>
                </form>
              </div>
            )}

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

          <div className="space-y-4">
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
