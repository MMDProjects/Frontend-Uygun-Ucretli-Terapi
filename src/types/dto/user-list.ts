/** Psychologist platform client roles (extend when backend is fixed). */
export type DanisanRole = "danisan" | "premium_danisan" | "guest";

export type UserListStatus = "active" | "inactive";

export interface DanisanUser {
  id: string;
  name: string;
  email: string;
  role: DanisanRole;
  status: UserListStatus;
  /** ISO or display string from API */
  registeredAt?: string;
  isLoading?: boolean;
}
