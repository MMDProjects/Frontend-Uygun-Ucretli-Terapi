"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Bell } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { UzmanSidebar } from "@/features/uzman/components/uzman-sidebar";
import { UzmanAuthGuard } from "@/features/uzman/components/uzman-auth-guard";
import { MusaitlikModal } from "@/features/uzman/components/musaitlik-modal";
import { MOCK_NOTIFICATIONS } from "@/features/uzman/data/mock-uzman";

const PAGE_TITLES: Record<string, string> = {
  "/uzman/dashboard": "Kontrol Paneli",
  "/uzman/profil": "Profilim",
  "/uzman/belgeler": "Belgelerim",
  "/uzman/musaitlik": "Müsaitlik Takvimi",
  "/uzman/talepler": "Danışan Talepleri",
  "/uzman/blog": "Blog Yazılarım",
  "/uzman/bildirimler": "Bildirimler",
};

export function UzmanPanelShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const pageTitle = PAGE_TITLES[pathname] ?? "Uzman Paneli";
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length;

  return (
    <UzmanAuthGuard>
      <div className="flex h-screen overflow-hidden bg-[#f4f7f6]">
        <UzmanSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Panel top bar */}
          <header className="flex shrink-0 items-center justify-between border-b border-border/60 bg-white px-4 py-3 lg:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="flex size-9 items-center justify-center rounded-xl border border-border/60 bg-white text-muted-foreground transition hover:border-primary/30 hover:text-primary lg:hidden"
                aria-label="Menüyü aç"
              >
                <Menu className="size-4" />
              </button>
              <h1 className="text-base font-bold text-foreground">{pageTitle}</h1>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/uzman/bildirimler"
                className={cn(
                  "relative flex size-9 items-center justify-center rounded-xl border border-border/60 bg-white text-muted-foreground transition hover:border-primary/30 hover:text-primary",
                  pathname === "/uzman/bildirimler" &&
                    "border-primary/30 text-primary"
                )}
                aria-label={`Bildirimler${unreadCount > 0 ? ` (${unreadCount} okunmamış)` : ""}`}
              >
                <Bell className="size-4" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </Link>

              <Link
                href="/"
                target="_blank"
                className="hidden items-center gap-1.5 rounded-xl border border-border/60 bg-white px-3 py-2 text-xs font-medium text-muted-foreground transition hover:border-primary/30 hover:text-primary sm:flex"
              >
                Siteyi Görüntüle ↗
              </Link>
            </div>
          </header>

          {/* Scrollable content */}
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-5xl px-4 py-6 lg:px-6 lg:py-8">
              {children}
            </div>
          </main>
        </div>

        <MusaitlikModal />
      </div>
    </UzmanAuthGuard>
  );
}
