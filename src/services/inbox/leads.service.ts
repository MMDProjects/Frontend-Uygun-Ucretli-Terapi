import { apiFetch } from "@/lib/api";
import { buildQuery } from "./query";
import type {
  Lead,
  LeadListItem,
  LeadStatus,
  ListLeadsParams,
  Paginated,
} from "./types";

export function listLeads(
  params: ListLeadsParams = {},
): Promise<Paginated<LeadListItem>> {
  return apiFetch(`/admin/leads${buildQuery(params)}`);
}

export function updateLeadStatus(id: string, status: LeadStatus): Promise<Lead> {
  return apiFetch(`/admin/leads/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
}
