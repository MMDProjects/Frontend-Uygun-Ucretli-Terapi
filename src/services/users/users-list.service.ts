import { apiFetch } from "@/lib/api";
import { getOptionalApiBase } from "@/lib/http-client";
import { buildQuery } from "@/lib/pagination";
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

export const USERS_PAGE_LIMIT = 20;

export interface ListUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: UserListStatus;
}

export interface UsersPage {
  data: DanisanUser[];
  total: number;
}

function filterMockUsers(params: ListUsersParams): DanisanUser[] {
  const q = params.search?.toLowerCase().trim() ?? "";
  return MOCK_DANISAN_USERS.filter((user) => {
    const matchSearch =
      q.length === 0 ||
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q) ||
      user.id.includes(q) ||
      `#${user.id}`.includes(q);
    const matchStatus = !params.status || user.status === params.status;
    return matchSearch && matchStatus;
  });
}

/**
 * GET /admin/users?page&limit&search&status with Bearer token. Mock list only when API URL is not
 * configured (local/demo mode); mock'ta filtre ve sayfalama tarayıcıda yapılır.
 * Real HTTP or network failures throw so callers can surface an error to the user.
 */
export async function listUsers(
  params: ListUsersParams = {},
  accessToken?: string | null
): Promise<UsersPage> {
  const page = params.page ?? 1;
  const limit = params.limit ?? USERS_PAGE_LIMIT;
  const search = params.search?.trim() || undefined;

  const base = getOptionalApiBase();
  if (!base) {
    const filtered = filterMockUsers({ ...params, search });
    return {
      data: filtered.slice((page - 1) * limit, page * limit),
      total: filtered.length,
    };
  }

  const qs = buildQuery({ page, limit, search, status: params.status });
  const payload = await apiFetch<unknown>(`/admin/users${qs}`, {
    token: accessToken,
  });

  if (!responseLooksSuccessful(payload)) {
    throw new Error("Kullanıcılar yüklenemedi: beklenmeyen sunucu yanıtı");
  }

  const data = mapUsersFromResponse(payload);
  const total =
    isRecord(payload) && typeof payload.total === "number"
      ? payload.total
      : data.length;
  return { data, total };
}
