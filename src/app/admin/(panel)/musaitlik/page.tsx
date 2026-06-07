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
  "#4d978b", "#f59e0b", "#3b82f6", "#8b5cf6",
  "#ec4899", "#14b8a6", "#f97316", "#6366f1",
];

const DAY_LABELS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const DAY_OF_WEEK = [1, 2, 3, 4, 5, 6, 0];

type TimeRange = "all" | "morning" | "afternoon" | "evening";
const TIME_RANGE_OPTS: { value: TimeRange; label: string; sub: string }[] = [
  { value: "all",       label: "Tümü",  sub: "" },
  { value: "morning",   label: "Sabah", sub: "08-12" },
  { value: "afternoon", label: "Öğle",  sub: "12-17" },
  { value: "evening",   label: "Akşam", sub: "17+" },
];

function getToken() { return getAccessToken() ?? ""; }

/** "Şükran Ç." biçiminde kısaltılmış etiket */
function expertLabel(e: ExpertItem) {
  const last = e.user.lastName?.trim();
  return `${e.user.firstName}${last ? ` ${last[0].toUpperCase()}.` : ""}`;
}

function initials(e: ExpertItem) {
  return `${e.user.firstName[0] ?? ""}${e.user.lastName?.[0] ?? ""}`.toUpperCase();
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
  if (range === "all")       return true;
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

  const timeSlots = useMemo(() => {
    const s = new Set(visibleAvails.map((a) => a.startTime));
    return [...s].sort().filter((t) => matchesRange(t, filterRange));
  }, [visibleAvails, filterRange]);

  const filteredDayIndices = useMemo(
    () => Array.from({ length: 7 }, (_, i) => i).filter((i) => filterDays.has(i)),
    [filterDays],
  );

  const activeFilterCount = (filterRange !== "all" ? 1 : 0) + (filterDays.size < 7 ? 1 : 0);

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

  const allChecked = experts.length > 0 && checkedIds.size === experts.length;

  /* ─────────── render ─────────── */
  return (
    /*
     * Outer: sadece flex col + gap.
     * h-screen & overflow-hidden parent layout'ta zaten var (admin layout).
     * main.overflow-auto.p-4.sm:p-6 içindeyiz:
     *   Kullanılabilir yükseklik ≈ 100vh − (p*2) − PageHeader − gap
     *   p-4→32px, p-6→48px; PageHeader≈64px; gap≈12px → ~156px ≈ 9.75rem
     *   Güvenli: calc(100vh - 10rem) mobil, calc(100vh - 10.5rem) sm+
     */
    <div className="flex flex-col gap-3">

      {/* PageHeader */}
      <div className="shrink-0">
        <PageHeader
          title="Müsaitlik Yönetimi"
          description="Tüm uzmanların haftalık müsaitliklerini ortak tabloda görüntüleyin."
        />
      </div>

      {/* ═══════ TEK KUTU ═══════
          Yükseklik = viewport − padding − header − gap
          p-4 (mobile): 2×16 + 64 + 12 = 108px ≈ 6.75rem  → 7rem
          p-6 (sm+):    2×24 + 64 + 12 = 124px ≈ 7.75rem  → 8rem        */}
      <div className="flex overflow-hidden rounded-2xl border border-border/60 bg-white
                      h-[calc(100vh-7rem)] sm:h-[calc(100vh-8rem)]">

        {/* ── SOL: Uzman Seç (25%) ── */}
        <div className="flex w-56 shrink-0 flex-col border-r border-border/60">

          {/* Panel başlığı */}
          <div className="flex shrink-0 items-center justify-between
                          border-b border-border/60 bg-[#e6f0ee] px-3 py-2">
            <span className="flex items-center gap-1.5 text-[10px] font-bold
                             uppercase tracking-widest text-muted-foreground">
              <Users className="size-3" /> Uzman Seç
            </span>
            <button
              type="button"
              onClick={() =>
                setCheckedIds(allChecked ? new Set() : new Set(experts.map((e) => e.id)))
              }
              className="cursor-pointer text-[10px] font-semibold text-primary hover:underline"
            >
              {allChecked ? "Kaldır" : "Tümünü"}
            </button>
          </div>

          {/* Uzman listesi — scroll */}
          <div className="flex flex-1 min-h-0 flex-col gap-0.5 overflow-y-auto p-1.5">
            {loadingExperts
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="skeleton h-10 rounded-lg" />
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
                        "flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-1.5",
                        "text-left transition-all duration-150",
                        checked
                          ? "border-primary/20 bg-primary/5"
                          : "border-transparent opacity-40 hover:opacity-65 hover:bg-[#e6f0ee]",
                      )}
                    >
                      {/* Avatar */}
                      <div
                        className="flex size-6 shrink-0 items-center justify-center
                                   rounded-full text-[9px] font-bold text-white"
                        style={{ background: color }}
                      >
                        {initials(expert)}
                      </div>
                      {/* İsim */}
                      <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-foreground">
                        {expert.user.firstName} {expert.user.lastName}
                      </span>
                      {/* Renk göstergesi */}
                      {checked && (
                        <span className="size-1.5 shrink-0 rounded-full" style={{ background: color }} />
                      )}
                    </button>
                  );
                })}
          </div>

          {/* Legend — alt sabit */}
          {checkedIds.size > 0 && (
            <div className="shrink-0 space-y-1 border-t border-border/50 px-2.5 py-2">
              <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">
                Renk Göstergesi
              </p>
              {experts
                .filter((e) => checkedIds.has(e.id))
                .map((e) => (
                  <div key={e.id} className="flex items-center gap-1.5">
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

        {/* ── SAĞ: Filter + Tablo (75%) ── */}
        <div className="flex flex-1 min-w-0 flex-col">

          {/* ── Filter bar (sabit yükseklik) ── */}
          <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2
                          border-b border-border/60 bg-[#e6f0ee]/40 px-4 py-2.5">

            {/* Gün filtreleri */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Gün
              </span>
              <div className="flex gap-1">
                {DAY_LABELS.map((label, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleDay(i)}
                    className={cn(
                      "min-w-[28px] cursor-pointer rounded-md border px-1.5 py-0.5",
                      "text-[11px] font-semibold transition-colors duration-150",
                      filterDays.has(i)
                        ? "border-primary/40 bg-primary/10 text-[#014a3e]"
                        : "border-border/40 text-muted-foreground/50 hover:bg-white",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Ayraç */}
            <div className="hidden h-4 w-px bg-border/50 sm:block" />

            {/* Saat filtresi */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Saat
              </span>
              <div className="flex gap-1">
                {TIME_RANGE_OPTS.map(({ value, label, sub }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFilterRange(value)}
                    className={cn(
                      "flex cursor-pointer items-baseline gap-0.5 rounded-md border px-2 py-0.5",
                      "text-[11px] font-semibold transition-colors duration-150",
                      filterRange === value
                        ? "border-primary bg-primary text-white"
                        : "border-border/40 text-muted-foreground hover:bg-white",
                    )}
                  >
                    {label}
                    {sub && (
                      <span className={cn(
                        "text-[9px]",
                        filterRange === value ? "text-white/65" : "text-muted-foreground/50",
                      )}>
                        {sub}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Temizle */}
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="ml-auto flex cursor-pointer items-center gap-1.5 rounded-md
                           border border-amber-200 bg-amber-50 px-2 py-0.5
                           text-[11px] font-semibold text-amber-700 transition hover:bg-amber-100"
              >
                <X className="size-3" />
                {activeFilterCount} filtre — temizle
              </button>
            )}
          </div>

          {/* ── Tablo (flex-1, kendi içinde scroll) ── */}
          <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
            <div className="flex-1 min-h-0 overflow-auto">
              {/* İçerik flex col min-h-full → boş alan alta doluyor */}
              <div className="flex min-h-full flex-col">

                {/* Sticky gün başlıkları */}
                <div className="sticky top-0 z-10 flex shrink-0 border-b-2 border-border/60 bg-[#e6f0ee]">
                  {/* Saat kolonu */}
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
                          today ? "bg-primary/15" : "",
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

                {/* Zaman satırları */}
                {timeSlots.length === 0 ? (
                  <div className="flex flex-1 items-center justify-center py-12 text-sm text-muted-foreground">
                    {checkedIds.size === 0
                      ? "Sol panelden uzman seçin"
                      : activeFilterCount > 0
                        ? "Bu filtreye uyan müsaitlik kaydı bulunamadı"
                        : "Seçili uzmanlarda müsaitlik kaydı yok"}
                  </div>
                ) : (
                  <>
                    {timeSlots.map((time, rowIdx) => (
                      <div
                        key={time}
                        className={cn(
                          "flex shrink-0 border-b border-border/40 last:border-b-0",
                          "transition-colors duration-100 hover:bg-primary/[0.02]",
                          rowIdx % 2 === 1 && "bg-muted/[0.015]",
                        )}
                      >
                        {/* Saat etiketi */}
                        <div className="flex w-14 shrink-0 items-center justify-center
                                        border-r border-border/50 bg-[#e6f0ee] px-1 py-3">
                          <p className="text-[11px] font-semibold tabular-nums text-[#014a3e]">
                            {time}
                          </p>
                        </div>

                        {/* Hücreler */}
                        {filteredDayIndices.map((dowIdx) => {
                          const date  = weekDates[dowIdx];
                          const today = isTodayDate(date);
                          const cell  = getCellAvails(dowIdx, time);

                          return (
                            <div
                              key={dowIdx}
                              className={cn(
                                "min-w-[110px] flex-1 border-r border-border/40 p-1.5 last:border-r-0",
                                today && "bg-primary/[0.025]",
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
                                      aria-label={`${expert.user.firstName} ${expert.user.lastName} — ${blocked ? "Kilidi aç" : "Kilitle"}`}
                                      title={`${expert.user.firstName} ${expert.user.lastName} — ${blocked ? "Kilidi aç" : "Kilitle"}`}
                                      onClick={() => handleToggle(avail)}
                                      className={cn(
                                        "flex w-full cursor-pointer items-center gap-1.5 rounded-md",
                                        "px-2 py-1 text-[11px] font-semibold",
                                        "transition-all duration-150 hover:brightness-95 active:scale-[0.97]",
                                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                        blocked && "opacity-70",
                                      )}
                                      style={
                                        blocked
                                          ? { background: "#fee2e2", color: "#dc2626" }
                                          : { background: color + "1a", color }
                                      }
                                    >
                                      {/* Dot */}
                                      <span
                                        className="size-2 shrink-0 rounded-full"
                                        style={{ background: blocked ? "#dc2626" : color }}
                                      />
                                      {/* İsim */}
                                      <span className={cn(
                                        "min-w-0 flex-1 truncate leading-none",
                                        blocked && "line-through",
                                      )}>
                                        {expertLabel(expert)}
                                      </span>
                                      {blocked && (
                                        <Lock className="size-3 shrink-0 text-red-400" />
                                      )}
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
                      <div className="w-14 shrink-0 border-r border-border/60 bg-[#e6f0ee]/50" />
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

            {/* Footer — sabit */}
            <div className="flex shrink-0 flex-wrap items-center gap-4
                            border-t border-border/40 bg-muted/20 px-4 py-2
                            text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#4d978b]" /> Müsait
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-red-400" /> Admin Kilitli
              </div>
              <p className="ml-auto text-[10px]">İsme tıklayarak kilit durumunu değiştirin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
