import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-cookies";

export type ForumAnswer = {
  content: string;
  createdAt: string;
  expertProfile: {
    title: string;
    avatarUrl: string | null;
    user: { firstName: string; lastName: string };
  };
};

export type ForumQuestion = {
  id: string;
  title: string;
  content: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  answers: ForumAnswer[];
};

export type ForumListResponse = {
  data: ForumQuestion[];
  total: number;
  page: number;
  limit: number;
};

export async function getForumQuestions(page = 1, limit = 15): Promise<ForumListResponse> {
  return apiFetch(`/forum/questions?page=${page}&limit=${limit}`);
}

export async function getForumQuestion(id: string): Promise<ForumQuestion> {
  return apiFetch(`/forum/questions/${id}`);
}

export async function createQuestion(dto: {
  title: string;
  content: string;
}): Promise<ForumQuestion> {
  const token = getAccessToken();
  return apiFetch("/forum/questions", { method: "POST", body: dto, token });
}

export type MyQuestion = {
  id: string;
  title: string;
  content: string;
  status: "ONAY_BEKLIYOR" | "ATANDI" | "CEVAPLANDI";
  createdAt: string;
};

export async function getMyQuestions(): Promise<MyQuestion[]> {
  const token = getAccessToken();
  return apiFetch("/forum/my-questions", { token });
}

export async function deleteQuestion(questionId: string): Promise<void> {
  const token = getAccessToken();
  await apiFetch(`/forum/questions/${questionId}`, { method: "DELETE", token });
}

export async function createAnswer(questionId: string, content: string): Promise<void> {
  const token = getAccessToken();
  await apiFetch(`/forum/questions/${questionId}/answers`, {
    method: "POST",
    body: { content },
    token,
  });
}

export type AssignedQuestion = {
  id: string;
  title: string;
  content: string;
  status: "ATANDI" | "CEVAPLANDI";
  createdAt: string;
  updatedAt: string;
};

export async function getAssignedQuestions(): Promise<AssignedQuestion[]> {
  const token = getAccessToken();
  return apiFetch("/forum/me/questions", { token });
}

export type AssignedQuestionDetail = {
  id: string;
  title: string;
  content: string;
  status: "ATANDI" | "CEVAPLANDI";
  createdAt: string;
  updatedAt: string;
  answers: {
    id: string;
    content: string;
    isApproved: boolean;
    createdAt: string;
    expertProfile: {
      title: string;
      avatarUrl: string | null;
      user: { firstName: string; lastName: string };
    };
  }[];
};

export async function getAssignedQuestionById(id: string): Promise<AssignedQuestionDetail> {
  const token = getAccessToken();
  return apiFetch(`/forum/me/questions/${id}`, { token });
}
