"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useBlogApprovals } from "@/hooks/use-blog-approvals";
import {
  blogAdminRevisionSchema,
  blogApprovalRejectSchema,
  type BlogAdminRevisionForm,
  type BlogApprovalRejectForm,
} from "@/lib/blog-approval-schemas";
import type { BlogApprovalDto } from "@/types/dto/blog-approval";
import { PageHeader } from "@/features/admin/components/page-header";
import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-cookies";
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

interface RejectBlogDialogProps {
  post: BlogApprovalDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReject: (id: string, revisionNote: string) => Promise<void>;
}

function RejectBlogDialog({ post, open, onOpenChange, onReject }: RejectBlogDialogProps) {
  const form = useForm<BlogApprovalRejectForm>({
    resolver: zodResolver(blogApprovalRejectSchema),
    defaultValues: { revisionNote: "" },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!post) return;
    try {
      await onReject(post.id, values.revisionNote);
      toast.success(
        values.revisionNote.trim()
          ? "Blog reddedildi; revize notu iletilecek (yerel veya API)."
          : "Blog reddedildi (not olmadan)."
      );
      onOpenChange(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Red tamamlanamadı");
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Blog yazısını reddet</DialogTitle>
          <DialogDescription>
            {post
              ? `“${post.title}” — revize notu isteğe bağlıdır; doldurursanız yazara iletilebilir.`
              : ""}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-3 py-1">
          <div className="grid gap-2">
            <Label htmlFor="blog-reject-note">Revize notu (isteğe bağlı)</Label>
            <Textarea
              id="blog-reject-note"
              rows={5}
              placeholder="Boş bırakabilir veya yazara iletmek istediğiniz düzeltme talebini yazın…"
              disabled={form.formState.isSubmitting}
              {...form.register("revisionNote")}
            />
            {form.formState.errors.revisionNote ? (
              <p className="text-sm text-[#EB5757]">
                {form.formState.errors.revisionNote.message}
              </p>
            ) : null}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              disabled={form.formState.isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              Vazgeç
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={form.formState.isSubmitting}
              className="hover:opacity-95 active:opacity-90"
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Gönderiliyor
                </>
              ) : (
                "Reddet"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function BlogApprovalsView({ hideHeader }: { hideHeader?: boolean } = {}) {
  const {
    approvals,
    loading,
    error,
    refetch,
    approve,
    reject,
    saveAdminRevision,
    updateLocalApproval,
  } = useBlogApprovals();
  const [selected, setSelected] = useState<BlogApprovalDto | null>(null);
  const [rejectTarget, setRejectTarget] = useState<BlogApprovalDto | null>(null);

  const revisionForm = useForm<BlogAdminRevisionForm>({
    resolver: zodResolver(blogAdminRevisionSchema),
    defaultValues: { title: "", excerpt: "", content: "" },
  });

  useEffect(() => {
    if (selected) {
      revisionForm.reset({
        title: selected.title,
        excerpt: selected.excerpt,
        content: selected.content,
      });
    }
  }, [selected?.id]); // eslint-disable-line react-hooks/exhaustive-deps -- sync when opening another post

  const handleApprove = async (id: string) => {
    try {
      await approve(id);
      toast.success("Blog yazısı onaylandı (yerel veya API).");
      if (selected?.id === id) setSelected(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Onay tamamlanamadı");
    }
  };

  const handleSaveRevision = revisionForm.handleSubmit(async (values) => {
    if (!selected) return;
    try {
      await saveAdminRevision(selected.id, values);
      updateLocalApproval(selected.id, values);
      setSelected((s) => (s && s.id === selected.id ? { ...s, ...values } : s));
      toast.success("Admin revizyonu kaydedildi (yerel veya API).");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Kayıt başarısız");
    }
  });

  const handleDelete = async (item: BlogApprovalDto) => {
    if (!confirm(`"${item.title}" blog yazısını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) return;
    try {
      const token = getAccessToken();
      await apiFetch(`/admin/blogs/${item.id}`, { method: "DELETE", token });
      toast.success("Blog yazısı silindi.");
      if (selected?.id === item.id) setSelected(null);
      void refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Silinemedi");
    }
  };

  const openReject = (post: BlogApprovalDto) => {
    setRejectTarget(post);
  };

  const handleRejectDialogOpenChange = (open: boolean) => {
    if (!open) {
      setRejectTarget((cur) => {
        const closedId = cur?.id;
        if (closedId) {
          setSelected((s) => (s?.id === closedId ? null : s));
        }
        return null;
      });
    }
  };

  return (
    <div className="space-y-6">
      {!hideHeader && (
        <PageHeader
          title="Blog onayları"
          description="Uzmanların gönderdiği yazıları inceleyin. Detayda başlık ve içeriği düzenleyip revizyon kaydedebilir; reddederken revize notu isteğe bağlıdır."
        />
      )}

      {loading ? (
        <Card>
          <CardContent className="flex min-h-40 items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Blog onay kuyruğu yükleniyor...
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

      {!loading && !error && approvals.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            Onay bekleyen blog bulunmuyor.
          </CardContent>
        </Card>
      ) : null}

      {!loading && !error && approvals.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {approvals.map((item) => (
            <Card
              key={item.id}
              className="rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.05)]"
            >
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    variant="outline"
                    className={item.status === "revised"
                      ? "border-[#3178C6]/40 bg-[#3178C6]/10 text-[#3178C6]"
                      : "border-[#F2994A]/40 bg-[#F2994A]/10 text-[#F2994A]"
                    }
                  >
                    {item.status === "revised" ? "Revize Gönderildi" : "Onay Bekliyor"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{item.submittedAt}</span>
                </div>
                <CardTitle className="text-base leading-snug">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-[#24292E] dark:text-muted-foreground">
                  Yazar: {item.authorName}
                </p>
                <p className="text-sm text-muted-foreground">{item.excerpt}</p>
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelected(item)}
                  >
                    Detay / Düzenle
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="bg-[#27AE60] hover:bg-[#229954] active:bg-[#1e874b]"
                    onClick={() => void handleApprove(item.id)}
                  >
                    Onayla
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => openReject(item)}
                  >
                    Reddet
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="border-destructive/30 text-destructive hover:bg-destructive/5"
                    onClick={() => void handleDelete(item)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      <RejectBlogDialog
        key={rejectTarget?.id ?? "closed"}
        post={rejectTarget}
        open={rejectTarget !== null}
        onOpenChange={handleRejectDialogOpenChange}
        onReject={reject}
      />

      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="flex max-h-[92vh] max-w-[95vw] flex-col gap-0 overflow-hidden sm:max-w-3xl">
          {selected ? (
            <form onSubmit={handleSaveRevision} className="flex min-h-0 flex-1 flex-col gap-4">
              <DialogHeader>
                <DialogTitle>İncele ve düzenle</DialogTitle>
                <DialogDescription>
                  {selected.authorName} • {selected.submittedAt}
                </DialogDescription>
              </DialogHeader>
              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
                <div className="grid gap-2">
                  <Label htmlFor="blog-edit-title">Başlık</Label>
                  <Input
                    id="blog-edit-title"
                    disabled={revisionForm.formState.isSubmitting}
                    {...revisionForm.register("title")}
                  />
                  {revisionForm.formState.errors.title ? (
                    <p className="text-sm text-[#EB5757]">{revisionForm.formState.errors.title.message}</p>
                  ) : null}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="blog-edit-excerpt">Özet</Label>
                  <Input
                    id="blog-edit-excerpt"
                    disabled={revisionForm.formState.isSubmitting}
                    {...revisionForm.register("excerpt")}
                  />
                  {revisionForm.formState.errors.excerpt ? (
                    <p className="text-sm text-[#EB5757]">
                      {revisionForm.formState.errors.excerpt.message}
                    </p>
                  ) : null}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="blog-edit-content">İçerik</Label>
                  <Textarea
                    id="blog-edit-content"
                    className="min-h-[200px] font-mono text-sm"
                    disabled={revisionForm.formState.isSubmitting}
                    {...revisionForm.register("content")}
                  />
                  {revisionForm.formState.errors.content ? (
                    <p className="text-sm text-[#EB5757]">
                      {revisionForm.formState.errors.content.message}
                    </p>
                  ) : null}
                </div>
              </div>
              <DialogFooter className="flex-shrink-0 flex-col gap-2 border-t pt-4 sm:flex-row sm:flex-wrap sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelected(null)}
                  className="sm:mr-auto"
                >
                  Kapat
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-destructive/30 text-destructive hover:bg-destructive/5"
                  disabled={revisionForm.formState.isSubmitting}
                  onClick={() => void handleDelete(selected)}
                >
                  <Trash2 className="mr-1.5 size-3.5" />
                  Sil
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={revisionForm.formState.isSubmitting}
                  onClick={() => {
                    openReject(selected);
                  }}
                >
                  Reddet…
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="hover:bg-muted active:bg-muted/80"
                  disabled={revisionForm.formState.isSubmitting}
                  onClick={() => void handleApprove(selected.id)}
                >
                  Onayla
                </Button>
                <Button
                  type="submit"
                  disabled={revisionForm.formState.isSubmitting}
                  className="hover:opacity-95 active:opacity-90"
                >
                  {revisionForm.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Kaydediliyor
                    </>
                  ) : (
                    "Revizyonu kaydet"
                  )}
                </Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>

      <div className="rounded-lg border border-[#3178C6]/25 bg-[#3178C6]/5 px-4 py-3 text-sm text-[#24292E] dark:border-[#3178C6]/40 dark:text-foreground">
        <p className="font-medium text-[#3178C6] dark:text-[#6BA3E8]">İpucu</p>
        <p className="mt-1 text-muted-foreground">
          Revizyonu kaydet yazıyı kuyrukta günceller; yayın onayı için Onayla kullanın. Red
          sırasında not zorunlu değildir (profil onayları ile aynı mantık).
        </p>
      </div>
    </div>
  );
}
