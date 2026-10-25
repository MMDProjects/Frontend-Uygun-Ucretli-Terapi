"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Search, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { listConversations } from "@/services/inbox/conversations.service";
import type {
  ContactType,
  ConversationListItem,
  ListConversationsParams,
} from "@/services/inbox/types";
import {
  ChannelBadge,
  contactName,
  formatRelative,
} from "./labels";
import { CONTACT_TYPE_LABELS, CONTACT_TYPE_ORDER, handoffReasonLabel } from "./constants";

type TypeFilter = ContactType | "ALL";

type TabKey = "ALL" | "BOT" | "PENDING" | "CRISIS" | "CLOSED";

const TABS: { key: TabKey; label: string }[] = [
  { key: "ALL", label: "Tümü" },
  { key: "BOT", label: "Elif'te" },
  { key: "PENDING", label: "Personel bekliyor" },
  { key: "CRISIS", label: "Kriz" },
  { key: "CLOSED", label: "Kapalı" },
];

const PAGE_SIZE = 20;
const MAX_LIMIT = 100;

function tabParams(tab: TabKey): ListConversationsParams {
  switch (tab) {
    case "BOT":
      return { status: "OPEN" };
    case "PENDING":
      return { status: "PENDING_AGENT" };
    case "CRISIS":
      return { status: "ALL", crisis: true };
    case "CLOSED":
      return { status: "CLOSED" };
    default:
      return { status: "ALL" };
  }
}

interface ListResult {
  key: string;
  items: ConversationListItem[];
  total: number;
}

interface ConversationListProps {
  selectedId: string | null;
  refreshKey: number;
  onSelect: (id: string) => void;
}

export function ConversationList({
  selectedId,
  refreshKey,
  onSelect,
}: ConversationListProps) {
  const [tab, setTab] = useState<TabKey>("ALL");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");
  const [searchInput, setSearchInput] = useState("");
  const [q, setQ] = useState("");
  const [result, setResult] = useState<ListResult | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const key = `${tab}|${typeFilter}|${q}`;
  const items = result?.key === key ? result.items : [];
  const total = result?.key === key ? result.total : 0;
  const loading = result?.key !== key;
  const itemsLenRef = useRef(0);
  const requestRef = useRef(0);
  const lastRefreshRef = useRef(refreshKey);

  useEffect(() => {
    const timer = setTimeout(() => setQ(searchInput.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const load = useCallback(
    async (silent: boolean) => {
      const requestId = ++requestRef.current;
      const loadKey = `${tab}|${typeFilter}|${q}`;
      const loaded = itemsLenRef.current;
      const limit = silent
        ? Math.min(MAX_LIMIT, Math.max(PAGE_SIZE, Math.ceil(loaded / PAGE_SIZE) * PAGE_SIZE))
        : PAGE_SIZE;
      try {
        const res = await listConversations({
          ...tabParams(tab),
          contactType: typeFilter === "ALL" ? undefined : typeFilter,
          q: q || undefined,
          page: 1,
          limit,
        });
        if (requestId !== requestRef.current) return;
        itemsLenRef.current = res.data.length;
        setResult({ key: loadKey, items: res.data, total: res.total });
      } catch (err) {
        if (requestId !== requestRef.current) return;
        if (!silent) {
          toast.error(err instanceof Error ? err.message : "Konuşmalar yüklenemedi");
          setResult({ key: loadKey, items: [], total: 0 });
        }
      }
    },
    [tab, typeFilter, q],
  );

  const loadRef = useRef(load);
  useEffect(() => {
    loadRef.current = load;
  }, [load]);

  useEffect(() => {
    void load(false);
  }, [load]);

  useEffect(() => {
    if (lastRefreshRef.current === refreshKey) return;
    lastRefreshRef.current = refreshKey;
    const timer = setTimeout(() => void loadRef.current(true), 400);
    return () => clearTimeout(timer);
  }, [refreshKey]);

  async function handleLoadMore() {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const page = Math.floor(itemsLenRef.current / PAGE_SIZE) + 1;
      const res = await listConversations({
        ...tabParams(tab),
        contactType: typeFilter === "ALL" ? undefined : typeFilter,
        q: q || undefined,
        page,
        limit: PAGE_SIZE,
      });
      setResult((prev) => {
        if (!prev || prev.key !== key) return prev;
        const seen = new Set(prev.items.map((c) => c.id));
        const next = [...prev.items, ...res.data.filter((c) => !seen.has(c.id))];
        itemsLenRef.current = next.length;
        return { key, items: next, total: res.total };
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Konuşmalar yüklenemedi");
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-card">
      <div className="space-y-2 border-b border-border p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Ad veya telefon ara"
            className="h-9 rounded-lg pl-9 text-sm"
            aria-label="Konuşma ara"
          />
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                tab === t.key
                  ? t.key === "CRISIS"
                    ? "bg-destructive text-white"
                    : "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1 overflow-x-auto" role="group" aria-label="Kişi tipi filtresi">
          {(["ALL", ...CONTACT_TYPE_ORDER] as TypeFilter[]).map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setTypeFilter(tf)}
              aria-pressed={typeFilter === tf}
              className={cn(
                "shrink-0 rounded-md border px-2.5 py-0.5 text-[11px] font-medium transition-colors",
                typeFilter === tf
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {tf === "ALL" ? "Tümü" : CONTACT_TYPE_LABELS[tf]}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {loading ? (
          <div className="space-y-px">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="flex animate-pulse gap-3 p-3">
                <div className="size-9 shrink-0 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/2 rounded bg-muted" />
                  <div className="h-3 w-4/5 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">
            {q || tab !== "ALL" || typeFilter !== "ALL" ? "Bu filtreye uygun konuşma yok" : "Henüz konuşma yok"}
          </p>
        ) : (
          <ul>
            {items.map((c) => {
              const active = c.id === selectedId;
              const preview = c.lastMessage
                ? `${
                    c.lastMessage.isDraft
                      ? "Taslak: "
                      : c.lastMessage.senderType === "CLIENT"
                      ? ""
                      : c.lastMessage.senderType === "BOT"
                        ? "Elif: "
                        : "Siz: "
                  }${c.lastMessage.content}`
                : "Mesaj yok";
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(c.id)}
                    className={cn(
                      "flex w-full flex-col gap-1 border-b border-border/60 px-3 py-3 text-left transition-colors hover:bg-muted/60",
                      active && "bg-primary/10 hover:bg-primary/10",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <ChannelBadge channel={c.channel} />
                      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
                        {contactName(c.contact)}
                      </span>
                      <span className="shrink-0 text-[11px] text-muted-foreground">
                        {formatRelative(c.lastMessageAt)}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "truncate text-xs text-muted-foreground",
                        c.lastMessage?.isDraft && "italic",
                      )}
                    >
                      {preview}
                    </p>
                    {c.flaggedCrisis || c.status !== "OPEN" || c.contact.contactType !== "DANISAN" ? (
                      <div className="flex flex-wrap gap-1">
                        {c.contact.contactType !== "DANISAN" ? (
                          <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-800">
                            {CONTACT_TYPE_LABELS[c.contact.contactType]}
                          </span>
                        ) : null}
                        {c.flaggedCrisis ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold text-destructive">
                            <TriangleAlert className="size-3" />
                            Kriz
                          </span>
                        ) : null}
                        {c.status === "PENDING_AGENT" ? (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                            Personel bekliyor
                          </span>
                        ) : null}
                        {c.status === "PENDING_AGENT" && c.handoffReason ? (
                          <span
                            className={
                              c.handoffReason === "acil_durum"
                                ? "rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold text-destructive"
                                : "rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-800"
                            }
                          >
                            {handoffReasonLabel(c.handoffReason)}
                          </span>
                        ) : null}
                        {c.status === "CLOSED" ? (
                          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                            Kapalı
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {!loading && items.length < total ? (
          <div className="p-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => void handleLoadMore()}
              disabled={loadingMore}
            >
              {loadingMore ? <Loader2 className="size-4 animate-spin" /> : null}
              Daha fazla yükle
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
