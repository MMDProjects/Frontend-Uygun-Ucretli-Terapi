/**
 * Pending profile change for an already-approved expert (case brief R20).
 * Published profile stays live until this revision is approved.
 */

export type ExpertProfileApprovalStatus = "pending" | "approved" | "rejected";

export interface ExpertProfileApproval {
  id: string;
  /** Expert user / profile entity id from backend */
  expertId: string;
  expertDisplayName: string;
  email: string;
  submittedAt: string;
  status: ExpertProfileApprovalStatus;
  /** Proposed biography (word limits enforced on public site) */
  biography: string;
  keywords: string[];
  /** Human-readable list e.g. "Biyografi, fotoğraf" */
  changedFieldsSummary: string;
}
