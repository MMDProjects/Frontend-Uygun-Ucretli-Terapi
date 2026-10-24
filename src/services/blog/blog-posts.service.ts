import { apiFetch } from "@/lib/api";
import { getOptionalApiBase } from "@/lib/http-client";
import { buildQuery, type Paginated } from "@/lib/pagination";
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
  } | null;
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
      (blog.expertProfile?.user
        ? `${blog.expertProfile.user.firstName} ${blog.expertProfile.user.lastName}`.trim()
        : "Editör"),
    publishedAt: blog.createdAt,
    status: mapStatus(blog.status),
  };
}

export async function listBlogPosts(
  page = 1,
  limit = 20
): Promise<Paginated<BlogPostDto>> {
  const base = getOptionalApiBase();
  if (!base) return { data: [], total: 0, page, limit };

  try {
    const payload = await apiFetch<Paginated<BackendBlog>>(
      `/admin/blogs${buildQuery({ status: "YAYINDA", page, limit })}`
    );
    if (!Array.isArray(payload?.data)) return { data: [], total: 0, page, limit };
    return {
      data: payload.data.map(mapToBlogPost),
      total: payload.total ?? payload.data.length,
      page: payload.page ?? page,
      limit: payload.limit ?? limit,
    };
  } catch {
    return { data: [], total: 0, page, limit };
  }
}
