"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  createKnowledge,
  updateKnowledge,
} from "@/services/inbox/knowledge.service";
import type { KnowledgeCategory, KnowledgeEntry } from "@/services/inbox/types";
import { CategorySelect } from "./category-select";
import { PiiCheckbox } from "./pii-checkbox";

interface EntryDialogProps {
  open: boolean;
  entry: KnowledgeEntry | null;
  onClose: () => void;
  onSaved: () => void;
}

export function EntryDialog({
  open,
  entry,
  onClose,
  onSaved,
}: EntryDialogProps) {
  const [saving, setSaving] = useState(false);
  return (
    <Dialog
      open={open}
      onOpenChange={(o) => (!o && !saving ? onClose() : undefined)}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <EntryForm
          key={entry?.id ?? "new"}
          entry={entry}
          saving={saving}
          setSaving={setSaving}
          onClose={onClose}
          onSaved={onSaved}
        />
      </DialogContent>
    </Dialog>
  );
}

interface EntryFormProps {
  entry: KnowledgeEntry | null;
  saving: boolean;
  setSaving: (saving: boolean) => void;
  onClose: () => void;
  onSaved: () => void;
}

function EntryForm({
  entry,
  saving,
  setSaving,
  onClose,
  onSaved,
}: EntryFormProps) {
  const [category, setCategory] = useState<KnowledgeCategory>(
    entry?.category ?? "HIZMET",
  );
  const [title, setTitle] = useState(entry?.title ?? "");
  const [content, setContent] = useState(entry?.content ?? "");
  const [pii, setPii] = useState(false);

  const isEdit = entry !== null;
  const canSave =
    title.trim().length > 0 &&
    content.trim().length > 0 &&
    (isEdit || pii) &&
    !saving;

  const handleSave = async () => {
    setSaving(true);
    try {
      if (entry) {
        await updateKnowledge(entry.id, {
          category,
          title: title.trim(),
          content: content.trim(),
        });
        toast.success("Kayıt güncellendi");
      } else {
        await createKnowledge({
          category,
          title: title.trim(),
          content: content.trim(),
          piiConfirmed: pii,
          source: "MANUAL",
        });
        toast.success("Kayıt eklendi");
      }
      onSaved();
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Kayıt kaydedilemedi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEdit ? "Kaydı düzenle" : "Yeni kayıt"}</DialogTitle>
        <DialogDescription>
          {isEdit
            ? "Kaydı kaydettiğinizde Elif'in kullandığı arama bilgisi de yenilenir."
            : "Elif'in cevap verirken kullanacağı bilgiyi ekleyin."}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>Kategori</Label>
          <CategorySelect value={category} onChange={setCategory} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="kb-title">Başlık</Label>
          <Input
            id="kb-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Örn. Seans ücretleri"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="kb-content">İçerik</Label>
          <Textarea
            id="kb-content"
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Elif'in danışana vereceği cevap"
          />
        </div>
        {!isEdit ? (
          <PiiCheckbox id="kb-pii" checked={pii} onChange={setPii} />
        ) : null}
      </div>
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          disabled={saving}
          onClick={onClose}
        >
          İptal
        </Button>
        <Button
          type="button"
          disabled={!canSave}
          onClick={() => void handleSave()}
        >
          {saving ? "Kaydediliyor…" : "Kaydet"}
        </Button>
      </DialogFooter>
    </>
  );
}
