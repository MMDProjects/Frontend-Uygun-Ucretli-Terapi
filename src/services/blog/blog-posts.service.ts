import { apiFetch } from "@/lib/api";
import { getOptionalApiBase } from "@/lib/http-client";
import type { BlogPostDto } from "@/types/dto/blog-post";

interface BackendBlog {
  id: string;
  title: string;
  content: string;
  coverImageUrl?: string | null;
  authorName?: string | null;
  status: string;
  createdAt: string;
  expertProfile: {
    user: { firstName: string; lastName: string };
  };
}

function mapStatus(s: string): BlogPostDto["status"] {
  return s === "YAYINDA" ? "published" : "draft";
}

function mapToBlogPost(blog: BackendBlog): BlogPostDto {
  const excerpt =
    blog.content.length > 200 ? blog.content.slice(0, 200) + "…" : blog.content;
  return {
    id: blog.id,
    title: blog.title,
    excerpt,
    content: blog.content,
    coverImageUrl: blog.coverImageUrl ?? null,
    expertName:
      blog.authorName?.trim() ||
      `${blog.expertProfile.user.firstName} ${blog.expertProfile.user.lastName}`.trim(),
    publishedAt: blog.createdAt,
    status: mapStatus(blog.status),
  };
}

export async function listBlogPosts(): Promise<BlogPostDto[]> {
  const base = getOptionalApiBase();
  if (!base) return [];

  try {
    const payload = await apiFetch<{ data: BackendBlog[] }>("/admin/blogs?limit=100");
    if (!Array.isArray(payload?.data)) return [];
    return payload.data
      .filter((b) => b.status === "YAYINDA")
      .map(mapToBlogPost);
  } catch {
    return [];
  }
}
