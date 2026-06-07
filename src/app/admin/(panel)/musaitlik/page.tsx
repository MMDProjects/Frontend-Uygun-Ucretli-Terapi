"use client";

import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { Lock, ChevronDown, CalendarDays, Clock, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { PageHeader } from "@/features/admin/components/page-header";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-cookies";

/* ─── types ─────────────────────────────────────────────── */
type ExpertItem = {
  id: string;
  priorityScore: number;
  user: { firstName: string; lastName: string };
};
type ApiAvailability = {
  id: string;
  expertProfileId: string;
  date: string;  // ISO datetime string "2026-06-09T00:00:00.000Z"
  startTime: string;
  endTime: string;
  isBlockedByAdmin: boolean;
};
type AvailWithExpert = ApiAvailability & { expertId: string };

/* ─── constants ──────────────────────────────────────────── */
const EXPERT_COLORS = [
  "#4d978b","#f59e0b","#3b82f6","#8b5cf6",
  "#ec4899","#14b8a6","#f97316","#6366f1",
];

const DAY_LABELS = ["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"];

const TIME_BLOCKS = Array.from({ length: 15 }, (_, i) => {
  const h = 8 + i;
  const pad = (n: number) => String(n).padStart(2, "0");
  const start = `${pad(h)}:00`;
  return {
    key: `${pad(h)}-${pad(h + 1)}`,
    label: `${pad(h)}:00`,
    startTime: start,
    test: (t: string) => t === start,
  };
});

type BlockKey = string;

/* ─── helpers ────────────────────────────────────────────── */
function getToken() { return getAccessToken() ?? ""; }

function expertLabel(e: ExpertItem) {
  const last = e.user.lastName?.trim();
  return `${e.user.firstName}${last ? ` ${last[0].toUpperCase()}.` : ""}`;
}
function initials(e: ExpertItem) {
  return `${e.user.firstName[0] ?? ""}${e.user.lastName?.[0] ?? ""}`.toUpperCase();
}

function getWeekDates(offset = 0): Date[] {
  const today  = new Date();
  const diff   = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - diff + offset * 7);
  monday.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function isTodayDate(d: Date) {
  const t = new Date();
  return d.getDate()===t.getDate() && d.getMonth()===t.getMonth() && d.getFullYear()===t.getFullYear();
}

function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const MONTH_SHORT = ["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"];

function weekRangeLabel(dates: Date[]): string {
  const from = dates[0];
  const to   = dates[6];
  const d1   = from.getDate();
  const d2   = to.getDate();
  const m1   = MONTH_SHORT[from.getMonth()];
  const m2   = MONTH_SHORT[to.getMonth()];
  return from.getMonth() === to.getMonth()
    ? `${d1}–${d2} ${m1}`
    : `${d1} ${m1} – ${d2} ${m2}`;
}

/* ─── API ────────────────────────────────────────────────── */
async function fetchExperts(): Promise<ExpertItem[]> {
  const res = await apiFetch<{ data: ExpertItem[] } | ExpertItem[]>(
    "/admin/experts?limit=100", { token: getToken() },
  );
  return Array.isArray(res) ? res : (res.data ?? []);
}
async function fetchAvailabilities(id: string, weekStart: Date): Promise<ApiAvailability[]> {
  const ws = toDateStr(weekStart);
  return apiFetch(`/admin/experts/${id}/availabilities?weekStart=${ws}`, { token: getToken() });
}
async function patchBulkBlock(ids: string[], block: boolean) {
  return apiFetch("/admin/availabilities/bulk-block", {
    method: "PATCH", body: { ids, block }, token: getToken(),
  });
}

/* ══════════════════════════════════════════════════════════ */
export default function AdminMusaitlikPage() {
  const [experts,        setExperts]        = useState<ExpertItem[]>([]);
  const [checkedIds,     setCheckedIds]     = useState<Set<string>>(new Set());
  const [availMap,       setAvailMap]       = useState<Map<string, ApiAvailability[]>>(new Map());
  const [loadingExperts, setLoadingExperts] = useState(true);
  const [filterDays,     setFilterDays]     = useState<Set<number>>(new Set([0,1,2,3,4,5,6]));
  const [filterBlocks,   setFilterBlocks]   = useState<Set<BlockKey>>(
    () => new Set(TIME_BLOCKS.map((b) => b.key)),
  );
  const [weekOffset, setWeekOffset] = useState(0);

  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset]);


  // Uzman listesini bir kez yükle
  useEffect(() => {
    fetchExperts()
      .then((list) => {
        setExperts(list);
        setCheckedIds(new Set(list.map((e) => e.id)));
      })
      .catch(() => toast.error("Uzmanlar yüklenemedi"))
      .finally(() => setLoadingExperts(false));
  }, []);

  // Hafta değişince tüm uzmanların müsaitliklerini yeniden çek
  useEffect(() => {
    if (loadingExperts || experts.length === 0) return;
    const weekStart = weekDates[0];
    Promise.all(
      experts.map(async (e) => {
        try   { return [e.id, await fetchAvailabilities(e.id, weekStart)] as [string, ApiAvailability[]]; }
        catch { return [e.id, []] as [string, ApiAvailability[]]; }
      }),
    ).then((entries) => setAvailMap(new Map(entries)));
  }, [weekDates, loadingExperts, experts]);

  const colorMap = useMemo(() => {
    const m = new Map<string, string>();
    experts.forEach((e, i) => m.set(e.id, EXPERT_COLORS[i % EXPERT_COLORS.length]));
    return m;
  }, [experts]);

  const visibleAvails = useMemo((): AvailWithExpert[] => {
    const r: AvailWithExpert[] = [];
    checkedIds.forEach((id) =>
      (availMap.get(id) ?? []).forEach((a) => r.push({ ...a, expertId: id })),
    );
    return r;
  }, [checkedIds, availMap]);

  const visibleBlocks = useMemo(
    () => TIME_BLOCKS.filter((b) => filterBlocks.has(b.key)),
    [filterBlocks],
  );

  const filteredDayIndices = useMemo(
    () => Array.from({ length: 7 }, (_, i) => i).filter((i) => filterDays.has(i)),
    [filterDays],
  );

  const allChecked = experts.length > 0 && checkedIds.size === experts.length;

  /* buton stili — diğer sayfalardaki toolbar ile aynı (size: default) */
  const triggerCls = buttonVariants({ variant: "outline", size: "default" }) + " gap-2";

  function getCellAvails(dowIdx: number, blockKey: BlockKey): AvailWithExpert[] {
    const block = TIME_BLOCKS.find((b) => b.key === blockKey);
    if (!block) return [];
    const dateStr = toDateStr(weekDates[dowIdx]);
    return visibleAvails.filter(
      (a) => a.date.startsWith(dateStr) && block.test(a.startTime),
    );
  }

  async function handleToggle(avail: AvailWithExpert) {
    const newBlocked = !avail.isBlockedByAdmin;
    setAvailMap((prev) => {
      const n = new Map(prev);
      n.set(avail.expertId, (n.get(avail.expertId) ?? []).map((a) =>
        a.id === avail.id ? { ...a, isBlockedByAdmin: newBlocked } : a,
      ));
      return n;
    });
    try {
      await patchBulkBlock([avail.id], newBlocked);
      toast.success(newBlocked ? "Slot kilitlendi" : "Slot açıldı");
    } catch {
      setAvailMap((prev) => {
        const n = new Map(prev);
        n.set(avail.expertId, (n.get(avail.expertId) ?? []).map((a) =>
          a.id === avail.id ? { ...a, isBlockedByAdmin: !newBlocked } : a,
        ));
        return n;
      });
      toast.error("İşlem başarısız");
    }
  }

  function toggleDay(i: number) {
    setFilterDays((p) => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; });
  }
  function toggleBlock(key: BlockKey) {
    setFilterBlocks((p) => { const n = new Set(p); n.has(key) ? n.delete(key) : n.add(key); return n; });
  }
  function toggleCheck(id: string) {
    setCheckedIds((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  /* ─── render ─────────────────────────────────────────────── */
  return (
    /*
     * space-y-6: diğer admin sayfalarıyla (kategoriler, bildirimler vb.)
     * aynı PageHeader → içerik boşluğu (24px)
     */
    <div className="space-y-6">

      <PageHeader
        title="Müsaitlik Yönetimi"
        description="Tüm uzmanların haftalık müsaitliklerini ortak tabloda görüntüleyin."
      >
        {/* Gün filtresi */}
        <DropdownMenu>
          <DropdownMenuTrigger type="button" className={triggerCls}>
            <CalendarDays className="size-4" />
            {filterDays.size === 7
              ? "Tüm Günler"
              : filterDays.size === 0
                ? "Gün Seçin"
                : `${filterDays.size} Gün`}
            <ChevronDown className="size-4 opacity-60" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            {DAY_LABELS.map((label, i) => (
              <DropdownMenuCheckboxItem
                key={i}
                checked={filterDays.has(i)}
                onCheckedChange={() => toggleDay(i)}
              >
                {label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Saat filtresi — gün filtresiyle birebir aynı */}
        <DropdownMenu>
          <DropdownMenuTrigger type="button" className={triggerCls}>
            <Clock className="size-4" />
            {filterBlocks.size === TIME_BLOCKS.length
              ? "Tüm Saatler"
              : filterBlocks.size === 0
                ? "Saat Seçin"
                : `${filterBlocks.size} Aralık`}
            <ChevronDown className="size-4 opacity-60" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            {TIME_BLOCKS.map((block) => (
              <DropdownMenuCheckboxItem
                key={block.key}
                checked={filterBlocks.has(block.key)}
                onCheckedChange={() => toggleBlock(block.key)}
              >
                {block.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Hafta navigasyonu */}
        <div className="flex items-center overflow-hidden rounded-md border border-border/60">
          <button
            type="button"
            onClick={() => setWeekOffset((p) => p - 4)}
            className="flex h-10 cursor-pointer items-center px-2.5 transition-colors
                       hover:bg-muted/60 border-r border-border/60"
            aria-label="4 hafta geri"
          >
            <ChevronsLeft className="size-4 text-muted-foreground" />
          </button>
          <button
            type="button"
            onClick={() => setWeekOffset((p) => p - 1)}
            className="flex h-10 cursor-pointer items-center px-2.5 transition-colors
                       hover:bg-muted/60 border-r border-border/60"
            aria-label="Önceki hafta"
          >
            <ChevronLeft className="size-4 text-muted-foreground" />
          </button>
          <div className="flex h-10 min-w-[120px] cursor-default flex-col items-center
                          justify-center px-3 leading-none">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              {weekOffset === 0 ? "Bu Hafta" : weekOffset === -1 ? "Geçen Hafta" : weekOffset === 1 ? "Gelecek Hafta" : weekOffset > 0 ? `+${weekOffset} Hafta` : `${weekOffset} Hafta`}
            </span>
            <span className="text-sm font-semibold text-foreground tabular-nums">
              {weekRangeLabel(weekDates)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setWeekOffset((p) => p + 1)}
            className="flex h-10 cursor-pointer items-center px-2.5 transition-colors
                       hover:bg-muted/60 border-l border-border/60"
            aria-label="Sonraki hafta"
          >
            <ChevronRight className="size-4 text-muted-foreground" />
          </button>
          <button
            type="button"
            onClick={() => setWeekOffset((p) => p + 4)}
            className="flex h-10 cursor-pointer items-center px-2.5 transition-colors
                       hover:bg-muted/60 border-l border-border/60"
            aria-label="4 hafta ileri"
          >
            <ChevronsRight className="size-4 text-muted-foreground" />
          </button>
        </div>
      </PageHeader>

      {/*
        Ana kutu
        space-y-6 dışarıda margin-top 24px ekler; layout main p-4/p-6 padding içinde.
        Toplam çıkarılacak: padding × 2 + PageHeader yüksekliği + space-y-6 gap
        p-4 (mobile): 32px + ~72px + 24px = ~128px ≈ 8rem
        p-6 (sm+):    48px + ~72px + 24px = ~144px ≈ 9rem
      */}
      <div className="flex overflow-hidden rounded-2xl border border-border/60 bg-white
                      h-[calc(100vh-8rem)] sm:h-[calc(100vh-9rem)]">

        {/* ── SOL: Uzman listesi ──────────────────────────── */}
        <div className="flex w-56 shrink-0 flex-col overflow-hidden border-r border-border/60">

          <div className="flex shrink-0 items-center justify-between px-3 pt-2.5 pb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
              Uzmanlar
            </span>
            <button
              type="button"
              onClick={() =>
                setCheckedIds(allChecked ? new Set() : new Set(experts.map((e) => e.id)))
              }
              className="cursor-pointer text-[10px] font-semibold text-primary hover:underline"
            >
              {allChecked ? "Kaldır" : "Tümünü seç"}
            </button>
          </div>

          <div className="flex flex-1 min-h-0 flex-col gap-1 overflow-y-auto px-2 pb-2">
            {loadingExperts
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 rounded-xl bg-muted/30 animate-pulse" />
                ))
              : experts.map((expert) => {
                  const color   = colorMap.get(expert.id) ?? "#4d978b";
                  const checked = checkedIds.has(expert.id);
                  return (
                    <button
                      key={expert.id}
                      type="button"
                      aria-pressed={checked}
                      onClick={() => toggleCheck(expert.id)}
                      style={checked ? { borderColor: color, background: color + "18" } : {}}
                      className={cn(
                        "flex cursor-pointer items-center gap-2.5 rounded-xl border-2 px-3 py-2",
                        "text-left transition-all duration-150",
                        checked ? "shadow-sm" : "border-border/40 bg-muted/20",
                      )}
                    >
                      <div
                        className="flex size-7 shrink-0 items-center justify-center rounded-full
                                   text-[10px] font-bold text-white transition-colors duration-150"
                        style={{ background: checked ? color : "#9ca3af" }}
                      >
                        {initials(expert)}
                      </div>
                      <span className={cn(
                        "min-w-0 flex-1 truncate text-[12px] font-medium leading-tight transition-colors duration-150",
                        checked ? "text-foreground" : "text-muted-foreground",
                      )}>
                        {expert.user.firstName}{" "}
                        <span className="font-semibold">{expert.user.lastName}</span>
                      </span>
                    </button>
                  );
                })}
          </div>
        </div>

        {/* ── SAĞ: Tablo ──────────────────────────────────── */}
        <div className="flex flex-1 min-w-0 flex-col overflow-hidden">

          {/* Gün başlıkları */}
          <div className="flex shrink-0 border-b-2 border-border/60 bg-[#e6f0ee]">
            <div className="w-14 shrink-0 border-r border-border/60 px-2 py-2.5
                            text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">
              SAAT
            </div>
            {filteredDayIndices.map((dowIdx) => {
              const date  = weekDates[dowIdx];
              const today = isTodayDate(date);
              return (
                <div
                  key={dowIdx}
                  className={cn(
                    "min-w-[110px] flex-1 border-r border-border/60 py-2 text-center last:border-r-0",
                    today && "bg-primary/15",
                  )}
                >
                  <p className={cn(
                    "text-[10px] font-bold uppercase tracking-wider",
                    today ? "text-primary" : "text-muted-foreground",
                  )}>
                    {DAY_LABELS[dowIdx]}
                  </p>
                  <p className={cn(
                    "text-base font-bold leading-none",
                    today ? "text-primary" : "text-[#014a3e]",
                  )}>
                    {date.getDate()}
                  </p>
                  <p className={cn(
                    "text-[9px] font-medium mt-0.5",
                    today ? "text-primary/70" : "text-muted-foreground/50",
                  )}>
                    {MONTH_SHORT[date.getMonth()]}
                  </p>
                </div>
              );
            })}
          </div>

          {/* 3 blok — flex-1 ile dikey %100 */}
          {filteredDayIndices.length === 0 || visibleBlocks.length === 0 ? (
            <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
              {filteredDayIndices.length === 0 ? "Gün filtresi boş" : "Saat aralığı seçin"}
            </div>
          ) : (
            <div className="flex flex-1 min-h-0 flex-col overflow-y-auto">
              {visibleBlocks.map((block, idx) => (
                <div
                  key={block.key}
                  className={cn(
                    "flex min-h-[52px] shrink-0 border-b border-border/40 last:border-b-0",
                    "transition-colors duration-100 hover:bg-primary/[0.015]",
                    idx % 2 === 1 && "bg-muted/[0.015]",
                  )}
                >
                  {/* Saat etiketi */}
                  <div className="flex w-14 shrink-0 items-center justify-center
                                  border-r border-border/50 bg-[#e6f0ee]/70 px-1">
                    <p className="text-[11px] font-semibold tabular-nums text-[#014a3e]">
                      {block.label}
                    </p>
                  </div>

                  {/* Hücreler */}
                  {filteredDayIndices.map((dowIdx) => {
                    const today = isTodayDate(weekDates[dowIdx]);
                    const cell  = getCellAvails(dowIdx, block.key);
                    return (
                      <div
                        key={dowIdx}
                        className={cn(
                          "min-w-[110px] flex-1 overflow-hidden border-r border-border/40 p-1.5 last:border-r-0",
                          today && "bg-primary/[0.02]",
                        )}
                      >
                        <div className="flex flex-col gap-1">
                          {cell.map((avail) => {
                            const expert = experts.find((e) => e.id === avail.expertProfileId);
                            if (!expert) return null;
                            const color   = colorMap.get(expert.id) ?? "#4d978b";
                            const blocked = avail.isBlockedByAdmin;
                            return (
                              <button
                                key={avail.id}
                                type="button"
                                title={`${expert.user.firstName} ${expert.user.lastName} — ${blocked ? "Kilidi aç" : "Kilitle"}`}
                                onClick={() => handleToggle(avail)}
                                className={cn(
                                  "flex w-full cursor-pointer items-center gap-1.5 rounded-md",
                                  "px-2 py-1 text-[11px] font-semibold",
                                  "transition-all duration-150 hover:brightness-95 active:scale-[0.97]",
                                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                )}
                                style={
                                  blocked
                                    ? { background: "#fee2e2", color: "#dc2626" }
                                    : { background: color + "1a", color }
                                }
                              >
                                <span
                                  className="size-2 shrink-0 rounded-full"
                                  style={{ background: blocked ? "#dc2626" : color }}
                                />
                                <span className={cn(
                                  "min-w-0 flex-1 truncate leading-none",
                                  blocked && "line-through",
                                )}>
                                  {expertLabel(expert)}
                                </span>
                                {blocked && <Lock className="size-3 shrink-0 text-red-400" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex shrink-0 items-center gap-4 border-t border-border/40
                          bg-muted/10 px-4 py-1.5 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[#4d978b]" /> Müsait
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-red-400" /> Admin Kilitli
            </div>
            <p className="ml-auto text-[10px] opacity-60">
              İsme tıklayarak kilit durumunu değiştirin
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
