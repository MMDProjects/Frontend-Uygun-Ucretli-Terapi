"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, LogIn, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/lib/stores/auth-store";

type RequestFormProps = {
  expertName: string;
  expertSlug: string;
};

export function RequestForm({ expertName, expertSlug }: RequestFormProps) {
  const { isAuthenticated, displayName } = useAuthStore();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="surface-card overflow-hidden p-0">
        <div className="bg-muted px-5 py-4">
          <p className="text-sm font-semibold text-primary-hover">Talep Gönder</p>
        </div>
        <div className="flex flex-col items-center gap-4 px-5 py-8 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted">
            <LogIn className="size-6 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Giriş yapmanız gerekiyor</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {expertName} ile görüşme talebinde bulunmak için hesabınıza giriş yapın.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2">
            <Button asChild className="w-full">
              <Link href={`/giris?redirect=/uzmanlar/${expertSlug}`}>Giriş Yap</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/kayit">Ücretsiz Kayıt Ol</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="surface-card flex flex-col items-center gap-4 px-5 py-10 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle className="size-7 text-primary" />
        </div>
        <div>
          <p className="font-bold text-foreground">Talebiniz Alındı</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {expertName} ile görüşme talebiniz iletildi.{" "}
            <Link href="/taleplerim" className="font-semibold text-primary hover:underline">
              Taleplerim
            </Link>{" "}
            sayfasından durumu takip edebilirsiniz.
          </p>
        </div>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  }

  return (
    <div className="surface-card overflow-hidden p-0">
      <div className="bg-muted px-5 py-4">
        <p className="text-sm font-semibold text-primary-hover">Talep Gönder</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {expertName} ile görüşme talep ediyorsunuz
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 px-5 pb-5 pt-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="req-name" className="text-sm font-medium">
            Ad Soyad <span className="text-destructive">*</span>
          </Label>
          <Input
            id="req-name"
            defaultValue={displayName ?? ""}
            placeholder="Adınız Soyadınız"
            className="h-10 rounded-xl"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="req-email" className="text-sm font-medium">
            E-posta <span className="text-destructive">*</span>
          </Label>
          <Input
            id="req-email"
            type="email"
            placeholder="ornek@email.com"
            className="h-10 rounded-xl"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="req-message" className="text-sm font-medium">
            Mesajınız <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="req-message"
            placeholder="Destek almak istediğiniz konuyu kısaca açıklayın…"
            className="min-h-[100px] resize-none rounded-xl"
            required
          />
        </div>

        {/* KVKK onayı — tüm public formlarda zorunlu */}
        <label className="flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            required
            className="mt-0.5 size-4 shrink-0 cursor-pointer accent-primary"
          />
          <span className="text-xs leading-relaxed text-muted-foreground">
            <Link href="/kvkk" className="font-medium text-primary hover:underline">
              KVKK Aydınlatma Metni
            </Link>
            &apos;ni okudum, kişisel verilerimin işlenmesine onay veriyorum.{" "}
            <span className="text-destructive">*</span>
          </span>
        </label>

        <Button type="submit" className="w-full gap-2" disabled={loading}>
          {loading ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Gönderiliyor…
            </>
          ) : (
            <>
              <Send className="size-4" />
              Talep Gönder
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
