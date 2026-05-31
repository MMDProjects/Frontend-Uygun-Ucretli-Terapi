"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, Tag, Info, Megaphone, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/features/admin/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-cookies";

type Settings = {
  id: string;
  standardPrice: string | number;
  discountedPrice: string | number;
  announcementItems?: string[];
};

export default function AyarlarGenelPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [standardPrice, setStandardPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingBanner, setSavingBanner] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    apiFetch<Settings>("/admin/settings", { token })
      .then((s) => {
        setSettings(s);
        setStandardPrice(String(Number(s.standardPrice)));
        setDiscountedPrice(String(Number(s.discountedPrice)));
        setItems(s.announcementItems ?? []);
      })
      .catch(() => toast.error("Ayarlar yüklenemedi."))
      .finally(() => setLoading(false));
  }, []);

  async function handleSavePrices(e: React.FormEvent) {
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
      toast.success("Fiyatlar kaydedildi.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kayıt başarısız.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveBanner() {
    setSavingBanner(true);
    try {
      const token = getAccessToken();
      await apiFetch("/admin/settings", {
        method: "PUT",
        token,
        body: { announcementItems: items },
      });
      toast.success("Duyuru şeridi kaydedildi.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kayıt başarısız.");
    } finally {
      setSavingBanner(false);
    }
  }

  function addItem() {
    const t = newItem.trim();
    if (!t) return;
    setItems((prev) => [...prev, t]);
    setNewItem("");
  }

  function removeItem(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateItem(i: number, val: string) {
    setItems((prev) => prev.map((item, idx) => (idx === i ? val : item)));
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

      {/* Fiyat Yönetimi */}
      <form onSubmit={handleSavePrices} className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="mb-5 flex items-center gap-2">
              <Tag className="size-4 text-primary" />
              <h2 className="text-sm font-bold text-primary-hover">Fiyat Yönetimi</h2>
            </div>

            <div className="mb-4 flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-700">
              <Info className="mt-0.5 size-3.5 shrink-0" />
              <span>
                Bu fiyatlar duyuru bandında gösterilir. Uzman sayfasında fiyat gösterilmez — yalnızca <strong>/paketler</strong> sayfasında yer alır.
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
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover disabled:opacity-60"
          >
            {saving ? <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Save className="size-4" />}
            {saving ? "Kaydediliyor…" : "Fiyatları Kaydet"}
          </button>
        </div>
      </form>

      {/* Duyuru Şeridi */}
      <Card>
        <CardContent className="pt-6">
          <div className="mb-5 flex items-center gap-2">
            <Megaphone className="size-4 text-primary" />
            <h2 className="text-sm font-bold text-primary-hover">Duyuru Şeridi</h2>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">
            Sayfanın üst kısmında kayan şeritte gösterilecek metinleri yönetin.
          </p>

          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateItem(i, e.target.value)}
                  className="flex-1 rounded-xl border border-border bg-background px-4 py-2 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring/25"
                />
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border/60 text-muted-foreground transition hover:border-destructive/30 hover:text-destructive"
                  aria-label="Kaldır"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Yeni satır ekle */}
          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addItem(); } }}
              placeholder="Yeni duyuru metni..."
              className="flex-1 rounded-xl border border-dashed border-border bg-background px-4 py-2 text-sm placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring/25"
            />
            <button
              type="button"
              onClick={addItem}
              disabled={!newItem.trim()}
              className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white transition hover:bg-primary-hover disabled:opacity-40"
              aria-label="Ekle"
            >
              <Plus className="size-4" />
            </button>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleSaveBanner}
              disabled={savingBanner}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover disabled:opacity-60"
            >
              {savingBanner ? <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Save className="size-4" />}
              {savingBanner ? "Kaydediliyor…" : "Şeridi Kaydet"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
