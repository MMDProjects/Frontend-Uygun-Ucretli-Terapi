"use client";

import { useState } from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useExpertApplications } from "@/hooks/use-expert-applications";
import {
  expertApplicationRejectSchema,
  type ExpertApplicationRejectForm,
} from "@/lib/expert-application-schemas";
import type { ExpertApplication } from "@/types/dto/expert-application";
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

function openDocument(doc: ExpertApplication["certificateDocument"], label: string) {
  if (doc.url) {
    window.open(doc.url, "_blank", "noopener,noreferrer");
    return;
  }
  toast.info(`${label} için indirme bağlantısı henüz tanımlı değil.`);
}

interface RejectApplicationDialogProps {
  application: ExpertApplication | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReject: (applicationId: string, reason: string) => Promise<void>;
}

function RejectApplicationDialog({
  application,
  open,
  onOpenChange,
  onReject,
}: RejectApplicationDialogProps) {
  const form = useForm<ExpertApplicationRejectForm>({
    resolver: zodResolver(expertApplicationRejectSchema),
    defaultValues: { rejectionReason: "" },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!application) return;
    try {
      await onReject(application.id, values.rejectionReason);
      toast.success("Başvuru reddedildi (yerel veya API)");
      onOpenChange(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Red işlemi tamamlanamadı");
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Başvuruyu reddet</DialogTitle>
          <DialogDescription>
            {application
              ? `${application.firstName} ${application.lastName} — red gerekçesi zorunludur; uzman panelinde görünecektir.`
              : ""}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-3 py-1">
          <div className="grid gap-2">
            <Label htmlFor="reject-reason">Red gerekçesi</Label>
            <Textarea
              id="reject-reason"
              rows={5}
              placeholder="En az 10 karakter; net ve profesyonel bir açıklama yazın…"
              disabled={form.formState.isSubmitting}
              {...form.register("rejectionReason")}
            />
            {form.formState.errors.rejectionReason ? (
              <p className="text-sm text-[#EB5757]">
                {form.formState.errors.rejectionReason.message}
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

export function ExpertApplicationsView() {
  const { applications, loading, error, refetch, approve, reject } = useExpertApplications();
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<ExpertApplication | null>(null);
  const [rejectTarget, setRejectTarget] = useState<ExpertApplication | null>(null);

  const handleApprove = async (app: ExpertApplication) => {
    try {
      await approve(app.id);
      toast.success(`${app.firstName} ${app.lastName} başvurusu onaylandı (yerel veya API)`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Onay tamamlanamadı");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Yeni başvurular"
        description="Uzman kayıt formundan gelen başvurular (ad, soyad, iletişim, sertifika ve CV). Onayla veya red gerekçesi ile reddet."
      />

      {loading ? (
        <Card>
          <CardContent className="flex min-h-40 items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Başvurular yükleniyor…
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

      {!loading && !error && applications.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            Bekleyen uzman kayıt başvurusu yok.
          </CardContent>
        </Card>
      ) : null}

      {!loading && !error && applications.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {applications.map((app) => (
            <Card
              key={app.id}
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
                    {formatSubmittedAt(app.submittedAt)}
                  </span>
                </div>
                <CardTitle className="text-base leading-snug">
                  {app.firstName} {app.lastName}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {app.title ? (
                  <p className="text-xs font-medium text-[#016a59]">{app.title}</p>
                ) : null}
                {app.tags && app.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {app.tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="outline"
                        className="border-[#016a59]/30 bg-[#e6f0ee] text-[#016a59] text-[10px]"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                ) : null}
                <dl className="grid gap-1 text-xs text-[#24292E] dark:text-muted-foreground">
                  <div className="flex justify-between gap-2">
                    <dt className="text-muted-foreground">E-posta</dt>
                    <dd className="font-medium">{app.email}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-muted-foreground">Telefon</dt>
                    <dd className="font-medium">{app.phone}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-muted-foreground">Başvuru no</dt>
                    <dd className="font-mono text-[10px] text-muted-foreground">{app.id}</dd>
                  </div>
                </dl>
                <div className="flex flex-wrap gap-2 border-t pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="hover:border-[#3178C6]/50 active:bg-muted"
                    onClick={() => openDocument(app.certificateDocument, "Sertifika")}
                  >
                    <FileText className="mr-1 size-4" />
                    Sertifika
                    {app.certificateDocument.url ? (
                      <ExternalLink className="ml-1 size-3 opacity-70" />
                    ) : null}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="hover:border-[#3178C6]/50 active:bg-muted"
                    onClick={() => openDocument(app.cvDocument, "CV")}
                  >
                    <FileText className="mr-1 size-4" />
                    CV
                    {app.cvDocument.url ? <ExternalLink className="ml-1 size-3 opacity-70" /> : null}
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {app.certificateDocument.fileName} · {app.cvDocument.fileName}
                </p>
                <div className="flex flex-wrap items-center justify-end gap-2 border-t pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelected(app);
                      setDetailOpen(true);
                    }}
                  >
                    Detay
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="bg-[#27AE60] text-white hover:bg-[#229954] active:bg-[#1e874b]"
                    onClick={() => void handleApprove(app)}
                  >
                    Onayla
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="hover:opacity-95 active:opacity-90"
                    onClick={() => setRejectTarget(app)}
                  >
                    Reddet
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      <RejectApplicationDialog
        key={rejectTarget?.id ?? "closed"}
        application={rejectTarget}
        open={rejectTarget !== null}
        onOpenChange={(open) => {
          if (!open) setRejectTarget(null);
        }}
        onReject={reject}
      />

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-lg">
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle>
                  {selected.firstName} {selected.lastName}
                </DialogTitle>
                <DialogDescription>{formatSubmittedAt(selected.submittedAt)}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 text-sm max-h-[60vh] overflow-y-auto pr-1">
                {selected.title ? (
                  <div className="rounded-md border bg-muted/20 p-3">
                    <p className="text-xs text-muted-foreground">Unvan</p>
                    <p className="font-medium">{selected.title}</p>
                  </div>
                ) : null}
                {selected.bio ? (
                  <div className="rounded-md border bg-muted/20 p-3">
                    <p className="text-xs text-muted-foreground">Biyografi</p>
                    <p className="mt-1 leading-relaxed text-[#1a1a1a]">{selected.bio}</p>
                  </div>
                ) : null}
                {selected.education ? (
                  <div className="rounded-md border bg-muted/20 p-3">
                    <p className="text-xs text-muted-foreground">Eğitim</p>
                    <p className="mt-1">{selected.education}</p>
                  </div>
                ) : null}
                {selected.tags && selected.tags.length > 0 ? (
                  <div className="rounded-md border bg-muted/20 p-3">
                    <p className="text-xs text-muted-foreground mb-2">Uzmanlık alanları</p>
                    <div className="flex flex-wrap gap-1">
                      {selected.tags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="outline"
                          className="border-[#016a59]/30 bg-[#e6f0ee] text-[#016a59]"
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : null}
                <div className="rounded-md border bg-muted/20 p-3">
                  <p className="text-xs text-muted-foreground">E-posta</p>
                  <p className="font-medium">{selected.email}</p>
                </div>
                <div className="rounded-md border bg-muted/20 p-3">
                  <p className="text-xs text-muted-foreground">Telefon</p>
                  <p className="font-medium">{selected.phone}</p>
                </div>
                <div className="rounded-md border bg-muted/20 p-3">
                  <p className="text-xs text-muted-foreground">Sertifika dosyası</p>
                  <button
                    type="button"
                    className="font-mono text-xs text-[#016a59] underline underline-offset-2 cursor-pointer"
                    onClick={() => openDocument(selected.certificateDocument, "Sertifika")}
                  >
                    {selected.certificateDocument.fileName}
                  </button>
                </div>
                <div className="rounded-md border bg-muted/20 p-3">
                  <p className="text-xs text-muted-foreground">CV dosyası</p>
                  <button
                    type="button"
                    className="font-mono text-xs text-[#016a59] underline underline-offset-2 cursor-pointer"
                    onClick={() => openDocument(selected.cvDocument, "CV")}
                  >
                    {selected.cvDocument.fileName}
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <div className="rounded-lg border border-[#3178C6]/25 bg-[#3178C6]/5 px-4 py-3 text-sm text-[#24292E] dark:border-[#3178C6]/40 dark:text-foreground">
        <p className="font-medium text-[#3178C6] dark:text-[#6BA3E8]">İpucu</p>
        <p className="mt-1 text-muted-foreground">
          Şifre alanı güvenlik nedeniyle burada gösterilmez. Red gerekçesi case brief (R18) ile
          uyumlu olarak zorunludur. API yoksa işlemler yalnızca bu oturumda listeden düşer;
          backend hazır olduğunda onay/red kalıcı yazılır.
        </p>
      </div>
    </div>
  );
}
