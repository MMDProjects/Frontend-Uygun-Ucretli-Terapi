import type { IncomingRequestStatus } from "@/types/dto/incoming-request";

export const INCOMING_STATUS_LABELS: Record<IncomingRequestStatus, string> = {
  new: "Yeni",
  in_progress: "İşlemde",
  resolved: "Çözüldü",
};

export const INCOMING_STATUS_ORDER: IncomingRequestStatus[] = [
  "new",
  "in_progress",
  "resolved",
];
