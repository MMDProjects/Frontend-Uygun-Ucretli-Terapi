"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/features/admin/components/page-header";
import { createBlog } from "@/lib/services/uzman.service";

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/ç/g, "c").replace(/ş/g, "s").replace(/ğ/g, "g")
    .replace(/ü/g, "u").replace(/ö/g, "o").replace(/ı/g, "i")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function YeniBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleTitleChange(v: string) {
    setTitle(v);
    if (!slugManual) setSlug(toSlug(v));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (title.trim().length < 5) e.title = "Başlık en az 5 karakter olmalıdır.";
    if (!slug.trim()) e.slug = "Slug boş bırakılamaz.";
    if (content.trim().length < 100) e.content = "İçerik en az 100 karakter olmalıdır.";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    setErrors({});
    setSubmitting(true);
    try {
      await createBlog({ title: title.trim(), slug: slug.trim(), content: content.trim() });
      toast.success("Taslak kaydedildi.");
      router.push("/uzman/blog");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Yeni Blog Yazısı" description="Yazınızı oluşturun ve taslak olarak kaydedin." />

      <div className="mb-2">
        <Link href="/uzman/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-primary">
          <ArrowLeft className="size-4" /> Geri Dön
        </Link>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Başlık */}
        <div className="space-y-1.5">
          <label htmlFor="blog-title" className="block text-sm font-semibold text-foreground">
            Başlık <span className="text-destructive">*</span>
          </label>
          <input
            id="blog-title"
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            maxLength={200}
            placeholder="Blog yazısı başlığı"
            className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring/25"
          />
          {errors.title && (
            <p className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="size-3" />{errors.title}
            </p>
          )}
        </div>

        {/* Slug */}
        <div className="space-y-1.5">
          <label htmlFor="blog-slug" className="block text-sm font-semibold text-foreground">
            Slug <span className="text-destructive">*</span>
            <span className="ml-2 text-xs font-normal text-muted-foreground">URL'de görünür, benzersiz olmalı</span>
          </label>
          <input
            id="blog-slug"
            type="text"
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }}
            placeholder="ornek-blog-yazisi"
            className="w-full rounded-xl border border-border bg-white px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring/25"
          />
          {errors.slug && (
            <p className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="size-3" />{errors.slug}
            </p>
          )}
        </div>

        {/* İçerik */}
        <div className="space-y-1.5">
          <label htmlFor="blog-content" className="block text-sm font-semibold text-foreground">
            İçerik <span className="text-destructive">*</span>
            <span className="ml-2 text-xs font-normal text-muted-foreground">min 100 karakter</span>
          </label>
          <textarea
            id="blog-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={14}
            placeholder="Blog yazısı içeriğini buraya yazın..."
            className="w-full resize-y rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring/25"
          />
          <p className="text-right text-xs text-muted-foreground">{content.length} karakter</p>
          {errors.content && (
            <p className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="size-3" />{errors.content}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border/50 pt-4">
          <Link href="/uzman/blog" className="inline-flex h-10 items-center rounded-xl border border-border px-5 text-sm font-medium text-muted-foreground transition hover:bg-muted">
            İptal
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
          >
            {submitting ? (
              <><span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Kaydediliyor...</>
            ) : "Taslak Olarak Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
}
