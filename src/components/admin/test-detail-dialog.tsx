"use client";

import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PsychometricTestDefinition } from "@/types/dto/psychometric-test";

function formatUpdated(iso?: string): string {
  if (!iso) return "—";
  try {
    return format(parseISO(iso), "d MMMM yyyy, HH:mm", { locale: tr });
  } catch {
    return iso;
  }
}

interface TestDetailDialogProps {
  test: PsychometricTestDefinition | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TestDetailDialog({
  test,
  open,
  onOpenChange,
}: TestDetailDialogProps) {
  if (!test) return null;

  const previewQuestions = [...test.questions]
    .sort((a, b) => a.order - b.order)
    .slice(0, 15);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] max-w-2xl flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="shrink-0 border-b px-4 py-3 pr-12">
          <DialogTitle className="text-left leading-snug">{test.title}</DialogTitle>
          <p className="text-left text-xs text-muted-foreground">
            Güncelleme: {formatUpdated(test.updatedAt)} · {test.questions.length}{" "}
            soru · {test.subscales.length} alt ölçek
          </p>
        </DialogHeader>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-3 text-sm">
          <section>
            <h4 className="mb-1 font-medium">Açıklama</h4>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {test.description || "—"}
            </p>
          </section>
          {test.disclaimer ? (
            <section className="rounded-md border border-amber-200/80 bg-amber-50/80 p-3 text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-100">
              <h4 className="mb-1 font-medium">Uyarı / sorumluluk</h4>
              <p className="whitespace-pre-wrap">{test.disclaimer}</p>
            </section>
          ) : null}
          <section>
            <h4 className="mb-2 font-medium">Alt ölçekler</h4>
            {test.subscales.length === 0 ? (
              <p className="text-muted-foreground">Tanımlı alt ölçek yok.</p>
            ) : (
              <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                {test.subscales.map((s) => (
                  <li key={s.id}>
                    <span className="font-medium text-foreground">{s.name}</span>
                    {s.description ? ` — ${s.description}` : null}
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section>
            <h4 className="mb-2 font-medium">Yorum bantları</h4>
            <ul className="space-y-2">
              {test.interpretationBands.map((b) => (
                <li
                  key={b.id}
                  className="rounded-md border bg-muted/30 px-3 py-2"
                >
                  <span className="font-medium">
                    {b.minScore}–{b.maxScore} puan: {b.title}
                  </span>
                  <p className="mt-0.5 text-muted-foreground">{b.summary}</p>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h4 className="mb-2 font-medium">
              Sorular (özet — ilk {previewQuestions.length} / {test.questions.length})
            </h4>
            <ol className="list-decimal space-y-2 pl-5 text-muted-foreground">
              {previewQuestions.map((q) => (
                <li key={q.id} className="marker:font-medium">
                  <span className="text-foreground">{q.text}</span>
                  <span className="mt-1 block text-xs">
                    Şıklar:{" "}
                    {q.options.map((o) => `${o.label} (${o.score} puan)`).join(" · ")}
                  </span>
                </li>
              ))}
            </ol>
            {test.questions.length > previewQuestions.length ? (
              <p className="mt-2 text-xs text-muted-foreground">
                Liste kısaltıldı; tam metin için testi dışa aktarma (API) ile
                kullanılabilir.
              </p>
            ) : null}
          </section>
        </div>
        <DialogFooter className="shrink-0 border-t">
          <Button
            type="button"
            variant="outline"
            className="transition-colors hover:bg-muted/80 active:scale-[0.98]"
            onClick={() => onOpenChange(false)}
          >
            Kapat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
