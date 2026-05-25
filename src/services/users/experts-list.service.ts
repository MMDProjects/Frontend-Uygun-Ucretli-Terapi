import { getOptionalApiBase } from "@/lib/http-client";
import { getAccessToken } from "@/lib/auth-cookies";
import type { ExpertDetail, ExpertListItem } from "@/types/dto/expert-list";

const PRIORITY_STORAGE_KEY = "psikolog-admin-expert-priority-scores";

export function clampExpertPriorityScore(raw: number): number {
  const n = Math.round(Number(raw));
  if (!Number.isFinite(n) || n < 0) return 0;
  if (n > 999_999) return 999_999;
  return n;
}

export function sortExpertsByPriority(items: ExpertListItem[]): ExpertListItem[] {
  return [...items].sort((a, b) => {
    const diff = (b.priorityScore ?? 0) - (a.priorityScore ?? 0);
    if (diff !== 0) return diff;
    return a.fullName.localeCompare(b.fullName, "tr");
  });
}

function readStoredPriorityMap(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(PRIORITY_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    const out: Record<string, number> = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      const n = clampExpertPriorityScore(Number(v));
      out[k] = n;
    }
    return out;
  } catch {
    return {};
  }
}

function persistStoredPriorityMap(map: Record<string, number>): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PRIORITY_STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* ignore quota / private mode */
  }
}

interface BackendExpert {
  id: string;
  title: string;
  bio: string;
  education: string;
  certificateUrl: string;
  cvUrl: string;
  priorityScore: number;
  rating: number;
  status: string;
  adminNote: string | null;
  createdAt: string;
  user: { firstName: string; lastName: string; email: string; phone: string };
  tags: { id: string; name: string; isActive: boolean }[];
}

function mapToListItem(expert: BackendExpert): ExpertListItem {
  const storedPriority = readStoredPriorityMap()[expert.id];
  const priorityScore =
    storedPriority !== undefined
      ? storedPriority
      : clampExpertPriorityScore(expert.priorityScore ?? 0);

  return {
    id: expert.id,
    fullName: `${expert.user.firstName} ${expert.user.lastName}`.trim(),
    email: expert.user.email,
    status: expert.status === "AKTIF" ? "active" : "inactive",
    registeredAt: expert.createdAt,
    priorityScore,
  };
}

function mapToDetail(expert: BackendExpert): ExpertDetail {
  const listItem = mapToListItem(expert);
  const docs = [];
  if (expert.certificateUrl) {
    docs.push({ id: "cert", name: "Sertifika", type: "Sertifika", uploadedAt: "" });
  }
  if (expert.cvUrl) {
    docs.push({ id: "cv", name: "CV / Özgeçmiş", type: "CV", uploadedAt: "" });
  }
  return {
    ...listItem,
    biography: expert.bio,
    keywords: expert.tags.map((t) => t.name),
    specialties: expert.tags.map((t) => t.name),
    documents: docs,
  };
}

function authHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? getAccessToken() : undefined;
  return {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function listExperts(): Promise<ExpertListItem[]> {
  const base = getOptionalApiBase();
  if (!base) return [];

  try {
    const res = await fetch(`${base}/admin/experts?limit=100`, {
      method: "GET",
      headers: authHeaders(),
    });
    if (!res.ok) return [];
    const payload = (await res.json()) as { data: BackendExpert[]; total: number };
    if (!Array.isArray(payload?.data)) return [];
    return sortExpertsByPriority(payload.data.map(mapToListItem));
  } catch {
    return [];
  }
}

export async function getExpertDetail(expertId: string): Promise<ExpertDetail | null> {
  const base = getOptionalApiBase();
  if (!base) return null;

  try {
    const res = await fetch(`${base}/admin/experts/${expertId}`, {
      method: "GET",
      headers: authHeaders(),
    });
    if (!res.ok) return null;
    const expert = (await res.json()) as BackendExpert;
    return mapToDetail(expert);
  } catch {
    return null;
  }
}

/**
 * Persists priority locally; PATCHes the backend when API URL is set.
 */
export async function updateExpertPriorityScore(
  expertId: string,
  rawScore: number
): Promise<void> {
  const priorityScore = clampExpertPriorityScore(rawScore);
  const map = readStoredPriorityMap();
  map[expertId] = priorityScore;
  persistStoredPriorityMap(map);

  const base = getOptionalApiBase();
  if (!base) return;

  try {
    await fetch(`${base}/admin/experts/${expertId}/priority`, {
      method: "PATCH",
      headers: {
        ...authHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ priorityScore }),
    });
  } catch {
    /* local overlay remains authoritative for ordering */
  }
}
