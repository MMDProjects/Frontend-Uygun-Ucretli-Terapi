import type { Channel, LeadStatus, ServiceType } from "@/services/inbox/types";

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  YENI: "Yeni",
  ARANDI: "Arandı",
  ULASILAMADI: "Ulaşılamadı",
  RANDEVU_OLUSTURULDU: "Randevu oluşturuldu",
  VAZGECTI: "Vazgeçti",
};

export const LEAD_STATUS_ORDER: LeadStatus[] = [
  "YENI",
  "ARANDI",
  "ULASILAMADI",
  "RANDEVU_OLUSTURULDU",
  "VAZGECTI",
];

export const LEAD_STATUS_STYLE: Record<LeadStatus, string> = {
  YENI: "border-amber-200 bg-amber-50 text-amber-800",
  ARANDI: "border-blue-200 bg-blue-50 text-blue-800",
  ULASILAMADI: "border-red-200 bg-red-50 text-red-800",
  RANDEVU_OLUSTURULDU: "border-green-200 bg-green-50 text-green-800",
  VAZGECTI: "border-gray-200 bg-gray-50 text-gray-700",
};

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  BIREYSEL: "Bireysel terapi",
  CIFT: "Çift terapisi",
  AILE: "Aile terapisi",
  COCUK_ERGEN: "Çocuk / ergen",
  EMDR: "EMDR",
  ON_GORUSME: "Ön görüşme",
};

export const CHANNEL_LABELS: Record<Channel, string> = {
  WHATSAPP: "WhatsApp",
  INSTAGRAM: "Instagram",
  WEB: "Web",
};
