"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deleteKnowledge,
  listKnowledge,
  updateKnowledge,
} from "@/services/inbox/knowledge.service";
import type { KnowledgeEntry, KnowledgeSource } from "@/services/inbox/types";
import { CATEGORY_LABELS, PAGE_LIMIT, SOURCE_LABELS } from "./constants";
import { EntryDialog } from "./entry-dialog";
import { Pager } from "./pager";

type SourceFilter = KnowledgeSource | "ALL";

const NO_EMBEDDING_TEXT =
  "Elif bu kaydı henüz kullanamıyor — OpenAI anahtarı tanımlanınca yeniden kaydedin";

export function EntriesPanel() {
  const [source, setSource] = useState<SourceFilter>("ALL");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<KnowledgeEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<KnowledgeEntry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<KnowledgeEntry | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const [reloadKey, setReloadKey] = useState(0);
  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    listKnowledge({
      source: source === "ALL" ? undefined : source,
      q: query || undefined,
      page,
      limit: PAGE_LIMIT,
    })
      .then((res) => {
        if (cancelled) return;
        setItems(res.data);
        setTotal(res.total);
      })
      .catch((e: unknown) => {
        if (!cancelled)
          toast.error(e instanceof Error ? e.message : "Kayıtlar yüklenemedi");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [source, query, page, reloadKey]);

  const handleToggle = async (entry: KnowledgeEntry, isActive: boolean) => {
    setItems((prev) =>
      prev.map((e) => (e.id === entry.id ? { ...e, isActive } : e)),
    );
    try {
      const updated = await updateKnowledge(entry.id, { isActive });
      setItems((prev) => prev.map((e) => (e.id === entry.id ? updated : e)));
    } catch (e) {
      setItems((prev) =>
        prev.map((x) =>
          x.id === entry.id ? { ...x, isActive: entry.isActive } : x,
        ),
      );
      toast.error(e instanceof Error ? e.message : "Durum güncellenemedi");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteKnowledge(deleteTarget.id);
      toast.success("Kayıt silindi");
      setDeleteTarget(null);
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Kayıt silinemedi");
    } finally {
      setDeleting(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (entry: KnowledgeEntry) => {
    setEditing(entry);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select
            value={source}
            onValueChange={(v) => {
              if (!v || v === source) return;
              setLoading(true);
              setSource(v as SourceFilter);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue>
                {(v: string) =>
                  v === "ALL"
                    ? "Tümü"
                    : (SOURCE_LABELS[v as KnowledgeSource] ?? v)
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tümü</SelectItem>
              <SelectItem value="MANUAL">Manuel</SelectItem>
              <SelectItem value="CONVERSATION">Konuşmadan</SelectItem>
              <SelectItem value="SSS">SSS</SelectItem>
            </SelectContent>
          </Select>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Başlık veya içerikte ara..."
            className="w-full sm:w-[260px]"
          />
        </div>
        <Button type="button" onClick={openCreate}>
          <Plus className="mr-1.5 size-4" />
          Yeni kayıt
        </Button>
      </div>

      {loading && items.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Yükleniyor…
        </p>
      ) : items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
          Kayıt bulunamadı.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Başlık</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Kaynak</TableHead>
                <TableHead>Aktif</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((entry) => {
                const readOnly = entry.source === "SSS";
                return (
                  <TableRow key={entry.id}>
                    <TableCell className="max-w-[320px] whitespace-normal">
                      <p className="break-words font-medium text-foreground">
                        {entry.title}
                      </p>
                      {!entry.hasEmbedding ? (
                        <p
                          className="mt-1 inline-flex items-start gap-1 text-xs text-amber-700 dark:text-amber-400"
                          title={NO_EMBEDDING_TEXT}
                        >
                          <AlertTriangle className="mt-0.5 size-3 shrink-0" />
                          <span>
                            <span className="font-semibold">
                              Embedding yok.
                            </span>{" "}
                            {NO_EMBEDDING_TEXT}
                          </span>
                        </p>
                      ) : null}
                    </TableCell>
                    <TableCell>{CATEGORY_LABELS[entry.category]}</TableCell>
                    <TableCell>
                      <Badge variant={readOnly ? "secondary" : "outline"}>
                        {SOURCE_LABELS[entry.source]}
                      </Badge>
                    </TableCell>
                    {readOnly ? (
                      <TableCell
                        colSpan={2}
                        className="text-right text-xs text-muted-foreground"
                      >
                        <Link
                          href="/admin/icerik/sss"
                          className="text-primary underline-offset-4 hover:underline"
                        >
                          SSS ekranından yönetilir
                        </Link>
                      </TableCell>
                    ) : (
                      <>
                        <TableCell>
                          <Switch
                            checked={entry.isActive}
                            onCheckedChange={(c) => void handleToggle(entry, c)}
                            aria-label="Aktif"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              aria-label="Düzenle"
                              onClick={() => openEdit(entry)}
                            >
                              <Pencil className="size-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              aria-label="Sil"
                              onClick={() => setDeleteTarget(entry)}
                            >
                              <Trash2 className="size-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
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

      <EntryDialog
        open={dialogOpen}
        entry={editing}
        onClose={() => setDialogOpen(false)}
        onSaved={() => reload()}
      />

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(o) => {
          if (!o && !deleting) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kaydı sil</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `"${deleteTarget.title}" kalıcı olarak silinecek. `
                : ""}
              Elif bu bilgiyi artık kullanmayacak.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>İptal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              disabled={deleting}
              onClick={() => void handleDelete()}
            >
              {deleting ? "Siliniyor…" : "Evet, sil"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
