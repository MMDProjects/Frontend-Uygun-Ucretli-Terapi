"use client";

import { ChevronDown, ChevronUp, Copy, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import type {
  PsychometricOption,
  PsychometricQuestion,
  PsychometricSubscale,
} from "@/types/dto/psychometric-test";

function newQId(): string {
  return `q-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function newOptId(): string {
  return `opt-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface PsychometricQuestionsEditorProps {
  questions: PsychometricQuestion[];
  subscales: PsychometricSubscale[];
  onChange: (next: PsychometricQuestion[]) => void;
}

export function PsychometricQuestionsEditor({
  questions,
  subscales,
  onChange,
}: PsychometricQuestionsEditorProps) {
  const sorted = [...questions].sort((a, b) => a.order - b.order);

  const reorder = (fromIndex: number, dir: -1 | 1) => {
    const toIndex = fromIndex + dir;
    if (toIndex < 0 || toIndex >= sorted.length) return;
    const next = [...sorted];
    const [removed] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, removed);
    onChange(
      next.map((q, i) => ({
        ...q,
        order: i + 1,
      }))
    );
  };

  const addQuestion = () => {
    const n = sorted.length + 1;
    onChange([
      ...sorted.map((q) => ({ ...q })),
      {
        id: newQId(),
        order: n,
        text: "",
        subscaleId: subscales[0]?.id,
        options: [
          { id: newOptId(), label: "Evet", score: 1 },
          { id: newOptId(), label: "Hayır", score: 0 },
        ],
      },
    ]);
  };

  const removeQuestion = (id: string) => {
    const filtered = sorted.filter((q) => q.id !== id);
    onChange(filtered.map((q, i) => ({ ...q, order: i + 1 })));
  };

  const duplicateQuestion = (q: PsychometricQuestion) => {
    const copy: PsychometricQuestion = {
      ...q,
      id: newQId(),
      order: sorted.length + 1,
      text: `${q.text} (kopya)`,
      options: q.options.map((o) => ({
        ...o,
        id: newOptId(),
      })),
    };
    onChange([...sorted.map((x) => ({ ...x })), copy]);
  };

  const patchQuestion = (id: string, partial: Partial<PsychometricQuestion>) => {
    onChange(
      sorted.map((q) => (q.id === id ? { ...q, ...partial } : q))
    );
  };

  const patchOptions = (qid: string, options: PsychometricOption[]) => {
    onChange(sorted.map((q) => (q.id === qid ? { ...q, options } : q)));
  };

  const addOption = (qid: string) => {
    const q = sorted.find((x) => x.id === qid);
    if (!q) return;
    patchOptions(qid, [
      ...q.options,
      { id: newOptId(), label: "", score: 0 },
    ]);
  };

  const removeOption = (qid: string, optId: string) => {
    const q = sorted.find((x) => x.id === qid);
    if (!q || q.options.length <= 1) return;
    patchOptions(
      qid,
      q.options.filter((o) => o.id !== optId)
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Label className="text-base font-medium">Sorular ve şıklar</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="transition-colors hover:bg-muted/80 active:scale-[0.98]"
          onClick={addQuestion}
        >
          <Plus className="mr-1 size-4" />
          Soru ekle
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Her şık için seçildiğinde eklenecek puanı girin (MOCI: Evet 1, Hayır 0 gibi).
      </p>

      <ul className="space-y-4">
        {sorted.map((q, index) => (
          <li
            key={q.id}
            className="rounded-lg border bg-card p-4 shadow-[0_4px_6px_rgba(0,0,0,0.05)]"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-medium">Soru {q.order}</span>
              <div className="flex flex-wrap gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  disabled={index === 0}
                  aria-label="Yukarı taşı"
                  onClick={() => reorder(index, -1)}
                >
                  <ChevronUp className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  disabled={index === sorted.length - 1}
                  aria-label="Aşağı taşı"
                  onClick={() => reorder(index, 1)}
                >
                  <ChevronDown className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  aria-label="Çoğalt"
                  onClick={() => duplicateQuestion(q)}
                >
                  <Copy className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-destructive"
                  aria-label="Soruyu sil"
                  onClick={() => removeQuestion(q.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="space-y-1">
                <Label htmlFor={`q-text-${q.id}`}>Soru metni</Label>
                <Textarea
                  id={`q-text-${q.id}`}
                  value={q.text}
                  onChange={(e) =>
                    patchQuestion(q.id, { text: e.target.value })
                  }
                  placeholder="Soru ifadesi"
                  rows={2}
                />
              </div>
              {subscales.length > 0 ? (
                <div className="space-y-1">
                  <Label>Alt ölçek (isteğe bağlı)</Label>
                  <Select
                    value={q.subscaleId ?? "__none__"}
                    onValueChange={(v) =>
                      patchQuestion(q.id, {
                        subscaleId:
                          v === "__none__" || v == null ? undefined : v,
                      })
                    }
                  >
                    <SelectTrigger className="w-full max-w-md">
                      <SelectValue placeholder="Seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">— Yok —</SelectItem>
                      {subscales.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name || s.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Şıklar</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => addOption(q.id)}
                  >
                    <Plus className="mr-1 size-3" />
                    Şık ekle
                  </Button>
                </div>
                <ul className="space-y-2">
                  {q.options.map((o) => (
                    <li
                      key={o.id}
                      className="flex flex-wrap items-end gap-2 rounded-md border bg-muted/20 p-2"
                    >
                      <div className="min-w-0 flex-1 space-y-1">
                        <Label className="text-xs" htmlFor={`opt-l-${o.id}`}>
                          Etiket
                        </Label>
                        <Input
                          id={`opt-l-${o.id}`}
                          value={o.label}
                          onChange={(e) =>
                            patchOptions(
                              q.id,
                              q.options.map((x) =>
                                x.id === o.id
                                  ? { ...x, label: e.target.value }
                                  : x
                              )
                            )
                          }
                          placeholder="Örn. Evet"
                        />
                      </div>
                      <div className="w-24 space-y-1">
                        <Label className="text-xs" htmlFor={`opt-s-${o.id}`}>
                          Puan
                        </Label>
                        <Input
                          id={`opt-s-${o.id}`}
                          type="number"
                          value={o.score}
                          onChange={(e) =>
                            patchOptions(
                              q.id,
                              q.options.map((x) =>
                                x.id === o.id
                                  ? {
                                      ...x,
                                      score: Number(e.target.value) || 0,
                                    }
                                  : x
                              )
                            )
                          }
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive shrink-0"
                        disabled={q.options.length <= 1}
                        onClick={() => removeOption(q.id, o.id)}
                        aria-label="Şıkkı sil"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
