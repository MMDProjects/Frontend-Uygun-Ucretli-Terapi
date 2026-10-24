"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useInboxStream } from "@/hooks/use-inbox-stream";
import { listLeads, updateLeadStatus } from "@/services/inbox/leads.service";
import type { LeadListItem, LeadStatus } from "@/services/inbox/types";
import { LEAD_STATUS_LABELS, LEAD_STATUS_ORDER } from "./lead-meta";
import { LeadsTable } from "./leads-table";

type Filter = LeadStatus | "ALL";

const PAGE_SIZE = 20;

export function LeadsView() {
  const [filter, setFilter] = useState<Filter>("YENI");
  const [items, setItems] = useState<LeadListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pagesRef = useRef(1);
  const filterRef = useRef<Filter>(filter);
  const requestRef = useRef(0);

  const fetchPages = useCallback(async (f: Filter, pages: number) => {
    const status = f === "ALL" ? undefined : f;
    const results = await Promise.all(
      Array.from({ length: pages }, (_, i) =>
        listLeads({ status, page: i + 1, limit: PAGE_SIZE }),
      ),
    );
    const seen = new Set<string>();
    const data: LeadListItem[] = [];
    for (const r of results) {
      for (const l of r.data) {
        if (!seen.has(l.id)) {
          seen.add(l.id);
          data.push(l);
        }
      }
    }
    return { data, total: results[results.length - 1]?.total ?? 0 };
  }, []);

  const reload = useCallback(
    async (f: Filter, opts: { silent?: boolean; reset?: boolean } = {}) => {
      const id = ++requestRef.current;
      if (opts.reset) pagesRef.current = 1;
      if (!opts.silent) {
        setLoading(true);
        setError(null);
      }
      try {
        const res = await fetchPages(f, pagesRef.current);
        if (id !== requestRef.current) return;
        setItems(res.data);
        setTotal(res.total);
        setError(null);
      } catch (e) {
        if (id !== requestRef.current) return;
        if (!opts.silent) {
          setError(e instanceof Error ? e.message : "Talepler yüklenemedi");
        }
      } finally {
        if (id === requestRef.current && !opts.silent) setLoading(false);
      }
    },
    [fetchPages],
  );

  useEffect(() => {
    filterRef.current = filter;
    void Promise.resolve().then(() => reload(filter, { reset: true }));
  }, [filter, reload]);

  useInboxStream({
    onCountsChanged: () => void reload(filterRef.current, { silent: true }),
  });

  const handleLoadMore = async () => {
    const next = pagesRef.current + 1;
    setLoadingMore(true);
    try {
      const status = filter === "ALL" ? undefined : filter;
      const res = await listLeads({ status, page: next, limit: PAGE_SIZE });
      pagesRef.current = next;
      setItems((prev) => {
        const ids = new Set(prev.map((l) => l.id));
        return [...prev, ...res.data.filter((l) => !ids.has(l.id))];
      });
      setTotal(res.total);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Daha fazla talep yüklenemedi");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleStatusChange = async (id: string, status: LeadStatus) => {
    const previousStatus = items.find((l) => l.id === id)?.status;
    setItems((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    try {
      await updateLeadStatus(id, status);
      toast.success("Durum güncellendi");
    } catch (e) {
      if (previousStatus) {
        setItems((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status: previousStatus } : l)),
        );
      }
      toast.error(e instanceof Error ? e.message : "Durum güncellenemedi");
    }
  };

  const filters: Filter[] = ["ALL", ...LEAD_STATUS_ORDER];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <Button
            key={f}
            type="button"
            size="sm"
            variant={filter === f ? "default" : "outline"}
            onClick={() => setFilter(f)}
          >
            {f === "ALL" ? "Tümü" : LEAD_STATUS_LABELS[f]}
          </Button>
        ))}
      </div>

      <Card className="rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.05)]">
        <CardContent>
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center gap-3 py-10 text-center text-destructive">
              <AlertTriangle className="size-8" />
              <p className="text-sm">{error}</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => void reload(filter)}
              >
                Tekrar dene
              </Button>
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Bu filtreye uygun arama talebi bulunamadı.
            </p>
          )}

          {!loading && !error && items.length > 0 && (
            <div className="space-y-4">
              <LeadsTable leads={items} onStatusChange={handleStatusChange} />
              <div className="flex flex-col items-center gap-2">
                <p className="text-xs text-muted-foreground">
                  {items.length} / {total} talep gösteriliyor
                </p>
                {items.length < total && (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={loadingMore}
                    onClick={() => void handleLoadMore()}
                  >
                    {loadingMore ? "Yükleniyor…" : "Daha fazla yükle"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
