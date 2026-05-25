export type BlogApprovalStatus = "pending" | "approved" | "rejected";

export interface BlogApprovalDto {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  authorName: string;
  submittedAt: string;
  status: BlogApprovalStatus;
}
