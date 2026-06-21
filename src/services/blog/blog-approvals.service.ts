import { getOptionalApiBase } from "@/lib/http-client";
import { getAccessToken } from "@/lib/auth-cookies";
import type { BlogApprovalDto } from "@/types/dto/blog-approval";

interface BackendBlog {
  id: string;
  title: string;
  content: string;
  coverImageUrl?: string | null;
  status: string;
  adminNote: string | null;
  createdAt: string;
  expertProfile: {
    user: { firstName: string; lastName: string };
  };
}

function authHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? getAccessToken() : undefined;
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function mapToBlogApproval(blog: BackendBlog): BlogApprovalDto {
  const excerpt =
    blog.content.length > 200
      ? blog.content.slice(0, 200) + "…"
      : blog.content;
  return {
    id: blog.id,
    title: blog.title,
    excerpt,
    content: blog.content,
    coverImageUrl: blog.coverImageUrl ?? null,
    authorName:
      `${blog.expertProfile.user.firstName} ${blog.expertProfile.user.lastName}`.trim(),
    submittedAt: blog.createdAt,
    status: blog.status === "REVIZE_GONDERILDI" ? "revised" : "pending",
  };
}

/**
 * Lists blog posts awaiting admin approval (status: ONAY_BEKLIYOR).
 */
export async function listPendingBlogApprovals(): Promise<BlogApprovalDto[]> {
  const base = getOptionalApiBase();
  if (!base) return [];

  try {
    const res = await fetch(`${base}/admin/blogs?limit=100`, {
      method: "GET",
      headers: authHeaders(),
    });
    if (!res.ok) return [];
    const payload = (await res.json()) as { data: BackendBlog[] };
    if (!Array.isArray(payload?.data)) return [];
    return payload.data
      .filter((b) => b.status === "ONAY_BEKLIYOR" || b.status === "REVIZE_GONDERILDI")
      .map(mapToBlogApproval);
  } catch {
    return [];
  }
}

/** Approve: sets blog status to AKTIF. */
export async function approveBlogApproval(postId: string): Promise<void> {
  const base = getOptionalApiBase();
  if (!base) return;

  const res = await fetch(`${base}/admin/blogs/${postId}/status`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ status: "YAYINDA" }),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new Error(err?.message || res.statusText);
  }
}

/** Reject: sets blog status to REDDEDILDI with admin note. */
export async function rejectBlogApproval(
  postId: string,
  revisionNote: string
): Promise<void> {
  const base = getOptionalApiBase();
  if (!base) return;

  const res = await fetch(`${base}/admin/blogs/${postId}/status`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ status: "REDDEDILDI", adminNote: revisionNote }),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new Error(err?.message || res.statusText);
  }
}

/** Edit blog content while keeping it pending. */
export async function submitAdminBlogRevision(
  postId: string,
  body: { title: string; excerpt: string; content: string }
): Promise<void> {
  const base = getOptionalApiBase();
  if (!base) return;

  const res = await fetch(`${base}/admin/blogs/${postId}/content`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ title: body.title, content: body.content }),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new Error(err?.message || res.statusText);
  }
}
