"use client";

import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { Lock, Users } from "lucide-react";
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

// Mon=1 … Sat=6, Sun=0  —  displayed left to right
const DAY_LABELS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const DAY_OF_WEEK = [1, 2, 3, 4, 5, 6, 0];

function getToken() {
  return getAccessToken() ?? "";
}
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

function isTodayDate(date: Date): boolean {
  const t = new Date();
  return (
    date.getDate() === t.getDate() &&
    date.getMonth() === t.getMonth() &&
    date.getFullYear() === t.getFullYear()
  );
}

async function fetchExperts(): Promise<ExpertItem[]> {
  const res = await apiFetch<{ data: ExpertItem[] } | ExpertItem[]>(
    "/admin/experts?limit=100",
    { token: getToken() },
  );
  return Array.isArray(res) ? res : (res.data ?? []);
}
async function fetchAvailabilities(
  expertId: string,
): Promise<ApiAvailability[]> {
  return apiFetch(`/admin/experts/${expertId}/availabilities`, {
    token: getToken(),
  });
}
async function patchBulkBlock(ids: string[], block: boolean) {
  return apiFetch("/admin/availabilities/bulk-block", {
    method: "PATCH",
    body: { ids, block },
    token: getToken(),
  });
}

export default function AdminMusaitlikPage() {
  const [experts, setExperts] = useState<ExpertItem[]>([]);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [availMap, setAvailMap] = useState<Map<string, ApiAvailability[]>>(
    new Map(),
  );
  const [loadingExperts, setLoadingExperts] = useState(true);

  const weekDates = useMemo(() => getWeekDates(), []);

  useEffect(() => {
    fetchExperts()
      .then(async (list) => {
        setExperts(list);
        const ids = list.map((e) => e.id);
        setCheckedIds(new Set(ids));
        const entries = await Promise.all(
          ids.map(async (id) => {
            try {
              const data = await fetchAvailabilities(id);
              return [id, data] as [string, ApiAvailability[]];
            } catch {
              return [id, []] as [string, ApiAvailability[]];
            }
          }),
        );
        setAvailMap(new Map(entries));
      })
      .catch(() => toast.error("Uzmanlar yüklenemedi"))
      .finally(() => setLoadingExperts(false));
  }, []);

  const colorMap = useMemo(() => {
    const m = new Map<string, string>();
    experts.forEach((e, i) =>
      m.set(e.id, EXPERT_COLORS[i % EXPERT_COLORS.length]),
    );
    return m;
  }, [experts]);

  const visibleAvails = useMemo((): AvailWithExpert[] => {
    const result: AvailWithExpert[] = [];
    checkedIds.forEach((id) => {
      (availMap.get(id) ?? []).forEach((a) =>
        result.push({ ...a, expertId: id }),
      );
    });
    return result;
  }, [checkedIds, availMap]);

  const timeSlots = useMemo(() => {
    const s = new Set(visibleAvails.map((a) => a.startTime));
    return [...s].sort();
  }, [visibleAvails]);

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
      const list = (n.get(avail.expertId) ?? []).map((a) =>
        a.id === avail.id ? { ...a, isBlockedByAdmin: newBlocked } : a,
      );
      n.set(avail.expertId, list);
      return n;
    });
    try {
      await patchBulkBlock([avail.id], newBlocked);
      toast.success(newBlocked ? "Slot kilitlendi" : "Slot açıldı");
    } catch {
      setAvailMap((prev) => {
        const n = new Map(prev);
        const list = (n.get(avail.expertId) ?? []).map((a) =>
          a.id === avail.id ? { ...a, isBlockedByAdmin: !newBlocked } : a,
        );
        n.set(avail.expertId, list);
        return n;
      });
      toast.error("İşlem başarısız");
    }
  }

  function toggleCheck(id: string) {
    setCheckedIds((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  const allChecked =
    experts.length > 0 && checkedIds.size === experts.length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Müsaitlik Yönetimi"
        description="Tüm uzmanların haftalık müsaitliklerini ortak tabloda görüntüleyin ve yönetin."
      />

      <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
        {/* ── Expert selector ─────────────────────────────────────── */}
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-white">
          <div className="flex items-center justify-between border-b border-border/60 bg-[#e6f0ee] px-4 py-2.5">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Users className="size-3.5" /> Uzman Seç
            </p>
            <button
              type="button"
              className="text-[10px] font-semibold text-primary hover:underline"
              onClick={() =>
                setCheckedIds(
                  allChecked ? new Set() : new Set(experts.map((e) => e.id)),
                )
              }
            >
              {allChecked ? "Kaldır" : "Tümünü Seç"}
            </button>
          </div>

          <div className="flex max-h-[60vh] flex-col gap-1 overflow-y-auto p-2">
            {loadingExperts
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="skeleton h-12 rounded-xl" />
                ))
              : experts.map((expert) => {
                  const color = colorMap.get(expert.id) ?? "#4d978b";
                  const checked = checkedIds.has(expert.id);
                  return (
                    <button
                      key={expert.id}
                      type="button"
                      onClick={() => toggleCheck(expert.id)}
                      className={cn(
                        "flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2 text-left transition",
                        checked
                          ? "border-primary/30 bg-primary/5"
                          : "border-transparent opacity-50 hover:bg-[#e6f0ee] hover:opacity-80",
                      )}
                    >
                      <div
                        className="flex size-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                        style={{ background: color }}
                      >
                        {initials(expert)}
                      </div>
                      <p className="min-w-0 flex-1 truncate text-xs font-semibold text-foreground">
                        {expert.user.firstName} {expert.user.lastName}
                      </p>
                      <div
                        className={cn(
                          "size-3 shrink-0 rounded-full border-2 transition",
                          checked
                            ? "border-primary bg-primary"
                            : "border-muted-foreground/30",
                        )}
                      />
                    </button>
                  );
                })}
          </div>
        </div>

        {/* ── Combined weekly grid ─────────────────────────────────── */}
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-white">
          <div className="border-b border-border/60 bg-[#e6f0ee] px-4 py-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Haftalık Ortak Takvim
              {checkedIds.size > 0 && (
                <span className="ml-2 font-normal normal-case text-[#014a3e]">
                  — {checkedIds.size} uzman görüntüleniyor
                </span>
              )}
            </p>
          </div>

          <div className="overflow-x-auto">
            {/* Day headers */}
            <div className="flex border-b-2 border-border/60 bg-[#e6f0ee]">
              <div className="w-16 shrink-0 border-r border-border/60 px-2 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Saat
              </div>
              {weekDates.map((date, i) => (
                <div
                  key={i}
                  className={cn(
                    "min-w-[80px] flex-1 border-r border-border/60 py-2 text-center last:border-r-0",
                    isTodayDate(date) && "bg-primary/10",
                  )}
                >
                  <p
                    className={cn(
                      "text-[10px] font-bold uppercase",
                      isTodayDate(date) ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {DAY_LABELS[i]}
                  </p>
                  <p
                    className={cn(
                      "text-base font-bold",
                      isTodayDate(date) ? "text-primary" : "text-[#014a3e]",
                    )}
                  >
                    {date.getDate()}
                  </p>
                </div>
              ))}
            </div>

            {/* Time rows */}
            {timeSlots.length === 0 ? (
              <div className="py-14 text-center text-sm text-muted-foreground">
                {checkedIds.size === 0
                  ? "Sol panelden uzman seçin"
                  : "Seçili uzmanlarda müsaitlik kaydı bulunamadı"}
              </div>
            ) : (
              timeSlots.map((time) => (
                <div
                  key={time}
                  className="flex border-b border-border/40 last:border-b-0"
                >
                  <div className="flex w-16 shrink-0 items-start justify-center border-r border-border/60 bg-[#e6f0ee] px-1 pt-2">
                    <p className="text-[11px] font-semibold text-[#014a3e]">
                      {time}
                    </p>
                  </div>
                  {weekDates.map((date, dowIdx) => {
                    const cell = getCellAvails(dowIdx, time);
                    return (
                      <div
                        key={dowIdx}
                        className={cn(
                          "min-h-[44px] min-w-[80px] flex-1 border-r border-border/40 p-1 last:border-r-0",
                          isTodayDate(date) && "bg-primary/[0.03]",
                        )}
                      >
                        <div className="flex flex-col gap-0.5">
                          {cell.map((avail) => {
                            const expert = experts.find(
                              (e) => e.id === avail.expertProfileId,
                            );
                            if (!expert) return null;
                            const color =
                              colorMap.get(expert.id) ?? "#4d978b";
                            const blocked = avail.isBlockedByAdmin;
                            return (
                              <button
                                key={avail.id}
                                type="button"
                                onClick={() => handleToggle(avail)}
                                title={`${expert.user.firstName} ${expert.user.lastName} — ${blocked ? "Kilidi aç" : "Kilitle"}`}
                                className="flex w-full cursor-pointer items-center gap-1 rounded px-1.5 py-[3px] text-[10px] font-bold transition hover:opacity-75 active:scale-95"
                                style={
                                  blocked
                                    ? {
                                        background: "#fee2e2",
                                        color: "#dc2626",
                                      }
                                    : {
                                        background: color + "22",
                                        color,
                                      }
                                }
                              >
                                <span
                                  className="size-2 shrink-0 rounded-full"
                                  style={{
                                    background: blocked ? "#dc2626" : color,
                                  }}
                                />
                                <span
                                  className={cn(blocked && "line-through")}
                                >
                                  {initials(expert)}
                                </span>
                                {blocked && (
                                  <Lock className="ml-auto size-2.5 shrink-0 text-red-500" />
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

          <div className="flex flex-wrap items-center gap-4 border-t border-border/40 px-4 py-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-[#4d978b]" />
              Müsait
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-red-400" />
              Admin Kilitli
            </div>
            <p className="ml-auto">
              İsim chip&apos;ine tıklayarak kilit durumunu değiştirin
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
