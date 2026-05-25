"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { ExpertDetail } from "@/types/dto/expert-list";

interface ExpertDetailDialogProps {
  expert: ExpertDetail | null;
  loading: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExpertDetailDialog({
  expert,
  loading,
  open,
  onOpenChange,
}: ExpertDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        {loading ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Uzman detayı yükleniyor...
          </div>
        ) : expert ? (
          <>
            <DialogHeader>
              <DialogTitle>{expert.fullName}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 text-sm">
              <div className="grid gap-2 rounded-md border p-3">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">E-posta</span>
                  <span className="font-medium">{expert.email}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Durum</span>
                  <span className="font-medium">
                    {expert.status === "active" ? "Aktif" : "Pasif"}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Kayıt tarihi</span>
                  <span className="font-medium">{expert.registeredAt ?? "-"}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Öncelik skoru</span>
                  <span className="font-medium tabular-nums">
                    {expert.priorityScore ?? 0}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-semibold">Biyografi</p>
                <p className="rounded-md border bg-muted/30 p-3 text-muted-foreground">
                  {expert.biography || "Biyografi bilgisi yok."}
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-semibold">Anahtar kelimeler</p>
                <div className="flex flex-wrap gap-2">
                  {expert.keywords.length > 0 ? (
                    expert.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-full border px-2 py-1 text-xs text-muted-foreground"
                      >
                        {keyword}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted-foreground">Anahtar kelime yok.</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-semibold">Uzmanlık alanları</p>
                <div className="flex flex-wrap gap-2">
                  {expert.specialties.length > 0 ? (
                    expert.specialties.map((item) => (
                      <span
                        key={item}
                        className="rounded-md bg-[#3178C6]/10 px-2 py-1 text-xs text-[#3178C6]"
                      >
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted-foreground">Uzmanlık alanı yok.</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-semibold">Belgeler</p>
                <div className="rounded-md border">
                  {expert.documents.length > 0 ? (
                    expert.documents.map((doc, index) => (
                      <div key={doc.id}>
                        <div className="grid grid-cols-3 gap-2 px-3 py-2 text-xs">
                          <span className="font-medium">{doc.name}</span>
                          <span className="text-muted-foreground">{doc.type}</span>
                          <span className="text-right text-muted-foreground">
                            {doc.uploadedAt}
                          </span>
                        </div>
                        {index < expert.documents.length - 1 ? <Separator /> : null}
                      </div>
                    ))
                  ) : (
                    <p className="px-3 py-2 text-xs text-muted-foreground">
                      Yüklenmiş belge bulunmuyor.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Uzman detayı bulunamadı.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
