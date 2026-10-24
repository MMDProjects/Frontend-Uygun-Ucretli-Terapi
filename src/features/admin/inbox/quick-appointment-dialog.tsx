"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { tr as trDayPicker } from "react-day-picker/locale";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  fetchExperts,
  fetchWeekAvailabilities,
  type ApiAvailability,
  type ExpertItem,
} from "@/lib/services/admin.service";
import { createAppointment } from "@/services/inbox/appointments.service";
import type {
  ConversationDetail,
  PaymentStatus,
  ServiceType,
} from "@/services/inbox/types";
import {
  LEAD_STATUS_LABELS,
  PAYMENT_LABELS,
  PAYMENT_ORDER,
  SERVICE_LABELS,
  SERVICE_ORDER,
} from "./labels";

const NO_LEAD = "NONE";

interface QuickAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  detail: ConversationDetail;
  onCreated: () => void;
}

function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function weekStartOf(d: Date): Date {
  const monday = new Date(d);
  const diff = d.getDay() === 0 ? 6 : d.getDay() - 1;
  monday.setDate(d.getDate() - diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function slotInstant(dateStr: string, startTime: string): Date {
  return new Date(`${dateStr}T${startTime.slice(0, 5)}:00+03:00`);
}

function expertName(e: ExpertItem): string {
  return `${e.user.firstName} ${e.user.lastName}`.trim();
}

const dateLabelFmt = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  weekday: "long",
});

export function QuickAppointmentDialog({
  open,
  onOpenChange,
  detail,
  onCreated,
}: QuickAppointmentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "top-0 right-0 left-auto h-full max-h-none w-full max-w-full translate-x-0 translate-y-0 content-start overflow-y-auto rounded-none rounded-l-xl sm:max-w-md",
          "data-open:zoom-in-100 data-open:slide-in-from-right-10 data-closed:zoom-out-100",
        )}
      >
        {open ? (
          <QuickAppointmentForm
            detail={detail}
            onCreated={onCreated}
            onClose={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function QuickAppointmentForm({
  detail,
  onCreated,
  onClose,
}: {
  detail: ConversationDetail;
  onCreated: () => void;
  onClose: () => void;
}) {
  const [serviceType, setServiceType] = useState<ServiceType>(
    detail.leads[0]?.serviceType ?? "BIREYSEL",
  );
  const [experts, setExperts] = useState<ExpertItem[]>([]);
  const [expertsLoading, setExpertsLoading] = useState(true);
  const [therapistId, setTherapistId] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [weeks, setWeeks] = useState<Record<string, ApiAvailability[]>>({});
  const [slot, setSlot] = useState("");
  const [duration, setDuration] = useState("45");
  const [payment, setPayment] = useState<PaymentStatus>("PENDING");
  const [leadId, setLeadId] = useState(NO_LEAD);
  const [saving, setSaving] = useState(false);
  const [openedAt] = useState(() => Date.now());

  const dateStr = date ? toDateStr(date) : null;
  const weekKey = date ? toDateStr(weekStartOf(date)) : null;
  const weekData = weekKey ? weeks[weekKey] : undefined;
  const slotsLoading = weekKey !== null && weekData === undefined;

  useEffect(() => {
    let cancelled = false;
    fetchExperts()
      .then((list) => {
        if (!cancelled) setExperts(list);
      })
      .catch(() => {
        if (!cancelled) toast.error("Uzmanlar yüklenemedi");
      })
      .finally(() => {
        if (!cancelled) setExpertsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!date || !weekKey) return;
    const start = weekStartOf(date);
    let cancelled = false;
    fetchWeekAvailabilities(start)
      .then((list) => {
        if (!cancelled) setWeeks((prev) => ({ ...prev, [weekKey]: list }));
      })
      .catch(() => {
        if (cancelled) return;
        toast.error("Müsait saatler yüklenemedi");
        setWeeks((prev) => ({ ...prev, [weekKey]: [] }));
      });
    return () => {
      cancelled = true;
    };
  }, [date, weekKey]);

  const slots =
    therapistId && dateStr && weekData
      ? weekData
          .filter(
            (a) =>
              a.expertProfileId === therapistId &&
              a.date.startsWith(dateStr) &&
              !a.isBlockedByAdmin &&
              slotInstant(dateStr, a.startTime).getTime() > openedAt,
          )
          .map((a) => a.startTime.slice(0, 5))
          .sort()
      : [];
  const activeSlot = slots.includes(slot) ? slot : "";

  const durationNum = Number(duration);
  const durationValid =
    Number.isInteger(durationNum) && durationNum >= 15 && durationNum <= 240;
  const canSave =
    !!therapistId && !!dateStr && !!activeSlot && durationValid && !saving;

  const selectedExpert = experts.find((e) => e.id === therapistId);
  const today = new Date(openedAt);
  today.setHours(0, 0, 0, 0);

  async function handleSave() {
    if (!canSave || !dateStr) return;
    setSaving(true);
    try {
      await createAppointment({
        contactId: detail.contact.id,
        therapistId,
        serviceType,
        scheduledAt: slotInstant(dateStr, activeSlot).toISOString(),
        durationMinutes: durationNum,
        paymentStatus: payment,
        leadId: leadId === NO_LEAD ? undefined : leadId,
      });
      toast.success("Randevu oluşturuldu");
      onCreated();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Randevu oluşturulamadı");
    } finally {
      setSaving(false);
    }
  }

  const selectedLead = detail.leads.find((l) => l.id === leadId);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Hızlı Randevu</DialogTitle>
        <DialogDescription>
          {detail.contact.fullName?.trim() || "Danışan"} için randevu oluşturun.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>Hizmet tipi</Label>
          <Select
            value={serviceType}
            onValueChange={(v) => setServiceType(v as ServiceType)}
          >
            <SelectTrigger className="w-full">
              <SelectValue>{SERVICE_LABELS[serviceType]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {SERVICE_ORDER.map((s) => (
                <SelectItem key={s} value={s}>
                  {SERVICE_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Uzman</Label>
          <Select
            value={therapistId}
            onValueChange={(v) => setTherapistId(v ?? "")}
            disabled={expertsLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                {selectedExpert ? (
                  expertName(selectedExpert)
                ) : (
                  <span className="text-muted-foreground">
                    {expertsLoading ? "Yükleniyor…" : "Uzman seçin"}
                  </span>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {experts.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {expertName(e)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Tarih</Label>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => setDate(d ?? undefined)}
            disabled={(d) => d < today}
            locale={trDayPicker}
            weekStartsOn={1}
            className="mx-auto w-fit"
          />
        </div>

        <div className="space-y-1.5">
          <Label>
            Saat
            {date ? (
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                {dateLabelFmt.format(date)}
              </span>
            ) : null}
          </Label>
          {!therapistId || !date ? (
            <p className="text-sm text-muted-foreground">
              Müsait saatleri görmek için uzman ve tarih seçin.
            </p>
          ) : slotsLoading ? (
            <div className="flex animate-pulse flex-wrap gap-2">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="h-8 w-16 rounded-lg bg-muted" />
              ))}
            </div>
          ) : slots.length === 0 ? (
            <p className="text-sm text-muted-foreground">Bu gün için müsait saat yok</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {slots.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSlot(s)}
                  className={cn(
                    "h-8 rounded-lg border px-3 text-sm font-medium transition-colors",
                    activeSlot === s
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-card hover:bg-muted",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="qa-duration">Süre (dk)</Label>
            <Input
              id="qa-duration"
              type="number"
              min={15}
              max={240}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              aria-invalid={!durationValid}
              className="h-8 rounded-lg text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Ödeme durumu</Label>
            <Select
              value={payment}
              onValueChange={(v) => setPayment(v as PaymentStatus)}
            >
              <SelectTrigger className="w-full">
                <SelectValue>{PAYMENT_LABELS[payment]}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_ORDER.map((p) => (
                  <SelectItem key={p} value={p}>
                    {PAYMENT_LABELS[p]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {detail.leads.length > 0 ? (
          <div className="space-y-1.5">
            <Label>Bağlanacak arama talebi (opsiyonel)</Label>
            <Select value={leadId} onValueChange={(v) => setLeadId(v ?? NO_LEAD)}>
              <SelectTrigger className="w-full">
                <SelectValue>
                  {selectedLead
                    ? `${SERVICE_LABELS[selectedLead.serviceType]} · ${LEAD_STATUS_LABELS[selectedLead.status]}`
                    : "Bağlama"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_LEAD}>Bağlama</SelectItem>
                {detail.leads.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {SERVICE_LABELS[l.serviceType]} · {LEAD_STATUS_LABELS[l.status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}
      </div>

      <DialogFooter className="mt-2">
        <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
          Vazgeç
        </Button>
        <Button type="button" onClick={() => void handleSave()} disabled={!canSave}>
          {saving ? <Loader2 className="size-4 animate-spin" /> : null}
          Randevu oluştur
        </Button>
      </DialogFooter>
    </>
  );
}
