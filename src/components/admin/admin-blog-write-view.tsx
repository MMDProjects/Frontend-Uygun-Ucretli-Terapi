"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { apiFetch } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/ç/g, "c").replace(/ş/g, "s").replace(/ğ/g, "g")
    .replace(/ü/g, "u").replace(/ö/g, "o").replace(/ı/g, "i")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AdminBlogWriteView({ onPublished }: { onPublished?: () => void }) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [content, setContent] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleTitleChange(v: string) {
    setTitle(v);
    if (!slugManual) setSlug(toSlug(v));
  }

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  function removeCover() {
    setCoverFile(null);
    setCoverPreview(null);
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
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);
    try {
      const created = await apiFetch<{ id: string }>("/admin/blogs", {
        method: "POST",
        body: {
          title: title.trim(),
          slug: slug.trim(),
          content: content.trim(),
          authorName: "Editör",
        },
      });
      if (coverFile) {
        const formData = new FormData();
        formData.append("cover", coverFile);
        await apiFetch(`/admin/blogs/${created.id}/cover`, {
          method: "POST",
          body: formData,
          isFormData: true,
        });
      }
      toast.success("Blog yazısı yayınlandı.");
      setTitle(""); setSlug(""); setContent(""); setSlugManual(false);
      setCoverFile(null); setCoverPreview(null);
      onPublished?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Yayınlama başarısız.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">

          <div className="space-y-1.5">
            <Label>
              Kapak Resmi
              <span className="ml-2 text-xs font-normal text-muted-foreground">Opsiyonel · max 5 MB, JPG/PNG/WEBP</span>
            </Label>
            {coverPreview ? (
              <div className="relative aspect-[16/6] w-full overflow-hidden rounded-lg border border-border">
                <Image src={coverPreview} alt="Kapak önizlemesi" fill className="object-cover" />
                <button
                  type="button"
                  onClick={removeCover}
                  className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
                  aria-label="Resmi kaldır"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/20 py-7 transition hover:border-primary/40 hover:bg-primary/5">
                <ImagePlus className="size-7 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Resim seçmek için tıklayın</span>
                <input type="file" accept="image/*" className="sr-only" onChange={handleCoverChange} />
              </label>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ab-title">
              Başlık <span className="text-destructive">*</span>
            </Label>
            <Input
              id="ab-title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Blog yazısı başlığı"
              maxLength={200}
              className="h-9"
            />
            {errors.title && (
              <p className="flex items-center gap-1 text-xs text-destructive">
                {errors.title}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ab-slug">
              Slug <span className="text-destructive">*</span>
              <span className="ml-2 text-xs font-normal text-muted-foreground">URL&apos;de görünür</span>
            </Label>
            <Input
              id="ab-slug"
              value={slug}
              onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }}
              placeholder="ornek-blog-yazisi"
              className="h-9 font-mono"
            />
            {errors.slug && (
              <p className="flex items-center gap-1 text-xs text-destructive">
                {errors.slug}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="ab-content">
                İçerik <span className="text-destructive">*</span>
                <span className="ml-2 text-xs font-normal text-muted-foreground">min 100 karakter</span>
              </Label>
              <span className="text-xs text-muted-foreground">{content.length} karakter</span>
            </div>
            <Textarea
              id="ab-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={14}
              placeholder="Blog yazısı içeriğini buraya yazın..."
              className="resize-y"
            />
            {errors.content && (
              <p className="flex items-center gap-1 text-xs text-destructive">
                {errors.content}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t border-border/50 pt-4">
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <><span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Yayınlanıyor…</>
              ) : "Yayınla"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
