import type { Channel, ContactType } from "@/services/inbox/types";

export const HANDOFF_REASON_LABELS: Record<string, string> = {
  randevu_degisiklik: "Randevu değişikliği",
  paket_sorusu: "Paket sorusu",
  sikayet: "Şikayet",
  yetkili_talebi: "Yetkili talebi",
  konum_idari: "Konum/idari",
  bilinmeyen_konu: "Bilinmeyen konu",
  acil_durum: "Acil durum",
  uzman_ekip: "Uzman / iç ekip",
};

export const CONTACT_TYPE_LABELS: Record<ContactType, string> = {
  DANISAN: "Danışan",
  UZMAN: "Uzman",
  EKIP: "İç ekip",
};

export const CONTACT_TYPE_ORDER: ContactType[] = ["DANISAN", "UZMAN", "EKIP"];

export const MESSAGE_MAX_LENGTH: Record<Channel, number> = {
  WHATSAPP: 4096,
  INSTAGRAM: 1000,
  WEB: 4096,
};

export const EXTERNAL_SOURCE_INSTAGRAM_APP = "instagram_app";

export function handoffReasonLabel(reason: string): string {
  return HANDOFF_REASON_LABELS[reason] ?? reason;
}
