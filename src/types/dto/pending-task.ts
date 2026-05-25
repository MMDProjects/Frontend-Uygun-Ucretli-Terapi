export type PendingTaskType =
  | "uzman_basvuru"
  | "profil_guncelleme"
  | "blog_onay"
  | "yeni_talep";

export type TaskUrgency = "high" | "medium" | "low";

export interface PendingTaskDto {
  type: PendingTaskType;
  count: number;
  urgency: TaskUrgency;
  href: string;
  label: string;
}
