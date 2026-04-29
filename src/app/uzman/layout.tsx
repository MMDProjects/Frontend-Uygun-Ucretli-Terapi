"use client";

import { usePathname } from "next/navigation";
import { UzmanPanelShell } from "@/features/uzman";

const PANEL_PATHS = [
  "/uzman/dashboard",
  "/uzman/profil",
  "/uzman/belgeler",
  "/uzman/musaitlik",
  "/uzman/talepler",
  "/uzman/blog",
  "/uzman/bildirimler",
];

export default function UzmanLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPanelRoute = PANEL_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  if (!isPanelRoute) {
    return <>{children}</>;
  }

  return <UzmanPanelShell>{children}</UzmanPanelShell>;
}
