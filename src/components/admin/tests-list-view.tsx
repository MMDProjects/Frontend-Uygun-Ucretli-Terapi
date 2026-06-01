"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
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
import { usePsychometricTests } from "@/hooks/use-psychometric-tests";
import type { PsychometricTestDefinition } from "@/types/dto/psychometric-test";
import { TestDetailDialog } from "./test-detail-dialog";

function formatUpdated(iso?: string): string {
  if (!iso) return "—";
  try {
    return format(parseISO(iso), "dd.MM.yyyy HH:mm", { locale: tr });
  } catch {
    return iso;
  }
}

export function TestsListView({ hideHeader }: { hideHeader?: boolean } = {}) {
  const { tests, loading, error, refetch } = usePsychometricTests();
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<PsychometricTestDefinition | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

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
    <div className="flex-1 space-y-6">
      {!hideHeader && (
        <PageHeader title="Mevcut testler" description="Sistemde tanımlı psikometrik testlerin listesi ve özeti." />
      )}
      <div className="flex flex-wrap gap-2 justify-end">
        <Input
          placeholder="Test ara…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-[280px]"
          aria-label="Test ara"
        />
        <Button
          type="button"
          variant="outline"
          disabled={loading}
          className="shrink-0 transition-colors hover:bg-muted/80 active:scale-[0.98]"
          onClick={() => void refetch()}
        >
          <RefreshCw className={`mr-2 size-4 ${loading ? "animate-spin" : ""}`} />
          Yenile
        </Button>
      </div>

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
                  <button
                    key={t.id}
                    type="button"
                    className="rounded-lg border bg-card p-4 text-left shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-colors hover:bg-muted/40 active:scale-[0.99]"
                    onClick={() => openDetail(t)}
                  >
                    <p className="font-medium">{t.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t.questions.length} soru · {t.subscales.length} alt ölçek ·{" "}
                      {formatUpdated(t.updatedAt)}
                    </p>
                  </button>
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
    </div>
  );
}
