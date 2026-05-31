export type ExpertStatus = "active" | "inactive";

export interface ExpertListItem {
  id: string;
  fullName: string;
  email: string;
  status: ExpertStatus;
  registeredAt?: string;
  /** Higher values surface the expert earlier in listings (admin-controlled). */
  priorityScore?: number;
  /** Whether the expert is visible on the public /uzmanlar page. */
  isPublished: boolean;
}

export interface ExpertDocument {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
}

export interface ExpertDetail extends ExpertListItem {
  biography: string;
  pendingBiography: string | null;
  keywords: string[];
  specialties: string[];
  documents: ExpertDocument[];
}
