import { apiFetch } from "@/lib/api";
import { getOptionalApiBase } from "@/lib/http-client";

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

export async function listAdminExpertRequests(
  page = 1,
  limit = 20
): Promise<AdminExpertRequestsResponse> {
  const base = getOptionalApiBase();
  if (!base) return { data: [], total: 0, page, limit };

  return apiFetch<AdminExpertRequestsResponse>(
    `/admin/requests?page=${page}&limit=${limit}`
  );
}

export async function updateAdminExpertRequestStatus(
  id: string,
  status: AdminExpertRequestStatus
): Promise<void> {
  const base = getOptionalApiBase();
  if (!base) return;

  await apiFetch<unknown>(`/admin/requests/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
}
