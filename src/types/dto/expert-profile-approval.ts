/**
 * Pending profile change for an already-approved expert (case brief R20).
 * Published profile stays live until this revision is approved.
 */

export type ExpertProfileApprovalStatus = "pending" | "approved" | "rejected";

export interface ExpertProfileApproval {
  id: string;
  expertId: string;
  expertDisplayName: string;
  email: string;
  submittedAt: string;
  status: ExpertProfileApprovalStatus;
  currentFirstName: string;
  currentLastName: string;
  pendingFirstName: string | null;
  pendingLastName: string | null;
  currentBiography: string;
  biography: string;
  currentTitle: string;
  pendingTitle: string | null;
  currentEducation: string;
  pendingEducation: string | null;
  keywords: string[];
  changedFieldsSummary: string;
}
