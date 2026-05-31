"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { useAuthStore } from "@/lib/stores/auth-store";
import { createQuestion } from "@/lib/services/forum.service";

export default function YeniKonuPage() {
  const { role } = useAuthStore();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (role !== "danisan") {
    return (
      <div className="bg-[#e6f0ee] py-16 !pt-0">
        <div className="page-shell flex justify-center">
          <div className="rounded-[2rem] border border-border/60 bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-primary-hover">
              {role === null ? "Soru sormak için kayıt olun" : "Bu sayfaya erişemezsiniz"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {role === null
                ? "Soru-Cevap bölümünde soru sorabilmek için ücretsiz hesap oluşturmanız gerekiyor."
                : "Yeni konu açmak için danışan hesabıyla giriş yapmanız gerekiyor."}
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              {role === null && (
                <Link href="/kayit" className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-hover">
                  Ücretsiz Kayıt Ol
                </Link>
              )}
              <Link href="/giris?redirect=/forum/yeni-konu" className="inline-flex h-10 items-center rounded-full border border-border px-5 text-sm font-medium text-muted-foreground transition hover:bg-muted">
                Giriş Yap
              </Link>
              <Link href="/forum" className="inline-flex h-10 items-center rounded-full border border-border px-5 text-sm font-medium text-muted-foreground transition hover:bg-muted">
                Geri Dön
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (title.trim().length < 5) { setError("Başlık en az 5 karakter olmalıdır."); return; }
    if (content.trim().length < 20) { setError("Açıklama en az 20 karakter olmalıdır."); return; }

    setSubmitting(true);
    try {
      await createQuestion({ title: title.trim(), content: content.trim() });
      router.push("/forum?submitted=1");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setSubmitting(false);
    }
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
              Yeni Soru Sor
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
                Soru Başlığı <span className="text-destructive">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: Sosyal kaygı ile nasıl başa çıkabilirim?"
                maxLength={200}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring/25"
              />
              <p className="text-right text-xs text-muted-foreground">{title.length}/200</p>
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
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring/25"
              />
              <p className="text-right text-xs text-muted-foreground">{content.length} karakter</p>
            </div>

            {/* Gizlilik notu */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
              <span className="font-semibold text-primary">Gizlilik:</span>{" "}
              Sorunuz admin onayından geçtikten sonra bir uzmana atanır. Uzman yanıtladığında herkese açık olarak yayınlanır.
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
                ) : "Soruyu Gönder"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
