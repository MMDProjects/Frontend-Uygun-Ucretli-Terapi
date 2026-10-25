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
  const es = new EventSource(`${apiUrl}/notifications/stream?token=${encodeURIComponent(token)}`);

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

const ADMIN_EXPERTS_PAGE_LIMIT = 100;
const ADMIN_EXPERTS_MAX_PAGES = 50;

// /admin/experts sayfalarını birleştirir (sayfa başına en fazla 100 kayıt).
export async function fetchAllExperts(
  opts: { onlyApproved?: boolean } = {},
): Promise<ExpertItem[]> {
  const token = getAccessToken() ?? "";
  const all: ExpertItem[] = [];
  for (let page = 1; page <= ADMIN_EXPERTS_MAX_PAGES; page++) {
    const qs = `page=${page}&limit=${ADMIN_EXPERTS_PAGE_LIMIT}${opts.onlyApproved ? "&onlyApproved=true" : ""}`;
    const res = await apiFetch<
      { data: ExpertItem[]; total?: number } | ExpertItem[]
    >(`/admin/experts?${qs}`, { token });
    const items = Array.isArray(res) ? res : (res.data ?? []);
    all.push(...items);
    if (Array.isArray(res)) break;
    const total = res.total;
    if (items.length < ADMIN_EXPERTS_PAGE_LIMIT) break;
    if (typeof total === "number" && all.length >= total) break;
  }
  return all;
}

export async function fetchExperts(): Promise<ExpertItem[]> {
  return fetchAllExperts({ onlyApproved: true });
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
