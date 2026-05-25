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
};

function mapContactForm(form: BackendContactForm): IncomingRequest {
  return {
    id: form.id,
    fullName: form.fullName,
    email: form.email,
    subject: SUBJECT_LABELS[form.subject] ?? form.subject,
    message: form.message,
    kvkkAccepted: true,
    createdAt: form.createdAt,
    status: "new",
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

/**
 * GET /admin/contact-forms
 */
export async function listIncomingRequests(
  accessToken?: string | null
): Promise<IncomingRequest[]> {
  const base = getOptionalApiBase();
  if (!base) return [];

  try {
    const headers = authHeaders();
    if (accessToken) {
      (headers as Record<string, string>).Authorization = `Bearer ${accessToken}`;
    }

    const res = await fetch(`${base}/admin/contact-forms?limit=100`, {
      method: "GET",
      headers,
    });
    if (!res.ok) return [];
    const payload: unknown = await res.json();
    const list = mapIncomingRequestsFromResponse(payload);
    return list;
  } catch {
    return [];
  }
}

/**
 * Contact forms are read-only in the backend — status changes are local UI only.
 */
export async function updateIncomingRequestStatus(
  _id: string,
  _status: IncomingRequestStatus,
  _accessToken?: string | null
): Promise<void> {
  // Contact form status is managed client-side only (no backend PATCH endpoint)
}
