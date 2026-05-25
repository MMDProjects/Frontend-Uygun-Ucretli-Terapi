"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import type { ExpertListItem } from "@/types/dto/expert-list";

function ExpertPriorityEditor({
  expertId,
  score,
  disabled,
  onSave,
}: {
  expertId: string;
  score: number;
  disabled?: boolean;
  onSave: (id: string, value: number) => Promise<void>;
}) {
  const [value, setValue] = useState(String(score));
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setValue(String(score));
  }, [score, expertId]);

  const commit = async () => {
    const raw = Number(String(value).replace(/\s/g, ""));
    const parsed = Number.isFinite(raw) ? raw : 0;
    setPending(true);
    try {
      await onSave(expertId, parsed);
    } finally {
      setPending(false);
    }
  };

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      onClick={(e) => e.stopPropagation()}
    >
      <Input
        type="number"
        inputMode="numeric"
        min={0}
        max={999_999}
        className="h-9 w-[6.5rem] tabular-nums"
        value={value}
        disabled={disabled || pending}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") void commit();
        }}
        aria-label="Öncelik skoru"
      />
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="shrink-0"
        disabled={disabled || pending}
        onClick={() => void commit()}
      >
        Kaydet
      </Button>
    </div>
  );
}

const statusBadgeClass = (status: ExpertListItem["status"]) =>
  status === "active"
    ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/30"
    : "";

interface ExpertsTableProps {
  experts: ExpertListItem[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onOpenDetail: (expertId: string) => void;
  onSavePriority: (expertId: string, score: number) => Promise<void>;
  onOpenWarning: (expert: ExpertListItem) => void;
  onStatusToggle: (expertId: string) => void;
}

export function ExpertsTable({
  experts,
  loading,
  error,
  onRefresh,
  onOpenDetail,
  onSavePriority,
  onOpenWarning,
  onStatusToggle,
}: ExpertsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Kayıtlı uzman listesi</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : null}

        {error && !loading ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center text-destructive">
            <AlertTriangle className="size-8" />
            <p className="text-sm">{error}</p>
            <Button type="button" variant="outline" onClick={() => void onRefresh()}>
              Tekrar dene
            </Button>
          </div>
        ) : null}

        {!loading && !error && experts.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Kayıtlı uzman bulunamadı.
          </p>
        ) : null}

        {!loading && !error && experts.length > 0 ? (
          <>
            <div className="grid gap-4 md:hidden">
              {experts.map((expert) => (
                <Card key={expert.id} className="p-4">
                  <div className="space-y-3">
                    <button
                      type="button"
                      className="text-left font-medium hover:underline"
                      onClick={() => onOpenDetail(expert.id)}
                    >
                      {expert.fullName}
                    </button>
                    <p className="text-sm text-muted-foreground">{expert.email}</p>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">
                        Öncelik skoru
                      </p>
                      <ExpertPriorityEditor
                        expertId={expert.id}
                        score={expert.priorityScore ?? 0}
                        onSave={onSavePriority}
                      />
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Badge variant="outline" className={statusBadgeClass(expert.status)}>
                        {expert.status === "active" ? "Aktif" : "Pasif"}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon-sm"
                          title="Uyarı gönder"
                          onClick={() => onOpenWarning(expert)}
                        >
                          <AlertTriangle className="size-4 text-[#F2994A]" />
                        </Button>
                        <Switch
                          checked={expert.status === "active"}
                          onCheckedChange={() => onStatusToggle(expert.id)}
                          aria-label="Uzman durumu"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => onOpenDetail(expert.id)}
                    >
                      <Eye className="mr-1 size-4" />
                      Detay
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Ad Soyad</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Öncelik</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Kayıt Tarihi</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {experts.map((expert) => (
                    <TableRow
                      key={expert.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => onOpenDetail(expert.id)}
                    >
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {expert.id}
                      </TableCell>
                      <TableCell className="font-medium">{expert.fullName}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {expert.email}
                      </TableCell>
                      <TableCell className="align-top" onClick={(e) => e.stopPropagation()}>
                        <ExpertPriorityEditor
                          expertId={expert.id}
                          score={expert.priorityScore ?? 0}
                          onSave={onSavePriority}
                        />
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusBadgeClass(expert.status)}>
                          {expert.status === "active" ? "Aktif" : "Pasif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {expert.registeredAt ?? "-"}
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon-sm"
                            title="Uyarı gönder"
                            onClick={() => onOpenWarning(expert)}
                          >
                            <AlertTriangle className="size-4 text-[#F2994A]" />
                          </Button>
                          <Switch
                            checked={expert.status === "active"}
                            onCheckedChange={() => onStatusToggle(expert.id)}
                            aria-label="Uzman durumu"
                          />
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
  );
}
