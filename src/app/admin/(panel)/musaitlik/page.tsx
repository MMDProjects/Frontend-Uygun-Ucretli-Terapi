"use client";

import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { Lock, ChevronDown, X, CalendarDays, Clock } from "lucide-react";
import { PageHeader } from "@/features/admin/components/page-header";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isBlockedByAdmin: boolean;
};
type AvailWithExpert = ApiAvailability & { expertId: string };
type TimeRange = "all" | "morning" | "afternoon" | "evening";

/* ─── constants ──────────────────────────────────────────── */
const EXPERT_COLORS = [
  "#4d978b","#f59e0b","#3b82f6","#8b5cf6",
  "#ec4899","#14b8a6","#f97316","#6366f1",
];

const DAY_LABELS  = ["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"];
const DAY_OF_WEEK = [1, 2, 3, 4, 5, 6, 0]; // Mon=1…Sun=0

/* 09:00–20:00 sabit saat dilimleri — filtre ile daraltılır */
const ALL_TIME_SLOTS = [
  "09:00","10:00","11:00","12:00","13:00",
  "14:00","15:00","16:00","17:00","18:00","19:00","20:00",
];

const TIME_RANGE_LABELS: Record<TimeRange, string> = {
  all:       "Tüm Saatler",
  morning:   "Sabah (09-12)",
  afternoon: "Öğle (12-17)",
  evening:   "Akşam (17-21)",
};

/* ─── helpers ────────────────────────────────────────────── */
function getToken() { return getAccessToken() ?? ""; }

function expertLabel(e: ExpertItem) {
  const last = e.user.lastName?.trim();
  return `${e.user.firstName}${last ? ` ${last[0].toUpperCase()}.` : ""}`;
}
function initials(e: ExpertItem) {
  return `${e.user.firstName[0] ?? ""}${e.user.lastName?.[0] ?? ""}`.toUpperCase();
}

function getWeekDates(): Date[] {
  const today = new Date();
  const diff   = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - diff);
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

function matchesRange(time: string, range: TimeRange) {
  if (range === "morning")   return time >= "09:00" && time < "12:00";
  if (range === "afternoon") return time >= "12:00" && time < "17:00";
  if (range === "evening")   return time >= "17:00" && time <= "20:00";
  return true;
}

/* ─── API ────────────────────────────────────────────────── */
async function fetchExperts(): Promise<ExpertItem[]> {
  const res = await apiFetch<{ data: ExpertItem[] } | ExpertItem[]>(
    "/admin/experts?limit=100", { token: getToken() },
  );
  return Array.isArray(res) ? res : (res.data ?? []);
}
async function fetchAvailabilities(id: string): Promise<ApiAvailability[]> {
  return apiFetch(`/admin/experts/${id}/availabilities`, { token: getToken() });
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
  const [filterRange,    setFilterRange]    = useState<TimeRange>("all");

  const weekDates = useMemo(() => getWeekDates(), []);

  useEffect(() => {
    fetchExperts()
      .then(async (list) => {
        setExperts(list);
        const ids = list.map((e) => e.id);
        setCheckedIds(new Set(ids));
        const entries = await Promise.all(
          ids.map(async (id) => {
            try   { return [id, await fetchAvailabilities(id)] as [string, ApiAvailability[]]; }
            catch { return [id, []] as [string, ApiAvailability[]]; }
          }),
        );
        setAvailMap(new Map(entries));
      })
      .catch(() => toast.error("Uzmanlar yüklenemedi"))
      .finally(() => setLoadingExperts(false));
  }, []);

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

  const timeSlots = useMemo(
    () => ALL_TIME_SLOTS.filter((t) => matchesRange(t, filterRange)),
    [filterRange],
  );

  const filteredDayIndices = useMemo(
    () => Array.from({ length: 7 }, (_, i) => i).filter((i) => filterDays.has(i)),
    [filterDays],
  );

  const activeFilterCount = (filterRange !== "all" ? 1 : 0) + (filterDays.size < 7 ? 1 : 0);
  const allChecked = experts.length > 0 && checkedIds.size === experts.length;

  function getCellAvails(dowIdx: number, time: string): AvailWithExpert[] {
    const dayNum = DAY_OF_WEEK[dowIdx];
    return visibleAvails.filter((a) => a.dayOfWeek === dayNum && a.startTime === time);
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
  function toggleCheck(id: string) {
    setCheckedIds((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function clearFilters() {
    setFilterDays(new Set([0,1,2,3,4,5,6]));
    setFilterRange("all");
  }

  /* ─── render ─────────────────────────────────────────────── */
  return (
    <div className="flex flex-col gap-3">

      {/* PageHeader — filtreler sağ toolbar */}
      <div className="shrink-0">
        <PageHeader
          title="Müsaitlik Yönetimi"
          description="Tüm uzmanların haftalık müsaitliklerini ortak tabloda görüntüleyin."
        >
          {/* Gün filtresi */}
          <DropdownMenu>
            <DropdownMenuTrigger
              type="button"
              className={buttonVariants({ variant: "outline", size: "sm" }) + " gap-1.5"}
            >
              <CalendarDays className="size-3.5" />
              {filterDays.size === 7
                ? "Tüm Günler"
                : filterDays.size === 0
                  ? "Gün Seçin"
                  : `${filterDays.size} Gün`}
              <ChevronDown className="size-3 opacity-60" />
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

          {/* Saat aralığı */}
          <Select value={filterRange} onValueChange={(v) => setFilterRange(v as TimeRange)}>
            <SelectTrigger className="h-9 w-40 gap-1.5 text-sm">
              <Clock className="size-3.5 shrink-0 opacity-60" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {(Object.entries(TIME_RANGE_LABELS) as [TimeRange, string][]).map(([val, label]) => (
                <SelectItem key={val} value={val}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Temizle */}
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5
                         text-sm font-medium text-amber-600 hover:text-amber-700 hover:bg-amber-50
                         transition-colors duration-150"
            >
              <X className="size-3.5" />
              Temizle ({activeFilterCount})
            </button>
          )}
        </PageHeader>
      </div>

      {/*
        Ana kutu
        Yükseklik hesabı (admin layout: main = flex-1 overflow-auto p-4 sm:p-6)
        PageHeader toolbar satırında ~80px yükseklik alıyor.
        p-4: 32px padding + 80px header + 12px gap = 124px ≈ 8rem
        p-6: 48px padding + 80px header + 12px gap = 140px ≈ 9rem
      */}
      <div className="flex overflow-hidden rounded-2xl border border-border/60 bg-white
                      h-[calc(100vh-8rem)] sm:h-[calc(100vh-9rem)]">

        {/* ── SOL: Uzman listesi ──────────────────────────── */}
        <div className="flex w-56 shrink-0 flex-col overflow-hidden border-r border-border/60">

          {/* Mini başlık */}
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

          {/* Uzman kartları */}
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
                        checked
                          ? "shadow-sm"
                          : "border-transparent bg-muted/20 opacity-40 hover:opacity-60 hover:bg-muted/30",
                      )}
                    >
                      <div
                        className="flex size-7 shrink-0 items-center justify-center
                                   rounded-full text-[10px] font-bold text-white"
                        style={{ background: color }}
                      >
                        {initials(expert)}
                      </div>
                      <span className="min-w-0 flex-1 truncate text-[12px] font-medium leading-tight text-foreground">
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
          <div className="flex-1 min-h-0 overflow-auto">
            <div className="flex min-h-full flex-col">

              {/* Sticky gün başlıkları */}
              <div className="sticky top-0 z-10 flex shrink-0 border-b-2 border-border/60 bg-[#e6f0ee]">
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
                        "text-base font-bold leading-tight",
                        today ? "text-primary" : "text-[#014a3e]",
                      )}>
                        {date.getDate()}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Empty state */}
              {filteredDayIndices.length === 0 ? (
                <div className="flex flex-1 items-center justify-center py-16
                                text-sm text-muted-foreground">
                  Gün filtresi boş — yukarıdan gün seçin
                </div>
              ) : (
                <>
                  {timeSlots.map((time, rowIdx) => (
                    <div
                      key={time}
                      className={cn(
                        "flex shrink-0 border-b border-border/40",
                        "transition-colors duration-100 hover:bg-primary/[0.025]",
                        rowIdx % 2 === 1 && "bg-muted/[0.02]",
                      )}
                    >
                      {/* Saat etiketi */}
                      <div className="flex w-14 shrink-0 items-center justify-center
                                      border-r border-border/50 bg-[#e6f0ee]/70 px-1 py-3">
                        <p className="text-[11px] font-semibold tabular-nums text-[#014a3e]">
                          {time}
                        </p>
                      </div>

                      {/* Hücreler */}
                      {filteredDayIndices.map((dowIdx) => {
                        const today = isTodayDate(weekDates[dowIdx]);
                        const cell  = getCellAvails(dowIdx, time);
                        return (
                          <div
                            key={dowIdx}
                            className={cn(
                              "min-w-[110px] flex-1 border-r border-border/40 p-1.5 last:border-r-0",
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

                  {/* Boş alan dolgusu — tablo aşağıya kadar uzanır */}
                  <div className="flex flex-1">
                    <div className="w-14 shrink-0 border-r border-border/60 bg-[#e6f0ee]/30" />
                    {filteredDayIndices.map((dowIdx) => (
                      <div
                        key={dowIdx}
                        className={cn(
                          "min-w-[110px] flex-1 border-r border-border/40 last:border-r-0",
                          isTodayDate(weekDates[dowIdx]) && "bg-primary/[0.015]",
                        )}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

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
