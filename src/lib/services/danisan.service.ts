import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-cookies";

// ─── Talep Gönder ────────────────────────────────────────────────────────────

export async function sendExpertRequest(
  expertProfileId: string,
  message: string,
): Promise<{ id: string }> {
  const token = getAccessToken();
  return apiFetch(`/experts/${expertProfileId}/requests`, {
    method: "POST",
    body: { message },
    token,
  });
}

// ─── Favoriler ───────────────────────────────────────────────────────────────

export type ApiFavorite = {
  id: string;
  expertProfileId: string;
  expertProfile: {
    id: string;
    title: string;
    avatarUrl: string;
    rating: number;
    user: { firstName: string; lastName: string };
  };
};

export async function addFavorite(expertProfileId: string): Promise<void> {
  const token = getAccessToken();
  await apiFetch(`/experts/${expertProfileId}/favorites`, {
    method: "POST",
    token,
  });
}

export async function removeFavorite(expertProfileId: string): Promise<void> {
  const token = getAccessToken();
  await apiFetch(`/experts/${expertProfileId}/favorites`, {
    method: "DELETE",
    token,
  });
}

export async function getMyFavorites(): Promise<ApiFavorite[]> {
  const token = getAccessToken();
  return apiFetch("/experts/me/favorites", { token });
}

// ─── Gönderilen Talepler ──────────────────────────────────────────────────────

export type ApiDanisanRequest = {
  id: string;
  message: string;
  status: "BEKLEMEDE" | "UZMANA_YONLENDIRILDI" | "TAMAMLANDI" | "REDDEDILDI";
  createdAt: string;
  expertProfile: {
    id: string;
    title: string;
    avatarUrl: string | null;
    user: { firstName: string; lastName: string };
  };
};

export async function getMyDanisanRequests(): Promise<ApiDanisanRequest[]> {
  const token = getAccessToken();
  return apiFetch("/experts/me/sent-requests", { token });
}

// ─── Test Geçmişi ─────────────────────────────────────────────────────────────

export type ApiTestResult = {
  id: string;
  scoreSummary: string;
  createdAt: string;
  test: { title: string; slug: string };
};

export async function getMyTestHistory(): Promise<ApiTestResult[]> {
  const token = getAccessToken();
  return apiFetch("/tests/history/me", { token });
}
