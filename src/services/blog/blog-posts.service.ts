import { getOptionalApiBase } from "@/lib/http-client";
import { getAccessToken } from "@/lib/auth-cookies";
import type { BlogPostDto } from "@/types/dto/blog-post";

interface BackendBlog {
  id: string;
  title: string;
  content: string;
  status: string;
  createdAt: string;
  expertProfile: {
    user: { firstName: string; lastName: string };
  };
}

function authHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? getAccessToken() : undefined;
  return {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
    expertName:
      `${blog.expertProfile.user.firstName} ${blog.expertProfile.user.lastName}`.trim(),
    publishedAt: blog.createdAt,
    status: mapStatus(blog.status),
  };
}

export async function listBlogPosts(): Promise<BlogPostDto[]> {
  const base = getOptionalApiBase();
  if (!base) return [];

  try {
    const res = await fetch(`${base}/admin/blogs?limit=100`, {
      headers: authHeaders(),
    });
    if (!res.ok) return [];
    const payload = (await res.json()) as { data: BackendBlog[] };
    if (!Array.isArray(payload?.data)) return [];
    return payload.data.map(mapToBlogPost);
  } catch {
    return [];
  }
}
