export type IncomingRequestStatus = "new" | "in_progress" | "resolved";

export interface IncomingRequest {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  kvkkAccepted: boolean;
  createdAt: string;
  status: IncomingRequestStatus;
  /** Optional link to a danışan user for deep links from admin. */
  danisanId?: string;
}
