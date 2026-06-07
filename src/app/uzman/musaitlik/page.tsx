"use client";

import { useState, useEffect, useMemo } from "react";
import { Info, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/features/admin/components/page-header";
import { cn } from "@/lib/utils";
import {
  getMyAvailabilities,
  addAvailability,
  removeAvailability,
  type ApiAvailability,
} from "@/lib/services/uzman.service";

/* ─── Constants ────────────────────────────────────────────── */
const DAY_SHORT = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const MONTH_SHORT = ["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"];

const SLOT_DEFS = Array.from({ length: 15 }, (_, i) => {
  const h = 8 + i;
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    key: `${pad(h)}-${pad(h + 1)}`,
    label: `${pad(h)}:00`,
    startTime: `${pad(h)}:00`,
    endTime: `${pad(h + 1)}:00`,
  };
});

type SlotKey = string;

type WeekCell = {
  id?: string;
  dateStr: string;
  dayIdx: number;
  slotKey: SlotKey;
  available: boolean;
  adminLocked: boolean;
};

/* ─── Helpers ──────────────────────────────────────────────── */
function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getWeekDates(offset = 0): Date[] {
  const today = new Date();
  const diff = today.getDay() === 0 ? 6 : today.getDay() - 1;
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
  return (
    d.getDate() === t.getDate() &&
    d.getMonth() === t.getMonth() &&
    d.getFullYear() === t.getFullYear()
  );
}

function weekRangeLabel(dates: Date[]): string {
  const d1 = dates[0].getDate();
  const d2 = dates[6].getDate();
  const m1 = MONTH_SHORT[dates[0].getMonth()];
  const m2 = MONTH_SHORT[dates[6].getMonth()];
  return dates[0].getMonth() === dates[6].getMonth()
    ? `${d1}–${d2} ${m1}`
    : `${d1} ${m1} – ${d2} ${m2}`;
}

function deriveWeekCells(weekDates: Date[], avails: ApiAvailability[]): WeekCell[] {
  return weekDates.flatMap((date, dayIdx) =>
    SLOT_DEFS.map((slot) => {
      const dateStr = toDateStr(date);
      const existing = avails.find(
        (a) => a.date.startsWith(dateStr) && a.startTime === slot.startTime,
      );
      return {
        dateStr,
        dayIdx,
        slotKey: slot.key,
        id: existing?.id,
        available: !!existing,
        adminLocked: existing?.isBlockedByAdmin ?? false,
      };
    }),
  );
}

/* ─── Component ────────────────────────────────────────────── */
export default function UzmanMusaitlikPage() {
  const [allAvails, setAllAvails] = useState<ApiAvailability[]>([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [cells, setCells] = useState<WeekCell[]>([]);
  const [initialCells, setInitialCells] = useState<WeekCell[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset]);

  useEffect(() => {
    getMyAvailabilities()
      .then(setAllAvails)
      .catch(() => toast.error("Müsaitlik yüklenemedi."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const derived = deriveWeekCells(weekDates, allAvails);
    setCells(derived);
    setInitialCells(JSON.parse(JSON.stringify(derived)));
  }, [weekDates, allAvails]);

  function toggleCell(dateStr: string, slotKey: SlotKey) {
    setCells((prev) =>
      prev.map((c) =>
        c.dateStr === dateStr && c.slotKey === slotKey && !c.adminLocked
          ? { ...c, available: !c.available }
          : c,
      ),
    );
  }

  function getCell(dateStr: string, slotKey: SlotKey) {
    return cells.find((c) => c.dateStr === dateStr && c.slotKey === slotKey);
  }

  function selectAll() {
    setCells((prev) => prev.map((c) => (c.adminLocked ? c : { ...c, available: true })));
  }

  function clearAll() {
    setCells((prev) => prev.map((c) => (c.adminLocked ? c : { ...c, available: false })));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const toAdd: WeekCell[] = [];
      const toRemove: string[] = [];

      for (const cell of cells) {
        if (cell.adminLocked) continue;
        const initial = initialCells.find(
          (c) => c.dateStr === cell.dateStr && c.slotKey === cell.slotKey,
        );
        const wasAvailable = initial?.available ?? false;

        if (cell.available && !wasAvailable) {
          toAdd.push(cell);
        } else if (!cell.available && wasAvailable && initial?.id) {
          toRemove.push(initial.id);
        }
      }

      await Promise.all([
        ...toRemove.map((id) => removeAvailability(id)),
        ...toAdd.map((c) => {
          const slot = SLOT_DEFS.find((s) => s.key === c.slotKey)!;
          return addAvailability({
            date: c.dateStr,
            startTime: slot.startTime,
            endTime: slot.endTime,
          });
        }),
      ]);

      const fresh = await getMyAvailabilities();
      setAllAvails(fresh);

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      toast.success("Müsaitlik kaydedildi.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Kayıt başarısız.");
    } finally {
      setSaving(false);
    }
  }

  const availableCount = cells.filter((c) => c.available && !c.adminLocked).length;
  const lockedCount = cells.filter((c) => c.adminLocked).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 skeleton rounded-xl" />
        <div className="h-64 skeleton rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Müsaitlik Takvimi"
        description="Haftalık çalışma saatlerinizi belirleyin."
      >
        {saved && (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
            <CheckCircle2 className="size-4" />
            Kaydedildi
          </span>
        )}
        <Button size="sm" onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Kaydediliyor…
            </>
          ) : (
            "Müsaitliği Kaydet"
          )}
        </Button>
      </PageHeader>

      <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4">
        <Info className="mt-0.5 size-4 shrink-0 text-blue-600" />
        <div>
          <p className="text-sm font-semibold text-blue-800">Müsaitlik Hakkında</p>
          <p className="mt-0.5 text-xs text-blue-700">
            Seçtiğiniz zaman dilimleri danışanlar için görünür olacaktır. Kırmızı
            işaretli hücreler admin tarafından kilitlenmiştir ve değiştirilemez.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-white p-5">
        {/* Toolbar */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-foreground">Haftalık Takvim</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {availableCount} zaman dilimi seçili · {lockedCount} slot kilitli
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={selectAll}
              className="rounded-xl border border-border/60 px-3 py-1.5 text-xs font-semibold
                         text-muted-foreground transition hover:border-primary/30 hover:text-primary"
            >
              Tümünü Seç
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="rounded-xl border border-border/60 px-3 py-1.5 text-xs font-semibold
                         text-muted-foreground transition hover:border-destructive/30 hover:text-destructive"
            >
              Temizle
            </button>
            {/* Week navigation */}
            <div className="flex items-center overflow-hidden rounded-lg border border-border/60">
              <button
                type="button"
                onClick={() => setWeekOffset((p) => p - 1)}
                className="flex h-8 cursor-pointer items-center px-2 transition-colors
                           hover:bg-muted/60 border-r border-border/60"
                aria-label="Önceki hafta"
              >
                <ChevronLeft className="size-3.5 text-muted-foreground" />
              </button>
              <div className="flex h-8 min-w-[96px] flex-col items-center justify-center px-2 leading-none">
                <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                  {weekOffset === 0
                    ? "Bu Hafta"
                    : weekOffset === 1
                    ? "Gelecek Hafta"
                    : weekOffset === -1
                    ? "Geçen Hafta"
                    : weekOffset > 0
                    ? `+${weekOffset} Hafta`
                    : `${weekOffset} Hafta`}
                </span>
                <span className="text-[11px] font-semibold text-foreground tabular-nums">
                  {weekRangeLabel(weekDates)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setWeekOffset((p) => p + 1)}
                className="flex h-8 cursor-pointer items-center px-2 transition-colors
                           hover:bg-muted/60 border-l border-border/60"
                aria-label="Sonraki hafta"
              >
                <ChevronRight className="size-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border/60">
          {/* Day header row */}
          <div className="flex border-b-2 border-border/60 bg-[#e6f0ee]">
            <div className="w-16 shrink-0 border-r border-border/60 px-2 py-3
                            text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">
              SAAT
            </div>
            {weekDates.map((date, dayIdx) => {
              const today = isTodayDate(date);
              return (
                <div
                  key={dayIdx}
                  className={cn(
                    "flex-1 min-w-0 border-r border-border/60 py-2 text-center last:border-r-0",
                    today && "bg-primary/15",
                  )}
                >
                  <p className={cn(
                    "text-[10px] font-bold uppercase tracking-wider",
                    today ? "text-primary" : "text-muted-foreground",
                  )}>
                    {DAY_SHORT[dayIdx]}
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

          {/* Slot rows — scrollable */}
          <div className="max-h-[480px] overflow-y-auto">
            {SLOT_DEFS.map((slot, slotIdx) => (
              <div
                key={slot.key}
                className={cn(
                  "flex border-b border-border/40 last:border-b-0",
                  "hover:bg-primary/[0.02]",
                  slotIdx % 2 === 1 && "bg-muted/[0.015]",
                )}
              >
                <div className="w-16 shrink-0 border-r border-border/60 bg-[#e6f0ee] px-2 py-1.5">
                  <p className="text-[11px] font-semibold tabular-nums text-[#014a3e]">{slot.label}</p>
                </div>
                {weekDates.map((date, dayIdx) => {
                  const dateStr = toDateStr(date);
                  const cell = getCell(dateStr, slot.key);
                  const today = isTodayDate(date);
                  if (!cell) {
                    return (
                      <div
                        key={dayIdx}
                        className="flex-1 border-r border-border/40 last:border-r-0 p-1.5"
                      />
                    );
                  }
                  return (
                    <div
                      key={dayIdx}
                      className={cn(
                        "flex flex-1 items-center justify-center border-r border-border/40 p-1.5 last:border-r-0",
                        cell.adminLocked && "bg-red-50/50",
                        today && !cell.adminLocked && "bg-primary/[0.02]",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => toggleCell(dateStr, slot.key)}
                        disabled={cell.adminLocked}
                        title={
                          cell.adminLocked
                            ? "Admin tarafından kilitlendi"
                            : cell.available
                            ? "Müsait — tıklayarak kaldır"
                            : "Müsait değil — tıklayarak ekle"
                        }
                        style={
                          cell.adminLocked
                            ? {
                                backgroundImage:
                                  "repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(220,38,38,0.12) 3px, rgba(220,38,38,0.12) 6px)",
                              }
                            : undefined
                        }
                        className={cn(
                          "w-full rounded-lg border py-1.5 text-[10px] font-bold transition-all",
                          cell.adminLocked &&
                            "cursor-not-allowed border-red-200 text-red-400",
                          !cell.adminLocked &&
                            cell.available &&
                            "border-primary/40 bg-primary text-white shadow-sm hover:bg-primary-hover active:scale-95",
                          !cell.adminLocked &&
                            !cell.available &&
                            "border-border/50 bg-white text-muted-foreground hover:border-primary/30 hover:bg-[#e6f0ee] hover:text-primary",
                        )}
                        aria-label={`${DAY_SHORT[dayIdx]} ${slot.label} ${cell.available ? "müsait" : "müsait değil"}`}
                        aria-pressed={cell.available}
                      >
                        {cell.adminLocked ? "Kilitli" : cell.available ? "Müsait" : "Boş"}
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-4 w-6 rounded border border-primary/40 bg-primary" />
            Müsait
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-4 w-6 rounded border border-border/50 bg-white" />
            Müsait Değil
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div
              className="h-4 w-6 rounded border border-red-200"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(220,38,38,0.12) 3px, rgba(220,38,38,0.12) 6px)",
              }}
            />
            <span>Admin Kilitli</span>
          </div>
        </div>
      </div>
    </div>
  );
}
