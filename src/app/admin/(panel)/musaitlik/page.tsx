"use client";

import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { Lock, Users, X } from "lucide-react";
import { PageHeader } from "@/features/admin/components/page-header";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-cookies";

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

const EXPERT_COLORS = [
  "#4d978b",
  "#f59e0b",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#6366f1",
];

const DAY_LABELS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const DAY_OF_WEEK = [1, 2, 3, 4, 5, 6, 0]; // Mon→Sun

type TimeRange = "all" | "morning" | "afternoon" | "evening";
const TIME_RANGE_OPTS: { value: TimeRange; label: string; sub: string }[] = [
  { value: "all",       label: "Tümü",   sub: "" },
  { value: "morning",   label: "Sabah",  sub: "08-12" },
  { value: "afternoon", label: "Öğle",   sub: "12-17" },
  { value: "evening",   label: "Akşam",  sub: "17+" },
];

function getToken() { return getAccessToken() ?? ""; }
function initials(e: ExpertItem) {
  return `${e.user.firstName[0] ?? ""}${e.user.lastName[0] ?? ""}`.toUpperCase();
}
function getWeekDates(): Date[] {
  const today = new Date();
  const day = today.getDay();
  const diff = day === 0 ? 6 : day - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - diff);
  monday.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}
function isTodayDate(date: Date) {
  const t = new Date();
  return (
    date.getDate() === t.getDate() &&
    date.getMonth() === t.getMonth() &&
    date.getFullYear() === t.getFullYear()
  );
}
function matchesRange(time: string, range: TimeRange) {
  if (range === "all") return true;
  if (range === "morning")   return time < "12:00";
  if (range === "afternoon") return time >= "12:00" && time < "17:00";
  if (range === "evening")   return time >= "17:00";
  return true;
}

async function fetchExperts(): Promise<ExpertItem[]> {
  const res = await apiFetch<{ data: ExpertItem[] } | ExpertItem[]>(
    "/admin/experts?limit=100",
    { token: getToken() },
  );
  return Array.isArray(res) ? res : (res.data ?? []);
}
async function fetchAvailabilities(id: string): Promise<ApiAvailability[]> {
  return apiFetch(`/admin/experts/${id}/availabilities`, { token: getToken() });
}
async function patchBulkBlock(ids: string[], block: boolean) {
  return apiFetch("/admin/availabilities/bulk-block", {
    method: "PATCH",
    body: { ids, block },
    token: getToken(),
  });
}

export default function AdminMusaitlikPage() {
  const [experts,      setExperts]      = useState<ExpertItem[]>([]);
  const [checkedIds,   setCheckedIds]   = useState<Set<string>>(new Set());
  const [availMap,     setAvailMap]     = useState<Map<string, ApiAvailability[]>>(new Map());
  const [loadingExperts, setLoadingExperts] = useState(true);

  /* ── filters ── */
  const [filterDays,  setFilterDays]  = useState<Set<number>>(new Set([0,1,2,3,4,5,6]));
  const [filterRange, setFilterRange] = useState<TimeRange>("all");

  const weekDates = useMemo(() => getWeekDates(), []);

  /* ── load data ── */
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

  /* ── derived ── */
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

  /* filtered time rows */
  const timeSlots = useMemo(() => {
    const s = new Set(visibleAvails.map((a) => a.startTime));
    return [...s].sort().filter((t) => matchesRange(t, filterRange));
  }, [visibleAvails, filterRange]);

  /* filtered day columns */
  const filteredDayIndices = useMemo(
    () => Array.from({ length: 7 }, (_, i) => i).filter((i) => filterDays.has(i)),
    [filterDays],
  );

  const activeFilterCount =
    (filterRange !== "all" ? 1 : 0) +
    (filterDays.size < 7 ? 1 : 0);

  function getCellAvails(dowIdx: number, time: string): AvailWithExpert[] {
    const dayNum = DAY_OF_WEEK[dowIdx];
    return visibleAvails.filter(
      (a) => a.dayOfWeek === dayNum && a.startTime === time,
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
    setFilterDays((prev) => {
      const n = new Set(prev);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });
  }
  function toggleCheck(id: string) {
    setCheckedIds((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }
  function clearFilters() {
    setFilterDays(new Set([0,1,2,3,4,5,6]));
    setFilterRange("all");
  }

  const allChecked = experts.length > 0 && checkedIds.size === experts.length;

  /* ───────────────────── render ───────────────────── */
  return (
    <div className="space-y-4">
      <PageHeader
        title="Müsaitlik Yönetimi"
        description="Tüm uzmanların haftalık müsaitliklerini ortak tabloda görüntüleyin ve yönetin."
      />

      {/* ── Filter bar ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border border-border/60 bg-white px-5 py-3.5">
        {/* Day filter */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Gün
          </span>
          <div className="flex gap-1">
            {DAY_LABELS.map((label, i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggleDay(i)}
                className={cn(
                  "min-w-[32px] rounded-lg border px-2 py-1 text-[11px] font-semibold transition-colors duration-150",
                  filterDays.has(i)
                    ? "border-primary/40 bg-primary/10 text-[#014a3e]"
                    : "border-border/50 text-muted-foreground/60 hover:border-primary/20 hover:bg-primary/5",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="hidden h-5 w-px bg-border/60 sm:block" />

        {/* Time filter */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Saat
          </span>
          <div className="flex gap-1">
            {TIME_RANGE_OPTS.map(({ value, label, sub }) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilterRange(value)}
                className={cn(
                  "flex items-baseline gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-colors duration-150",
                  filterRange === value
                    ? "border-primary bg-primary text-white"
                    : "border-border/50 text-muted-foreground hover:border-primary/30 hover:bg-primary/5",
                )}
              >
                {label}
                {sub && (
                  <span
                    className={cn(
                      "text-[9px]",
                      filterRange === value ? "text-white/70" : "text-muted-foreground/60",
                    )}
                  >
                    {sub}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Active count + clear */}
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="ml-auto flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 transition hover:bg-amber-100"
          >
            <X className="size-3" />
            {activeFilterCount} filtre aktif — temizle
          </button>
        )}
      </div>

      {/* ── Main grid ──────────────────────────────────────────── */}
      <div className="grid gap-5 lg:grid-cols-[220px_1fr]">

        {/* Expert selector */}
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-white">
          <div className="flex items-center justify-between border-b border-border/60 bg-[#e6f0ee] px-4 py-2.5">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <Users className="size-3.5" /> Uzman Seç
            </p>
            <button
              type="button"
              className="cursor-pointer text-[10px] font-semibold text-primary transition hover:underline"
              onClick={() =>
                setCheckedIds(
                  allChecked ? new Set() : new Set(experts.map((e) => e.id)),
                )
              }
            >
              {allChecked ? "Kaldır" : "Tümünü Seç"}
            </button>
          </div>

          <div className="flex max-h-[62vh] flex-col gap-0.5 overflow-y-auto p-2">
            {loadingExperts
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="skeleton h-11 rounded-xl" />
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
                      className={cn(
                        "flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2 text-left transition-all duration-150",
                        checked
                          ? "border-primary/25 bg-primary/5 shadow-sm"
                          : "border-transparent opacity-45 hover:opacity-70 hover:bg-[#e6f0ee]",
                      )}
                    >
                      <div
                        className="flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                        style={{ background: color }}
                      >
                        {initials(expert)}
                      </div>
                      <p className="min-w-0 flex-1 truncate text-xs font-medium text-foreground">
                        {expert.user.firstName} {expert.user.lastName}
                      </p>
                      {checked && (
                        <span
                          className="size-2 shrink-0 rounded-full"
                          style={{ background: color }}
                        />
                      )}
                    </button>
                  );
                })}
          </div>

          {/* Color legend */}
          {checkedIds.size > 0 && (
            <div className="border-t border-border/50 px-3 py-2.5 space-y-1.5">
              {experts
                .filter((e) => checkedIds.has(e.id))
                .map((e) => (
                  <div key={e.id} className="flex items-center gap-2">
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{ background: colorMap.get(e.id) }}
                    />
                    <span className="truncate text-[10px] text-muted-foreground">
                      {e.user.firstName} {e.user.lastName}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Combined weekly grid */}
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-white">
          {/* Grid header */}
          <div className="flex items-center justify-between border-b border-border/60 bg-[#e6f0ee] px-4 py-2.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Haftalık Ortak Takvim
            </p>
            {checkedIds.size > 0 && (
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#014a3e]">
                {checkedIds.size} uzman
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            {/* Day header row */}
            <div className="flex border-b-2 border-border/60 bg-[#e6f0ee]">
              <div className="w-16 shrink-0 border-r border-border/60 px-2 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                SAAT
              </div>
              {filteredDayIndices.map((dowIdx) => {
                const date    = weekDates[dowIdx];
                const today   = isTodayDate(date);
                return (
                  <div
                    key={dowIdx}
                    className={cn(
                      "min-w-[90px] flex-1 border-r border-border/60 py-2.5 text-center last:border-r-0",
                      today
                        ? "bg-primary/15 ring-inset ring-1 ring-primary/20"
                        : "bg-[#e6f0ee]",
                    )}
                  >
                    <p className={cn(
                      "text-[10px] font-bold uppercase tracking-wider",
                      today ? "text-primary" : "text-muted-foreground",
                    )}>
                      {DAY_LABELS[dowIdx]}
                    </p>
                    <p className={cn(
                      "mt-0.5 text-lg font-bold leading-none",
                      today ? "text-primary" : "text-[#014a3e]",
                    )}>
                      {date.getDate()}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Body */}
            {timeSlots.length === 0 ? (
              <div className="py-16 text-center text-sm text-muted-foreground">
                {checkedIds.size === 0
                  ? "Sol panelden uzman seçin"
                  : filterRange !== "all" || filterDays.size < 7
                    ? "Bu filtreye uyan müsaitlik kaydı bulunamadı"
                    : "Seçili uzmanlarda müsaitlik kaydı yok"}
              </div>
            ) : (
              timeSlots.map((time) => (
                <div
                  key={time}
                  className="group flex border-b border-border/40 last:border-b-0 transition-colors duration-100 hover:bg-muted/20"
                >
                  {/* Time label */}
                  <div className="flex w-16 shrink-0 items-center justify-center border-r border-border/50 bg-[#e6f0ee] px-1 py-2">
                    <p className="text-[11px] font-semibold tabular-nums text-[#014a3e]">
                      {time}
                    </p>
                  </div>

                  {/* Day cells */}
                  {filteredDayIndices.map((dowIdx) => {
                    const date = weekDates[dowIdx];
                    const today = isTodayDate(date);
                    const cell  = getCellAvails(dowIdx, time);

                    return (
                      <div
                        key={dowIdx}
                        className={cn(
                          "min-h-[52px] min-w-[90px] flex-1 border-r border-border/40 p-1.5 last:border-r-0",
                          today && "bg-primary/[0.03]",
                        )}
                      >
                        <div className="flex flex-col gap-1">
                          {cell.map((avail) => {
                            const expert = experts.find(
                              (e) => e.id === avail.expertProfileId,
                            );
                            if (!expert) return null;
                            const color   = colorMap.get(expert.id) ?? "#4d978b";
                            const blocked = avail.isBlockedByAdmin;

                            return (
                              <button
                                key={avail.id}
                                type="button"
                                aria-label={`${expert.user.firstName} ${expert.user.lastName} — ${blocked ? "Kilidi aç" : "Kilitle"}`}
                                onClick={() => handleToggle(avail)}
                                className={cn(
                                  "flex w-full cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-[4px] text-[11px] font-semibold transition-all duration-150",
                                  "hover:brightness-95 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                                  blocked ? "opacity-75" : "",
                                )}
                                style={
                                  blocked
                                    ? { background: "#fee2e2", color: "#dc2626" }
                                    : { background: color + "20", color }
                                }
                              >
                                <span
                                  className="size-2 shrink-0 rounded-full"
                                  style={{ background: blocked ? "#dc2626" : color }}
                                />
                                <span className={cn("leading-none", blocked && "line-through")}>
                                  {initials(expert)}
                                </span>
                                {blocked && (
                                  <Lock className="ml-auto size-3 shrink-0 text-red-400" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer legend */}
          <div className="flex flex-wrap items-center gap-5 border-t border-border/40 bg-muted/20 px-4 py-2.5 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-[#4d978b]" />
              Müsait
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-red-400" />
              Admin Kilitli
            </div>
            <p className="ml-auto">
              Chip&apos;e tıklayarak kilit durumunu değiştirin
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
