"use client";

import { useState, type ReactNode } from "react";
import {
  ArrowLeft,
  CalendarPlus,
  Check,
  Loader2,
  Pencil,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  closeConversation,
  handbackConversation,
  takeoverConversation,
  updateContact,
} from "@/services/inbox/conversations.service";
import type {
  Contact,
  ContactType,
  ConversationDetail,
  UpdateContactInput,
} from "@/services/inbox/types";
import {
  CHANNEL_LABELS,
  ChannelBadge,
  LEAD_STATUS_LABELS,
  LEAD_STATUS_STYLE,
  SERVICE_LABELS,
  formatDateTime,
  formatRelative,
} from "./labels";
import { CONTACT_TYPE_LABELS, CONTACT_TYPE_ORDER } from "./constants";
import { QuickAppointmentDialog } from "./quick-appointment-dialog";

interface ContactPanelProps {
  detail: ConversationDetail | null;
  onBack: () => void;
  onChanged: () => void;
}

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="space-y-2 border-b border-border p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="min-w-0 break-words text-right text-foreground">
        {value && value.length > 0 ? value : "—"}
      </span>
    </div>
  );
}

function ContactTypeSection({
  contact,
  onChanged,
}: {
  contact: Contact;
  onChanged: () => void;
}) {
  const [saving, setSaving] = useState(false);

  async function handleChange(next: ContactType) {
    if (next === contact.contactType || saving) return;
    setSaving(true);
    try {
      await updateContact(contact.id, { contactType: next });
      toast.success("Kişi tipi güncellendi");
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Güncellenemedi");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Section title="Kişi tipi">
      <Select
        value={contact.contactType}
        onValueChange={(v) => {
          if (v) void handleChange(v as ContactType);
        }}
        disabled={saving}
      >
        <SelectTrigger className="h-9 w-full rounded-lg" aria-label="Kişi tipi">
          <SelectValue>
            {(v: string) => CONTACT_TYPE_LABELS[v as ContactType] ?? v}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {CONTACT_TYPE_ORDER.map((t) => (
            <SelectItem key={t} value={t}>
              {CONTACT_TYPE_LABELS[t]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {contact.contactType !== "DANISAN" ? (
        <p className="text-xs text-muted-foreground">Elif bu kişiye cevap vermez.</p>
      ) : null}
    </Section>
  );
}

function ContactCard({
  contact,
  onChanged,
}: {
  contact: Contact;
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const isWhatsapp = contact.channel === "WHATSAPP";

  function startEdit() {
    setFullName(contact.fullName ?? "");
    setAge(contact.age !== null ? String(contact.age) : "");
    setPhone(contact.phone ?? "");
    setNotes(contact.notes ?? "");
    setEditing(true);
  }

  async function handleSave() {
    const input: UpdateContactInput = {};
    const nameTrim = fullName.trim();
    if (nameTrim && nameTrim !== (contact.fullName ?? "")) input.fullName = nameTrim;
    const phoneTrim = phone.trim();
    if (!isWhatsapp && phoneTrim && phoneTrim !== (contact.phone ?? "")) input.phone = phoneTrim;
    if (age.trim() !== "") {
      const ageNum = Number(age);
      if (!Number.isInteger(ageNum) || ageNum < 0 || ageNum > 120) {
        toast.error("Yaş 0 ile 120 arasında bir tam sayı olmalı");
        return;
      }
      if (ageNum !== contact.age) input.age = ageNum;
    }
    if (notes !== (contact.notes ?? "")) input.notes = notes;

    if (Object.keys(input).length === 0) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      await updateContact(contact.id, input);
      toast.success("Danışan bilgileri güncellendi");
      setEditing(false);
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Güncellenemedi");
    } finally {
      setSaving(false);
    }
  }

  if (!editing) {
    return (
      <Section
        title="Danışan"
        action={
          <Button type="button" variant="ghost" size="xs" onClick={startEdit}>
            <Pencil className="size-3" />
            Düzenle
          </Button>
        }
      >
        <Field label="Ad" value={contact.fullName} />
        <Field label="Yaş" value={contact.age !== null ? String(contact.age) : null} />
        <Field label="Telefon" value={contact.phone} />
        {contact.instagramId ? (
          <Field label="Instagram" value={`@${contact.instagramId}`} />
        ) : null}
        <div className="space-y-1 text-sm">
          <span className="text-muted-foreground">Notlar</span>
          <p className="whitespace-pre-wrap break-words text-foreground">
            {contact.notes?.trim() ? contact.notes : "—"}
          </p>
        </div>
      </Section>
    );
  }

  return (
    <Section title="Danışanı düzenle">
      <div className="space-y-2.5">
        <div className="space-y-1">
          <Label htmlFor="contact-name" className="text-xs">Ad soyad</Label>
          <Input
            id="contact-name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            maxLength={120}
            className="h-9 rounded-lg text-sm"
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1">
            <Label htmlFor="contact-age" className="text-xs">Yaş</Label>
            <Input
              id="contact-age"
              type="number"
              min={0}
              max={120}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="h-9 rounded-lg text-sm"
            />
          </div>
          <div className="col-span-2 space-y-1">
            <Label htmlFor="contact-phone" className="text-xs">Telefon</Label>
            <Input
              id="contact-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={32}
              disabled={isWhatsapp}
              readOnly={isWhatsapp}
              className="h-9 rounded-lg text-sm"
            />
            {isWhatsapp ? (
              <p className="text-[11px] text-muted-foreground">
                WhatsApp numarası mesaj adresidir, değiştirilemez.
              </p>
            ) : null}
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor="contact-notes" className="text-xs">Notlar</Label>
          <Textarea
            id="contact-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={5000}
            rows={4}
            className="min-h-20 rounded-lg px-3 py-2"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setEditing(false)}
            disabled={saving}
          >
            <X className="size-4" />
            Vazgeç
          </Button>
          <Button type="button" size="sm" onClick={() => void handleSave()} disabled={saving}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
            Kaydet
          </Button>
        </div>
      </div>
    </Section>
  );
}

export function ContactPanel({ detail, onBack, onChanged }: ContactPanelProps) {
  const [busy, setBusy] = useState<"takeover" | "handback" | "close" | null>(null);
  const [closeOpen, setCloseOpen] = useState(false);
  const [appointmentOpen, setAppointmentOpen] = useState(false);

  async function runAction(
    kind: "takeover" | "handback" | "close",
    fn: (id: string) => Promise<unknown>,
    successMessage: string,
  ) {
    if (!detail) return;
    setBusy(kind);
    try {
      await fn(detail.id);
      toast.success(successMessage);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "İşlem başarısız");
    } finally {
      setBusy(null);
      onChanged();
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-card">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2.5 lg:hidden">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onBack}
          aria-label="Konuşmaya dön"
        >
          <ArrowLeft className="size-4" />
        </Button>
        <span className="text-sm font-semibold">Danışan bilgileri</span>
      </div>

      {!detail ? (
        <div className="space-y-4 p-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="animate-pulse space-y-2">
              <div className="h-3 w-20 rounded bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-2/3 rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <ContactCard
            key={detail.contact.id}
            contact={detail.contact}
            onChanged={onChanged}
          />

          <ContactTypeSection contact={detail.contact} onChanged={onChanged} />

          <Section title="Kanal">
            <div className="flex items-center gap-2 text-sm">
              <ChannelBadge channel={detail.channel} />
              <span>{CHANNEL_LABELS[detail.channel]}</span>
            </div>
          </Section>

          <Section title="Elif durumu">
            <div className="flex items-center gap-2 text-sm">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  detail.status === "CLOSED"
                    ? "bg-slate-200 text-slate-700"
                    : detail.flaggedCrisis
                      ? "bg-destructive/10 text-destructive"
                      : detail.isBotActive
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800",
                )}
              >
                {detail.status === "CLOSED"
                  ? "Kapalı"
                  : detail.flaggedCrisis
                    ? "Kriz"
                    : detail.isBotActive
                      ? "Aktif"
                      : "Personelde"}
              </span>
            </div>
            {detail.flaggedCrisis && detail.status !== "CLOSED" ? (
              <p className="text-xs text-muted-foreground">
                Kriz ifadesi tespit edildiği için Elif bu konuşmada devre dışı; konuşma
                Elif&apos;e geri verilemez.
              </p>
            ) : null}

            {detail.status !== "CLOSED" ? (
              <div className="flex flex-col gap-2 pt-1">
                {detail.isBotActive ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={busy !== null}
                    onClick={() =>
                      void runAction("takeover", takeoverConversation, "Konuşma devralındı")
                    }
                  >
                    {busy === "takeover" ? <Loader2 className="size-4 animate-spin" /> : null}
                    Devral
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={busy !== null || detail.flaggedCrisis}
                    title={
                      detail.flaggedCrisis
                        ? "Kriz konuşması Elif'e geri verilemez"
                        : undefined
                    }
                    onClick={() =>
                      void runAction("handback", handbackConversation, "Konuşma Elif'e geri verildi")
                    }
                  >
                    {busy === "handback" ? <Loader2 className="size-4 animate-spin" /> : null}
                    Elif&apos;e geri ver
                  </Button>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  disabled={busy !== null}
                  onClick={() => setCloseOpen(true)}
                >
                  {busy === "close" ? <Loader2 className="size-4 animate-spin" /> : null}
                  Konuşmayı kapat
                </Button>
              </div>
            ) : null}
          </Section>

          <Section title="Son arama talepleri">
            {detail.leads.length === 0 ? (
              <p className="text-sm text-muted-foreground">Arama talebi yok</p>
            ) : (
              <ul className="space-y-2">
                {detail.leads.map((lead) => (
                  <li key={lead.id} className="rounded-lg border border-border p-2.5 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{SERVICE_LABELS[lead.serviceType]}</span>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                          LEAD_STATUS_STYLE[lead.status],
                        )}
                      >
                        {LEAD_STATUS_LABELS[lead.status]}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {lead.preferredCallTime} · {formatRelative(lead.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section
            title="Yaklaşan randevular"
            action={
              <Button type="button" size="xs" onClick={() => setAppointmentOpen(true)}>
                <CalendarPlus className="size-3.5" />
                Hızlı Randevu
              </Button>
            }
          >
            {detail.appointments.length === 0 ? (
              <p className="text-sm text-muted-foreground">Yaklaşan randevu yok</p>
            ) : (
              <ul className="space-y-2">
                {detail.appointments.map((a) => (
                  <li key={a.id} className="rounded-lg border border-border p-2.5 text-sm">
                    <p className="font-medium">
                      {[a.therapist.title, a.therapist.user.firstName, a.therapist.user.lastName]
                        .filter(Boolean)
                        .join(" ")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(a.scheduledAt)} · {SERVICE_LABELS[a.serviceType]}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>
      )}

      <AlertDialog open={closeOpen} onOpenChange={setCloseOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konuşma kapatılsın mı?</AlertDialogTitle>
            <AlertDialogDescription>
              Konuşma kapatılır ve Elif devre dışı kalır. Danışan yeniden yazarsa yeni
              bir konuşma açılır.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Vazgeç</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                setCloseOpen(false);
                void runAction("close", closeConversation, "Konuşma kapatıldı");
              }}
            >
              Konuşmayı kapat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {detail ? (
        <QuickAppointmentDialog
          open={appointmentOpen}
          onOpenChange={setAppointmentOpen}
          detail={detail}
          onCreated={onChanged}
        />
      ) : null}
    </div>
  );
}
