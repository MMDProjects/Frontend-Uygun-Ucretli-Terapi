import type { AdminUserRole } from "@/types/dto/admin-user-list";

export const ADMIN_ROLE_LABELS: Record<AdminUserRole, string> = {
  admin: "Admin",
  personel: "Personel",
};

export const ADMIN_ROLE_COLORS: Record<
  AdminUserRole,
  { bg: string; text: string }
> = {
  admin: {
    bg: "bg-[#3178C6]/10",
    text: "text-[#3178C6]",
  },
  personel: {
    bg: "bg-[#24292E]/10",
    text: "text-[#24292E] dark:text-foreground",
  },
};
