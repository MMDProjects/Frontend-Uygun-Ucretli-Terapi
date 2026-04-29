"use client";

import { useState } from "react";
import { X, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { DayOfWeek, TimeSlot, AvailabilityCell } from "@/types/domain";
import { MOCK_AVAILABILITY } from "@/features/uzman/data/mock-uzman";

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

export function MusaitlikModal() {
  const { role, isAuthenticated, hasSetMusaitlik, markMusaitlikSet } =
    useAuthStore();

  const [cells, setCells] = useState<AvailabilityCell[]>(MOCK_AVAILABILITY);
  const [saving, setSaving] = useState(false);

  const shouldShow =
    isAuthenticated && role === "uzman" && !hasSetMusaitlik;

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
    await new Promise((r) => setTimeout(r, 600));
    markMusaitlikSet();
    setSaving(false);
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
                          title={cell.adminLocked ? "Admin tarafından kilitlendi" : undefined}
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

          <p className="mt-3 text-xs text-muted-foreground">
            <span className="inline-block size-2.5 rounded bg-red-50 border border-red-200 mr-1" />
            Kırmızı hücreler admin tarafından kilitlenmiştir.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={markMusaitlikSet}
          >
            Daha Sonra
          </Button>
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
        </div>
      </div>
    </div>
  );
}
