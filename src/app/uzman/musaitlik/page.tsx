"use client";

import { useState } from "react";
import { Info, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MOCK_AVAILABILITY } from "@/features/uzman/data/mock-uzman";
import type { AvailabilityCell, DayOfWeek, TimeSlot } from "@/types/domain";

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

const SLOT_TIMES: Record<TimeSlot, string> = {
  Sabah: "09:00–12:00",
  "Öğleden Sonra": "12:00–17:00",
  Akşam: "17:00–21:00",
};

export default function UzmanMusaitlikPage() {
  const [cells, setCells] = useState<AvailabilityCell[]>(MOCK_AVAILABILITY);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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

  function selectAll() {
    setCells((prev) =>
      prev.map((c) => (c.adminLocked ? c : { ...c, available: true }))
    );
  }

  function clearAll() {
    setCells((prev) =>
      prev.map((c) => (c.adminLocked ? c : { ...c, available: false }))
    );
  }

  async function handleSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const availableCount = cells.filter((c) => c.available && !c.adminLocked).length;
  const lockedCount = cells.filter((c) => c.adminLocked).length;

  return (
    <div className="space-y-6">
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
        {/* Header */}
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
              className="rounded-xl border border-border/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:border-primary/30 hover:text-primary"
            >
              Tümünü Seç
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="rounded-xl border border-border/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:border-destructive/30 hover:text-destructive"
            >
              Temizle
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr>
                <th className="w-36 pb-3 text-left text-xs font-semibold text-muted-foreground">
                  Zaman Dilimi
                </th>
                {DAYS.map((day) => (
                  <th
                    key={day}
                    className="pb-3 text-center text-xs font-semibold text-muted-foreground"
                  >
                    <span className="hidden sm:block">{day}</span>
                    <span className="block sm:hidden">{day.slice(0, 3)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SLOTS.map((slot) => (
                <tr key={slot} className="border-t border-border/30">
                  <td className="py-3 pr-4">
                    <p className="text-xs font-semibold text-foreground">{slot}</p>
                    <p className="text-[10px] text-muted-foreground">{SLOT_TIMES[slot]}</p>
                  </td>
                  {DAYS.map((day) => {
                    const cell = getCell(day, slot);
                    if (!cell) return <td key={day} />;
                    return (
                      <td key={day} className="px-1 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleCell(day, slot)}
                          disabled={cell.adminLocked}
                          title={
                            cell.adminLocked
                              ? "Admin tarafından kilitlendi"
                              : cell.available
                              ? "Müsait — tıklayarak kaldır"
                              : "Müsait değil — tıklayarak ekle"
                          }
                          className={cn(
                            "mx-auto flex size-9 items-center justify-center rounded-xl border text-xs font-bold transition",
                            cell.adminLocked &&
                              "cursor-not-allowed border-red-200 bg-red-50 text-red-400",
                            !cell.adminLocked &&
                              cell.available &&
                              "border-primary/30 bg-primary text-white hover:bg-primary-hover",
                            !cell.adminLocked &&
                              !cell.available &&
                              "border-border/60 bg-white text-transparent hover:border-primary/30 hover:bg-muted hover:text-muted-foreground"
                          )}
                          aria-label={`${day} ${slot} ${cell.available ? "müsait" : "müsait değil"}`}
                          aria-pressed={cell.available}
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

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-border/40 pt-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="size-4 rounded-md border border-primary/30 bg-primary" />
            Müsait
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="size-4 rounded-md border border-border/60 bg-white" />
            Müsait Değil
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="size-4 rounded-md border border-red-200 bg-red-50" />
            Admin Kilitli
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center justify-end gap-3">
        {saved && (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
            <CheckCircle2 className="size-4" />
            Müsaitlik kaydedildi
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
      </div>
    </div>
  );
}
