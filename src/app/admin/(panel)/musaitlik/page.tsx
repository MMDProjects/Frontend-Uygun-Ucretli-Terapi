"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Lock, Unlock, Users, RefreshCw } from "lucide-react";
import { PageHeader } from "@/features/admin/components/page-header";
import { Button } from "@/components/ui/button";
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

const DAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const DAY_FULL = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const DAY_NUM = [1, 2, 3, 4, 5, 6, 0];

const SLOT_LABELS = ["Sabah", "Öğle", "Akşam"];
const SLOT_STARTS = ["09:00", "12:00", "17:00"];
const SLOT_ENDS = ["12:00", "17:00", "21:00"];

async function fetchExperts(): Promise<ExpertItem[]> {
  const res = await apiFetch<{ data: ExpertItem[] } | ExpertItem[]>("/admin/experts?limit=100", { token: getAccessToken() ?? "" });
  return Array.isArray(res) ? res : res.data ?? [];
}

async function fetchAvailabilities(expertId: string): Promise<ApiAvailability[]> {
  return apiFetch(`/admin/experts/${expertId}/availabilities`, { token: getAccessToken() ?? "" });
}

async function patchBlock(id: string, block: boolean): Promise<void> {
  await apiFetch(`/admin/availabilities/${id}/block`, {
    method: "PATCH",
    body: { block },
    token: getAccessToken() ?? "",
  });
}

function initials(e: ExpertItem) {
  return `${e.user.firstName[0] ?? ""}${e.user.lastName[0] ?? ""}`.toUpperCase();
}

export default function AdminMusaitlikPage() {
  const [experts, setExperts] = useState<ExpertItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [availabilities, setAvailabilities] = useState<ApiAvailability[]>([]);
  const [loadingExperts, setLoadingExperts] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    fetchExperts()
      .then((list) => {
        setExperts(list);
        if (list.length > 0) setSelectedId(list[0].id);
      })
      .catch(() => toast.error("Uzmanlar yüklenemedi"))
      .finally(() => setLoadingExperts(false));
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    setLoadingSlots(true);
    fetchAvailabilities(selectedId)
      .then(setAvailabilities)
      .catch(() => toast.error("Müsaitlik yüklenemedi"))
      .finally(() => setLoadingSlots(false));
  }, [selectedId]);

  function getSlot(dayNum: number, slotIdx: number) {
    return availabilities.find(
      (a) => a.dayOfWeek === dayNum && a.startTime === SLOT_STARTS[slotIdx]
    );
  }

  async function handleToggle(slot: ApiAvailability) {
    if (toggling) return;
    setToggling(slot.id);
    const next = !slot.isBlockedByAdmin;
    try {
      await patchBlock(slot.id, next);
      setAvailabilities((prev) =>
        prev.map((a) => (a.id === slot.id ? { ...a, isBlockedByAdmin: next } : a))
      );
      toast.success(next ? "Slot kilitlendi" : "Slot açıldı");
    } catch {
      toast.error("İşlem başarısız");
    } finally {
      setToggling(null);
    }
  }

  const selected = experts.find((e) => e.id === selectedId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Müsaitlik Yönetimi"
        description="Uzman bazlı müsaitlik görüntüleme ve admin kilit yönetimi."
      >
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            if (selectedId) {
              setLoadingSlots(true);
              fetchAvailabilities(selectedId)
                .then(setAvailabilities)
                .catch(() => toast.error("Yüklenemedi"))
                .finally(() => setLoadingSlots(false));
            }
          }}
        >
          <RefreshCw className="mr-1.5 size-3.5" />
          Yenile
        </Button>
      </PageHeader>

      <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
        {/* Uzman listesi */}
        <div className="rounded-2xl border border-border/60 bg-white overflow-hidden">
          <div className="border-b border-border/60 bg-[#e6f0ee] px-4 py-2.5">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Users className="size-3.5" /> Uzmanlar
            </p>
          </div>
          <div className="flex flex-col gap-1 p-2 max-h-[60vh] overflow-y-auto">
            {loadingExperts ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 skeleton rounded-xl" />
              ))
            ) : experts.length === 0 ? (
              <p className="p-3 text-xs text-muted-foreground text-center">Uzman bulunamadı</p>
            ) : (
              experts.map((expert) => (
                <button
                  key={expert.id}
                  type="button"
                  onClick={() => setSelectedId(expert.id)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl border-[1.5px] px-3 py-2 text-left transition",
                    selectedId === expert.id
                      ? "border-primary/30 bg-primary/7 text-[#014a3e]"
                      : "border-transparent hover:bg-[#e6f0ee]",
                  )}
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#4d978b] text-[10px] font-bold text-white">
                    {initials(expert)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-foreground">
                      {expert.user.firstName} {expert.user.lastName}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="rounded-2xl border border-border/60 bg-white overflow-hidden">
          <div className="border-b border-border/60 bg-[#e6f0ee] px-4 py-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {selected
                ? `${selected.user.firstName} ${selected.user.lastName} — Müsaitlik Takvimi`
                : "Uzman Seçin"}
            </p>
          </div>

          {loadingSlots ? (
            <div className="flex items-center justify-center p-16 text-muted-foreground text-sm">
              <span className="size-5 animate-spin rounded-full border-2 border-border border-t-primary" />
            </div>
          ) : !selectedId ? (
            <div className="flex items-center justify-center p-16 text-sm text-muted-foreground">
              Listeden bir uzman seçin
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Day header */}
              <div className="flex border-b-2 border-border/60 bg-[#e6f0ee]">
                <div className="w-24 shrink-0 border-r border-border/60 px-3 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Zaman
                </div>
                {DAYS.map((day, i) => (
                  <div
                    key={day}
                    className="flex-1 border-r border-border/60 py-3 text-center last:border-r-0"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{day}</p>
                    <p className="mt-0.5 text-[11px] font-semibold text-[#014a3e] hidden sm:block">
                      {DAY_FULL[i].slice(0, 3)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Slot rows */}
              {SLOT_LABELS.map((label, slotIdx) => (
                <div
                  key={label}
                  className="flex border-b border-border/40 last:border-b-0 hover:bg-primary/[0.015]"
                >
                  <div className="w-24 shrink-0 border-r border-border/60 bg-[#e6f0ee] px-3 py-4">
                    <p className="text-xs font-semibold text-[#014a3e]">{label}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {SLOT_STARTS[slotIdx]}–{SLOT_ENDS[slotIdx]}
                    </p>
                  </div>
                  {DAY_NUM.map((dayNum, dayIdx) => {
                    const slot = getSlot(dayNum, slotIdx);
                    const isBlocked = slot?.isBlockedByAdmin ?? false;
                    const isAvailable = !!slot;
                    const isLoading = toggling === slot?.id;

                    return (
                      <div
                        key={dayIdx}
                        className={cn(
                          "flex flex-1 items-center justify-center border-r border-border/40 p-2 last:border-r-0",
                          isBlocked && "bg-red-50/60",
                          !isAvailable && "bg-muted/30",
                        )}
                      >
                        {!isAvailable ? (
                          <div className="w-full rounded-lg border border-border/40 bg-muted/50 py-2.5 text-center text-[10px] text-muted-foreground">
                            —
                          </div>
                        ) : (
                          <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => handleToggle(slot!)}
                            title={isBlocked ? "Kilidi aç" : "Kilitle"}
                            style={
                              isBlocked
                                ? {
                                    backgroundImage:
                                      "repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(220,38,38,0.1) 3px, rgba(220,38,38,0.1) 6px)",
                                  }
                                : undefined
                            }
                            className={cn(
                              "w-full rounded-lg border py-2.5 text-[10px] font-bold transition-all flex items-center justify-center gap-1",
                              isLoading && "opacity-50 cursor-not-allowed",
                              isBlocked
                                ? "border-red-300 text-red-600 hover:border-red-400"
                                : "border-primary/40 bg-primary text-white hover:bg-primary-hover active:scale-95",
                            )}
                          >
                            {isLoading ? (
                              <span className="size-3 animate-spin rounded-full border border-current border-t-transparent" />
                            ) : isBlocked ? (
                              <><Lock className="size-3" /> Kilitli</>
                            ) : (
                              <><Unlock className="size-3" /> Müsait</>
                            )}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 border-t border-border/40 px-4 py-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-4 w-6 rounded border border-primary/40 bg-primary" />
              Müsait (Uzman seçti)
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div
                className="h-4 w-6 rounded border border-red-300"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(220,38,38,0.1) 3px, rgba(220,38,38,0.1) 6px)",
                }}
              />
              Admin Kilitli
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-4 w-6 rounded border border-border/40 bg-muted/50" />
              Seçilmemiş
            </div>
            <p className="ml-auto text-xs text-muted-foreground">
              Kilitlemek için yeşil slota, açmak için kırmızı slota tıklayın
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
