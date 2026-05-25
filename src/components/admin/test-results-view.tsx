"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { PageHeader } from "@/features/admin/components/page-header";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePsychometricTests } from "@/hooks/use-psychometric-tests";
import { useTestResults } from "@/hooks/use-test-results";
import type { TestResultSubmission } from "@/types/dto/psychometric-test";
import { TestResultDetailDialog } from "./test-result-detail-dialog";

function formatWhen(iso: string): string {
  try {
    return format(parseISO(iso), "dd.MM.yyyy HH:mm", { locale: tr });
  } catch {
    return iso;
  }
}

export function TestResultsView() {
  const { tests } = usePsychometricTests();
  const [testFilter, setTestFilter] = useState<string>("__all__");
  const [search, setSearch] = useState("");

  const filters = useMemo(
    () => ({
      testId: testFilter === "__all__" ? undefined : testFilter,
      search: search.trim() || undefined,
    }),
    [testFilter, search]
  );

  const { submissions, loading, error, refetch } = useTestResults(filters);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<TestResultSubmission | null>(null);

  const openDetail = (s: TestResultSubmission) => {
    setSelected(s);
    setOpen(true);
  };

  return (
    <div className="flex-1 space-y-6">
      <PageHeader title="Test sonuçları" description="Testleri tamamlayan kullanıcıların gönderimleri.">
        <Select
          value={testFilter}
          onValueChange={(v) => setTestFilter(v ?? "__all__")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tüm testler" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Tüm testler</SelectItem>
            {tests.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="İsim veya e-posta..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[220px]"
        />
        <Button
          type="button"
          variant="outline"
          disabled={loading}
          className="transition-colors hover:bg-muted/80 active:scale-[0.98]"
          onClick={() => void refetch()}
        >
          <RefreshCw className={`mr-2 size-4 ${loading ? "animate-spin" : ""}`} />
          Yenile
        </Button>
      </PageHeader>

      <Card className="shadow-[0_4px_6px_rgba(0,0,0,0.05)] rounded-lg">
        <CardHeader>
          <CardTitle>Gönderimler</CardTitle>
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
              <Button type="button" variant="outline" onClick={() => void refetch()}>
                Tekrar dene
              </Button>
            </div>
          ) : null}
          {!loading && !error && submissions.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Sonuç bulunamadı.
            </p>
          ) : null}
          {!loading && !error && submissions.length > 0 ? (
            <>
              <div className="grid gap-3 md:hidden">
                {submissions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className="rounded-lg border bg-card p-4 text-left shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-colors hover:bg-muted/40"
                    onClick={() => openDetail(s)}
                  >
                    <p className="font-medium">{s.userName}</p>
                    <p className="text-sm text-muted-foreground">{s.testTitle}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {formatWhen(s.submittedAt)}
                    </p>
                    <p className="mt-1 text-sm">
                      Puan: <strong>{s.totalScore}</strong> · {s.matchedBandTitle}
                    </p>
                  </button>
                ))}
              </div>
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tarih</TableHead>
                      <TableHead>Kullanıcı</TableHead>
                      <TableHead>Test</TableHead>
                      <TableHead>Puan</TableHead>
                      <TableHead>Bant</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((s) => (
                      <TableRow
                        key={s.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => openDetail(s)}
                      >
                        <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                          {formatWhen(s.submittedAt)}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{s.userName}</div>
                          <div className="text-xs text-muted-foreground">
                            {s.userEmail}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <span className="line-clamp-2">{s.testTitle}</span>
                        </TableCell>
                        <TableCell className="font-mono">{s.totalScore}</TableCell>
                        <TableCell className="text-sm">
                          {s.matchedBandTitle}
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

      <TestResultDetailDialog
        submission={selected}
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) window.setTimeout(() => setSelected(null), 200);
        }}
      />
    </div>
  );
}
