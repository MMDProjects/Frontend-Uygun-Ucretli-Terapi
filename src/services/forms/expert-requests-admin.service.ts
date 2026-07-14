import { getOptionalApiBase } from "@/lib/http-client";
import { getAccessToken } from "@/lib/auth-cookies";

export type AdminExpertRequestStatus =
  | "BEKLEMEDE"
  | "UZMANA_YONLENDIRILDI"
  | "TAMAMLANDI"
  | "REDDEDILDI";

export interface AdminExpertRequest {
  id: string;
  message: string;
  status: AdminExpertRequestStatus;
  createdAt: string;
  user: { firstName: string; lastName: string; email: string; phone?: string };
  expertProfile: {
    title: string;
    user: { firstName: string; lastName: string };
  };
}

export interface AdminExpertRequestsResponse {
  data: AdminExpertRequest[];
  total: number;
  page: number;
  limit: number;
}

function authHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? getAccessToken() : undefined;
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function listAdminExpertRequests(
  page = 1,
  limit = 20
): Promise<AdminExpertRequestsResponse> {
  const base = getOptionalApiBase();
  if (!base) return { data: [], total: 0, page, limit };

  const res = await fetch(
    `${base}/admin/requests?page=${page}&limit=${limit}`,
    { method: "GET", headers: authHeaders() }
  );
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? `Uzman talepleri yüklenemedi (${res.status})`);
  }
  return (await res.json()) as AdminExpertRequestsResponse;
}

export async function updateAdminExpertRequestStatus(
  id: string,
  status: AdminExpertRequestStatus
): Promise<void> {
  const base = getOptionalApiBase();
  if (!base) return;

  const res = await fetch(`${base}/admin/requests/${id}/status`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Durum güncellenemedi");
}
