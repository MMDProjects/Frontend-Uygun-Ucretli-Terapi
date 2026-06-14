"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useBlogPosts } from "@/hooks/use-blog-posts";
import { PageHeader } from "@/features/admin/components/page-header";
import type { BlogPostDto } from "@/types/dto/blog-post";
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

export function BlogPostsView({ hideHeader }: { hideHeader?: boolean } = {}) {
  const { posts, loading, error, refetch, remove } = useBlogPosts();
  const [selectedPost, setSelectedPost] = useState<BlogPostDto | null>(null);
  const [pendingDelete, setPendingDelete] = useState<BlogPostDto | null>(null);
  const [deleting, setDeleting] = useState(false);

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
          description="Uzmanların yayınladığı bloglar listelenir. Tam içerik sadece 'Detay Gör' ile açılır."
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
            <Button
              type="button"
              variant="outline"
              className="w-fit"
              onClick={() => void refetch()}
            >
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
            <Card
              key={post.id}
              className="rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.05)]"
            >
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    variant="outline"
                    className="border-[#27AE60]/30 bg-[#27AE60]/10 text-[#27AE60]"
                  >
                    Yayında
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {post.publishedAt}
                  </span>
                </div>
                <CardTitle className="text-base leading-snug">{post.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{post.excerpt}</p>
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
                      Detay Gör
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

      <Dialog
        open={selectedPost !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedPost(null);
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          {selectedPost ? (
            <>
              <DialogHeader>
                <DialogTitle>{selectedPost.title}</DialogTitle>
                <DialogDescription>
                  {selectedPost.expertName} • {selectedPost.publishedAt}
                </DialogDescription>
              </DialogHeader>
              <div className="max-h-[60vh] overflow-y-auto rounded-md border bg-muted/20 p-4 text-sm leading-6 text-foreground">
                {selectedPost.content}
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  className="border-[#EB5757]/30 text-[#EB5757] hover:bg-[#EB5757]/10 hover:text-[#EB5757]"
                  onClick={() => { setPendingDelete(selectedPost); setSelectedPost(null); }}
                >
                  <Trash2 className="mr-1.5 size-3.5" />
                  Sil
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={pendingDelete !== null}
        onOpenChange={(open) => { if (!open && !deleting) setPendingDelete(null); }}
      >
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
            <Button
              type="button"
              variant="outline"
              disabled={deleting}
              onClick={() => setPendingDelete(null)}
            >
              İptal
            </Button>
            <Button
              type="button"
              disabled={deleting}
              className="bg-[#EB5757] hover:bg-[#d04848] active:bg-[#b63c3c] text-white"
              onClick={() => void handleDelete()}
            >
              {deleting ? (
                <><Loader2 className="size-4 animate-spin" />Siliniyor...</>
              ) : "Sil"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
