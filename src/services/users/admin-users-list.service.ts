import { getOptionalApiBase } from "@/lib/http-client";
import { getAccessToken } from "@/lib/auth-cookies";
import type { AdminUser } from "@/types/dto/admin-user-list";

export const MOCK_ADMIN_USERS: AdminUser[] = [
  {
    id: "A-101",
    fullName: "Merve Aydın",
    email: "merve.aydin@psikolog.com",
    role: "admin",
    status: "active",
    createdAt: "2025-03-12",
  },
  {
    id: "P-204",
    fullName: "Emre Yıldız",
    email: "emre.yildiz@psikolog.com",
    role: "personel",
    status: "active",
    createdAt: "2025-07-01",
  },
  {
    id: "P-319",
    fullName: "Selin Kurt",
    email: "selin.kurt@psikolog.com",
    role: "personel",
    status: "inactive",
    createdAt: "2024-11-21",
  },
];

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function mapAdminUserRow(row: Record<string, unknown>): AdminUser {
  const first = String(row.firstName ?? row.first_name ?? "");
  const last = String(row.lastName ?? row.last_name ?? "");
  const fullName =
    `${first} ${last}`.trim() ||
    String(row.fullName ?? row.full_name ?? "İsimsiz");
  const isActive = row.isActive ?? row.is_active;
  const status: AdminUser["status"] =
    isActive === false || String(isActive ?? "").toLowerCase() === "false"
      ? "inactive"
      : "active";

  return {
    id: String(row.id ?? ""),
    fullName,
    email: String(row.email ?? ""),
    role: "admin",
    status,
    createdAt:
      typeof row.createdAt === "string"
        ? row.createdAt
        : typeof row.created_at === "string"
          ? row.created_at
          : undefined,
  };
}

export async function listAdminUsers(): Promise<AdminUser[]> {
  const base = getOptionalApiBase();
  if (!base) return MOCK_ADMIN_USERS;

  try {
    const token = getAccessToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${base}/admin/admin-users`, {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (!res.ok) {
      console.warn("[listAdminUsers] HTTP", res.status, "- using mock list");
      return MOCK_ADMIN_USERS;
    }

    const payload: unknown = await res.json();
    if (!isRecord(payload) || !Array.isArray(payload.data)) {
      console.warn("[listAdminUsers] unexpected response - using mock list");
      return MOCK_ADMIN_USERS;
    }

    return payload.data
      .filter(isRecord)
      .map(mapAdminUserRow)
      .filter((u) => u.id.length > 0);
  } catch (e) {
    console.warn("[listAdminUsers] request failed - using mock list", e);
    return MOCK_ADMIN_USERS;
  }
}
