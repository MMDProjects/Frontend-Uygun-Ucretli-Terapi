import { getOptionalApiBase } from "@/lib/http-client";
import { getAccessToken } from "@/lib/auth-cookies";
import type { ExpertProfileApproval } from "@/types/dto/expert-profile-approval";

interface BackendExpert {
  id: string;
  bio: string;
  title: string;
  education: string;
  pendingBio: string | null;
  pendingTitle: string | null;
  pendingEducation: string | null;
  pendingCertificateUrl: string | null;
  pendingCvUrl: string | null;
  status: string;
  isPublished: boolean;
  createdAt: string;
  user: { firstName: string; lastName: string; email: string; phone: string };
  tags: { id: string; name: string }[];
}

function authHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? getAccessToken() : undefined;
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function mapToApproval(expert: BackendExpert): ExpertProfileApproval {
  const changedFields: string[] = [];
  if (expert.pendingTitle) changedFields.push("Unvan");
  if (expert.pendingEducation) changedFields.push("Eğitim");
  if (expert.pendingBio) changedFields.push("Biyografi");
  if (expert.pendingCertificateUrl) changedFields.push("Sertifika");
  if (expert.pendingCvUrl) changedFields.push("CV");

  return {
    id: expert.id,
    expertId: expert.id,
    expertDisplayName:
      `${expert.user.firstName} ${expert.user.lastName}`.trim(),
    email: expert.user.email,
    submittedAt: expert.createdAt,
    status: "pending",
    currentBiography: expert.bio,
    biography: expert.pendingBio ?? expert.bio,
    currentTitle: expert.title,
    pendingTitle: expert.pendingTitle ?? null,
    currentEducation: expert.education,
    pendingEducation: expert.pendingEducation ?? null,
    keywords: expert.tags.map((t) => t.name),
    changedFieldsSummary: changedFields.join(", ") || "Profil güncelleme",
  };
}

/**
 * Lists expert profiles awaiting admin approval (status: ONAY_BEKLIYOR).
 */
export async function listExpertProfileApprovals(): Promise<ExpertProfileApproval[]> {
  const base = getOptionalApiBase();
  if (!base) return [];

  try {
    const res = await fetch(`${base}/admin/experts?limit=100`, {
      method: "GET",
      headers: authHeaders(),
    });
    if (!res.ok) return [];
    const payload = (await res.json()) as { data: BackendExpert[] };
    if (!Array.isArray(payload?.data)) return [];
    return payload.data
      .filter(
        (e) =>
          (e.status === "ONAY_BEKLIYOR" || e.status === "REVIZE_GONDERILDI") &&
          e.isPublished === true,
      )
      .map(mapToApproval);
  } catch {
    return [];
  }
}

/** Approve: sets expert status to AKTIF. */
export async function approveExpertProfileApproval(approvalId: string): Promise<void> {
  const base = getOptionalApiBase();
  if (!base) return;

  const res = await fetch(`${base}/admin/experts/${approvalId}/status`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ status: "YAYINDA" }),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new Error(err?.message || res.statusText);
  }
}

/** Reject: sets expert status to REDDEDILDI with revision note. */
export async function rejectExpertProfileApproval(
  approvalId: string,
  revisionNote: string
): Promise<void> {
  const base = getOptionalApiBase();
  if (!base) return;

  const res = await fetch(`${base}/admin/experts/${approvalId}/status`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ status: "REDDEDILDI", adminNote: revisionNote }),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new Error(err?.message || res.statusText);
  }
}
