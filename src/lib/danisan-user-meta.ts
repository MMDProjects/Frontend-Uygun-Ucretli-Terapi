import type { DanisanRole } from "@/types/dto/user-list";

export const ROLE_LABELS: Record<DanisanRole, string> = {
  danisan: "Danışan",
  premium_danisan: "Premium danışan",
  guest: "Misafir",
};

export const ROLE_COLORS: Record<
  DanisanRole,
  { bg: string; text: string }
> = {
  danisan: { bg: "bg-sky-100", text: "text-sky-900 dark:bg-sky-950/40 dark:text-sky-100" },
  premium_danisan: {
    bg: "bg-violet-100",
    text: "text-violet-900 dark:bg-violet-950/40 dark:text-violet-100",
  },
  guest: {
    bg: "bg-muted",
    text: "text-muted-foreground",
  },
};
