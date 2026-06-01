import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-cookies";
import type {
  UzmanProfileStatus,
  UzmanBlogStatus,
  UzmanNotificationType,
  ExpertRequestStatus,
} from "@/types/domain";

// ─── Status Mappers ───────────────────────────────────────────────────────────

type ApiProfileStatus = "TASLAK" | "ONAY_BEKLIYOR" | "YAYINDA" | "REDDEDILDI" | "REVIZE_GONDERILDI";
type ApiBlogStatus = "TASLAK" | "ONAY_BEKLIYOR" | "YAYINDA" | "REDDEDILDI" | "REVIZE_GONDERILDI";
type ApiRequestStatus = "BEKLEMEDE" | "UZMANA_YONLENDIRILDI" | "TAMAMLANDI" | "REDDEDILDI";
type ApiNotificationType = "INFO" | "WARNING" | "DANGER_PANIC";

function mapProfileStatus(s: ApiProfileStatus): UzmanProfileStatus {
  if (s === "REDDEDILDI" || s === "REVIZE_GONDERILDI") return "pasif";
  if (s === "ONAY_BEKLIYOR") return "onay_bekliyor";
  if (s === "YAYINDA") return "yayinda";
  return "taslak";
}

function mapBlogStatus(s: ApiBlogStatus): UzmanBlogStatus {
  if (s === "ONAY_BEKLIYOR") return "incelemede";
  if (s === "REVIZE_GONDERILDI") return "revize_gonderildi";
  if (s === "YAYINDA") return "yayinda";
  if (s === "REDDEDILDI") return "reddedildi";
  return "taslak";
}

function mapRequestStatus(s: ApiRequestStatus): ExpertRequestStatus {
  if (s === "UZMANA_YONLENDIRILDI") return "Yanıtlandı";
  if (s === "TAMAMLANDI") return "Tamamlandı";
  if (s === "REDDEDILDI") return "Reddedildi";
  return "Beklemede";
}

function mapNotificationType(t: ApiNotificationType): UzmanNotificationType {
  if (t === "WARNING") return "admin_message";
  if (t === "DANGER_PANIC") return "danger_panic";
  return "sistem";
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type ApiTag = { id: string; name: string; isActive: boolean };

export type ApiUzmanProfile = {
  id: string;
  userId: string;
  title: string;
  bio: string;
  pendingBio: string | null;
  education: string | null;
  avatarUrl: string | null;
  phone: string | null;
  rating: number;
  priorityScore: number;
  status: UzmanProfileStatus;
  adminNote: string | null;
  tags: ApiTag[];
  availabilities: ApiAvailability[];
};

export type ApiAvailability = {
  id: string;
  expertProfileId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isBlockedByAdmin: boolean;
};

export type ApiUzmanRequest = {
  id: string;
  message: string;
  status: ExpertRequestStatus;
  createdAt: string;
  user: { firstName: string; lastName: string; email: string };
};

export type ApiUzmanBlog = {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImageUrl?: string | null;
  status: UzmanBlogStatus;
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiUzmanNotification = {
  id: string;
  message: string;
  type: UzmanNotificationType;
  isRead: boolean;
  createdAt: string;
};

// ─── Profile ─────────────────────────────────────────────────────────────────

type RawProfile = {
  id: string;
  userId: string;
  title: string;
  bio: string;
  pendingBio: string | null;
  education: string | null;
  avatarUrl: string | null;
  phone: string | null;
  rating: number;
  priorityScore: number;
  status: ApiProfileStatus;
  adminNote: string | null;
  tags: ApiTag[];
  availabilities: ApiAvailability[];
};

export async function getMyUzmanProfile(): Promise<ApiUzmanProfile> {
  const token = getAccessToken();
  const raw = await apiFetch<RawProfile>("/experts/me/profile", { token });
  return { ...raw, status: mapProfileStatus(raw.status) };
}

export async function updateMyUzmanProfile(data: {
  title?: string;
  bio?: string;
  education?: string;
  tagIds?: string[];
  avatar?: File;
  certificate?: File;
  cv?: File;
}): Promise<{ message: string }> {
  const token = getAccessToken();
  const formData = new FormData();
  if (data.title !== undefined) formData.append("title", data.title);
  if (data.bio !== undefined) formData.append("bio", data.bio);
  if (data.education !== undefined) formData.append("education", data.education);
  data.tagIds?.forEach((id) => formData.append("tagIds", id));
  if (data.avatar) formData.append("avatar", data.avatar);
  if (data.certificate) formData.append("certificate", data.certificate);
  if (data.cv) formData.append("cv", data.cv);

  return apiFetch("/experts/me", {
    method: "PATCH",
    body: formData,
    token,
    isFormData: true,
  });
}

export async function getActiveTags(): Promise<ApiTag[]> {
  return apiFetch("/experts/tags");
}

// ─── Availability ─────────────────────────────────────────────────────────────

export async function getMyAvailabilities(): Promise<ApiAvailability[]> {
  const token = getAccessToken();
  return apiFetch("/experts/me/availabilities", { token });
}

export async function addAvailability(dto: {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}): Promise<ApiAvailability> {
  const token = getAccessToken();
  return apiFetch("/experts/me/availabilities", { method: "POST", body: dto, token });
}

export async function removeAvailability(id: string): Promise<void> {
  const token = getAccessToken();
  await apiFetch(`/experts/me/availabilities/${id}`, { method: "DELETE", token });
}

// ─── Requests ─────────────────────────────────────────────────────────────────

type RawRequest = {
  id: string;
  message: string;
  status: ApiRequestStatus;
  createdAt: string;
  user: { firstName: string; lastName: string; email: string };
};

export async function getMyUzmanRequests(): Promise<ApiUzmanRequest[]> {
  const token = getAccessToken();
  const raw = await apiFetch<RawRequest[]>("/experts/me/requests", { token });
  return raw.map((r) => ({ ...r, status: mapRequestStatus(r.status) }));
}

export async function updateUzmanRequestStatus(
  id: string,
  status: "UZMANA_YONLENDIRILDI" | "TAMAMLANDI" | "REDDEDILDI",
): Promise<void> {
  const token = getAccessToken();
  await apiFetch(`/experts/me/requests/${id}/status`, {
    method: "PATCH",
    body: { status },
    token,
  });
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

type RawBlog = {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: ApiBlogStatus;
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function getMyUzmanBlogs(): Promise<ApiUzmanBlog[]> {
  const token = getAccessToken();
  const raw = await apiFetch<RawBlog[]>("/blogs/me/list", { token });
  return raw.map((b) => ({ ...b, status: mapBlogStatus(b.status) }));
}

export async function createBlog(dto: {
  title: string;
  slug: string;
  content: string;
}): Promise<ApiUzmanBlog> {
  const token = getAccessToken();
  const raw = await apiFetch<RawBlog>("/blogs", { method: "POST", body: dto, token });
  return { ...raw, status: mapBlogStatus(raw.status) };
}

export async function submitBlogForReview(id: string): Promise<ApiUzmanBlog> {
  const token = getAccessToken();
  const raw = await apiFetch<RawBlog>(`/blogs/${id}`, { method: "PATCH", body: {}, token });
  return { ...raw, status: mapBlogStatus(raw.status) };
}

export async function updateBlogContent(
  id: string,
  dto: { title: string; slug: string; content: string },
): Promise<ApiUzmanBlog> {
  const token = getAccessToken();
  const raw = await apiFetch<RawBlog>(`/blogs/${id}`, { method: "PATCH", body: dto, token });
  return { ...raw, status: mapBlogStatus(raw.status) };
}

export async function uploadBlogCover(
  id: string,
  file: File,
): Promise<{ coverImageUrl: string }> {
  const token = getAccessToken();
  const formData = new FormData();
  formData.append("cover", file);
  return apiFetch(`/blogs/${id}/cover`, {
    method: "POST",
    body: formData,
    token,
    isFormData: true,
  });
}

export async function deleteBlog(id: string): Promise<void> {
  const token = getAccessToken();
  await apiFetch(`/blogs/${id}`, { method: "DELETE", token });
}

// ─── Notifications ────────────────────────────────────────────────────────────

type RawNotification = {
  id: string;
  message: string;
  type: ApiNotificationType;
  isRead: boolean;
  createdAt: string;
};

export async function getMyUzmanNotifications(): Promise<ApiUzmanNotification[]> {
  const token = getAccessToken();
  const raw = await apiFetch<RawNotification[]>("/notifications", { token });
  return raw.map((n) => ({ ...n, type: mapNotificationType(n.type) }));
}

export async function markUzmanNotificationRead(id: string): Promise<void> {
  const token = getAccessToken();
  await apiFetch(`/notifications/${id}/read`, { method: "PATCH", token });
}

export function subscribeToNotificationStream(
  onMessage: (data: { type: ApiNotificationType; message: string; id: string }) => void,
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
