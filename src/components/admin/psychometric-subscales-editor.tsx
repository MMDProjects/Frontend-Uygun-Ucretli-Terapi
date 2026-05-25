"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PsychometricSubscale } from "@/types/dto/psychometric-test";

function newId(): string {
  return `sc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface PsychometricSubscalesEditorProps {
  subscales: PsychometricSubscale[];
  onChange: (next: PsychometricSubscale[]) => void;
}

export function PsychometricSubscalesEditor({
  subscales,
  onChange,
}: PsychometricSubscalesEditorProps) {
  const add = () => {
    onChange([
      ...subscales,
      { id: newId(), name: "", description: "" },
    ]);
  };

  const remove = (id: string) => {
    onChange(subscales.filter((s) => s.id !== id));
  };

  const patch = (id: string, patch: Partial<PsychometricSubscale>) => {
    onChange(
      subscales.map((s) => (s.id === id ? { ...s, ...patch } : s))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Label className="text-base font-medium">Alt ölçekler</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="transition-colors hover:bg-muted/80 active:scale-[0.98]"
          onClick={add}
        >
          <Plus className="mr-1 size-4" />
          Alt ölçek ekle
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Soruları bu alt ölçeklere bağlayarak ara puanları hesaplatabilirsiniz.
      </p>
      <ul className="space-y-3">
        {subscales.map((s, index) => (
          <li
            key={s.id}
            className="rounded-lg border bg-card p-3 shadow-[0_4px_6px_rgba(0,0,0,0.05)]"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                #{index + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-destructive hover:bg-destructive/10"
                onClick={() => remove(s.id)}
                aria-label="Alt ölçeği sil"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor={`sc-name-${s.id}`}>Ad</Label>
                <Input
                  id={`sc-name-${s.id}`}
                  value={s.name}
                  onChange={(e) => patch(s.id, { name: e.target.value })}
                  placeholder="Örn. Temizlik / Titizlik"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label htmlFor={`sc-desc-${s.id}`}>Açıklama (isteğe bağlı)</Label>
                <Input
                  id={`sc-desc-${s.id}`}
                  value={s.description ?? ""}
                  onChange={(e) => patch(s.id, { description: e.target.value })}
                  placeholder="Kısa açıklama"
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
      {subscales.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Henüz alt ölçek yok. İsterseniz boş bırakıp yalnızca toplam puan kullanabilirsiniz.
        </p>
      ) : null}
    </div>
  );
}
