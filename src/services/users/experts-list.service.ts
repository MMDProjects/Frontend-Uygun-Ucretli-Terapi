import { apiFetch } from "@/lib/api";
import { getOptionalApiBase } from "@/lib/http-client";
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
    docs.push({ id: "cert", name: "Sertifika", type: "Sertifika", uploadedAt: "", url: expert.certificateUrl });
  }
  if (expert.cvUrl) {
    docs.push({ id: "cv", name: "CV / Özgeçmiş", type: "CV", uploadedAt: "", url: expert.cvUrl });
  }
  if (expert.pendingCertificateUrl) {
    docs.push({ id: "cert-pending", name: "Sertifika (Onay Bekliyor)", type: "Sertifika", uploadedAt: "", url: expert.pendingCertificateUrl, isPending: true });
  }
  if (expert.pendingCvUrl) {
    docs.push({ id: "cv-pending", name: "CV (Onay Bekliyor)", type: "CV", uploadedAt: "", url: expert.pendingCvUrl, isPending: true });
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

export async function listExperts(): Promise<ExpertListItem[]> {
  const base = getOptionalApiBase();
  if (!base) return [];

  const payload = await apiFetch<{ data: BackendExpert[]; total: number }>(
    "/admin/experts?limit=100"
  );
  if (!Array.isArray(payload?.data)) {
    throw new Error("Uzmanlar yüklenemedi: beklenmeyen sunucu yanıtı");
  }
  return sortExpertsByPriority(payload.data.map(mapToListItem));
}

export async function getExpertDetail(expertId: string): Promise<ExpertDetail | null> {
  const base = getOptionalApiBase();
  if (!base) return null;

  const expert = await apiFetch<BackendExpert>(`/admin/experts/${expertId}`);
  return mapToDetail(expert);
}

export async function updateExpertPricing(
  expertId: string,
  standardPrice: number | null,
  discountedPrice: number | null
): Promise<void> {
  const base = getOptionalApiBase();
  if (!base) return;

  await apiFetch<unknown>(`/admin/experts/${expertId}/pricing`, {
    method: "PATCH",
    body: { standardPrice, discountedPrice },
  });
}

export async function toggleExpertActive(
  expertId: string,
  isActive: boolean
): Promise<void> {
  const base = getOptionalApiBase();
  if (!base) return;

  await apiFetch<unknown>(`/admin/experts/${expertId}/active`, {
    method: "PATCH",
    body: { isActive },
  });
}

export async function toggleExpertPublish(
  expertId: string,
  isPublished: boolean
): Promise<void> {
  const base = getOptionalApiBase();
  if (!base) return;

  await apiFetch<unknown>(`/admin/experts/${expertId}/publish`, {
    method: "PATCH",
    body: { isPublished },
  });
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

  await apiFetch<unknown>(`/admin/experts/${expertId}/priority`, {
    method: "PATCH",
    body: { priorityScore },
  });
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

  return apiFetch<{ id: string; userId: string; email: string }>("/admin/experts", {
    method: "POST",
    body: payload,
  });
}
