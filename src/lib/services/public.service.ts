import { apiFetch } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ApiExpertSummary = {
  id: string;
  title: string;
  avatarUrl: string;
  bio: string;
  rating: number;
  standardPrice: string | null;
  discountedPrice: string | null;
  tags: { id: string; name: string }[];
  user: { firstName: string; lastName: string };
};

export type ApiExpertDetail = ApiExpertSummary & {
  education: string;
  cvUrl: string | null;
  certificateUrl: string | null;
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
  coverImageUrl?: string | null;
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

export type ApiExpertBlog = {
  id: string;
  slug: string;
  title: string;
  content: string;
  createdAt: string;
};

export async function getExpertBlogs(expertId: string): Promise<ApiExpertBlog[]> {
  return apiFetch(`/experts/${expertId}/blogs`);
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

export type ApiPricing = { standardPrice: number; discountedPrice: number };

export async function getPublicPricing(): Promise<ApiPricing> {
  return apiFetch("/packages/pricing");
}

// ─── Tests ───────────────────────────────────────────────────────────────────

export type ApiTest = {
  id: string;
  title: string;
  slug: string;
  description: string;
  isActive: boolean;
};

export async function getTests(): Promise<ApiTest[]> {
  return apiFetch("/tests");
}

// ─── Contact ─────────────────────────────────────────────────────────────────

export type ContactPayload = {
  fullName: string;
  email: string;
  phone: string;
  subject:
    | "SORU_SORUN"
    | "RANDEVU_OLUSTURUN"
    | "ONERI"
    | "SIKAYET"
    | "DIGER"
    | "KURUMSAL_DANISMANLIK"
    | "CALISAN_DESTEK_PROGRAMI"
    | "EGITIM_VE_ATOLYE"
    | "TEKLIF_TALEBI";
  message: string;
  isCorporate?: boolean;
  companyName?: string;
  employeeCount?: string;
  kvkkApproved?: boolean;
};

export async function submitContact(payload: ContactPayload): Promise<{ message: string; id: string }> {
  return apiFetch("/contact", { method: "POST", body: payload });
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

export async function subscribeNewsletter(email: string): Promise<{ message: string }> {
  return apiFetch("/newsletter/subscribe", { method: "POST", body: { email } });
}
