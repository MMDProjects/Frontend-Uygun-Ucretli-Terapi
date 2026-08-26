"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertCircle, ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { notFound } from "next/navigation";
import { PageHeader } from "@/features/admin/components/page-header";
import { getMyUzmanBlogs, updateBlogContent, uploadBlogCover, type ApiUzmanBlog } from "@/lib/services/uzman.service";

type PageProps = { params: Promise<{ id: string }> };

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/ç/g, "c").replace(/ş/g, "s").replace(/ğ/g, "g")
    .replace(/ü/g, "u").replace(/ö/g, "o").replace(/ı/g, "i")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function BlogDuzenlePage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [blog, setBlog] = useState<ApiUzmanBlog | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundPage, setNotFoundPage] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  useEffect(() => {
    getMyUzmanBlogs()
      .then((blogs) => {
        const found = blogs.find((b) => b.id === id);
        if (!found) { setNotFoundPage(true); return; }
        setBlog(found);
        setTitle(found.title);
        setSlug(found.slug);
        setContent(found.content);
      })
      .catch(() => setNotFoundPage(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="h-10 w-48 skeleton rounded-xl" />
        <div className="h-10 skeleton rounded-xl" />
        <div className="h-64 skeleton rounded-xl" />
      </div>
    );
  }

  if (notFoundPage || !blog) notFound();

  const isRejected = blog!.status === "reddedildi";
  const isPublished = blog!.status === "yayinda";
  const canEdit = blog!.status === "taslak" || isRejected || isPublished;

  if (!canEdit) {
    return (
      <div className="space-y-4">
        <Link href="/uzman/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-primary">
          <ArrowLeft className="size-4" /> Geri Dön
        </Link>
        <div className="rounded-2xl border border-border/60 bg-white p-8 text-center">
          <p className="text-sm font-semibold text-muted-foreground">
            Bu yazı şu an düzenlenemez.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            İncelemede veya revize bekleyen yazılar düzenlenemez.
          </p>
        </div>
      </div>
    );
  }

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
      await updateBlogContent(id, { title: title.trim(), slug: slug.trim(), content: content.trim() });
      if (coverFile) {
        try {
          await uploadBlogCover(id, coverFile);
        } catch {
          toast.error("İçerik güncellendi ancak kapak fotoğrafı yüklenemedi. Blog listesinden tekrar deneyin.");
          router.push("/uzman/blog");
          return;
        }
      }
      toast.success(
        isRejected ? "Yazı düzeltildi ve tekrar gönderildi." :
        isPublished ? "Revize incelemeye gönderildi. Onaylanana kadar mevcut içerik yayında kalmaya devam eder." :
        "Yazı güncellendi ve incelemeye gönderildi."
      );
      router.push("/uzman/blog");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  }

  const submitLabel = isRejected ? "Düzelt ve Tekrar Gönder" : isPublished ? "Revize Gönder" : "Güncelle ve İncelemeye Gönder";

  return (
    <div className="space-y-5">
      <PageHeader
        title="Blog Yazısını Düzenle"
        description={isRejected ? "Yazınızı düzelterek tekrar gönderebilirsiniz." : "Yazınızı güncelleyip incelemeye gönderin."}
      />

      <Link href="/uzman/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-primary">
        <ArrowLeft className="size-4" /> Geri Dön
      </Link>

      {/* Yayındaki blog uyarısı */}
      {isPublished && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-600" />
          <p className="text-sm text-amber-800">
            Değişiklikler admin onayına gönderilecek. Onaylanana kadar mevcut içerik yayında kalmaya devam eder.
          </p>
        </div>
      )}

      {/* Admin notu */}
      {blog!.adminNote && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-600" />
          <div>
            <p className="text-xs font-semibold text-red-800">Admin Reddetme Notu:</p>
            <p className="mt-0.5 text-sm text-red-700">{blog!.adminNote}</p>
          </div>
        </div>
      )}

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
            <span className="ml-2 text-xs font-normal text-muted-foreground">URL&apos;de görünür</span>
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

        {/* Kapak Resmi */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-foreground">
            Kapak Resmi
            <span className="ml-2 text-xs font-normal text-muted-foreground">max 5 MB, JPG/PNG/WEBP</span>
          </label>
          {(coverPreview || blog!.coverImageUrl) && !coverFile && !coverPreview ? (
            <div className="relative aspect-[16/6] w-full overflow-hidden rounded-xl border border-border">
              <Image src={blog!.coverImageUrl!} alt="Mevcut kapak" fill className="object-cover" />
              <button
                type="button"
                onClick={() => setCoverPreview("remove")}
                className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
                aria-label="Resmi kaldır"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : coverPreview && coverPreview !== "remove" ? (
            <div className="relative aspect-[16/6] w-full overflow-hidden rounded-xl border border-border">
              <Image src={coverPreview} alt="Kapak önizlemesi" fill className="object-cover" />
              <button
                type="button"
                onClick={() => { setCoverFile(null); setCoverPreview(null); }}
                className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
                aria-label="Resmi kaldır"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/20 py-8 transition hover:border-primary/40 hover:bg-primary/5">
              <ImagePlus className="size-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {blog!.coverImageUrl && coverPreview !== "remove" ? "Değiştirmek için tıklayın" : "Resim seçmek için tıklayın"}
              </span>
              <input type="file" accept="image/*" className="sr-only" onChange={handleCoverChange} />
            </label>
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
              <><span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Gönderiliyor...</>
            ) : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
