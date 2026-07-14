import { getOptionalApiBase } from "@/lib/http-client";
import { getAccessToken } from "@/lib/auth-cookies";
import type {
  IncomingRequest,
  IncomingRequestStatus,
} from "@/types/dto/incoming-request";

interface BackendContactForm {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isCorporate: boolean;
  companyName?: string;
  employeeCount?: string;
  kvkkApproved: boolean;
  status: "YENI" | "ISLEMDE" | "COZULDU";
  createdAt: string;
}

function authHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? getAccessToken() : undefined;
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

const SUBJECT_LABELS: Record<string, string> = {
  SORU_SORUN: "Soru / Sorun",
  RANDEVU_OLUSTURUN: "Randevu Oluşturun",
  ONERI: "Öneri",
  SIKAYET: "Şikayet",
  DIGER: "Diğer",
  KURUMSAL_DANISMANLIK: "Kurumsal Danışmanlık",
  CALISAN_DESTEK_PROGRAMI: "Çalışan Destek Programı",
  EGITIM_VE_ATOLYE: "Eğitim ve Atölye",
  TEKLIF_TALEBI: "Teklif Talebi",
};

const STATUS_MAP: Record<string, IncomingRequestStatus> = {
  YENI: "new",
  ISLEMDE: "in_progress",
  COZULDU: "resolved",
};

const STATUS_MAP_REVERSE: Record<IncomingRequestStatus, string> = {
  new: "YENI",
  in_progress: "ISLEMDE",
  resolved: "COZULDU",
};

function mapContactForm(form: BackendContactForm): IncomingRequest {
  return {
    id: form.id,
    fullName: form.fullName,
    email: form.email,
    phone: form.phone,
    subject: SUBJECT_LABELS[form.subject] ?? form.subject,
    message: form.message,
    kvkkAccepted: form.kvkkApproved,
    createdAt: form.createdAt,
    status: STATUS_MAP[form.status] ?? "new",
    isCorporate: form.isCorporate,
    companyName: form.companyName,
    employeeCount: form.employeeCount,
  };
}

export function mapIncomingRequestsFromResponse(
  payload: unknown
): IncomingRequest[] {
  if (!payload || typeof payload !== "object") return [];
  const p = payload as Record<string, unknown>;
  const arr = Array.isArray(p.data) ? (p.data as BackendContactForm[]) : [];
  return arr.map(mapContactForm);
}

export async function listIncomingRequests(
  accessToken?: string | null
): Promise<IncomingRequest[]> {
  const base = getOptionalApiBase();
  if (!base) return [];

  const headers = authHeaders();
  if (accessToken) {
    (headers as Record<string, string>).Authorization = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${base}/admin/contact-forms?limit=100`, {
    method: "GET",
    headers,
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? `Talepler yüklenemedi (${res.status})`);
  }
  const payload: unknown = await res.json();
  return mapIncomingRequestsFromResponse(payload);
}

export async function updateIncomingRequestStatus(
  id: string,
  status: IncomingRequestStatus,
  accessToken?: string | null
): Promise<void> {
  const base = getOptionalApiBase();
  if (!base) return;

  const headers = authHeaders();
  if (accessToken) {
    (headers as Record<string, string>).Authorization = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${base}/admin/contact-forms/${id}/status`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ status: STATUS_MAP_REVERSE[status] }),
  });

  if (!res.ok) throw new Error("Durum güncellenemedi");
}
