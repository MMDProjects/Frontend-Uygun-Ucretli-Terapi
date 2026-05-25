import { apiFetch } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ApiExpertSummary = {
  id: string;
  title: string;
  avatarUrl: string;
  bio: string;
  rating: number;
  tags: { id: string; name: string }[];
  user: { firstName: string; lastName: string };
};

export type ApiExpertDetail = ApiExpertSummary & {
  education: string;
  availabilities: { dayOfWeek: number; startTime: string; endTime: string }[];
};

export type ApiExpertListResponse = {
  data: ApiExpertSummary[];
  total: number;
  page: number;
  limit: number;
};

export type ApiTag = { id: string; name: string; isActive: boolean };

export type ApiBlog = {
  id: string;
  slug: string;
  title: string;
  content: string;
  createdAt: string;
  expertProfile: {
    title: string;
    user: { firstName: string; lastName: string };
  };
};

export type ApiBlogListResponse = {
  data: ApiBlog[];
  total: number;
  page: number;
  limit: number;
};

export type ApiSss = {
  id: string;
  question: string;
  answer: string;
  page: "GENEL" | "TESTLER" | "PAKETLER";
  order: number;
};

export type ApiPackage = {
  id: string;
  name: string;
  sessionCount: number;
  price: string;
  description: string;
};

// ─── Experts ─────────────────────────────────────────────────────────────────

export async function getExperts(params?: {
  tags?: string;
  page?: number;
  limit?: number;
}): Promise<ApiExpertListResponse> {
  const qs = new URLSearchParams();
  if (params?.tags) qs.set("tags", params.tags);
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  const query = qs.toString() ? `?${qs.toString()}` : "";
  return apiFetch(`/experts${query}`);
}

export async function getExpert(id: string): Promise<ApiExpertDetail> {
  return apiFetch(`/experts/${id}`);
}

export async function getTags(): Promise<ApiTag[]> {
  return apiFetch("/admin/tags");
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export async function getBlogs(page = 1, limit = 12): Promise<ApiBlogListResponse> {
  return apiFetch(`/blogs?page=${page}&limit=${limit}`);
}

export async function getBlog(slug: string): Promise<ApiBlog> {
  return apiFetch(`/blogs/${slug}`);
}

// ─── SSS ─────────────────────────────────────────────────────────────────────

export async function getSss(page?: "GENEL" | "TESTLER" | "PAKETLER"): Promise<ApiSss[]> {
  const query = page ? `?page=${page}` : "";
  return apiFetch(`/sss${query}`);
}

// ─── Packages ────────────────────────────────────────────────────────────────

export async function getPackages(): Promise<ApiPackage[]> {
  return apiFetch("/packages");
}

// ─── Contact ─────────────────────────────────────────────────────────────────

export type ContactPayload = {
  fullName: string;
  email: string;
  phone: string;
  subject: "SORU_SORUN" | "RANDEVU_OLUSTURUN" | "ONERI" | "SIKAYET" | "DIGER";
  message: string;
  isCorporate?: boolean;
  companyName?: string;
  employeeCount?: string;
};

export async function submitContact(payload: ContactPayload): Promise<{ message: string; id: string }> {
  return apiFetch("/contact", { method: "POST", body: payload });
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

export async function subscribeNewsletter(email: string): Promise<{ message: string }> {
  return apiFetch("/newsletter/subscribe", { method: "POST", body: { email } });
}
