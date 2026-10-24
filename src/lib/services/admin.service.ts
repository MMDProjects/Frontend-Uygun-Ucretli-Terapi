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
  return apiFetch(`/notifications/all?limit=${limit}`, { token });
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

export type ExpertItem = {
  id: string;
  priorityScore: number;
  user: { firstName: string; lastName: string };
};

export type ApiAvailability = {
  id: string;
  expertProfileId: string;
  date: string;
  startTime: string;
  endTime: string;
  isBlockedByAdmin: boolean;
};

export async function fetchExperts(): Promise<ExpertItem[]> {
  const res = await apiFetch<{ data: ExpertItem[] } | ExpertItem[]>(
    "/admin/experts?limit=100&onlyApproved=true",
    { token: getAccessToken() ?? "" },
  );
  return Array.isArray(res) ? res : (res.data ?? []);
}

// Tüm uzmanlar tek istekte: uzman başına istek rate limit'e takılıp
// bazı uzmanları boş gösteriyordu.
export async function fetchWeekAvailabilities(weekStart: Date): Promise<ApiAvailability[]> {
  const y = weekStart.getFullYear();
  const m = String(weekStart.getMonth() + 1).padStart(2, "0");
  const d = String(weekStart.getDate()).padStart(2, "0");
  return apiFetch(`/admin/availabilities?weekStart=${y}-${m}-${d}`, {
    token: getAccessToken() ?? "",
  });
}
