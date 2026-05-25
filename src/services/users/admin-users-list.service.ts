import type { AdminUser } from "@/types/dto/admin-user-list";

export const MOCK_ADMIN_USERS: AdminUser[] = [
  {
    id: "A-101",
    fullName: "Merve Aydın",
    email: "merve.aydin@psikolog.com",
    role: "admin",
    status: "active",
    createdAt: "2025-03-12",
  },
  {
    id: "P-204",
    fullName: "Emre Yıldız",
    email: "emre.yildiz@psikolog.com",
    role: "personel",
    status: "active",
    createdAt: "2025-07-01",
  },
  {
    id: "P-319",
    fullName: "Selin Kurt",
    email: "selin.kurt@psikolog.com",
    role: "personel",
    status: "inactive",
    createdAt: "2024-11-21",
  },
];

/**
 * Returns admin/personnel user list for UI scaffolding.
 * TODO: Replace mock with real endpoint integration when API contract is finalized.
 */
export async function listAdminUsers(): Promise<AdminUser[]> {
  return Promise.resolve(MOCK_ADMIN_USERS);
}
