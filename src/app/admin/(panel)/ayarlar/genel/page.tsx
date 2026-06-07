"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, Tag, Info, Megaphone, Plus, Trash2, Dices, Video, Bell } from "lucide-react";
import { PageHeader } from "@/features/admin/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-cookies";

type WheelSegment = { label: string; description: string };

type LoginPopupSettings = {
  title: string;
  description: string;
  benefits: string[];
  buttonText: string;
  buttonUrl: string;
};

type Settings = {
  id: string;
  standardPrice: string | number;
  discountedPrice: string | number;
  videoUrl?: string | null;
  announcementItems?: string[];
  wheelSegments?: WheelSegment[];
  loginPopupSettings?: LoginPopupSettings;
};

export default function AyarlarGenelPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [standardPrice, setStandardPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [savingVideo, setSavingVideo] = useState(false);
  const [wheelSegments, setWheelSegments] = useState<WheelSegment[]>([]);
  const [savingWheel, setSavingWheel] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupDescription, setPopupDescription] = useState("");
  const [popupBenefits, setPopupBenefits] = useState<string[]>([]);
  const [popupButtonText, setPopupButtonText] = useState("");
  const [popupButtonUrl, setPopupButtonUrl] = useState("");
  const [savingPopup, setSavingPopup] = useState(false);
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
        setVideoUrl(s.videoUrl ?? "");
        setItems(s.announcementItems ?? []);
        setWheelSegments(s.wheelSegments ?? []);
        const p = s.loginPopupSettings;
        setPopupTitle(p?.title ?? "Ücretsiz Ön Görüşme\nHakkınız Hazır");
        setPopupDescription(p?.description ?? "Platforma hoş geldiniz. Size özel ücretsiz ön görüşme hakkınızı kullanarak doğru uzmanı bulmanıza yardımcı olalım.");
        setPopupBenefits(p?.benefits ?? ["30 dakikalık tanışma seansı", "Uzmanla birebir değerlendirme", "Hiçbir ücret talep edilmez"]);
        setPopupButtonText(p?.buttonText ?? "Uzmanları İncele");
        setPopupButtonUrl(p?.buttonUrl ?? "/uzmanlar");
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

  async function handleSaveVideo() {
    setSavingVideo(true);
    try {
      const token = getAccessToken();
      await apiFetch("/admin/settings", {
        method: "PUT",
        token,
        body: { videoUrl: videoUrl.trim() || null },
      });
      toast.success("Video URL kaydedildi.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kayıt başarısız.");
    } finally {
      setSavingVideo(false);
    }
  }

  async function handleSavePopup() {
    setSavingPopup(true);
    try {
      const token = getAccessToken();
      await apiFetch("/admin/settings", {
        method: "PUT",
        token,
        body: {
          loginPopupSettings: {
            title: popupTitle.trim(),
            description: popupDescription.trim(),
            benefits: popupBenefits.filter((b) => b.trim()),
            buttonText: popupButtonText.trim(),
            buttonUrl: popupButtonUrl.trim(),
          },
        },
      });
      toast.success("Popup ayarları kaydedildi.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kayıt başarısız.");
    } finally {
      setSavingPopup(false);
    }
  }

  async function handleSaveWheel() {
    setSavingWheel(true);
    try {
      const token = getAccessToken();
      await apiFetch("/admin/settings", {
        method: "PUT",
        token,
        body: { wheelSegments },
      });
      toast.success("Şans çarkı kaydedildi.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kayıt başarısız.");
    } finally {
      setSavingWheel(false);
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

      {/* Video URL */}
      <Card>
        <CardContent className="pt-6">
          <div className="mb-5 flex items-center gap-2">
            <Video className="size-4 text-primary" />
            <h2 className="text-sm font-bold text-primary-hover">Tanıtım Videosu</h2>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">
            Ana sayfadaki &quot;Biz kimiz?&quot; bölümünde gösterilecek video URL&apos;sini girin (MP4, Cloudinary vb.). Boş bırakılırsa play butonu görünmez.
          </p>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://res.cloudinary.com/.../video.mp4"
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring/25"
          />
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleSaveVideo}
              disabled={savingVideo}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover disabled:opacity-60"
            >
              {savingVideo ? <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Save className="size-4" />}
              {savingVideo ? "Kaydediliyor…" : "Videoyu Kaydet"}
            </button>
          </div>
        </CardContent>
      </Card>

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
      {/* Şans Çarkı Dilimleri */}
      <Card>
        <CardContent className="pt-6">
          <div className="mb-5 flex items-center gap-2">
            <Dices className="size-4 text-primary" />
            <h2 className="text-sm font-bold text-primary-hover">Şans Çarkı Dilimleri</h2>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">
            Min 2, maks 8 dilim. Kısa etiket (maks 8 karakter) ve açıklama girin.
          </p>

          <div className="space-y-2">
            {wheelSegments.map((seg, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={seg.label}
                  maxLength={10}
                  onChange={(e) => setWheelSegments((prev) => prev.map((s, idx) => idx === i ? { ...s, label: e.target.value } : s))}
                  placeholder="Etiket"
                  className="w-28 shrink-0 rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring/25"
                />
                <input
                  type="text"
                  value={seg.description}
                  onChange={(e) => setWheelSegments((prev) => prev.map((s, idx) => idx === i ? { ...s, description: e.target.value } : s))}
                  placeholder="Açıklama"
                  className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring/25"
                />
                <button
                  type="button"
                  disabled={wheelSegments.length <= 2}
                  onClick={() => setWheelSegments((prev) => prev.filter((_, idx) => idx !== i))}
                  className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border/60 text-muted-foreground transition hover:border-destructive/30 hover:text-destructive disabled:opacity-30"
                  aria-label="Kaldır"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>

          {wheelSegments.length < 8 && (
            <button
              type="button"
              onClick={() => setWheelSegments((prev) => [...prev, { label: "", description: "" }])}
              className="mt-3 flex items-center gap-1.5 rounded-xl border border-dashed border-border px-4 py-2 text-sm text-muted-foreground transition hover:border-primary/40 hover:text-primary"
            >
              <Plus className="size-4" />
              Dilim Ekle
            </button>
          )}

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleSaveWheel}
              disabled={savingWheel || wheelSegments.length < 2}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover disabled:opacity-60"
            >
              {savingWheel ? <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Save className="size-4" />}
              {savingWheel ? "Kaydediliyor…" : "Çarkı Kaydet"}
            </button>
          </div>
        </CardContent>
      </Card>
      {/* Giriş Sonrası Popup */}
      <Card>
        <CardContent className="pt-6">
          <div className="mb-5 flex items-center gap-2">
            <Bell className="size-4 text-primary" />
            <h2 className="text-sm font-bold text-primary-hover">Giriş Sonrası Popup</h2>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">
            Danışan ve uzman giriş yaptıktan sonra gösterilen popup içeriğini düzenleyin.
          </p>

          <div className="space-y-4">
            {/* Başlık */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-primary-hover">Başlık</label>
              <textarea
                rows={2}
                value={popupTitle}
                onChange={(e) => setPopupTitle(e.target.value)}
                placeholder="Ücretsiz Ön Görüşme&#10;Hakkınız Hazır"
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring/25"
              />
              <p className="text-[11px] text-muted-foreground">Yeni satır için Enter'a basın — popup'ta iki satır olarak görünür.</p>
            </div>

            {/* Açıklama */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-primary-hover">Açıklama</label>
              <textarea
                rows={3}
                value={popupDescription}
                onChange={(e) => setPopupDescription(e.target.value)}
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring/25"
              />
            </div>

            {/* Avantajlar listesi */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-primary-hover">Avantajlar Listesi</label>
              <div className="space-y-2">
                {popupBenefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => setPopupBenefits((prev) => prev.map((b, idx) => idx === i ? e.target.value : b))}
                      className="flex-1 rounded-xl border border-border bg-background px-4 py-2 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring/25"
                    />
                    <button
                      type="button"
                      onClick={() => setPopupBenefits((prev) => prev.filter((_, idx) => idx !== i))}
                      disabled={popupBenefits.length <= 1}
                      className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border/60 text-muted-foreground transition hover:border-destructive/30 hover:text-destructive disabled:opacity-30"
                      aria-label="Kaldır"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setPopupBenefits((prev) => [...prev, ""])}
                className="mt-1 flex items-center gap-1.5 rounded-xl border border-dashed border-border px-4 py-2 text-sm text-muted-foreground transition hover:border-primary/40 hover:text-primary"
              >
                <Plus className="size-4" />
                Avantaj Ekle
              </button>
            </div>

            {/* Buton */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-primary-hover">Buton Metni</label>
                <input
                  type="text"
                  value={popupButtonText}
                  onChange={(e) => setPopupButtonText(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring/25"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-primary-hover">Buton URL</label>
                <input
                  type="text"
                  value={popupButtonUrl}
                  onChange={(e) => setPopupButtonUrl(e.target.value)}
                  placeholder="/uzmanlar"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring/25"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleSavePopup}
              disabled={savingPopup}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover disabled:opacity-60"
            >
              {savingPopup ? <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Save className="size-4" />}
              {savingPopup ? "Kaydediliyor…" : "Popup'u Kaydet"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
