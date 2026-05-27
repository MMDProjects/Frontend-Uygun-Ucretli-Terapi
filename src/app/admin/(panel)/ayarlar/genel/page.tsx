"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, Tag, Info } from "lucide-react";
import { PageHeader } from "@/features/admin/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-cookies";

type Settings = {
  id: string;
  standardPrice: string | number;
  discountedPrice: string | number;
};

export default function AyarlarGenelPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [standardPrice, setStandardPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    apiFetch<Settings>("/admin/settings", { token })
      .then((s) => {
        setSettings(s);
        setStandardPrice(String(Number(s.standardPrice)));
        setDiscountedPrice(String(Number(s.discountedPrice)));
      })
      .catch(() => toast.error("Ayarlar yüklenemedi."))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const std = Number(standardPrice);
    const disc = Number(discountedPrice);
    if (!std || !disc || disc >= std) {
      toast.error("İndirimli fiyat standart fiyattan küçük olmalıdır.");
      return;
    }
    setSaving(true);
    try {
      const token = getAccessToken();
      await apiFetch("/admin/settings", {
        method: "PUT",
        token,
        body: { standardPrice: std, discountedPrice: disc },
      });
      toast.success("Ayarlar kaydedildi.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kayıt başarısız.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 skeleton rounded-xl" />
        <div className="h-48 skeleton rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Genel Ayarlar"
        description="Platform genelinde geçerli temel ayarları yönetin."
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Fiyat Yönetimi */}
        <Card>
          <CardContent className="pt-6">
            <div className="mb-5 flex items-center gap-2">
              <Tag className="size-4 text-primary" />
              <h2 className="text-sm font-bold text-primary-hover">Fiyat Yönetimi</h2>
            </div>

            <div className="mb-4 flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-700">
              <Info className="mt-0.5 size-3.5 shrink-0" />
              <span>
                Bu fiyatlar uzman kartlarında ve duyuru bandında gösterilir.
                Uzman sayfasında fiyat gösterilmez — yalnızca <strong>/paketler</strong> sayfasında ayrıca fiyat yer alır.
              </span>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="standardPrice" className="block text-sm font-semibold text-primary-hover">
                  Standart Fiyat (TL) <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <input
                    id="standardPrice"
                    type="number"
                    min="1"
                    step="1"
                    value={standardPrice}
                    onChange={(e) => setStandardPrice(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 pr-12 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring/25"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">TL</span>
                </div>
                <p className="text-xs text-muted-foreground">Üzeri çizili gösterilecek standart fiyat</p>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="discountedPrice" className="block text-sm font-semibold text-primary-hover">
                  İndirimli Fiyat (TL) <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <input
                    id="discountedPrice"
                    type="number"
                    min="1"
                    step="1"
                    value={discountedPrice}
                    onChange={(e) => setDiscountedPrice(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 pr-12 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring/25"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">TL</span>
                </div>
                <p className="text-xs text-muted-foreground">Yeni kullanıcılara gösterilen indirimli fiyat</p>
              </div>
            </div>

            {/* Önizleme */}
            {standardPrice && discountedPrice && (
              <div className="mt-5 rounded-xl border border-border/60 bg-muted/30 px-4 py-3">
                <p className="mb-2 text-xs font-semibold text-muted-foreground">Önizleme — Duyuru Bandı</p>
                <p className="text-sm">
                  Yeni kullanıcılara özel:{" "}
                  <span className="line-through text-muted-foreground">
                    {Number(standardPrice).toLocaleString("tr-TR")} TL
                  </span>{" "}
                  yerine{" "}
                  <span className="font-bold text-primary">
                    {Number(discountedPrice).toLocaleString("tr-TR")} TL
                  </span>
                  {" "}— İlk seansta geçerli!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover disabled:opacity-60"
          >
            {saving ? (
              <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <Save className="size-4" />
            )}
            {saving ? "Kaydediliyor…" : "Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
}
