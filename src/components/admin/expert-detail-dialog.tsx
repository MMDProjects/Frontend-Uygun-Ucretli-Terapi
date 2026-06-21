"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateExpertPricing } from "@/services/users/experts-list.service";
import type { ExpertDetail } from "@/types/dto/expert-list";

interface ExpertDetailDialogProps {
  expert: ExpertDetail | null;
  loading: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPricingUpdated?: (expertId: string, standardPrice: number | null, discountedPrice: number | null) => void;
}

export function ExpertDetailDialog({
  expert,
  loading,
  open,
  onOpenChange,
  onPricingUpdated,
}: ExpertDetailDialogProps) {
  const [standardPrice, setStandardPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [savingPrice, setSavingPrice] = useState(false);

  useEffect(() => {
    if (expert) {
      setStandardPrice(expert.standardPrice != null ? String(expert.standardPrice) : "");
      setDiscountedPrice(expert.discountedPrice != null ? String(expert.discountedPrice) : "");
    }
  }, [expert]);

  async function handleSavePricing() {
    if (!expert) return;
    setSavingPrice(true);
    try {
      const std = standardPrice.trim() ? Number(standardPrice) : null;
      const disc = discountedPrice.trim() ? Number(discountedPrice) : null;
      await updateExpertPricing(expert.id, std, disc);
      toast.success("Fiyat güncellendi");
      onPricingUpdated?.(expert.id, std, disc);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Fiyat güncellenemedi");
    } finally {
      setSavingPrice(false);
    }
  }

  async function handleResetPricing() {
    if (!expert) return;
    setSavingPrice(true);
    try {
      await updateExpertPricing(expert.id, null, null);
      setStandardPrice("");
      setDiscountedPrice("");
      toast.success("Global fiyata döndürüldü");
      onPricingUpdated?.(expert.id, null, null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Fiyat sıfırlanamadı");
    } finally {
      setSavingPrice(false);
    }
  }

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

              {/* Fiyat Yönetimi */}
              <div className="space-y-3 rounded-md border p-3">
                <p className="font-semibold">Fiyat Yönetimi</p>
                <p className="text-xs text-muted-foreground">
                  Boş bırakırsanız global platform fiyatı kullanılır.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Standart Fiyat (TL)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={standardPrice}
                      onChange={(e) => setStandardPrice(e.target.value)}
                      placeholder="Global fiyat"
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">İndirimli Fiyat (TL)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={discountedPrice}
                      onChange={(e) => setDiscountedPrice(e.target.value)}
                      placeholder="Global fiyat"
                      className="h-8"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSavePricing} disabled={savingPrice}>
                    {savingPrice ? "Kaydediliyor…" : "Kaydet"}
                  </Button>
                  {(expert.standardPrice != null || expert.discountedPrice != null) && (
                    <Button size="sm" variant="outline" onClick={handleResetPricing} disabled={savingPrice}>
                      Globale Döndür
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-semibold">Biyografi</p>
                <p className="rounded-md border bg-muted/30 p-3 text-muted-foreground">
                  {expert.biography || "Biyografi bilgisi yok."}
                </p>
                {expert.pendingBiography && (
                  <div className="rounded-md border border-amber-200 bg-amber-50 p-3 space-y-1">
                    <p className="text-xs font-semibold text-amber-800">Onay bekleyen biyografi</p>
                    <p className="text-sm text-amber-700">{expert.pendingBiography}</p>
                  </div>
                )}
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
                <p className="font-semibold">Belgeler</p>
                <div className="rounded-md border">
                  {expert.documents.length > 0 ? (
                    expert.documents.map((doc, index) => (
                      <div key={doc.id}>
                        <div className="flex items-center justify-between gap-2 px-3 py-2 text-xs">
                          <span className={doc.isPending ? "font-medium text-amber-700" : "font-medium"}>
                            {doc.name}
                          </span>
                          {doc.url ? (
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#016a59] underline underline-offset-2 hover:opacity-80"
                            >
                              Görüntüle
                            </a>
                          ) : (
                            <span className="text-muted-foreground">URL yok</span>
                          )}
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
