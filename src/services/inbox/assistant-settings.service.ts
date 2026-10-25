import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export type AssistantMode = "OFF" | "SHADOW" | "LIVE";

export interface AssistantSettings {
  mode: AssistantMode;
  envEnabled: boolean;
  effectiveMode: AssistantMode;
  noticeText: string | null;
}

export interface AssistantSettingsPatch {
  mode?: AssistantMode;
  noticeText?: string | null;
}

const listeners = new Set<(s: AssistantSettings) => void>();

function publish(s: AssistantSettings): void {
  listeners.forEach((l) => l(s));
}

export async function getAssistantSettings(): Promise<AssistantSettings> {
  const s = await apiFetch<AssistantSettings>("/admin/assistant/settings");
  publish(s);
  return s;
}

export async function updateAssistantSettings(
  patch: AssistantSettingsPatch,
): Promise<AssistantSettings> {
  const s = await apiFetch<AssistantSettings>("/admin/assistant/settings", {
    method: "PATCH",
    body: patch,
  });
  publish(s);
  return s;
}

// Ayarlar değişince (veya pencere odaklanınca) güncel ayarı veren hook.
export function useAssistantSettings(): {
  settings: AssistantSettings | null;
  error: boolean;
  reload: () => void;
} {
  const [settings, setSettings] = useState<AssistantSettings | null>(null);
  const [error, setError] = useState(false);

  const reload = useCallback(() => {
    getAssistantSettings()
      .then(() => setError(false))
      .catch(() => setError(true));
  }, []);

  useEffect(() => {
    const listener = (s: AssistantSettings) => setSettings(s);
    listeners.add(listener);
    reload();
    window.addEventListener("focus", reload);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("focus", reload);
    };
  }, [reload]);

  return { settings, error, reload };
}
