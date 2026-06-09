import { getOptionalApiBase } from "@/lib/http-client";
import { getAccessToken } from "@/lib/auth-cookies";

export type AdminForumAnswer = {
  id: string;
  content: string;
  isApproved: boolean;
  createdAt: string;
  expertProfile: {
    id: string;
    title: string;
    user: { firstName: string; lastName: string };
  };
};

export type AdminForumQuestion = {
  id: string;
  title: string;
  content: string;
  status: "ONAY_BEKLIYOR" | "ATANDI" | "CEVAPLANDI";
  createdAt: string;
  expertProfileId: string | null;
  user: { firstName: string; lastName: string; email: string };
  answers: AdminForumAnswer[];
};

function authHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? getAccessToken() : undefined;
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function listAdminForumQuestions(
  status?: string
): Promise<AdminForumQuestion[]> {
  const base = getOptionalApiBase();
  if (!base) return [];

  try {
    const qs = status ? `?status=${status}` : "";
    const res = await fetch(`${base}/admin/forum/questions${qs}`, {
      headers: authHeaders(),
    });
    if (!res.ok) return [];
    const payload = (await res.json()) as
      | { data: AdminForumQuestion[] }
      | AdminForumQuestion[];
    return Array.isArray(payload) ? payload : (payload.data ?? []);
  } catch {
    return [];
  }
}

export async function assignForumQuestion(
  questionId: string,
  expertProfileId: string
): Promise<void> {
  const base = getOptionalApiBase();
  if (!base) throw new Error("API URL tanımlı değil");

  const res = await fetch(
    `${base}/admin/forum/questions/${questionId}/assign`,
    {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ expertProfileId }),
    }
  );
  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new Error(err?.message ?? res.statusText);
  }
}

export async function deleteAdminForumQuestion(questionId: string): Promise<void> {
  const base = getOptionalApiBase();
  if (!base) throw new Error("API URL tanımlı değil");

  const res = await fetch(`${base}/admin/forum/questions/${questionId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new Error(err?.message ?? res.statusText);
  }
}

export async function approveForumAnswer(answerId: string): Promise<void> {
  const base = getOptionalApiBase();
  if (!base) throw new Error("API URL tanımlı değil");

  const res = await fetch(`${base}/admin/forum/answers/${answerId}/approve`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new Error(err?.message ?? res.statusText);
  }
}
