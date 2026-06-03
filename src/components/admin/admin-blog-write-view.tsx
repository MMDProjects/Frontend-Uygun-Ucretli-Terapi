"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-cookies";
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
  const [authorName, setAuthorName] = useState("");
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
    if (!authorName.trim()) e.authorName = "Yazar adı zorunludur.";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);
    try {
      const token = getAccessToken();
      await apiFetch("/admin/blogs", {
        method: "POST",
        token,
        body: {
          title: title.trim(),
          slug: slug.trim(),
          content: content.trim(),
          authorName: authorName.trim(),
        },
      });
      toast.success("Blog yazısı yayınlandı.");
      setTitle(""); setSlug(""); setContent(""); setAuthorName(""); setSlugManual(false);
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
            <Label htmlFor="ab-author">
              Yazar Adı <span className="text-destructive">*</span>
            </Label>
            <Input
              id="ab-author"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Mehmet Keşan"
              className="h-9"
            />
            {errors.authorName && (
              <p className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="size-3" />{errors.authorName}
              </p>
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
                <AlertCircle className="size-3" />{errors.title}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ab-slug">
              Slug <span className="text-destructive">*</span>
              <span className="ml-2 text-xs font-normal text-muted-foreground">URL'de görünür</span>
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
                <AlertCircle className="size-3" />{errors.slug}
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
                <AlertCircle className="size-3" />{errors.content}
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
