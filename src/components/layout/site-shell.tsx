"use client";

import { usePathname } from "next/navigation";

import { FloatingSupportCluster } from "@/components/common/floating-support-cluster";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { FreeConsultationPopup } from "@/features/auth/components/free-consultation-popup";
import { DevAuthToggle } from "@/features/auth/components/dev-auth-toggle";

const UZMAN_PANEL_PREFIXES = [
  "/uzman/dashboard",
  "/uzman/profil",
  "/uzman/belgeler",
  "/uzman/musaitlik",
  "/uzman/talepler",
  "/uzman/blog",
  "/uzman/bildirimler",
];

function isUzmanPanel(pathname: string) {
  return UZMAN_PANEL_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (isUzmanPanel(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
      <FloatingSupportCluster />
      <FreeConsultationPopup />
      <DevAuthToggle />
    </div>
  );
}
