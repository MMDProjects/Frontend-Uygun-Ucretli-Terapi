"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useBlogPosts } from "@/hooks/use-blog-posts";
import { PageHeader } from "@/features/admin/components/page-header";
import type { BlogPostDto } from "@/types/dto/blog-post";
import { apiFetch } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function BlogPostsView({ hideHeader }: { hideHeader?: boolean } = {}) {
  const { posts, loading, error, refetch, remove } = useBlogPosts();
  const [selectedPost, setSelectedPost] = useState<BlogPostDto | null>(null);
  const [pendingDelete, setPendingDelete] = useState<BlogPostDto | null>(null);
  const [deleting, setDeleting] = useState(false);

  // edit state
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedPost) {
      setEditTitle(selectedPost.title);
      setEditContent(selectedPost.content);
      setCoverFile(null);
      setCoverPreview(null);
    }
  }, [selectedPost?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  async function handleSave() {
    if (!selectedPost) return;
    if (editTitle.trim().length < 5) { toast.error("Başlık en az 5 karakter olmalıdır."); return; }
    if (editContent.trim().length < 100) { toast.error("İçerik en az 100 karakter olmalıdır."); return; }
    setSaving(true);
    try {
      await apiFetch(`/admin/blogs/${selectedPost.id}/content`, {
        method: "PATCH",
        body: { title: editTitle.trim(), content: editContent.trim() },
      });
      setSelectedPost((s) => s ? { ...s, title: editTitle.trim(), content: editContent.trim() } : s);
      toast.success("Blog güncellendi.");
      void refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Güncelleme başarısız.");
    } finally {
      setSaving(false);
    }
  }

  async function handleCoverUpload() {
    if (!selectedPost || !coverFile) return;
    setCoverUploading(true);
    try {
      const formData = new FormData();
      formData.append("cover", coverFile);
      const result = await apiFetch<{ coverImageUrl: string }>(
        `/admin/blogs/${selectedPost.id}/cover`,
        { method: "POST", body: formData, isFormData: true }
      );
      setSelectedPost((s) => s ? { ...s, coverImageUrl: result.coverImageUrl } : s);
      setCoverFile(null);
      setCoverPreview(null);
      toast.success("Kapak resmi güncellendi.");
      void refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Resim yüklenemedi.");
    } finally {
      setCoverUploading(false);
    }
  }

  async function handleDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await remove(pendingDelete.id);
      toast.success("Blog yazısı silindi.");
      setPendingDelete(null);
      if (selectedPost?.id === pendingDelete.id) setSelectedPost(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Silinemedi.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      {!hideHeader && (
        <PageHeader
          title="Uzman blog yazıları"
          description="Tüm yayındaki bloglar listelenir. Detay Gör ile içeriği görüntüleyip güncelleyebilirsiniz."
        />
      )}

      {loading ? (
        <Card>
          <CardContent className="flex min-h-40 items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Blog yazıları yükleniyor...
            </div>
          </CardContent>
        </Card>
      ) : null}

      {error && !loading ? (
        <Card className="border-[#EB5757]/30 bg-[#EB5757]/5">
          <CardContent className="flex flex-col gap-3 py-6">
            <p className="text-sm text-[#EB5757]">{error}</p>
            <Button type="button" variant="outline" className="w-fit" onClick={() => void refetch()}>
              Tekrar dene
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {!loading && !error && posts.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            Yayında uzman blog yazısı bulunamadı.
          </CardContent>
        </Card>
      ) : null}

      {!loading && !error && posts.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {posts.map((post) => (
            <Card key={post.id} className="rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.05)]">
              {post.coverImageUrl && (
                <div className="relative aspect-[16/7] w-full overflow-hidden rounded-t-lg">
                  <Image
                    src={post.coverImageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              )}
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="border-[#27AE60]/30 bg-[#27AE60]/10 text-[#27AE60]">
                    Yayında
                  </Badge>
                  <span className="text-xs text-muted-foreground">{post.publishedAt}</span>
                </div>
                <CardTitle className="text-base leading-snug">{post.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-[#24292E] dark:text-muted-foreground">
                    Yazar: {post.expertName}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      className="bg-[#3178C6] hover:bg-[#2b6bad] active:bg-[#255f9c]"
                      onClick={() => setSelectedPost(post)}
                    >
                      Detay / Düzenle
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="border-[#EB5757]/30 text-[#EB5757] hover:bg-[#EB5757]/10 hover:text-[#EB5757]"
                      onClick={() => setPendingDelete(post)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {/* Detail / Edit Dialog */}
      <Dialog open={selectedPost !== null} onOpenChange={(open) => { if (!open) setSelectedPost(null); }}>
        <DialogContent className="flex max-h-[92vh] max-w-[95vw] flex-col gap-0 overflow-hidden sm:max-w-3xl">
          {selectedPost ? (
            <div className="flex min-h-0 flex-1 flex-col gap-4">
              <DialogHeader>
                <DialogTitle>Blog Yazısını Düzenle</DialogTitle>
                <DialogDescription>
                  Yazar: {selectedPost.expertName} • {selectedPost.publishedAt}
                </DialogDescription>
              </DialogHeader>

              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
                {/* Başlık */}
                <div className="grid gap-2">
                  <Label htmlFor="bp-title">Başlık</Label>
                  <Input
                    id="bp-title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    disabled={saving}
                  />
                </div>

                {/* Kapak Resmi */}
                <div className="grid gap-2">
                  <Label>Kapak Resmi</Label>
                  {(coverPreview ?? selectedPost.coverImageUrl) ? (
                    <div className="relative aspect-[16/6] w-full overflow-hidden rounded-lg border border-border">
                      <Image
                        src={coverPreview ?? selectedPost.coverImageUrl!}
                        alt="Kapak resmi"
                        fill
                        className="object-cover"
                      />
                      {coverPreview && (
                        <button
                          type="button"
                          onClick={() => { setCoverFile(null); setCoverPreview(null); }}
                          className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
                          aria-label="Seçimi iptal et"
                        >
                          <X className="size-4" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => coverInputRef.current?.click()}
                      className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/20 py-6 transition hover:border-primary/40 hover:bg-primary/5"
                    >
                      <ImagePlus className="size-6 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Kapak resmi eklemek için tıklayın</span>
                    </button>
                  )}
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => coverInputRef.current?.click()}>
                      {selectedPost.coverImageUrl ? "Resmi Değiştir" : "Resim Seç"}
                    </Button>
                    {coverFile && (
                      <Button
                        type="button"
                        size="sm"
                        disabled={coverUploading}
                        onClick={() => void handleCoverUpload()}
                      >
                        {coverUploading ? <><Loader2 className="mr-1.5 size-3.5 animate-spin" />Yükleniyor</> : "Resmi Kaydet"}
                      </Button>
                    )}
                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleCoverChange}
                    />
                  </div>
                </div>

                {/* İçerik */}
                <div className="grid gap-2">
                  <Label htmlFor="bp-content">İçerik</Label>
                  <Textarea
                    id="bp-content"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                    disabled={saving}
                  />
                </div>
              </div>

              <DialogFooter className="flex-shrink-0 flex-col gap-2 border-t pt-4 sm:flex-row sm:flex-wrap sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="border-[#EB5757]/30 text-[#EB5757] hover:bg-[#EB5757]/10 hover:text-[#EB5757] sm:mr-auto"
                  onClick={() => { setPendingDelete(selectedPost); setSelectedPost(null); }}
                >
                  <Trash2 className="mr-1.5 size-3.5" />
                  Sil
                </Button>
                <Button type="button" variant="outline" onClick={() => setSelectedPost(null)}>
                  Kapat
                </Button>
                <Button type="button" disabled={saving} onClick={() => void handleSave()}>
                  {saving ? <><Loader2 className="mr-2 size-4 animate-spin" />Kaydediliyor</> : "Kaydet"}
                </Button>
              </DialogFooter>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={pendingDelete !== null} onOpenChange={(open) => { if (!open && !deleting) setPendingDelete(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Blog yazısını silmek istediğinize emin misiniz?</DialogTitle>
            <DialogDescription>Bu işlem geri alınamaz. Yazı kalıcı olarak silinecek.</DialogDescription>
          </DialogHeader>
          {pendingDelete && (
            <div className="rounded-md border bg-muted/20 p-3 text-sm text-foreground">
              {pendingDelete.title}
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" disabled={deleting} onClick={() => setPendingDelete(null)}>
              İptal
            </Button>
            <Button
              type="button"
              disabled={deleting}
              className="bg-[#EB5757] hover:bg-[#d04848] active:bg-[#b63c3c] text-white"
              onClick={() => void handleDelete()}
            >
              {deleting ? <><Loader2 className="size-4 animate-spin" />Siliniyor...</> : "Sil"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
