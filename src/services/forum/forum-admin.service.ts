import { apiFetch } from "@/lib/api";
import { getOptionalApiBase } from "@/lib/http-client";

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

export async function listAdminForumQuestions(
  status?: string
): Promise<AdminForumQuestion[]> {
  const base = getOptionalApiBase();
  if (!base) return [];

  const qs = status ? `?status=${status}` : "";
  const payload = await apiFetch<{ data: AdminForumQuestion[] } | AdminForumQuestion[]>(
    `/admin/forum/questions${qs}`
  );
  return Array.isArray(payload) ? payload : (payload.data ?? []);
}

export async function assignForumQuestion(
  questionId: string,
  expertProfileId: string
): Promise<void> {
  const base = getOptionalApiBase();
  if (!base) throw new Error("API URL tanımlı değil");

  await apiFetch<unknown>(`/admin/forum/questions/${questionId}/assign`, {
    method: "PATCH",
    body: { expertProfileId },
  });
}

export async function deleteAdminForumQuestion(questionId: string): Promise<void> {
  const base = getOptionalApiBase();
  if (!base) throw new Error("API URL tanımlı değil");

  await apiFetch<unknown>(`/admin/forum/questions/${questionId}`, {
    method: "DELETE",
  });
}

export async function approveForumAnswer(answerId: string): Promise<void> {
  const base = getOptionalApiBase();
  if (!base) throw new Error("API URL tanımlı değil");

  await apiFetch<unknown>(`/admin/forum/answers/${answerId}/approve`, {
    method: "PATCH",
  });
}
