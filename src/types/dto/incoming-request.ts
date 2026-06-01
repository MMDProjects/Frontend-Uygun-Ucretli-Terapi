export type IncomingRequestStatus = "new" | "in_progress" | "resolved";

export interface IncomingRequest {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  kvkkAccepted: boolean;
  createdAt: string;
  status: IncomingRequestStatus;
  isCorporate: boolean;
  companyName?: string;
  employeeCount?: string;
  danisanId?: string;
}
