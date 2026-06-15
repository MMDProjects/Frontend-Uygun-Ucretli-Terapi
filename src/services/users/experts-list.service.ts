import { getOptionalApiBase } from "@/lib/http-client";
import { getAccessToken } from "@/lib/auth-cookies";
import type { ExpertDetail, ExpertListItem } from "@/types/dto/expert-list";

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


interface BackendExpert {
  id: string;
  title: string;
  bio: string;
  pendingBio: string | null;
  education: string;
  certificateUrl: string;
  cvUrl: string;
  pendingCertificateUrl: string | null;
  pendingCvUrl: string | null;
  priorityScore: number;
  rating: number;
  standardPrice: string | null;
  discountedPrice: string | null;
  status: string;
  isPublished: boolean;
  adminNote: string | null;
  createdAt: string;
  user: { id: string; firstName: string; lastName: string; email: string; phone: string; isActive: boolean };
  tags: { id: string; name: string; isActive: boolean }[];
}

function mapToListItem(expert: BackendExpert): ExpertListItem {
  return {
    id: expert.id,
    userId: expert.user.id,
    fullName: `${expert.user.firstName} ${expert.user.lastName}`.trim(),
    email: expert.user.email,
    status: expert.user.isActive ? "active" : "inactive",
    registeredAt: expert.createdAt,
    priorityScore: clampExpertPriorityScore(expert.priorityScore ?? 0),
    isPublished: expert.isPublished ?? false,
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
  if (expert.pendingCertificateUrl) {
    docs.push({ id: "cert-pending", name: "Sertifika (Onay Bekliyor)", type: "Sertifika", uploadedAt: "" });
  }
  if (expert.pendingCvUrl) {
    docs.push({ id: "cv-pending", name: "CV (Onay Bekliyor)", type: "CV", uploadedAt: "" });
  }
  return {
    ...listItem,
    biography: expert.bio,
    pendingBiography: expert.pendingBio ?? null,
    keywords: expert.tags.map((t) => t.name),
    specialties: expert.tags.map((t) => t.name),
    documents: docs,
    standardPrice: expert.standardPrice ? Number(expert.standardPrice) : null,
    discountedPrice: expert.discountedPrice ? Number(expert.discountedPrice) : null,
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

export async function updateExpertPricing(
  expertId: string,
  standardPrice: number | null,
  discountedPrice: number | null
): Promise<void> {
  const base = getOptionalApiBase();
  if (!base) return;

  const res = await fetch(`${base}/admin/experts/${expertId}/pricing`, {
    method: "PATCH",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ standardPrice, discountedPrice }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Fiyat güncellenemedi");
  }
}

export async function toggleExpertActive(
  expertId: string,
  isActive: boolean
): Promise<void> {
  const base = getOptionalApiBase();
  if (!base) return;

  const res = await fetch(`${base}/admin/experts/${expertId}/active`, {
    method: "PATCH",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ isActive }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Durum güncellenemedi");
  }
}

export async function toggleExpertPublish(
  expertId: string,
  isPublished: boolean
): Promise<void> {
  const base = getOptionalApiBase();
  if (!base) return;

  const res = await fetch(`${base}/admin/experts/${expertId}/publish`, {
    method: "PATCH",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ isPublished }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Yayın durumu güncellenemedi");
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
  const base = getOptionalApiBase();
  if (!base) return;

  const res = await fetch(`${base}/admin/experts/${expertId}/priority`, {
    method: "PATCH",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ priorityScore }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Öncelik skoru güncellenemedi");
  }
}

export interface CreateExpertByAdminPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export async function createExpertByAdmin(
  payload: CreateExpertByAdminPayload,
): Promise<{ id: string; userId: string; email: string }> {
  const base = getOptionalApiBase();
  if (!base) throw new Error("API bağlantısı bulunamadı");

  const res = await fetch(`${base}/admin/experts`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new Error(err?.message || "Uzman oluşturulamadı");
  }

  return res.json() as Promise<{ id: string; userId: string; email: string }>;
}
