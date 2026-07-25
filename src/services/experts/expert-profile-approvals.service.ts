import { apiFetch } from "@/lib/api";
import { getOptionalApiBase } from "@/lib/http-client";
import type { ExpertProfileApproval } from "@/types/dto/expert-profile-approval";

interface BackendExpert {
  id: string;
  bio: string;
  title: string;
  education: string;
  avatarUrl: string | null;
  pendingAvatarUrl: string | null;
  pendingFirstName: string | null;
  pendingLastName: string | null;
  pendingBio: string | null;
  pendingTitle: string | null;
  pendingEducation: string | null;
  certificateUrl: string | null;
  cvUrl: string | null;
  pendingCertificateUrl: string | null;
  pendingCvUrl: string | null;
  status: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  user: { firstName: string; lastName: string; email: string; phone: string };
  tags: { id: string; name: string }[];
}

function mapToApproval(expert: BackendExpert): ExpertProfileApproval {
  const changedFields: string[] = [];
  if (expert.pendingAvatarUrl) changedFields.push("Profil Fotoğrafı");
  if (expert.pendingFirstName) changedFields.push("Ad");
  if (expert.pendingLastName) changedFields.push("Soyad");
  if (expert.pendingTitle) changedFields.push("Unvan");
  if (expert.pendingEducation) changedFields.push("Eğitim");
  if (expert.pendingBio) changedFields.push("Biyografi");
  if (expert.pendingCertificateUrl) changedFields.push("Sertifika");
  if (expert.pendingCvUrl) changedFields.push("CV");

  return {
    id: expert.id,
    expertId: expert.id,
    expertDisplayName: `${expert.user.firstName} ${expert.user.lastName}`.trim(),
    email: expert.user.email,
    submittedAt: expert.updatedAt ?? expert.createdAt,
    status: "pending",
    currentAvatarUrl: expert.avatarUrl ?? null,
    pendingAvatarUrl: expert.pendingAvatarUrl ?? null,
    currentFirstName: expert.user.firstName,
    currentLastName: expert.user.lastName,
    pendingFirstName: expert.pendingFirstName ?? null,
    pendingLastName: expert.pendingLastName ?? null,
    currentBiography: expert.bio,
    biography: expert.pendingBio ?? expert.bio,
    currentTitle: expert.title,
    pendingTitle: expert.pendingTitle ?? null,
    currentEducation: expert.education,
    pendingEducation: expert.pendingEducation ?? null,
    currentCertificateUrl: expert.certificateUrl ?? null,
    pendingCertificateUrl: expert.pendingCertificateUrl ?? null,
    currentCvUrl: expert.cvUrl ?? null,
    pendingCvUrl: expert.pendingCvUrl ?? null,
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

  const payload = await apiFetch<{ data: BackendExpert[] }>("/admin/experts?limit=100");
  if (!Array.isArray(payload?.data)) {
    throw new Error("Profil onayları yüklenemedi: beklenmeyen sunucu yanıtı");
  }
  // Profil Onayları kuyruğu: daha önce yayına alınmış (isPublished: true) uzmanların
  // profil/biyografi/belge güncellemeleri buraya düşer.
  // Yeni başvurular (isPublished: false, ONAY_BEKLIYOR) "Yeni Başvurular" kuyruğuna aittir.
  return payload.data
    .filter(
      (e) =>
        e.status === "REVIZE_GONDERILDI" || e.status === "PROFIL_GUNCELLENDI",
    )
    .map(mapToApproval);
}

/** Approve: sets expert status to AKTIF. */
export async function approveExpertProfileApproval(approvalId: string): Promise<void> {
  const base = getOptionalApiBase();
  if (!base) return;

  await apiFetch<unknown>(`/admin/experts/${approvalId}/status`, {
    method: "PATCH",
    body: { status: "YAYINDA" },
  });
}

/** Reject: sets expert status to REDDEDILDI with revision note. */
export async function rejectExpertProfileApproval(
  approvalId: string,
  revisionNote: string
): Promise<void> {
  const base = getOptionalApiBase();
  if (!base) return;

  await apiFetch<unknown>(`/admin/experts/${approvalId}/status`, {
    method: "PATCH",
    body: { status: "REDDEDILDI", adminNote: revisionNote },
  });
}
