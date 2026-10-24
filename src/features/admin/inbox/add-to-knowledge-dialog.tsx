"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { createKnowledge } from "@/services/inbox/knowledge.service";
import type { KnowledgeCategory } from "@/services/inbox/types";

export const KNOWLEDGE_CATEGORY_LABELS: Record<KnowledgeCategory, string> = {
  FIYAT: "Fiyat",
  HIZMET: "Hizmet",
  PROSEDUR: "Prosedür",
  SSS: "SSS",
};

const CATEGORY_ORDER: KnowledgeCategory[] = ["FIYAT", "HIZMET", "PROSEDUR", "SSS"];

interface AddToKnowledgeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTitle: string;
  initialContent: string;
}

export function AddToKnowledgeDialog({
  open,
  onOpenChange,
  initialTitle,
  initialContent,
}: AddToKnowledgeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        {open ? (
          <AddToKnowledgeForm
            key={`${initialTitle}\u0000${initialContent}`}
            initialTitle={initialTitle}
            initialContent={initialContent}
            onClose={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function AddToKnowledgeForm({
  initialTitle,
  initialContent,
  onClose,
}: {
  initialTitle: string;
  initialContent: string;
  onClose: () => void;
}) {
  const [category, setCategory] = useState<KnowledgeCategory>("SSS");
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [piiConfirmed, setPiiConfirmed] = useState(false);
  const [saving, setSaving] = useState(false);

  const canSave = piiConfirmed && title.trim().length > 0 && content.trim().length > 0 && !saving;

  async function handleSave() {
    if (!canSave) return;
    setSaving(true);
    try {
      await createKnowledge({
        category,
        title: title.trim(),
        content: content.trim(),
        piiConfirmed: true,
        source: "CONVERSATION",
      });
      toast.success("Bilgi bankasına eklendi");
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kayıt eklenemedi");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Bilgi bankasına ekle</DialogTitle>
        <DialogDescription>
          Elif bu bilgiyi gelecekteki konuşmalarda kullanacak. Başlık ve içeriği
          düzenleyebilirsiniz.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label>Kategori</Label>
          <Select
            value={category}
            onValueChange={(v) => setCategory(v as KnowledgeCategory)}
          >
            <SelectTrigger className="w-full">
              <SelectValue>{KNOWLEDGE_CATEGORY_LABELS[category]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_ORDER.map((c) => (
                <SelectItem key={c} value={c}>
                  {KNOWLEDGE_CATEGORY_LABELS[c]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="kb-title">Başlık (danışanın sorusu)</Label>
          <Input
            id="kb-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-10 rounded-lg text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="kb-content">İçerik (personel cevabı)</Label>
          <Textarea
            id="kb-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            className="min-h-28 rounded-lg px-3 py-2"
          />
        </div>

        <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-border bg-muted/40 p-3 text-sm">
          <input
            type="checkbox"
            checked={piiConfirmed}
            onChange={(e) => setPiiConfirmed(e.target.checked)}
            className="mt-0.5 size-4 accent-[#016a59]"
          />
          <span>
            Kişisel bilgileri (ad, telefon, sağlık bilgisi vb.) çıkardım
          </span>
        </label>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
          Vazgeç
        </Button>
        <Button type="button" onClick={() => void handleSave()} disabled={!canSave}>
          {saving ? <Loader2 className="size-4 animate-spin" /> : null}
          Kaydet
        </Button>
      </DialogFooter>
    </>
  );
}
