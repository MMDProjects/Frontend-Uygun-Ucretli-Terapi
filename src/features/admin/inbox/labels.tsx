import { cn } from "@/lib/utils";
import type {
  Channel,
  ContactSummary,
  LeadStatus,
  PaymentStatus,
  ServiceType,
} from "@/services/inbox/types";

export const TIME_ZONE = "Europe/Istanbul";

export const CHANNEL_LABELS: Record<Channel, string> = {
  WHATSAPP: "WhatsApp",
  INSTAGRAM: "Instagram",
  WEB: "Web",
};

const CHANNEL_SHORT: Record<Channel, string> = {
  WHATSAPP: "WA",
  INSTAGRAM: "IG",
  WEB: "WEB",
};

const CHANNEL_STYLE: Record<Channel, string> = {
  WHATSAPP: "bg-emerald-100 text-emerald-800",
  INSTAGRAM: "bg-pink-100 text-pink-800",
  WEB: "bg-slate-200 text-slate-700",
};

export const SERVICE_LABELS: Record<ServiceType, string> = {
  BIREYSEL: "Bireysel",
  CIFT: "Çift",
  AILE: "Aile",
  COCUK_ERGEN: "Çocuk-Ergen",
  EMDR: "EMDR",
  ON_GORUSME: "Ön görüşme",
};

export const SERVICE_ORDER: ServiceType[] = [
  "BIREYSEL",
  "CIFT",
  "AILE",
  "COCUK_ERGEN",
  "EMDR",
  "ON_GORUSME",
];

export const PAYMENT_LABELS: Record<PaymentStatus, string> = {
  PENDING: "Bekliyor",
  PAID: "Ödendi",
  FREE: "Ücretsiz",
};

export const PAYMENT_ORDER: PaymentStatus[] = ["PENDING", "PAID", "FREE"];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  YENI: "Yeni",
  ARANDI: "Arandı",
  ULASILAMADI: "Ulaşılamadı",
  RANDEVU_OLUSTURULDU: "Randevu oluşturuldu",
  VAZGECTI: "Vazgeçti",
};

export const LEAD_STATUS_STYLE: Record<LeadStatus, string> = {
  YENI: "bg-amber-100 text-amber-800",
  ARANDI: "bg-sky-100 text-sky-800",
  ULASILAMADI: "bg-orange-100 text-orange-800",
  RANDEVU_OLUSTURULDU: "bg-emerald-100 text-emerald-800",
  VAZGECTI: "bg-slate-200 text-slate-700",
};

export function ChannelBadge({
  channel,
  className,
}: {
  channel: Channel;
  className?: string;
}) {
  return (
    <span
      title={CHANNEL_LABELS[channel]}
      className={cn(
        "inline-flex h-5 shrink-0 items-center justify-center rounded px-1.5 text-[10px] font-bold tracking-wide",
        CHANNEL_STYLE[channel],
        className,
      )}
    >
      {CHANNEL_SHORT[channel]}
    </span>
  );
}

export function contactName(contact: ContactSummary | null | undefined): string {
  if (!contact) return "Bilinmeyen danışan";
  return (
    contact.fullName?.trim() ||
    contact.phone ||
    (contact.instagramId ? `@${contact.instagramId}` : "Adsız danışan")
  );
}

const timeFmt = new Intl.DateTimeFormat("tr-TR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: TIME_ZONE,
});

const dateFmt = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "short",
  timeZone: TIME_ZONE,
});

const dayLongFmt = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  weekday: "long",
  timeZone: TIME_ZONE,
});

const dateTimeFmt = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: TIME_ZONE,
});

const dayKeyFmt = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: TIME_ZONE,
});

export function formatTime(iso: string): string {
  return timeFmt.format(new Date(iso));
}

export function formatDayLabel(iso: string): string {
  return dayLongFmt.format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return dateTimeFmt.format(new Date(iso));
}

export function dayKey(iso: string): string {
  return dayKeyFmt.format(new Date(iso));
}

export function formatRelative(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "şimdi";
  if (minutes < 60) return `${minutes} dk`;
  if (dayKey(iso) === dayKey(new Date().toISOString())) return formatTime(iso);
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  if (dayKey(iso) === dayKey(yesterday)) return "Dün";
  return dateFmt.format(date);
}

export function agentName(
  agentUser: { firstName: string; lastName: string } | null,
): string {
  if (!agentUser) return "Personel";
  return `${agentUser.firstName} ${agentUser.lastName}`.trim() || "Personel";
}
