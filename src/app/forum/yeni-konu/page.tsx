"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";

import { useAuthStore } from "@/lib/stores/auth-store";
import { useForumStore } from "@/lib/stores/forum-store";

const SUGGESTED_TAGS = [
  "Kaygı", "Depresyon", "Stres", "Uyku", "İlişki",
  "Aile", "Panik Atak", "Tükenmişlik", "Özgüven", "Yas",
  "Travma", "Öfke", "Motivasyon", "Sosyal Fobi", "Diğer",
];

export default function YeniKonuPage() {
  const { role, displayName } = useAuthStore();
  const { addThread } = useForumStore();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (role !== "danisan") {
    return (
      <div className="bg-[#e6f0ee] py-16 !pt-0">
        <div className="page-shell flex justify-center">
          <div className="rounded-[2rem] border border-border/60 bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-primary-hover">Bu sayfaya erişemezsiniz</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Yeni konu açmak için danışan hesabıyla giriş yapmanız gerekiyor.
            </p>
            <Link href="/forum" className="mt-5 inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-hover">
              Forum Ana Sayfası
            </Link>
          </div>
        </div>
      </div>
    );
  }

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : prev.length < 3 ? [...prev, tag] : prev
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (title.trim().length < 10) { setError("Başlık en az 10 karakter olmalıdır."); return; }
    if (content.trim().length < 30) { setError("Açıklama en az 30 karakter olmalıdır."); return; }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    const id = addThread(title.trim(), content.trim(), selectedTags, displayName ?? "Danışan", displayName ?? "Danışan");
    router.push(`/forum/konu/${id}`);
  }

  return (
    <div className="bg-[#e6f0ee] !pt-0">
      <section className="section-shell relative overflow-hidden border-b border-border/70 bg-[#cce1de]">
        <div className="page-shell">
          <Link href="/forum" className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-primary">
            <ArrowLeft className="size-4" />
            Tüm Konular
          </Link>
          <div className="max-w-xl space-y-3">
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-primary-hover sm:text-5xl">
              Yeni Konu Aç
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-8">
              Sorunuzu açıklayın, uzmanlarımız yanıtlasın
            </p>
          </div>
        </div>
      </section>

      <div className="page-shell max-w-2xl py-8">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-[2rem] border border-border/60 bg-white p-6 shadow-sm lg:rounded-[2.25rem] lg:p-8"
        >
          <div className="space-y-5">
            {/* Başlık */}
            <div className="space-y-1.5">
              <label htmlFor="title" className="block text-sm font-semibold text-primary-hover">
                Konu Başlığı <span className="text-destructive">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: Sosyal kaygı ile nasıl başa çıkabilirim?"
                maxLength={120}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring/25"
              />
              <p className="text-right text-xs text-muted-foreground">{title.length}/120</p>
            </div>

            {/* İçerik */}
            <div className="space-y-1.5">
              <label htmlFor="content" className="block text-sm font-semibold text-primary-hover">
                Açıklama <span className="text-destructive">*</span>
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Durumunuzu, ne zamandır yaşadığınızı ve neye ihtiyaç duyduğunuzu açıklayın..."
                rows={6}
                maxLength={1500}
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring/25"
              />
              <p className="text-right text-xs text-muted-foreground">{content.length}/1500</p>
            </div>

            {/* Etiketler */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-primary-hover">
                Etiketler <span className="text-xs font-normal text-muted-foreground">(en fazla 3)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_TAGS.map((tag) => {
                  const active = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
                        active
                          ? "border-primary bg-primary text-white"
                          : "border-border bg-muted text-muted-foreground hover:border-primary/40 hover:text-primary"
                      }`}
                    >
                      {tag}
                      {active && <X className="size-3" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gizlilik notu */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
              <span className="font-semibold text-primary">Gizlilik:</span> Konunuza yalnızca siz ve onaylı uzmanlar yanıt verebilir.
            </div>

            {error && (
              <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="flex items-center justify-end gap-3 border-t border-border/50 pt-4">
              <Link href="/forum" className="inline-flex h-10 items-center rounded-full border border-border px-5 text-sm font-medium text-muted-foreground transition hover:bg-muted">
                İptal
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover disabled:opacity-60"
              >
                {submitting ? (
                  <><span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Gönderiliyor...</>
                ) : "Konuyu Yayınla"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
