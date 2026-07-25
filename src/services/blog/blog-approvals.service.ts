import { apiFetch } from "@/lib/api";
import { getOptionalApiBase } from "@/lib/http-client";
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

  const payload = await apiFetch<{ data: BackendBlog[] }>("/admin/blogs?limit=100");
  if (!Array.isArray(payload?.data)) {
    throw new Error("Blog onayları yüklenemedi: beklenmeyen sunucu yanıtı");
  }
  return payload.data
    .filter((b) => b.status === "ONAY_BEKLIYOR" || b.status === "REVIZE_GONDERILDI")
    .map(mapToBlogApproval);
}

/** Approve: sets blog status to AKTIF. */
export async function approveBlogApproval(postId: string): Promise<void> {
  const base = getOptionalApiBase();
  if (!base) return;

  await apiFetch<unknown>(`/admin/blogs/${postId}/status`, {
    method: "PATCH",
    body: { status: "YAYINDA" },
  });
}

/** Reject: sets blog status to REDDEDILDI with admin note. */
export async function rejectBlogApproval(
  postId: string,
  revisionNote: string
): Promise<void> {
  const base = getOptionalApiBase();
  if (!base) return;

  await apiFetch<unknown>(`/admin/blogs/${postId}/status`, {
    method: "PATCH",
    body: { status: "REDDEDILDI", adminNote: revisionNote },
  });
}

/** Edit blog content while keeping it pending. */
export async function submitAdminBlogRevision(
  postId: string,
  body: { title: string; excerpt: string; content: string }
): Promise<void> {
  const base = getOptionalApiBase();
  if (!base) return;

  await apiFetch<unknown>(`/admin/blogs/${postId}/content`, {
    method: "PATCH",
    body: { title: body.title, content: body.content },
  });
}
