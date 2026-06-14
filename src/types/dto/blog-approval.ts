export type BlogApprovalStatus = "pending" | "approved" | "rejected" | "revised";

export interface BlogApprovalDto {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  authorName: string;
  submittedAt: string;
  status: BlogApprovalStatus;
  coverImageUrl?: string | null;
}
