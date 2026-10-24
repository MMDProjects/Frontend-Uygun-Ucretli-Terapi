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
import { resolveUnanswered } from "@/services/inbox/knowledge.service";
import type {
  KnowledgeCategory,
  UnansweredQuestion,
} from "@/services/inbox/types";
import { CategorySelect } from "./category-select";
import { PiiCheckbox } from "./pii-checkbox";

interface ResolveDialogProps {
  question: UnansweredQuestion | null;
  onClose: () => void;
  onResolved: () => void;
}

export function ResolveDialog({
  question,
  onClose,
  onResolved,
}: ResolveDialogProps) {
  const [saving, setSaving] = useState(false);
  return (
    <Dialog
      open={question !== null}
      onOpenChange={(o) => (!o && !saving ? onClose() : undefined)}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        {question ? (
          <ResolveForm
            key={question.id}
            question={question}
            saving={saving}
            setSaving={setSaving}
            onClose={onClose}
            onResolved={onResolved}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

interface ResolveFormProps {
  question: UnansweredQuestion;
  saving: boolean;
  setSaving: (saving: boolean) => void;
  onClose: () => void;
  onResolved: () => void;
}

function ResolveForm({
  question,
  saving,
  setSaving,
  onClose,
  onResolved,
}: ResolveFormProps) {
  const [category, setCategory] = useState<KnowledgeCategory>("SSS");
  const [title, setTitle] = useState(question.question);
  const [content, setContent] = useState("");
  const [pii, setPii] = useState(false);

  const canSave =
    title.trim().length > 0 && content.trim().length > 0 && pii && !saving;

  const handleSave = async () => {
    setSaving(true);
    try {
      await resolveUnanswered(question.id, {
        addToKnowledge: true,
        category,
        title: title.trim(),
        content: content.trim(),
        piiConfirmed: pii,
      });
      toast.success("Bilgi bankasına eklendi");
      onResolved();
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Soru çözülemedi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Cevapla ve ekle</DialogTitle>
        <DialogDescription>
          Yazdığınız cevap bilgi bankasına eklenir; Elif benzer sorularda bunu
          kullanır.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>Kategori</Label>
          <CategorySelect value={category} onChange={setCategory} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="rs-title">Başlık</Label>
          <Input
            id="rs-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="rs-content">Cevap</Label>
          <Textarea
            id="rs-content"
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Elif'in danışana vereceği cevap"
          />
        </div>
        <PiiCheckbox id="rs-pii" checked={pii} onChange={setPii} />
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
          {saving ? "Ekleniyor…" : "Ekle"}
        </Button>
      </DialogFooter>
    </>
  );
}
