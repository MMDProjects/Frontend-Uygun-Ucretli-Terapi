import { getOptionalApiBase } from "@/lib/http-client";
import { getAccessToken } from "@/lib/auth-cookies";
import type { ExpertApplication } from "@/types/dto/expert-application";

interface BackendExpert {
  id: string;
  title: string;
  bio: string;
  education: string | null;
  certificateUrl: string;
  cvUrl: string;
  status: string;
  isPublished: boolean;
  createdAt: string;
  createdByAdmin: boolean;
  user: { firstName: string; lastName: string; email: string; phone: string };
  tags: { id: string; name: string }[];
  city?: string | null;
  district?: string | null;
  age?: number | null;
  gender?: string | null;
  website?: string | null;
  instagram?: string | null;
  experienceDuration?: string | null;
  registrationCertificates?: string | null;
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
  let parsedCerts: { ad: string; kurum: string }[] | undefined;
  if (expert.registrationCertificates) {
    try {
      parsedCerts = JSON.parse(expert.registrationCertificates) as { ad: string; kurum: string }[];
    } catch {
      parsedCerts = undefined;
    }
  }

  return {
    id: expert.id,
    firstName: expert.user.firstName,
    lastName: expert.user.lastName,
    phone: expert.user.phone ?? "",
    email: expert.user.email,
    submittedAt: expert.createdAt,
    status: "pending",
    title: expert.title || undefined,
    bio: expert.bio || undefined,
    education: expert.education || undefined,
    tags: expert.tags?.length ? expert.tags : undefined,
    certificateDocument: {
      fileName: expert.certificateUrl ? "sertifika.pdf" : "Belge eklenmemiş",
      url: expert.certificateUrl || undefined,
    },
    cvDocument: {
      fileName: expert.cvUrl ? "cv.pdf" : "Belge eklenmemiş",
      url: expert.cvUrl || undefined,
    },
    city: expert.city ?? undefined,
    district: expert.district ?? undefined,
    age: expert.age ?? undefined,
    gender: expert.gender ?? undefined,
    website: expert.website ?? undefined,
    instagram: expert.instagram ?? undefined,
    experienceDuration: expert.experienceDuration ?? undefined,
    registrationCertificates: parsedCerts,
  };
}

/**
 * Lists pending expert registration applications (status: ONAY_BEKLIYOR).
 */
export async function listExpertApplications(): Promise<ExpertApplication[]> {
  const base = getOptionalApiBase();
  if (!base) return [];

  const res = await fetch(`${base}/admin/experts?limit=100`, {
    method: "GET",
    headers: authHeaders(),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? `Uzman başvuruları yüklenemedi (${res.status})`);
  }
  const payload = (await res.json()) as { data: BackendExpert[] };
  if (!Array.isArray(payload?.data)) {
    throw new Error("Uzman başvuruları yüklenemedi: beklenmeyen sunucu yanıtı");
  }
  return payload.data
    .filter((e) => !e.isPublished && e.status === "ONAY_BEKLIYOR")
    .map(mapToApplication);
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
    body: JSON.stringify({ status: "YAYINDA" }),
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
