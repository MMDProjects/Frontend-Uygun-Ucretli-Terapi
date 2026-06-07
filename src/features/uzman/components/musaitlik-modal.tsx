"use client";

import { useState, useEffect, useRef } from "react";
import { X, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { DayOfWeek, TimeSlot, AvailabilityCell } from "@/types/domain";
import {
  getMyAvailabilities,
  addAvailability,
  removeAvailability,
} from "@/lib/services/uzman.service";

const DAYS: DayOfWeek[] = [
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
  "Pazar",
];

// 15 saatlik slot: 08:00–09:00, ..., 22:00–23:00
const HOURLY_SLOTS = Array.from({ length: 15 }, (_, i) => {
  const h = 8 + i;
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    key: `${pad(h)}:00` as TimeSlot,
    label: `${pad(h)}:00`,
    startTime: `${pad(h)}:00`,
    endTime: `${pad(h + 1)}:00`,
  };
});

// 0=Mon..6=Sun → DayOfWeek adı
const DAY_IDX_MAP: Record<number, DayOfWeek> = {
  0: "Pazartesi", 1: "Salı", 2: "Çarşamba", 3: "Perşembe",
  4: "Cuma", 5: "Cumartesi", 6: "Pazar",
};

function startTimeToSlot(startTime: string): TimeSlot | null {
  const slot = HOURLY_SLOTS.find((s) => s.startTime === startTime);
  return slot ? slot.key : null;
}

function buildEmptyCells(): AvailabilityCell[] {
  return DAYS.flatMap((day) =>
    HOURLY_SLOTS.map((slot) => ({ day, slot: slot.key, available: false, adminLocked: false }))
  );
}

function cellKey(day: DayOfWeek, slot: TimeSlot) {
  return `${day}::${slot}`;
}

function getCurrentWeekDates(): Date[] {
  const today = new Date();
  const diff = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - diff);
  monday.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function MusaitlikModal() {
  const { role, isAuthenticated, hasSetMusaitlik, markMusaitlikSet } =
    useAuthStore();

  const [cells, setCells] = useState<AvailabilityCell[]>(buildEmptyCells());
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const savedIdsRef = useRef<Map<string, string>>(new Map());
  // dateStr for each day index in current week (0=Mon..6=Sun)
  const weekDatesRef = useRef<string[]>([]);

  const shouldShow = isAuthenticated && role === "uzman" && !hasSetMusaitlik;

  useEffect(() => {
    if (!shouldShow) return;

    const weekDates = getCurrentWeekDates();
    weekDatesRef.current = weekDates.map(toDateStr);

    getMyAvailabilities()
      .then((avails) => {
        const idMap = new Map<string, string>();
        const newCells = buildEmptyCells();

        avails.forEach((a) => {
          // Parse the date field and map to day index (0=Mon..6=Sun)
          const d = new Date(a.date);
          const jsDay = d.getDay(); // 0=Sun,1=Mon..6=Sat
          const dayIdx = jsDay === 0 ? 6 : jsDay - 1;
          const day = DAY_IDX_MAP[dayIdx];
          if (!day) return;

          // Only apply slots that belong to the current week
          const aDateStr = a.date.substring(0, 10);
          if (aDateStr !== weekDatesRef.current[dayIdx]) return;

          const slot = startTimeToSlot(a.startTime);
          if (!slot) return;
          const key = cellKey(day, slot);
          idMap.set(key, a.id);

          const cell = newCells.find((c) => c.day === day && c.slot === slot);
          if (cell) {
            cell.available = !a.isBlockedByAdmin;
            cell.adminLocked = a.isBlockedByAdmin;
          }
        });

        savedIdsRef.current = idMap;
        setCells(newCells);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [shouldShow]);

  if (!shouldShow) return null;

  function toggleCell(day: DayOfWeek, slot: TimeSlot) {
    setCells((prev) =>
      prev.map((c) =>
        c.day === day && c.slot === slot && !c.adminLocked
          ? { ...c, available: !c.available }
          : c
      )
    );
  }

  function getCell(day: DayOfWeek, slot: TimeSlot) {
    return cells.find((c) => c.day === day && c.slot === slot);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const promises: Promise<unknown>[] = [];

      cells.forEach((cell) => {
        if (cell.adminLocked) return;
        const key = cellKey(cell.day, cell.slot);
        const existingId = savedIdsRef.current.get(key);

        if (cell.available && !existingId) {
          const dayIdx = DAYS.indexOf(cell.day);
          const dateStr = weekDatesRef.current[dayIdx];
          const slotDef = HOURLY_SLOTS.find((s) => s.key === cell.slot);
          if (dateStr && slotDef) promises.push(addAvailability({ date: dateStr, startTime: slotDef.startTime, endTime: slotDef.endTime }));
        } else if (!cell.available && existingId) {
          promises.push(removeAvailability(existingId));
        }
      });

      await Promise.all(promises);
      markMusaitlikSet();
    } catch {
      // Kısmi hata olsa bile modal'ı kapatma
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-4 sm:items-center">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
              <Calendar className="size-5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                Müsaitlik Takviminizi Güncelleyin
              </h2>
              <p className="text-xs text-muted-foreground">
                Bu hafta hangi zaman dilimlerinde müsaitsiniz?
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={markMusaitlikSet}
            className="flex size-8 items-center justify-center rounded-full hover:bg-muted"
            aria-label="Kapat"
          >
            <X className="size-4 text-muted-foreground" />
          </button>
        </div>

        {/* Grid */}
        <div className="p-4">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <span className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="max-h-[420px] overflow-auto">
              <table className="w-full min-w-[520px] border-collapse text-sm">
                <thead className="sticky top-0 z-10 bg-white">
                  <tr>
                    <th className="w-14 pb-2 text-left text-[10px] font-semibold text-muted-foreground" />
                    {DAYS.map((day) => (
                      <th
                        key={day}
                        className="pb-2 text-center text-[10px] font-semibold text-muted-foreground"
                      >
                        {day.slice(0, 3)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {HOURLY_SLOTS.map((slotDef) => (
                    <tr key={slotDef.key}>
                      <td className="py-0.5 pr-2 text-[11px] font-semibold tabular-nums text-muted-foreground">
                        {slotDef.label}
                      </td>
                      {DAYS.map((day) => {
                        const cell = getCell(day, slotDef.key);
                        if (!cell) return <td key={day} />;
                        return (
                          <td key={day} className="px-0.5 py-0.5 text-center">
                            <button
                              type="button"
                              onClick={() => toggleCell(day, slotDef.key)}
                              disabled={cell.adminLocked}
                              title={
                                cell.adminLocked
                                  ? "Admin tarafından kilitlendi"
                                  : undefined
                              }
                              className={cn(
                                "mx-auto flex size-7 items-center justify-center rounded-md border text-xs font-semibold transition",
                                cell.adminLocked &&
                                  "cursor-not-allowed border-red-200 bg-red-50 text-red-400",
                                !cell.adminLocked &&
                                  cell.available &&
                                  "border-primary/30 bg-primary text-white hover:bg-primary-hover",
                                !cell.adminLocked &&
                                  !cell.available &&
                                  "border-border bg-white text-muted-foreground hover:border-primary/30 hover:bg-muted"
                              )}
                            >
                              {cell.adminLocked ? "✕" : cell.available ? "✓" : ""}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="mt-3 text-xs text-muted-foreground">
            <span className="mr-1 inline-block size-2.5 rounded border border-red-200 bg-red-50" />
            Kırmızı hücreler admin tarafından kilitlenmiştir.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          <Button variant="outline" size="sm" onClick={markMusaitlikSet}>
            Daha Sonra
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving || loading}>
            {saving ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Kaydediliyor…
              </>
            ) : (
              "Müsaitliği Kaydet"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
