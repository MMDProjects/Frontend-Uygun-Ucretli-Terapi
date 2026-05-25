/**
 * Pending expert registration application (public /uzman/kayit → admin queue).
 * Password is never part of this DTO.
 */

export type ExpertApplicationStatus = "pending" | "approved" | "rejected";

export interface ExpertApplicationDocument {
  fileName: string;
  /** Signed URL or path when backend provides it */
  url?: string;
}

export interface ExpertApplication {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  submittedAt: string;
  status: ExpertApplicationStatus;
  certificateDocument: ExpertApplicationDocument;
  cvDocument: ExpertApplicationDocument;
}
