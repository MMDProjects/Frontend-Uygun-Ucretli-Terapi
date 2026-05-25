export type AdminUserRole = "admin" | "personel";

export type AdminUserStatus = "active" | "inactive";

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  createdAt?: string;
}
