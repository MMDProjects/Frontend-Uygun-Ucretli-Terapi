"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Lock, Unlock, Users, Save, CheckSquare, Square } from "lucide-react";
import { PageHeader } from "@/features/admin/components/page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-cookies";

type ExpertItem = { id: string; priorityScore: number; user: { firstName: string; lastName: string } };
type ApiAvailability = { id: string; expertProfileId: string; dayOfWeek: number; startTime: string; endTime: string; isBlockedByAdmin: boolean };

const DAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const DAY_FULL = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const DAY_NUM = [1, 2, 3, 4, 5, 6, 0];
const SLOT_LABELS = ["Sabah", "Öğle", "Akşam"];
const SLOT_STARTS = ["09:00", "12:00", "17:00"];
const SLOT_ENDS = ["12:00", "17:00", "21:00"];

function getToken() { return getAccessToken() ?? ""; }

async function fetchExperts(): Promise<ExpertItem[]> {
  const res = await apiFetch<{ data: ExpertItem[] } | ExpertItem[]>("/admin/experts?limit=100", { token: getToken() });
  return Array.isArray(res) ? res : res.data ?? [];
}
async function fetchAvailabilities(expertId: string): Promise<ApiAvailability[]> {
  return apiFetch(`/admin/experts/${expertId}/availabilities`, { token: getToken() });
}
async function patchBulkBlock(ids: string[], block: boolean): Promise<void> {
  await apiFetch("/admin/availabilities/bulk-block", { method: "PATCH", body: { ids, block }, token: getToken() });
}
function initials(e: ExpertItem) { return `${e.user.firstName[0] ?? ""}${e.user.lastName[0] ?? ""}`.toUpperCase(); }

export default function AdminMusaitlikPage() {
  const [experts, setExperts] = useState<ExpertItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [viewId, setViewId] = useState<string | null>(null);
  const [availabilities, setAvailabilities] = useState<ApiAvailability[]>([]);
  const [loadingExperts, setLoadingExperts] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [saving, setSaving] = useState(false);
  // pending: id → new isBlockedByAdmin value
  const [pending, setPending] = useState<Map<string, boolean>>(new Map());

  const loadSlots = useCallback(async (id: string) => {
    setLoadingSlots(true);
    setPending(new Map());
    try {
      const data = await fetchAvailabilities(id);
      setAvailabilities(data);
    } catch { toast.error("Müsaitlik yüklenemedi"); }
    finally { setLoadingSlots(false); }
  }, []);

  useEffect(() => {
    fetchExperts()
      .then((list) => {
        setExperts(list);
        if (list.length > 0) { setViewId(list[0].id); setSelectedIds(new Set([list[0].id])); }
      })
      .catch(() => toast.error("Uzmanlar yüklenemedi"))
      .finally(() => setLoadingExperts(false));
  }, []);

  useEffect(() => { if (viewId) loadSlots(viewId); }, [viewId, loadSlots]);

  function toggleSelect(id: string) {
    setSelectedIds((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function selectAll() { setExperts((e) => { setSelectedIds(new Set(e.map((x) => x.id))); return e; }); }
  function clearAll() { setSelectedIds(new Set()); }

  // Slot tıklanınca pending'e yaz (anında API'ye gitmiyor)
  function handleToggleSlot(slot: ApiAvailability) {
    setPending((prev) => {
      const n = new Map(prev);
      const currentBlocked = n.has(slot.id) ? n.get(slot.id)! : slot.isBlockedByAdmin;
      n.set(slot.id, !currentBlocked);
      return n;
    });
  }

  // Toplu kilitle/aç: tüm seçili uzmanların slotlarını pending'e ekle
  async function handleBulkPending(block: boolean) {
    if (selectedIds.size === 0) { toast.error("Hiç uzman seçilmedi"); return; }
    setSaving(true);
    try {
      const allAvails: ApiAvailability[] = [];
      await Promise.all([...selectedIds].map(async (id) => {
        const avails = await fetchAvailabilities(id);
        allAvails.push(...avails);
      }));
      const ids = allAvails.map((a) => a.id);
      if (ids.length === 0) { toast.error("Seçili uzmanların müsaitlik slotu yok"); return; }
      await patchBulkBlock(ids, block);
      if (viewId) await loadSlots(viewId);
      toast.success(`${selectedIds.size} uzman, ${allAvails.length} slot ${block ? "kilitlendi" : "açıldı"}`);
    } catch { toast.error("Toplu işlem başarısız"); }
    finally { setSaving(false); }
  }

  // Kaydet: pending değişiklikleri backend'e gönder
  async function handleSave() {
    if (pending.size === 0) { toast.info("Değişiklik yok"); return; }
    setSaving(true);
    try {
      const toBlock = [...pending.entries()].filter(([, v]) => v).map(([id]) => id);
      const toUnblock = [...pending.entries()].filter(([, v]) => !v).map(([id]) => id);
      await Promise.all([
        toBlock.length > 0 ? patchBulkBlock(toBlock, true) : Promise.resolve(),
        toUnblock.length > 0 ? patchBulkBlock(toUnblock, false) : Promise.resolve(),
      ]);
      if (viewId) await loadSlots(viewId);
      toast.success(`${pending.size} slot kaydedildi`);
    } catch { toast.error("Kayıt başarısız"); }
    finally { setSaving(false); }
  }

  function getSlot(dayNum: number, slotIdx: number) {
    return availabilities.find((a) => a.dayOfWeek === dayNum && a.startTime === SLOT_STARTS[slotIdx]);
  }

  function isBlocked(slot: ApiAvailability) {
    return pending.has(slot.id) ? pending.get(slot.id)! : slot.isBlockedByAdmin;
  }

  const selected = experts.find((e) => e.id === viewId);
  const hasPending = pending.size > 0;

  return (
    <div className="space-y-5">
      <PageHeader title="Müsaitlik Yönetimi" description="Uzman bazlı müsaitlik görüntüleme ve admin kilit yönetimi.">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {selectedIds.size > 0 && (
            <span className="text-xs font-medium text-muted-foreground">
              {selectedIds.size} uzman seçili
            </span>
          )}
          <Button size="sm" variant="outline" onClick={() => handleBulkPending(false)} disabled={saving || selectedIds.size === 0}>
            <Unlock className="mr-1.5 size-3.5" /> Tümünü Aç
          </Button>
          <Button size="sm" variant="destructive" onClick={() => handleBulkPending(true)} disabled={saving || selectedIds.size === 0}>
            <Lock className="mr-1.5 size-3.5" /> Tümünü Kilitle
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving || !hasPending}
            className={cn(hasPending ? "bg-primary hover:bg-primary-hover" : "")}
          >
            {saving
              ? <><span className="mr-1.5 size-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />Kaydediliyor…</>
              : <><Save className="mr-1.5 size-3.5" />Kaydet {hasPending ? `(${pending.size})` : ""}</>
            }
          </Button>
        </div>
      </PageHeader>

      <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
        {/* Uzman listesi */}
        <div className="rounded-2xl border border-border/60 bg-white overflow-hidden">
          <div className="border-b border-border/60 bg-[#e6f0ee] px-4 py-2.5">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Users className="size-3.5" /> Uzmanlar
              </p>
              <button
                type="button"
                onClick={selectedIds.size === experts.length && experts.length > 0 ? clearAll : selectAll}
                className="flex items-center justify-center rounded p-0.5 transition hover:bg-white/60"
                aria-label={selectedIds.size === experts.length ? "Seçimi kaldır" : "Tümünü seç"}
              >
                {selectedIds.size === experts.length && experts.length > 0
                  ? <CheckSquare className="size-4 text-primary" />
                  : selectedIds.size > 0
                    ? <CheckSquare className="size-4 text-primary/50" />
                    : <Square className="size-4 text-muted-foreground/50" />
                }
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-1 p-2 max-h-[60vh] overflow-y-auto">
            {loadingExperts ? (
              Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 skeleton rounded-xl" />)
            ) : experts.length === 0 ? (
              <p className="p-3 text-xs text-muted-foreground text-center">Uzman bulunamadı</p>
            ) : (
              experts.map((expert) => {
                const isChecked = selectedIds.has(expert.id);
                const isViewing = viewId === expert.id;
                return (
                  <div
                    key={expert.id}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl border-[1.5px] px-3 py-2 transition cursor-pointer",
                      isViewing ? "border-primary/30 bg-primary/7 text-[#014a3e]" : "border-transparent hover:bg-[#e6f0ee]",
                    )}
                    onClick={() => setViewId(expert.id)}
                  >
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); toggleSelect(expert.id); }}
                      className="shrink-0 flex items-center justify-center"
                      aria-label={isChecked ? "Seçimi kaldır" : "Seç"}
                    >
                      {isChecked
                        ? <CheckSquare className="size-4 text-primary" />
                        : <Square className="size-4 text-muted-foreground/40" />
                      }
                    </button>
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#4d978b] text-[10px] font-bold text-white">
                      {initials(expert)}
                    </div>
                    <p className="truncate text-xs font-semibold text-foreground">
                      {expert.user.firstName} {expert.user.lastName}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="rounded-2xl border border-border/60 bg-white overflow-hidden">
          <div className="border-b border-border/60 bg-[#e6f0ee] px-4 py-2.5 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {selected ? `${selected.user.firstName} ${selected.user.lastName} — Müsaitlik Takvimi` : "Uzman Seçin"}
            </p>
            {hasPending && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                {pending.size} değişiklik kaydedilmedi
              </span>
            )}
          </div>

          {loadingSlots ? (
            <div className="flex items-center justify-center p-16">
              <span className="size-5 animate-spin rounded-full border-2 border-border border-t-primary" />
            </div>
          ) : !viewId ? (
            <div className="flex items-center justify-center p-16 text-sm text-muted-foreground">Listeden bir uzman seçin</div>
          ) : (
            <div className="overflow-x-auto">
              <div className="flex border-b-2 border-border/60 bg-[#e6f0ee]">
                <div className="w-24 shrink-0 border-r border-border/60 px-3 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Zaman</div>
                {DAYS.map((day, i) => (
                  <div key={day} className="flex-1 border-r border-border/60 py-3 text-center last:border-r-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{day}</p>
                    <p className="mt-0.5 text-[11px] font-semibold text-[#014a3e] hidden sm:block">{DAY_FULL[i].slice(0, 3)}</p>
                  </div>
                ))}
              </div>

              {SLOT_LABELS.map((label, slotIdx) => (
                <div key={label} className="flex border-b border-border/40 last:border-b-0 hover:bg-primary/[0.015]">
                  <div className="w-24 shrink-0 border-r border-border/60 bg-[#e6f0ee] px-3 py-4">
                    <p className="text-xs font-semibold text-[#014a3e]">{label}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">{SLOT_STARTS[slotIdx]}–{SLOT_ENDS[slotIdx]}</p>
                  </div>
                  {DAY_NUM.map((dayNum, dayIdx) => {
                    const slot = getSlot(dayNum, slotIdx);
                    const blocked = slot ? isBlocked(slot) : false;
                    const isAvailable = !!slot;
                    const isDirty = slot ? pending.has(slot.id) : false;

                    return (
                      <div
                        key={dayIdx}
                        className={cn(
                          "flex flex-1 items-center justify-center border-r border-border/40 p-2 last:border-r-0",
                          blocked && "bg-red-50/60",
                          !isAvailable && "bg-muted/30",
                        )}
                      >
                        {!isAvailable ? (
                          <div className="w-full rounded-lg border border-border/40 bg-muted/50 py-2.5 text-center text-[10px] text-muted-foreground">—</div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleToggleSlot(slot!)}
                            title={blocked ? "Kilidi aç" : "Kilitle"}
                            style={blocked ? { backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(220,38,38,0.1) 3px, rgba(220,38,38,0.1) 6px)" } : undefined}
                            className={cn(
                              "w-full rounded-lg border py-2.5 text-[10px] font-bold transition-all flex items-center justify-center gap-1",
                              isDirty && "ring-2 ring-amber-400 ring-offset-1",
                              blocked ? "border-red-300 text-red-600 hover:border-red-400" : "border-primary/40 bg-primary text-white hover:bg-primary-hover active:scale-95",
                            )}
                          >
                            {blocked ? <><Lock className="size-3" /> Kilitli</> : <><Unlock className="size-3" /> Müsait</>}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 border-t border-border/40 px-4 py-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-4 w-6 rounded border border-primary/40 bg-primary" />Müsait
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-4 w-6 rounded border border-red-300" style={{ backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(220,38,38,0.1) 3px, rgba(220,38,38,0.1) 6px)" }} />
              Admin Kilitli
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-4 w-6 rounded border-2 border-amber-400 bg-white" />
              Kaydedilmedi
            </div>
            <p className="ml-auto text-xs text-muted-foreground">Slota tıkla → Kaydet ile gönder</p>
          </div>
        </div>
      </div>
    </div>
  );
}
