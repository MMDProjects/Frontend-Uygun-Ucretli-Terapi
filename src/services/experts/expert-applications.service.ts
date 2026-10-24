import { apiFetch } from "@/lib/api";
import { getOptionalApiBase } from "@/lib/http-client";
import { buildQuery, type Paginated } from "@/lib/pagination";
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
 * Lists pending expert registration applications (status: ONAY_BEKLIYOR, yayında değil).
 * Kuyruk filtresi backend'de uygulanır (queue=applications).
 */
export async function listExpertApplications(
  page = 1,
  limit = 20
): Promise<Paginated<ExpertApplication>> {
  const base = getOptionalApiBase();
  if (!base) return { data: [], total: 0, page, limit };

  const payload = await apiFetch<Paginated<BackendExpert>>(
    `/admin/experts${buildQuery({ queue: "applications", page, limit })}`
  );
  if (!Array.isArray(payload?.data)) {
    throw new Error("Uzman başvuruları yüklenemedi: beklenmeyen sunucu yanıtı");
  }
  return {
    data: payload.data.map(mapToApplication),
    total: payload.total ?? payload.data.length,
    page: payload.page ?? page,
    limit: payload.limit ?? limit,
  };
}

/**
 * Approve: sets expert status to AKTIF.
 */
export async function approveExpertApplication(applicationId: string): Promise<void> {
  const base = getOptionalApiBase();
  if (!base) return;

  await apiFetch<unknown>(`/admin/experts/${applicationId}/status`, {
    method: "PATCH",
    body: { status: "YAYINDA" },
  });
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

  await apiFetch<unknown>(`/admin/experts/${applicationId}/status`, {
    method: "PATCH",
    body: { status: "REDDEDILDI", adminNote: rejectionReason },
  });
}
