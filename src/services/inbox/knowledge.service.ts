import { apiFetch } from "@/lib/api";
import { buildQuery } from "./query";
import type {
  CreateKnowledgeInput,
  KnowledgeEntry,
  ListKnowledgeParams,
  ListUnansweredParams,
  Paginated,
  ResolveUnansweredInput,
  UnansweredQuestion,
  UnansweredResolved,
  UpdateKnowledgeInput,
} from "./types";

export function listUnanswered(
  params: ListUnansweredParams = {},
): Promise<Paginated<UnansweredQuestion>> {
  return apiFetch(`/admin/unanswered${buildQuery(params)}`);
}

export function resolveUnanswered(
  id: string,
  input: ResolveUnansweredInput,
): Promise<UnansweredResolved> {
  return apiFetch(`/admin/unanswered/${id}/resolve`, {
    method: "POST",
    body: input,
  });
}

export function dismissUnanswered(id: string): Promise<UnansweredResolved> {
  return apiFetch(`/admin/unanswered/${id}/dismiss`, { method: "POST" });
}

export function listKnowledge(
  params: ListKnowledgeParams = {},
): Promise<Paginated<KnowledgeEntry>> {
  return apiFetch(`/admin/knowledge${buildQuery(params)}`);
}

export function createKnowledge(input: CreateKnowledgeInput): Promise<KnowledgeEntry> {
  return apiFetch("/admin/knowledge", { method: "POST", body: input });
}

export function updateKnowledge(
  id: string,
  input: UpdateKnowledgeInput,
): Promise<KnowledgeEntry> {
  return apiFetch(`/admin/knowledge/${id}`, { method: "PATCH", body: input });
}

export function deleteKnowledge(id: string): Promise<{ ok: boolean }> {
  return apiFetch(`/admin/knowledge/${id}`, { method: "DELETE" });
}
