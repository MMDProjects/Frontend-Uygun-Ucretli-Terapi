export type PendingTaskType =
  | "uzman_basvuru"
  | "profil_guncelleme"
  | "blog_onay"
  | "yeni_talep"
  | "forum_cevap_onay"
  | "yorum_onay"
  | "yeni_test_sonucu";

export type TaskUrgency = "high" | "medium" | "low";

export interface PendingTaskDto {
  type: PendingTaskType;
  count: number;
  urgency: TaskUrgency;
  href: string;
  label: string;
}
