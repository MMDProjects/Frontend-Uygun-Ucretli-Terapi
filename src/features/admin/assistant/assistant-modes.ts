import type { AssistantMode } from "@/services/inbox/assistant-settings.service";

export const MODE_LABELS: Record<AssistantMode, string> = {
  OFF: "Kapalı",
  SHADOW: "Gölge",
  LIVE: "Canlı",
};

export const MODE_DESCRIPTIONS: Record<AssistantMode, string> = {
  OFF: "Elif hiçbir konuşmaya cevap yazmaz.",
  SHADOW: "Elif cevap yazar ama göndermez; taslaklar Mesajlar ekranında görünür.",
  LIVE: "Elif danışanlara cevap gönderir.",
};

export const MODE_ORDER: AssistantMode[] = ["OFF", "SHADOW", "LIVE"];
