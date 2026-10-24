import { apiFetch } from "@/lib/api";
import { buildQuery } from "./query";
import type {
  Contact,
  ConversationBase,
  ConversationDetail,
  ConversationListItem,
  InboxCounts,
  InboxMessage,
  ListConversationsParams,
  ListMessagesParams,
  Paginated,
  UpdateContactInput,
} from "./types";

const BASE = "/admin/inbox";

export function listConversations(
  params: ListConversationsParams = {},
): Promise<Paginated<ConversationListItem>> {
  return apiFetch(`${BASE}/conversations${buildQuery(params)}`);
}

export function getConversation(id: string): Promise<ConversationDetail> {
  return apiFetch(`${BASE}/conversations/${id}`);
}

export function listMessages(
  id: string,
  params: ListMessagesParams = {},
): Promise<InboxMessage[]> {
  return apiFetch(`${BASE}/conversations/${id}/messages${buildQuery(params)}`);
}

export function sendMessage(id: string, content: string): Promise<InboxMessage> {
  return apiFetch(`${BASE}/conversations/${id}/messages`, {
    method: "POST",
    body: { content },
  });
}

export function takeoverConversation(id: string): Promise<ConversationBase> {
  return apiFetch(`${BASE}/conversations/${id}/takeover`, { method: "POST" });
}

export function handbackConversation(id: string): Promise<ConversationBase> {
  return apiFetch(`${BASE}/conversations/${id}/handback`, { method: "POST" });
}

export function closeConversation(id: string): Promise<ConversationBase> {
  return apiFetch(`${BASE}/conversations/${id}/close`, { method: "POST" });
}

export function updateContact(
  id: string,
  input: UpdateContactInput,
): Promise<Contact> {
  return apiFetch(`${BASE}/contacts/${id}`, { method: "PATCH", body: input });
}

export function getInboxCounts(): Promise<InboxCounts> {
  return apiFetch(`${BASE}/counts`);
}
