"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, RefreshCw, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/features/admin/components/page-header";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { usePsychometricTests } from "@/hooks/use-psychometric-tests";
import type { PsychometricTestDefinition } from "@/types/dto/psychometric-test";
import { deleteTest, type SavePsychometricTestPayload } from "@/services/tests/psychometric-tests.service";
import { TestDetailDialog } from "./test-detail-dialog";
import { PsychometricTestBuilderView } from "./psychometric-test-builder-view";

function formatUpdated(iso?: string): string {
  if (!iso) return "—";
  try {
    return format(parseISO(iso), "dd.MM.yyyy HH:mm", { locale: tr });
  } catch {
    return iso;
  }
}

interface TestsListViewProps {
  hideHeader?: boolean;
  externalSearch?: string;
  onRefresh?: () => void;
}

export function TestsListView({ hideHeader, externalSearch, onRefresh }: TestsListViewProps = {}) {
  const { tests, loading, error, refetch } = usePsychometricTests();
  const [internalSearch, setInternalSearch] = useState("");
  const search = externalSearch ?? internalSearch;
  const [detail, setDetail] = useState<PsychometricTestDefinition | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<SavePsychometricTestPayload | null>(null);

  async function handleDelete(t: PsychometricTestDefinition, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm(`"${t.title}" testini silmek istediğinize emin misiniz? Tüm test sonuçları da silinecektir.`)) return;
    try {
      await deleteTest(t.id);
      toast.success("Test silindi.");
      void refetch();
      onRefresh?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Silinemedi.");
    }
  }

  function handleEdit(t: PsychometricTestDefinition, e: React.MouseEvent) {
    e.stopPropagation();
    setEditTarget({
      id: t.id,
      title: t.title,
      description: t.description,
      disclaimer: t.disclaimer,
      subscales: t.subscales,
      interpretationBands: t.interpretationBands,
      questions: t.questions,
    });
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return tests;
    return tests.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    );
  }, [tests, search]);

  const openDetail = (t: PsychometricTestDefinition) => {
    setDetail(t);
    setDetailOpen(true);
  };

  return (
    <div className="flex-1 space-y-4">
      {!hideHeader && (
        <PageHeader title="Mevcut testler" description="Sistemde tanımlı psikometrik testlerin listesi ve özeti.">
          <Input
            placeholder="Test ara…"
            value={internalSearch}
            onChange={(e) => setInternalSearch(e.target.value)}
            className="w-full sm:w-[280px]"
            aria-label="Test ara"
          />
          <Button type="button" variant="outline" disabled={loading}
            className="shrink-0" onClick={() => void refetch()}>
            <RefreshCw className={`mr-2 size-4 ${loading ? "animate-spin" : ""}`} />
            Yenile
          </Button>
        </PageHeader>
      )}

      <Card className="shadow-[0_4px_6px_rgba(0,0,0,0.05)] rounded-lg">
        <CardHeader>
          <CardTitle>Test kataloğu</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : null}
          {error && !loading ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center text-destructive">
              <AlertTriangle className="size-8" />
              <p className="text-sm">{error}</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => void refetch()}
              >
                Tekrar dene
              </Button>
            </div>
          ) : null}
          {!loading && !error && filtered.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Test bulunamadı.
            </p>
          ) : null}
          {!loading && !error && filtered.length > 0 ? (
            <>
              <div className="grid gap-3 md:hidden">
                {filtered.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-3 rounded-lg border bg-card p-4 shadow-[0_4px_6px_rgba(0,0,0,0.05)]"
                  >
                    <button
                      type="button"
                      className="flex-1 text-left transition-colors hover:text-primary active:scale-[0.99]"
                      onClick={() => openDetail(t)}
                    >
                      <p className="font-medium">{t.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {t.questions.length} soru · {t.subscales.length} alt ölçek ·{" "}
                        {formatUpdated(t.updatedAt)}
                      </p>
                    </button>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleEdit(t, e)}
                        className="flex size-8 items-center justify-center rounded-xl border border-border/60 text-muted-foreground transition hover:border-primary/30 hover:text-primary"
                        aria-label="Düzenle"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => void handleDelete(t, e)}
                        className="flex size-8 items-center justify-center rounded-xl border border-border/60 text-muted-foreground transition hover:border-destructive/30 hover:text-destructive"
                        aria-label="Sil"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Test</TableHead>
                      <TableHead>Soru</TableHead>
                      <TableHead>Alt ölçek</TableHead>
                      <TableHead>Güncelleme</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((t) => (
                      <TableRow
                        key={t.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => openDetail(t)}
                      >
                        <TableCell className="max-w-[280px] font-medium">
                          {t.title}
                        </TableCell>
                        <TableCell>{t.questions.length}</TableCell>
                        <TableCell>{t.subscales.length}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {formatUpdated(t.updatedAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => handleEdit(t, e)}
                              className="flex size-7 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition hover:border-primary/30 hover:text-primary"
                              aria-label="Düzenle"
                            >
                              <Pencil className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => void handleDelete(t, e)}
                              className="flex size-7 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition hover:border-destructive/30 hover:text-destructive"
                              aria-label="Sil"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>

      <TestDetailDialog
        test={detail}
        open={detailOpen}
        onOpenChange={(o) => {
          setDetailOpen(o);
          if (!o) window.setTimeout(() => setDetail(null), 200);
        }}
      />

      <Dialog open={editTarget !== null} onOpenChange={(o) => { if (!o) setEditTarget(null); }}>
        <DialogContent className="flex max-h-[92vh] max-w-4xl flex-col gap-0 overflow-y-auto p-6">
          {editTarget && (
            <PsychometricTestBuilderView
              hideHeader={false}
              initialData={editTarget}
              onSaved={() => {
                setEditTarget(null);
                void refetch();
                onRefresh?.();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
