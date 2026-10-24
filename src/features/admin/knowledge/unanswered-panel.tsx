"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInboxStream } from "@/hooks/use-inbox-stream";
import {
  dismissUnanswered,
  listUnanswered,
} from "@/services/inbox/knowledge.service";
import type {
  UnansweredQuestion,
  UnansweredStatus,
} from "@/services/inbox/types";
import { PAGE_LIMIT, formatDateTime } from "./constants";
import { Pager } from "./pager";
import { ResolveDialog } from "./resolve-dialog";

const STATUS_LABELS: Record<UnansweredStatus, string> = {
  OPEN: "Açık",
  RESOLVED: "Çözülmüş",
};

export function UnansweredPanel() {
  const [status, setStatus] = useState<UnansweredStatus>("OPEN");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<UnansweredQuestion[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [resolveTarget, setResolveTarget] = useState<UnansweredQuestion | null>(
    null,
  );
  const [dismissTarget, setDismissTarget] = useState<UnansweredQuestion | null>(
    null,
  );
  const [dismissing, setDismissing] = useState(false);

  const [reloadKey, setReloadKey] = useState(0);
  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    listUnanswered({ status, page, limit: PAGE_LIMIT })
      .then((res) => {
        if (cancelled) return;
        setItems(res.data);
        setTotal(res.total);
      })
      .catch((e: unknown) => {
        if (!cancelled)
          toast.error(e instanceof Error ? e.message : "Sorular yüklenemedi");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [status, page, reloadKey]);

  useInboxStream({ onCountsChanged: () => reload() });

  const handleDismiss = async () => {
    if (!dismissTarget) return;
    setDismissing(true);
    try {
      await dismissUnanswered(dismissTarget.id);
      toast.success("Soru kapatıldı");
      setDismissTarget(null);
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Soru kapatılamadı");
    } finally {
      setDismissing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Durum</span>
        <Select
          value={status}
          onValueChange={(v) => {
            if (!v || v === status) return;
            setLoading(true);
            setStatus(v as UnansweredStatus);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue>
              {(v: string) => STATUS_LABELS[v as UnansweredStatus] ?? v}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="OPEN">Açık</SelectItem>
            <SelectItem value="RESOLVED">Çözülmüş</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading && items.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Yükleniyor…
        </p>
      ) : items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
          {status === "OPEN"
            ? "Cevaplanmayı bekleyen soru yok."
            : "Çözülmüş soru bulunmuyor."}
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((q) => (
            <li
              key={q.id}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0 space-y-1.5">
                <p className="break-words text-sm font-medium text-foreground">
                  {q.question}
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span>{q.contact.fullName ?? "İsimsiz danışan"}</span>
                  <span>{formatDateTime(q.createdAt)}</span>
                  {q.topScore !== null ? (
                    <Badge variant="outline">
                      Benzerlik %{Math.round(q.topScore * 100)}
                    </Badge>
                  ) : null}
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <Link
                  href={`/admin/mesajlar?c=${q.conversationId}`}
                  className={buttonVariants({ variant: "ghost", size: "sm" })}
                >
                  <MessageSquare className="mr-1.5 size-4" />
                  Konuşmaya git
                </Link>
                {q.status === "OPEN" ? (
                  <>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setResolveTarget(q)}
                    >
                      Cevapla ve ekle
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setDismissTarget(q)}
                    >
                      Kapat
                    </Button>
                  </>
                ) : (
                  <Badge variant="secondary">Çözüldü</Badge>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <Pager
        page={page}
        total={total}
        disabled={loading}
        onChange={(p) => {
          setLoading(true);
          setPage(p);
        }}
      />

      <ResolveDialog
        question={resolveTarget}
        onClose={() => setResolveTarget(null)}
        onResolved={() => reload()}
      />

      <AlertDialog
        open={dismissTarget !== null}
        onOpenChange={(o) => {
          if (!o && !dismissing) setDismissTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Soruyu kapat</AlertDialogTitle>
            <AlertDialogDescription>
              Bu soru bilgi bankasına eklenmeden kapatılacak. Emin misiniz?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={dismissing}>Vazgeç</AlertDialogCancel>
            <AlertDialogAction
              disabled={dismissing}
              onClick={() => void handleDismiss()}
            >
              {dismissing ? "Kapatılıyor…" : "Kapat"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
