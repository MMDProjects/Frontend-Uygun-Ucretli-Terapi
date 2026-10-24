import type {
  KnowledgeCategory,
  KnowledgeSource,
} from "@/services/inbox/types";

export const CATEGORY_LABELS: Record<KnowledgeCategory, string> = {
  FIYAT: "Fiyat",
  HIZMET: "Hizmet",
  PROSEDUR: "Prosedür",
  SSS: "SSS",
};

export const CATEGORY_OPTIONS = Object.keys(
  CATEGORY_LABELS,
) as KnowledgeCategory[];

export const SOURCE_LABELS: Record<KnowledgeSource, string> = {
  MANUAL: "Manuel",
  CONVERSATION: "Konuşmadan",
  SSS: "SSS",
};

export const PAGE_LIMIT = 20;

export const PII_LABEL = "Kişisel bilgileri çıkardım";
export const PII_HINT =
  "Metinde isim, telefon, e-posta gibi kişisel bilgi kalmadığını onaylayın.";

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Istanbul",
  }).format(new Date(iso));
}
