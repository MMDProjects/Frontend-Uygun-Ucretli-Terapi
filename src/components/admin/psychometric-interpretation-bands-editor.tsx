"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PsychometricInterpretationBand } from "@/types/dto/psychometric-test";

function newId(): string {
  return `band-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface PsychometricInterpretationBandsEditorProps {
  bands: PsychometricInterpretationBand[];
  onChange: (next: PsychometricInterpretationBand[]) => void;
}

export function PsychometricInterpretationBandsEditor({
  bands,
  onChange,
}: PsychometricInterpretationBandsEditorProps) {
  const add = () => {
    onChange([
      ...bands,
      {
        id: newId(),
        minScore: 0,
        maxScore: 0,
        title: "",
        summary: "",
      },
    ]);
  };

  const remove = (id: string) => {
    onChange(bands.filter((b) => b.id !== id));
  };

  const patch = (
    id: string,
    partial: Partial<PsychometricInterpretationBand>
  ) => {
    onChange(bands.map((b) => (b.id === id ? { ...b, ...partial } : b)));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Label className="text-base font-medium">Yorum bantları (toplam puan)</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="transition-colors hover:bg-muted/80 active:scale-[0.98]"
          onClick={add}
        >
          <Plus className="mr-1 size-4" />
          Bant ekle
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Toplam puan hangi aralıkta hangi yorumu alır (ör. 0–7 normal, 8–15 hafif).
      </p>
      <ul className="space-y-3">
        {bands.map((b, index) => (
          <li
            key={b.id}
            className="rounded-lg border bg-card p-3 shadow-[0_4px_6px_rgba(0,0,0,0.05)]"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Bant #{index + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-destructive hover:bg-destructive/10"
                onClick={() => remove(b.id)}
                aria-label="Bantı sil"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor={`band-min-${b.id}`}>Min puan</Label>
                <Input
                  id={`band-min-${b.id}`}
                  type="number"
                  value={b.minScore}
                  onChange={(e) =>
                    patch(b.id, { minScore: Number(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`band-max-${b.id}`}>Max puan</Label>
                <Input
                  id={`band-max-${b.id}`}
                  type="number"
                  value={b.maxScore}
                  onChange={(e) =>
                    patch(b.id, { maxScore: Number(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label htmlFor={`band-title-${b.id}`}>Başlık</Label>
                <Input
                  id={`band-title-${b.id}`}
                  value={b.title}
                  onChange={(e) => patch(b.id, { title: e.target.value })}
                  placeholder="Örn. Hafif düzey"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label htmlFor={`band-sum-${b.id}`}>Özet / yorum metni</Label>
                <Textarea
                  id={`band-sum-${b.id}`}
                  value={b.summary}
                  onChange={(e) => patch(b.id, { summary: e.target.value })}
                  rows={2}
                  placeholder="Kısa açıklama"
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
