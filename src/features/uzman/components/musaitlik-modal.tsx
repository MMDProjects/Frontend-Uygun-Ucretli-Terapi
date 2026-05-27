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
const SLOTS: TimeSlot[] = ["Sabah", "Öğleden Sonra", "Akşam"];

// dayOfWeek 0 = Pazartesi ... 6 = Pazar
const DAY_INDEX_MAP: Record<number, DayOfWeek> = {
  0: "Pazartesi",
  1: "Salı",
  2: "Çarşamba",
  3: "Perşembe",
  4: "Cuma",
  5: "Cumartesi",
  6: "Pazar",
};

const DAY_TO_INDEX: Record<DayOfWeek, number> = {
  "Pazartesi": 0, "Salı": 1, "Çarşamba": 2, "Perşembe": 3,
  "Cuma": 4, "Cumartesi": 5, "Pazar": 6,
};

// startTime → zaman dilimi
const SLOT_TIME_MAP: Record<TimeSlot, { startTime: string; endTime: string }> = {
  "Sabah":          { startTime: "09:00", endTime: "12:00" },
  "Öğleden Sonra": { startTime: "13:00", endTime: "17:00" },
  "Akşam":          { startTime: "18:00", endTime: "21:00" },
};

function startTimeToSlot(startTime: string): TimeSlot {
  const h = parseInt(startTime.split(":")[0], 10);
  if (h < 12) return "Sabah";
  if (h < 17) return "Öğleden Sonra";
  return "Akşam";
}

function buildEmptyCells(): AvailabilityCell[] {
  return DAYS.flatMap((day) =>
    SLOTS.map((slot) => ({ day, slot, available: false, adminLocked: false }))
  );
}

function cellKey(day: DayOfWeek, slot: TimeSlot) {
  return `${day}::${slot}`;
}

export function MusaitlikModal() {
  const { role, isAuthenticated, hasSetMusaitlik, markMusaitlikSet } =
    useAuthStore();

  const [cells, setCells] = useState<AvailabilityCell[]>(buildEmptyCells());
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  // Mevcut kayıtlı availability'lerin id'lerini key bazında tut
  const savedIdsRef = useRef<Map<string, string>>(new Map());

  const shouldShow = isAuthenticated && role === "uzman" && !hasSetMusaitlik;

  useEffect(() => {
    if (!shouldShow) return;

    getMyAvailabilities()
      .then((avails) => {
        const idMap = new Map<string, string>();
        const newCells = buildEmptyCells();

        avails.forEach((a) => {
          const day = DAY_INDEX_MAP[a.dayOfWeek];
          if (!day) return;
          const slot = startTimeToSlot(a.startTime);
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
          // Yeni eklenen slot
          const { startTime, endTime } = SLOT_TIME_MAP[cell.slot];
          promises.push(addAvailability({ dayOfWeek: DAY_TO_INDEX[cell.day], startTime, endTime }));
        } else if (!cell.available && existingId) {
          // Kaldırılan slot
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
        <div className="overflow-x-auto p-4">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <span className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="w-32 pb-3 text-left text-xs font-semibold text-muted-foreground" />
                  {DAYS.map((day) => (
                    <th
                      key={day}
                      className="pb-3 text-center text-xs font-semibold text-muted-foreground"
                    >
                      {day.slice(0, 3)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="space-y-1">
                {SLOTS.map((slot) => (
                  <tr key={slot}>
                    <td className="py-1.5 pr-3 text-xs font-medium text-muted-foreground">
                      {slot}
                    </td>
                    {DAYS.map((day) => {
                      const cell = getCell(day, slot);
                      if (!cell) return <td key={day} />;
                      return (
                        <td key={day} className="px-1 py-1.5 text-center">
                          <button
                            type="button"
                            onClick={() => toggleCell(day, slot)}
                            disabled={cell.adminLocked}
                            title={
                              cell.adminLocked
                                ? "Admin tarafından kilitlendi"
                                : undefined
                            }
                            className={cn(
                              "mx-auto flex size-8 items-center justify-center rounded-lg border text-xs font-semibold transition",
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
