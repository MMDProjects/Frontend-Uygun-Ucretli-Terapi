export type BlogPostStatus = "published" | "draft";

export interface BlogPostDto {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  expertName: string;
  publishedAt: string;
  status: BlogPostStatus;
}
