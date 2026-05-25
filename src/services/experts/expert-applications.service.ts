import { getOptionalApiBase } from "@/lib/http-client";
import { getAccessToken } from "@/lib/auth-cookies";
import type { ExpertApplication } from "@/types/dto/expert-application";

interface BackendExpert {
  id: string;
  certificateUrl: string;
  cvUrl: string;
  status: string;
  createdAt: string;
  user: { firstName: string; lastName: string; email: string; phone: string };
}

function authHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? getAccessToken() : undefined;
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function mapToApplication(expert: BackendExpert): ExpertApplication {
  return {
    id: expert.id,
    firstName: expert.user.firstName,
    lastName: expert.user.lastName,
    phone: expert.user.phone ?? "",
    email: expert.user.email,
    submittedAt: expert.createdAt,
    status: "pending",
    certificateDocument: {
      fileName: expert.certificateUrl ? "sertifika.pdf" : "Belge eklenmemiş",
      url: expert.certificateUrl || undefined,
    },
    cvDocument: {
      fileName: expert.cvUrl ? "cv.pdf" : "Belge eklenmemiş",
      url: expert.cvUrl || undefined,
    },
  };
}

/**
 * Lists pending expert registration applications (status: ONAY_BEKLIYOR).
 */
export async function listExpertApplications(): Promise<ExpertApplication[]> {
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
      .filter((e) => e.status === "ONAY_BEKLIYOR")
      .map(mapToApplication);
  } catch {
    return [];
  }
}

/**
 * Approve: sets expert status to AKTIF.
 */
export async function approveExpertApplication(applicationId: string): Promise<void> {
  const base = getOptionalApiBase();
  if (!base) return;

  const res = await fetch(`${base}/admin/experts/${applicationId}/status`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ status: "AKTIF" }),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new Error(err?.message || res.statusText);
  }
}

/**
 * Reject: sets expert status to REDDEDILDI with admin note.
 */
export async function rejectExpertApplication(
  applicationId: string,
  rejectionReason: string
): Promise<void> {
  const base = getOptionalApiBase();
  if (!base) return;

  const res = await fetch(`${base}/admin/experts/${applicationId}/status`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ status: "REDDEDILDI", adminNote: rejectionReason }),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new Error(err?.message || res.statusText);
  }
}
