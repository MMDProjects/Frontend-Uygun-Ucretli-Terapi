import { getOptionalApiBase } from "@/lib/http-client";
import type { DanisanRole, DanisanUser, UserListStatus } from "@/types/dto/user-list";

export const MOCK_DANISAN_USERS: DanisanUser[] = [
  {
    id: "1",
    name: "Zeynep Kaya",
    email: "zeynep.kaya@example.com",
    role: "danisan",
    status: "active",
    registeredAt: "2024-11-12",
  },
  {
    id: "2",
    name: "Can Öztürk",
    email: "can.ozturk@example.com",
    role: "premium_danisan",
    status: "active",
    registeredAt: "2025-01-03",
  },
  {
    id: "3",
    name: "Elif Demir",
    email: "elif.demir@example.com",
    role: "guest",
    status: "inactive",
    registeredAt: "2024-08-20",
  },
];

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function mapBackendRole(raw?: string): DanisanRole {
  if (!raw) return "danisan";
  const r = raw.toLowerCase();
  if (r.includes("premium")) return "premium_danisan";
  if (r.includes("guest") || r.includes("misafir")) return "guest";
  if (
    r === "danisan" ||
    r === "danışan" ||
    r === "bireysel_kullanici" ||
    r === "üye" ||
    r === "user" ||
    r === "antrenor" ||
    r === "admin" ||
    r === "staff" ||
    r === "kulup_uyesi"
  ) {
    return "danisan";
  }
  return "danisan";
}

function mapBackendStatus(raw: unknown): UserListStatus {
  const s = String(raw ?? "").toLowerCase();
  if (s === "aktif" || s === "active" || s === "true") return "active";
  return "inactive";
}

function mapOneUserRow(row: Record<string, unknown>): DanisanUser {
  // Backend returns camelCase (firstName/lastName); some APIs use snake_case
  const first = String(row.firstName ?? row.first_name ?? "");
  const last = String(row.lastName ?? row.last_name ?? "");
  const nameFromParts = `${first} ${last}`.trim();
  const name = String(row.name ?? "").trim() || nameFromParts || "İsimsiz";
  const isActive = row.isActive ?? row.is_active;

  return {
    id: String(row.id ?? ""),
    name,
    email: String(row.email ?? ""),
    role: mapBackendRole(
      typeof row.role === "string" ? row.role : undefined
    ),
    status: mapBackendStatus(isActive !== undefined ? isActive : row.status),
    registeredAt:
      typeof row.createdAt === "string"
        ? row.createdAt
        : typeof row.created_at === "string"
          ? row.created_at
          : typeof row.registeredDate === "string"
            ? row.registeredDate
            : undefined,
  };
}

/**
 * Supports:
 * - { data: T[], total, page, limit } (backend format — data is directly an array)
 * - { success: true, data: { users?: T[] } } (standard envelope)
 * - { status: "success", data: { users?: T[], USER_DETAILS?: T[] } } (Sportlink-style)
 */
export function mapUsersFromResponse(payload: unknown): DanisanUser[] {
  if (!isRecord(payload)) return [];

  // Backend format: { data: [...], total, page, limit }
  if (Array.isArray(payload.data)) {
    return payload.data
      .filter(isRecord)
      .map(mapOneUserRow)
      .filter((u) => u.id.length > 0);
  }

  const data = isRecord(payload.data) ? payload.data : null;
  if (!data) return [];

  const rawList =
    (Array.isArray(data.users) ? data.users : null) ??
    (Array.isArray(data.USER_DETAILS) ? data.USER_DETAILS : null);

  if (!rawList) return [];

  return rawList
    .filter(isRecord)
    .map(mapOneUserRow)
    .filter((u) => u.id.length > 0);
}

function responseLooksSuccessful(payload: unknown): boolean {
  if (!isRecord(payload)) return false;
  if (payload.success === true) return true;
  if (payload.status === "success") return true;
  // Backend format: { data: [...], total, page, limit } — no success flag
  if (Array.isArray(payload.data)) return true;
  return false;
}

/**
 * GET /users with Bearer token. Mock list when API URL missing or request/parsing fails.
 */
export async function listUsers(
  accessToken?: string | null
): Promise<DanisanUser[]> {
  const base = getOptionalApiBase();
  if (!base) {
    return MOCK_DANISAN_USERS;
  }

  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const res = await fetch(`${base}/admin/users`, {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (!res.ok) {
      console.warn("[listUsers] HTTP", res.status, "- using mock list");
      return MOCK_DANISAN_USERS;
    }

    const payload: unknown = await res.json();

    if (!responseLooksSuccessful(payload)) {
      console.warn("[listUsers] unexpected response shape - using mock list");
      return MOCK_DANISAN_USERS;
    }

    const users = mapUsersFromResponse(payload);
    return users;
  } catch (e) {
    console.warn("[listUsers] request failed - using mock list", e);
    return MOCK_DANISAN_USERS;
  }
}
