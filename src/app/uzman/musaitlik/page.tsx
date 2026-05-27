"use client";

import { useState, useEffect } from "react";
import { Info, CheckCircle2 } from "lucide-react";
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

const SLOT_API: Record<TimeSlot, { startTime: string; endTime: string }> = {
  Sabah: { startTime: "09:00", endTime: "12:00" },
  "Öğleden Sonra": { startTime: "12:00", endTime: "17:00" },
  Akşam: { startTime: "17:00", endTime: "21:00" },
};

const DAY_TO_NUMBER: Record<DayOfWeek, number> = {
  Pazartesi: 1,
  Salı: 2,
  Çarşamba: 3,
  Perşembe: 4,
  Cuma: 5,
  Cumartesi: 6,
  Pazar: 0,
};

const NUMBER_TO_DAY: Record<number, DayOfWeek> = {
  1: "Pazartesi",
  2: "Salı",
  3: "Çarşamba",
  4: "Perşembe",
  5: "Cuma",
  6: "Cumartesi",
  0: "Pazar",
};

function startTimeToSlot(startTime: string): TimeSlot | null {
  if (startTime === "09:00") return "Sabah";
  if (startTime === "12:00") return "Öğleden Sonra";
  if (startTime === "17:00") return "Akşam";
  return null;
}

function buildEmptyGrid(): AvailabilityCell[] {
  return DAYS.flatMap((day) =>
    SLOTS.map((slot) => ({ day, slot, available: false, adminLocked: false }))
  );
}

function applyApiData(raw: ApiAvailability[]): AvailabilityCell[] {
  const cells = buildEmptyGrid();
  for (const avail of raw) {
    const day = NUMBER_TO_DAY[avail.dayOfWeek];
    const slot = startTimeToSlot(avail.startTime);
    if (!day || !slot) continue;
    const cell = cells.find((c) => c.day === day && c.slot === slot);
    if (cell) {
      cell.id = avail.id;
      cell.available = true;
      cell.adminLocked = avail.isBlockedByAdmin;
    }
  }
  return cells;
}

export default function UzmanMusaitlikPage() {
  const [cells, setCells] = useState<AvailabilityCell[]>(buildEmptyGrid());
  const [initialCells, setInitialCells] = useState<AvailabilityCell[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getMyAvailabilities()
      .then((raw) => {
        const mapped = applyApiData(raw);
        setCells(mapped);
        setInitialCells(JSON.parse(JSON.stringify(mapped)));
      })
      .catch(() => toast.error("Müsaitlik yüklenemedi."))
      .finally(() => setLoading(false));
  }, []);

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
    try {
      const toAdd: AvailabilityCell[] = [];
      const toRemove: string[] = [];

      for (const cell of cells) {
        if (cell.adminLocked) continue;
        const initial = initialCells.find((c) => c.day === cell.day && c.slot === cell.slot);
        const wasAvailable = initial?.available ?? false;

        if (cell.available && !wasAvailable) {
          toAdd.push(cell);
        } else if (!cell.available && wasAvailable && initial?.id) {
          toRemove.push(initial.id);
        }
      }

      await Promise.all([
        ...toRemove.map((id) => removeAvailability(id)),
        ...toAdd.map((c) =>
          addAvailability({
            dayOfWeek: DAY_TO_NUMBER[c.day],
            ...SLOT_API[c.slot],
          })
        ),
      ]);

      // Reload to get new IDs
      const fresh = await getMyAvailabilities();
      const mapped = applyApiData(fresh);
      setCells(mapped);
      setInitialCells(JSON.parse(JSON.stringify(mapped)));

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

        <div className="overflow-x-auto rounded-xl border border-border/60">
          {/* Day header row */}
          <div className="flex border-b-2 border-border/60 bg-[#e6f0ee]">
            <div className="w-32 shrink-0 border-r border-border/60 px-3 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Zaman
            </div>
            {DAYS.map((day) => (
              <div
                key={day}
                className="flex-1 border-r border-border/60 py-3 text-center last:border-r-0"
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <span className="hidden sm:block">{day.slice(0, 3)}</span>
                  <span className="block sm:hidden">{day.slice(0, 1)}</span>
                </p>
                <p className="mt-0.5 text-xs font-semibold text-[#014a3e]">
                  <span className="hidden sm:block">{day}</span>
                  <span className="block sm:hidden">{day.slice(0, 3)}</span>
                </p>
              </div>
            ))}
          </div>

          {/* Slot rows */}
          {SLOTS.map((slot, slotIdx) => (
            <div
              key={slot}
              className={cn(
                "flex border-b border-border/40 last:border-b-0",
                "hover:bg-primary/[0.02]"
              )}
            >
              <div className="w-32 shrink-0 border-r border-border/60 bg-[#e6f0ee] px-3 py-4">
                <p className="text-xs font-semibold text-[#014a3e]">{slot}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">{SLOT_TIMES[slot]}</p>
              </div>
              {DAYS.map((day) => {
                const cell = getCell(day, slot);
                if (!cell) return <div key={day} className="flex-1 border-r border-border/40 last:border-r-0" />;
                return (
                  <div
                    key={day}
                    className={cn(
                      "flex flex-1 items-center justify-center border-r border-border/40 p-2 last:border-r-0",
                      cell.adminLocked && "bg-red-50/50",
                    )}
                  >
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
                      style={
                        cell.adminLocked
                          ? {
                              backgroundImage:
                                "repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(220,38,38,0.12) 3px, rgba(220,38,38,0.12) 6px)",
                            }
                          : undefined
                      }
                      className={cn(
                        "w-full rounded-lg border py-2.5 text-[10px] font-bold transition-all",
                        cell.adminLocked &&
                          "cursor-not-allowed border-red-200 text-red-400",
                        !cell.adminLocked &&
                          cell.available &&
                          "border-primary/40 bg-primary text-white shadow-sm hover:bg-primary-hover active:scale-95",
                        !cell.adminLocked &&
                          !cell.available &&
                          "border-border/50 bg-white text-muted-foreground hover:border-primary/30 hover:bg-[#e6f0ee] hover:text-primary",
                      )}
                      aria-label={`${day} ${slot} ${cell.available ? "müsait" : "müsait değil"}`}
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

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-4 w-6 rounded border border-primary/40 bg-primary" />
            Müsait
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-4 w-6 rounded border border-border/50 bg-white" />
            Müsait Değil
          </div>
          <div
            className="flex items-center gap-2 text-xs text-muted-foreground"
            style={{
              backgroundImage:
                "repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(220,38,38,0.12) 3px, rgba(220,38,38,0.12) 6px)",
            }}
          >
            <div className="h-4 w-6 rounded border border-red-200" />
            <span>Admin Kilitli</span>
          </div>
        </div>
      </div>
    </div>
  );
}
