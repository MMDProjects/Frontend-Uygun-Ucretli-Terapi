"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  useAssistantSettings,
  type AssistantMode,
} from "@/services/inbox/assistant-settings.service";
import { MODE_LABELS } from "./assistant-modes";

const TONE: Record<AssistantMode, string> = {
  OFF: "border-gray-200 bg-gray-100 text-gray-700",
  SHADOW: "border-amber-200 bg-amber-100 text-amber-800",
  LIVE: "border-green-200 bg-green-100 text-green-800",
};

export function AssistantModeBadge() {
  const { settings } = useAssistantSettings();
  if (!settings) return null;
  const label = MODE_LABELS[settings.effectiveMode];
  return (
    <Link
      href="/admin/asistan-ayarlari"
      aria-label={`Asistan modu: ${label}. Asistan ayarlarını aç`}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        TONE[settings.effectiveMode],
      )}
    >
      Asistan: {label}
    </Link>
  );
}
