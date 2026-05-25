import { httpRequest } from "@/lib/http-client";
import type { PendingTaskDto } from "@/types/dto/pending-task";

interface DashboardResponse {
  pendingExperts: number;
  pendingBlogs: number;
  pendingComments: number;
  pendingQuestions: number;
  newRequests: number;
}

function mapDashboardToTasks(d: DashboardResponse): PendingTaskDto[] {
  const all: PendingTaskDto[] = [
    {
      type: "uzman_basvuru",
      count: d.pendingExperts,
      urgency: "high",
      href: "/admin/uzman-onay/basvurular",
      label: "Uzman onay bekliyor",
    },
    {
      type: "blog_onay",
      count: d.pendingBlogs,
      urgency: "low",
      href: "/admin/icerik/blog-onaylari",
      label: "Blog yazısı incelemede",
    },
    {
      type: "yeni_talep",
      count: d.newRequests,
      urgency: "medium",
      href: "/admin/formlar/talepler",
      label: "Yeni danışan talebi",
    },
  ];
  return all.filter((t) => t.count > 0);
}

/**
 * Fetches pending admin tasks from the dashboard endpoint.
 */
export async function getPendingTasks(
  accessToken?: string | null
): Promise<PendingTaskDto[]> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    return [];
  }

  const res = await httpRequest<DashboardResponse>("/admin/dashboard", {
    method: "GET",
    accessToken: accessToken ?? undefined,
  });
  return mapDashboardToTasks(res.data);
}
