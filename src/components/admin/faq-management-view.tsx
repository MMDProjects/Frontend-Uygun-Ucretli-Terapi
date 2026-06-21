"use client";

import { useCallback, useMemo, useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/features/admin/components/page-header";
import { toast } from "sonner";

import { useFaqs } from "@/hooks/use-faqs";
import type { FaqDto, FaqInput, FaqStatus } from "@/types/dto/faq";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const FAQ_CATEGORIES: { id: string; label: string }[] = [
  { id: "genel", label: "Genel" },
  { id: "randevu", label: "Randevu" },
  { id: "odeme", label: "Ödeme" },
  { id: "uzman", label: "Uzman seçimi" },
  { id: "gizlilik", label: "Gizlilik ve güvenlik" },
];

const CATEGORY_LABELS: Record<string, string> = FAQ_CATEGORIES.reduce(
  (acc, c) => ({ ...acc, [c.id]: c.label }),
  {} as Record<string, string>
);

const EMPTY_INPUT: FaqInput = {
  question: "",
  answer: "",
  category: "genel",
  order: 1,
  status: "published",
};

type DialogMode = { kind: "closed" } | { kind: "create" } | { kind: "edit"; faq: FaqDto };

export function FaqManagementView() {
  const { faqs, loading, error, refetch, add, edit, remove } = useFaqs();
  const [dialog, setDialog] = useState<DialogMode>({ kind: "closed" });
  const [pendingDelete, setPendingDelete] = useState<FaqDto | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState<FaqInput>(EMPTY_INPUT);

  const nextOrderForCategory = useCallback(
    (category: string) => {
      const inCat = faqs.filter((f) => f.category === category);
      if (inCat.length === 0) return 1;
      return Math.max(...inCat.map((f) => f.order)) + 1;
    },
    [faqs]
  );

  const groupedFaqs = useMemo(() => {
    const sorted = [...faqs].sort((a, b) => a.order - b.order);
    const catOrder: string[] = [];
    const map = new Map<string, FaqDto[]>();
    for (const f of sorted) {
      if (!map.has(f.category)) {
        catOrder.push(f.category);
        map.set(f.category, []);
      }
      map.get(f.category)!.push(f);
    }
    return catOrder.map((cat) => ({
      cat,
      label: CATEGORY_LABELS[cat] ?? cat,
      items: map.get(cat)!,
    }));
  }, [faqs]);

  const openCreate = () => {
    const defaultCat = "genel";
    setFormData({ ...EMPTY_INPUT, order: nextOrderForCategory(defaultCat) });
    setDialog({ kind: "create" });
  };

  const openEdit = (faq: FaqDto) => {
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      order: faq.order,
      status: faq.status,
    });
    setDialog({ kind: "edit", faq });
  };

  const closeDialog = () => {
    if (submitting) return;
    setDialog({ kind: "closed" });
  };

  const handleSubmit = async () => {
    const question = formData.question.trim();
    const answer = formData.answer.trim();
    if (!question || !answer) {
      toast.error("Soru ve cevap alanları zorunludur.");
      return;
    }

    const payload: FaqInput = {
      ...formData,
      question,
      answer,
      order: Number.isFinite(formData.order) ? formData.order : 1,
    };

    setSubmitting(true);
    try {
      if (dialog.kind === "create") {
        const created = await add(payload);
        if (created) {
          toast.success("SSS eklendi (yerel, API TODO)");
          setDialog({ kind: "closed" });
        } else {
          toast.error("SSS eklenemedi");
        }
      } else if (dialog.kind === "edit") {
        const updated = await edit(dialog.faq.id, payload);
        if (updated) {
          toast.success("SSS güncellendi (yerel, API TODO)");
          setDialog({ kind: "closed" });
        } else {
          toast.error("SSS güncellenemedi");
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      const ok = await remove(pendingDelete.id);
      if (ok) {
        toast.success("SSS silindi (yerel, API TODO)");
        setPendingDelete(null);
      } else {
        toast.error("SSS silinemedi");
      }
    } finally {
      setDeleting(false);
    }
  };

  const isDialogOpen = dialog.kind !== "closed";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sık Sorulan Sorular"
        description="Platformda yayınlanan SSS kayıtlarını ekleyin, düzenleyin veya silin. Yalnızca Yayında durumundaki kayıtlar kullanıcılara gösterilir."
      >
        <Button
          type="button"
          onClick={openCreate}
          className="bg-[#00A86B] hover:bg-[#008f5a] active:bg-[#007a4d] text-white"
        >
          <Plus className="size-4" />
          Yeni SSS Ekle
        </Button>
      </PageHeader>

      {loading ? (
        <Card>
          <CardContent className="flex min-h-40 items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              SSS kayıtları yükleniyor...
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

      {!loading && !error && faqs.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            Henüz SSS kaydı eklenmemiş. Sağ üstten yeni bir SSS ekleyebilirsiniz.
          </CardContent>
        </Card>
      ) : null}

      {!loading && !error && faqs.length > 0 ? (
        <div className="space-y-8">
          {groupedFaqs.map(({ cat, label, items }) => (
            <div key={cat}>
              <div className="mb-3 flex items-center gap-3">
                <span className="inline-flex shrink-0 items-center rounded-full bg-[#e6f0ee] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#014a3e]">
                  {label}
                </span>
                <div className="h-px flex-1 bg-border/50" />
                <span className="shrink-0 text-xs text-muted-foreground">
                  {items.length} kayıt
                </span>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {items.map((faq) => (
                  <Card
                    key={faq.id}
                    className="rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.05)]"
                  >
                    <CardHeader className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <Badge
                          variant="outline"
                          className={
                            faq.status === "published"
                              ? "border-[#27AE60]/30 bg-[#27AE60]/10 text-[#27AE60]"
                              : "border-muted-foreground/30 bg-muted text-muted-foreground"
                          }
                        >
                          {faq.status === "published" ? "Yayında" : "Taslak"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Sıra #{faq.order}
                        </span>
                      </div>
                      <CardTitle className="text-base leading-snug">
                        {faq.question}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="line-clamp-3 text-sm text-muted-foreground">
                        {faq.answer}
                      </p>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs text-muted-foreground">
                          Güncellendi: {faq.updatedAt}
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => openEdit(faq)}
                          >
                            <Pencil className="size-4" />
                            Düzenle
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="border-[#EB5757]/30 text-[#EB5757] hover:bg-[#EB5757]/10 hover:text-[#EB5757]"
                            onClick={() => setPendingDelete(faq)}
                          >
                            <Trash2 className="size-4" />
                            Sil
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {dialog.kind === "edit" ? "SSS Düzenle" : "Yeni SSS Ekle"}
            </DialogTitle>
            <DialogDescription>
              Soru, cevap ve yayın bilgilerini girin. Taslak olarak kaydedilen
              kayıtlar kullanıcılara gösterilmez.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="faq-question">Soru *</Label>
              <Input
                id="faq-question"
                value={formData.question}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, question: e.target.value }))
                }
                placeholder="Örn: Randevumu nasıl oluşturabilirim?"
                maxLength={200}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="faq-answer">Cevap *</Label>
              <Textarea
                id="faq-answer"
                value={formData.answer}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, answer: e.target.value }))
                }
                placeholder="Kullanıcıya yardımcı olacak açıklayıcı bir cevap yazın."
                rows={5}
                maxLength={2000}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="faq-category">Kategori *</Label>
                <Select
                  value={formData.category || null}
                  onValueChange={(value) => {
                    const cat = value ?? "genel";
                    setFormData((prev) => ({
                      ...prev,
                      category: cat,
                      ...(dialog.kind === "create"
                        ? { order: nextOrderForCategory(cat) }
                        : {}),
                    }));
                  }}
                >
                  <SelectTrigger id="faq-category" className="w-full min-w-0">
                    <SelectValue placeholder="Kategori seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {FAQ_CATEGORIES.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="faq-order">Kategori İçi Sıra *</Label>
                <Input
                  id="faq-order"
                  type="number"
                  min={1}
                  value={formData.order}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      order: Number(e.target.value) || 1,
                    }))
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Yalnızca seçilen kategori içindeki sıralamayı belirler.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label htmlFor="faq-status" className="text-sm font-medium">
                  Yayında
                </Label>
                <p className="text-xs text-muted-foreground">
                  Kapalıyken SSS taslak olarak saklanır.
                </p>
              </div>
              <Switch
                id="faq-status"
                checked={formData.status === "published"}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: (checked ? "published" : "draft") as FaqStatus,
                  }))
                }
                aria-label="SSS yayın durumu"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={closeDialog}
              disabled={submitting}
            >
              İptal
            </Button>
            <Button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={submitting}
              className="bg-[#00A86B] hover:bg-[#008f5a] active:bg-[#007a4d] text-white"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                "Kaydet"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) setPendingDelete(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>SSS&apos;yi silmek istediğinize emin misiniz?</DialogTitle>
            <DialogDescription>
              Bu işlem geri alınamaz. Kayıt kalıcı olarak silinecek.
            </DialogDescription>
          </DialogHeader>
          {pendingDelete ? (
            <div className="rounded-md border bg-muted/20 p-3 text-sm text-foreground">
              {pendingDelete.question}
            </div>
          ) : null}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setPendingDelete(null)}
              disabled={deleting}
            >
              İptal
            </Button>
            <Button
              type="button"
              onClick={() => void handleDelete()}
              disabled={deleting}
              className="bg-[#EB5757] hover:bg-[#d04848] active:bg-[#b63c3c] text-white"
            >
              {deleting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Siliniyor...
                </>
              ) : (
                "Sil"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
