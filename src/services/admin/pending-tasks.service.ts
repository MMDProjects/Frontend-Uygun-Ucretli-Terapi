import { httpRequest } from "@/lib/http-client";
import type { PendingTaskDto } from "@/types/dto/pending-task";

interface DashboardResponse {
  pendingExperts: number;
  pendingProfileUpdates: number;
  pendingBlogs: number;
  pendingComments: number;
  pendingQuestions: number;
  newRequests: number;
  pendingForumAnswers: number;
  newTestResults: number;
}

function mapDashboardToTasks(d: DashboardResponse): PendingTaskDto[] {
  const all: PendingTaskDto[] = [
    {
      type: "uzman_basvuru",
      count: d.pendingExperts ?? 0,
      urgency: "high",
      href: "/admin/uzman-onay/basvurular",
      label: "Uzman onay bekliyor",
    },
    {
      type: "profil_guncelleme",
      count: d.pendingProfileUpdates ?? 0,
      urgency: "high",
      href: "/admin/uzman-onay/profil-onaylari",
      label: "Profil güncelleme onay bekliyor",
    },
    {
      type: "blog_onay",
      count: d.pendingBlogs ?? 0,
      urgency: "medium",
      href: "/admin/icerik/blog",
      label: "Blog yazısı incelemede",
    },
    {
      type: "yorum_onay",
      count: d.pendingComments ?? 0,
      urgency: "medium",
      href: "/admin/uzmanlar",
      label: "Bekleyen yorum",
    },
    {
      type: "yeni_talep",
      count: d.newRequests ?? 0,
      urgency: "medium",
      href: "/admin/formlar/talepler",
      label: "Yeni iletişim talebi",
    },
    {
      type: "forum_cevap_onay",
      count: (d.pendingForumAnswers ?? 0) + (d.pendingQuestions ?? 0),
      urgency: "low",
      href: "/admin/icerik/forum-sorulari",
      label: "Forum onay bekliyor",
    },
    {
      type: "yeni_test_sonucu",
      count: d.newTestResults ?? 0,
      urgency: "low",
      href: "/admin/formlar/testler",
      label: "Son 24 saatte test sonucu",
    },
  ];
  return all.filter((t) => t.count > 0);
}

export async function getPendingTasks(
  accessToken?: string | null
): Promise<PendingTaskDto[]> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) return [];

  const res = await httpRequest<DashboardResponse>("/admin/dashboard", {
    method: "GET",
    accessToken: accessToken ?? undefined,
  });
  return mapDashboardToTasks(res.data);
}
