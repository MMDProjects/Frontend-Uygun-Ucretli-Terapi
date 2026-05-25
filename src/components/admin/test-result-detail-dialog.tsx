"use client";

import { useEffect, useState } from "react";
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
import { computePsychometricScores } from "@/lib/psychometric-scoring";
import { getTest } from "@/services/tests/psychometric-tests.service";
import { getAccessToken } from "@/lib/auth-cookies";
import type {
  PsychometricTestDefinition,
  TestResultSubmission,
} from "@/types/dto/psychometric-test";

function formatWhen(iso: string): string {
  try {
    return format(parseISO(iso), "d MMMM yyyy, HH:mm", { locale: tr });
  } catch {
    return iso;
  }
}

interface TestResultDetailDialogProps {
  submission: TestResultSubmission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TestResultDetailDialog({
  submission,
  open,
  onOpenChange,
}: TestResultDetailDialogProps) {
  const [definition, setDefinition] =
    useState<PsychometricTestDefinition | null>(null);

  useEffect(() => {
    if (!open || !submission) {
      setDefinition(null);
      return;
    }
    let cancelled = false;
    void (async () => {
      const token = getAccessToken();
      const def = await getTest(submission.testId, token ?? null);
      if (!cancelled) setDefinition(def);
    })();
    return () => {
      cancelled = true;
    };
  }, [open, submission]);

  if (!submission) return null;

  const recomputed =
    definition != null
      ? computePsychometricScores(definition, submission.answers)
      : null;

  const answerRows =
    definition != null
      ? [...definition.questions]
          .sort((a, b) => a.order - b.order)
          .map((q) => {
            const optId = submission.answers[q.id];
            const opt = q.options.find((o) => o.id === optId);
            return {
              order: q.order,
              text: q.text,
              label: opt?.label ?? "(yanıt yok)",
              score: opt?.score ?? 0,
              subscaleId: q.subscaleId,
            };
          })
      : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] max-w-2xl flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="shrink-0 border-b px-4 py-3 pr-12">
          <DialogTitle className="text-left">Test sonucu</DialogTitle>
          <p className="text-left text-sm text-muted-foreground">
            {submission.testTitle}
          </p>
        </DialogHeader>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-3 text-sm">
          <div className="rounded-md border bg-muted/30 p-3">
            <p>
              <span className="font-medium text-foreground">
                {submission.userName}
              </span>
              <span className="text-muted-foreground">
                {" "}
                · {submission.userEmail}
              </span>
            </p>
            <p className="mt-1 text-muted-foreground">
              Gönderim: {formatWhen(submission.submittedAt)}
            </p>
            <p className="mt-2">
              <span className="font-medium">Kayıtlı toplam:</span>{" "}
              {submission.totalScore} ·{" "}
              <span className="font-medium">Bant:</span>{" "}
              {submission.matchedBandTitle}
            </p>
            {recomputed ? (
              <p className="mt-1 text-xs text-muted-foreground">
                Tanımdan yeniden hesap: toplam {recomputed.totalScore}
                {recomputed.band
                  ? ` · bant: ${recomputed.band.title}`
                  : " · bant eşleşmedi"}
                {recomputed.totalScore !== submission.totalScore ? (
                  <span className="ml-1 text-amber-700 dark:text-amber-400">
                    (kayıtlı skorla farklı — tanım güncellenmiş olabilir)
                  </span>
                ) : null}
              </p>
            ) : (
              <p className="mt-1 text-xs text-muted-foreground">
                Test tanımı yükleniyor veya bulunamadı.
              </p>
            )}
          </div>

          {definition && recomputed ? (
            <section>
              <h4 className="mb-2 font-medium">Alt ölçek puanları</h4>
              {Object.keys(recomputed.subscaleScores).length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Alt ölçek atanmamış sorular.
                </p>
              ) : (
                <ul className="space-y-1">
                  {Object.entries(recomputed.subscaleScores).map(
                    ([sid, sc]) => {
                      const name =
                        definition.subscales.find((s) => s.id === sid)?.name ??
                        sid;
                      return (
                        <li
                          key={sid}
                          className="flex justify-between rounded-md border px-3 py-1.5"
                        >
                          <span>{name}</span>
                          <span className="font-mono font-medium">{sc}</span>
                        </li>
                      );
                    }
                  )}
                </ul>
              )}
            </section>
          ) : null}

          {answerRows.length > 0 ? (
            <section>
              <h4 className="mb-2 font-medium">Yanıtlar</h4>
              <ol className="list-decimal space-y-2 pl-5 text-muted-foreground">
                {answerRows.map((row) => (
                  <li key={row.order} className="marker:font-medium">
                    <span className="text-foreground">{row.text}</span>
                    <div className="mt-0.5 text-xs">
                      Seçim: <strong>{row.label}</strong> (+{row.score} puan)
                      {row.subscaleId ? ` · ${row.subscaleId}` : null}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}
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
