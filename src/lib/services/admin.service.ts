import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-cookies";

export type AdminNotificationType = "INFO" | "WARNING" | "DANGER_PANIC";

export type AdminNotification = {
  id: string;
  message: string;
  type: AdminNotificationType;
  isRead: boolean;
  createdAt: string;
};

export async function getAllAdminNotifications(limit = 50): Promise<AdminNotification[]> {
  const token = getAccessToken();
  return apiFetch("/notifications/all", { token, query: { limit } });
}

export async function markAllAdminNotificationsRead(): Promise<void> {
  const token = getAccessToken();
  await apiFetch("/notifications/read-all", { method: "PATCH", token });
}

export function subscribeToNotificationStream(
  onMessage: (data: { type: AdminNotificationType; message: string; id: string }) => void,
): () => void {
  const token = getAccessToken();
  if (!token || typeof window === "undefined") return () => {};

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
  const es = new EventSource(`${apiUrl}/notifications/stream?token=${token}`);

  es.onmessage = (e) => {
    try {
      const parsed = JSON.parse(e.data);
      onMessage(parsed);
    } catch {}
  };

  return () => es.close();
}
