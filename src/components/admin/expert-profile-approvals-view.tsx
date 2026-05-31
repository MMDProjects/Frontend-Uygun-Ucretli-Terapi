"use client";

import { useState } from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useExpertProfileApprovals } from "@/hooks/use-expert-profile-approvals";
import {
  expertProfileRejectSchema,
  type ExpertProfileRejectForm,
} from "@/lib/expert-profile-approval-schemas";
import type { ExpertProfileApproval } from "@/types/dto/expert-profile-approval";
import { PageHeader } from "@/features/admin/components/page-header";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function formatSubmittedAt(iso: string): string {
  try {
    return format(new Date(iso), "d MMM yyyy, HH:mm", { locale: tr });
  } catch {
    return iso;
  }
}

interface RejectProfileDialogProps {
  item: ExpertProfileApproval | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReject: (approvalId: string, revisionNote: string) => Promise<void>;
}

function RejectProfileDialog({
  item,
  open,
  onOpenChange,
  onReject,
}: RejectProfileDialogProps) {
  const form = useForm<ExpertProfileRejectForm>({
    resolver: zodResolver(expertProfileRejectSchema),
    defaultValues: { revisionNote: "" },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!item) return;
    try {
      await onReject(item.id, values.revisionNote);
      toast.success(
        values.revisionNote.trim()
          ? "Profil revizyonu reddedildi; not uzmana iletilecek (yerel veya API)."
          : "Profil revizyonu reddedildi (not olmadan)."
      );
      onOpenChange(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Red işlemi tamamlanamadı");
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Profil revizyonunu reddet</DialogTitle>
          <DialogDescription>
            {item
              ? `${item.expertDisplayName} — revize notu isteğe bağlıdır; doldurursanız uzman panelinde gösterilebilir.`
              : ""}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-3 py-1">
          <div className="grid gap-2">
            <Label htmlFor="profile-revision-note">Revize notu (isteğe bağlı)</Label>
            <Textarea
              id="profile-revision-note"
              rows={5}
              placeholder="Boş bırakabilir veya uzmana iletmek istediğiniz düzeltme talebini yazın…"
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

export function ExpertProfileApprovalsView() {
  const { items, loading, error, refetch, approve, reject } = useExpertProfileApprovals();
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<ExpertProfileApproval | null>(null);
  const [rejectTarget, setRejectTarget] = useState<ExpertProfileApproval | null>(null);

  const handleApprove = async (row: ExpertProfileApproval) => {
    try {
      await approve(row.id);
      toast.success(`${row.expertDisplayName} profil güncellemesi onaylandı (yerel veya API).`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Onay tamamlanamadı");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profil onayları"
        description="Onaylanmış uzmanların profil, biyografi, anahtar kelime veya belge güncellemeleri bu kuyruğa düşer. Yayında kalan önceki sürüm, yeni içerik onaylanana kadar korunur."
      />

      {loading ? (
        <Card>
          <CardContent className="flex min-h-40 items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Profil onayları yükleniyor…
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

      {!loading && !error && items.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            Onay bekleyen profil güncellemesi yok.
          </CardContent>
        </Card>
      ) : null}

      {!loading && !error && items.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((row) => (
            <Card
              key={row.id}
              className="rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.05)]"
            >
              <CardHeader className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge
                    variant="outline"
                    className="border-[#F2994A]/40 bg-[#F2994A]/10 text-[#F2994A]"
                  >
                    Onay bekliyor
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatSubmittedAt(row.submittedAt)}
                  </span>
                </div>
                <CardTitle className="text-base leading-snug">{row.expertDisplayName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <dl className="grid gap-1 text-xs text-[#24292E] dark:text-muted-foreground">
                  <div className="flex justify-between gap-2">
                    <dt className="text-muted-foreground">E-posta</dt>
                    <dd className="font-medium">{row.email}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-muted-foreground">Uzman ID</dt>
                    <dd className="font-mono text-[10px] text-muted-foreground">{row.expertId}</dd>
                  </div>
                  <div className="flex flex-col gap-1">
                    <dt className="text-muted-foreground">Değişen alanlar</dt>
                    <dd className="text-xs font-medium">{row.changedFieldsSummary || "—"}</dd>
                  </div>
                </dl>
                {row.currentBiography && row.currentBiography !== row.biography ? (
                  <div className="space-y-2">
                    <div className="rounded-md border bg-muted/20 p-3">
                      <p className="text-xs font-medium text-muted-foreground">Mevcut (yayındaki) biyografi</p>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{row.currentBiography}</p>
                    </div>
                    <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
                      <p className="text-xs font-medium text-amber-700">Onay bekleyen yeni biyografi</p>
                      <p className="mt-1 line-clamp-4 text-sm text-foreground">{row.biography}</p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-md border bg-muted/20 p-3">
                    <p className="text-xs font-medium text-muted-foreground">Biyografi</p>
                    <p className="mt-1 line-clamp-4 text-sm text-foreground">{row.biography}</p>
                  </div>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {row.keywords.slice(0, 6).map((k) => (
                    <Badge key={k} variant="secondary" className="text-xs font-normal">
                      {k}
                    </Badge>
                  ))}
                  {row.keywords.length > 6 ? (
                    <span className="text-xs text-muted-foreground">+{row.keywords.length - 6}</span>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2 border-t pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelected(row);
                      setDetailOpen(true);
                    }}
                  >
                    Detay
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="bg-[#27AE60] text-white hover:bg-[#229954] active:bg-[#1e874b]"
                    onClick={() => void handleApprove(row)}
                  >
                    Onayla
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="hover:opacity-95 active:opacity-90"
                    onClick={() => setRejectTarget(row)}
                  >
                    Reddet
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      <RejectProfileDialog
        key={rejectTarget?.id ?? "closed"}
        item={rejectTarget}
        open={rejectTarget !== null}
        onOpenChange={(open) => {
          if (!open) setRejectTarget(null);
        }}
        onReject={reject}
      />

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle>{selected.expertDisplayName}</DialogTitle>
                <DialogDescription>
                  {selected.email} · {formatSubmittedAt(selected.submittedAt)}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 text-sm">
                <div className="rounded-md border bg-muted/20 p-3">
                  <p className="text-xs text-muted-foreground">Değişen alanlar</p>
                  <p className="font-medium">{selected.changedFieldsSummary || "—"}</p>
                </div>
                {selected.currentBiography && selected.currentBiography !== selected.biography ? (
                  <>
                    <div className="rounded-md border bg-muted/20 p-3">
                      <p className="text-xs text-muted-foreground">Mevcut (yayındaki) biyografi</p>
                      <p className="mt-2 whitespace-pre-wrap text-muted-foreground">{selected.currentBiography}</p>
                    </div>
                    <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
                      <p className="text-xs font-medium text-amber-700">Onay bekleyen yeni biyografi</p>
                      <p className="mt-2 whitespace-pre-wrap text-foreground">{selected.biography}</p>
                    </div>
                  </>
                ) : (
                  <div className="rounded-md border bg-muted/20 p-3">
                    <p className="text-xs text-muted-foreground">Biyografi</p>
                    <p className="mt-2 whitespace-pre-wrap text-foreground">{selected.biography}</p>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {selected.keywords.map((k) => (
                    <Badge key={k} variant="outline">
                      {k}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <div className="rounded-lg border border-[#3178C6]/25 bg-[#3178C6]/5 px-4 py-3 text-sm text-[#24292E] dark:border-[#3178C6]/40 dark:text-foreground">
        <p className="font-medium text-[#3178C6] dark:text-[#6BA3E8]">İpucu</p>
        <p className="mt-1 text-muted-foreground">
          Red sırasında revize notu zorunlu değildir; doldurursanız backend ile bağlandığında uzmana
          iletilebilir. Kayıt öncesi ilk başvurular için red gerekçesi &quot;Yeni başvurular&quot;
          ekranında ayrı kurallara tabidir.
        </p>
      </div>
    </div>
  );
}
