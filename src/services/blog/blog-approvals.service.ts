import { apiFetch } from "@/lib/api";
import { getOptionalApiBase } from "@/lib/http-client";
import { buildQuery, type Paginated } from "@/lib/pagination";
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
  } | null;
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
    authorName: blog.expertProfile?.user
      ? `${blog.expertProfile.user.firstName} ${blog.expertProfile.user.lastName}`.trim()
      : "Editör",
    submittedAt: blog.createdAt,
    status: blog.status === "REVIZE_GONDERILDI" ? "revised" : "pending",
  };
}

/**
 * Lists blog posts awaiting admin approval (ONAY_BEKLIYOR | REVIZE_GONDERILDI).
 * Kuyruk filtresi backend'de uygulanır (queue=approvals).
 */
export async function listPendingBlogApprovals(
  page = 1,
  limit = 20
): Promise<Paginated<BlogApprovalDto>> {
  const base = getOptionalApiBase();
  if (!base) return { data: [], total: 0, page, limit };

  const payload = await apiFetch<Paginated<BackendBlog>>(
    `/admin/blogs${buildQuery({ queue: "approvals", page, limit })}`
  );
  if (!Array.isArray(payload?.data)) {
    throw new Error("Blog onayları yüklenemedi: beklenmeyen sunucu yanıtı");
  }
  return {
    data: payload.data.map(mapToBlogApproval),
    total: payload.total ?? payload.data.length,
    page: payload.page ?? page,
    limit: payload.limit ?? limit,
  };
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
