"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { Info, AlertTriangle } from "lucide-react";
import { UzmanSidebar } from "@/features/uzman/components/uzman-sidebar";
import { UzmanAuthGuard } from "@/features/uzman/components/uzman-auth-guard";
import { DangerPanicOverlay } from "@/features/uzman/components/danger-panic-overlay";
import { subscribeToNotificationStream, getMyUzmanNotifications } from "@/lib/services/uzman.service";
import { getAccessToken } from "@/lib/auth-cookies";
import { useAuthStore } from "@/lib/stores/auth-store";

export function UzmanPanelShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [panicMessage, setPanicMessage] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) return;
    getMyUzmanNotifications()
      .then((notifs) => setUnreadCount(notifs.filter((n) => !n.isRead).length))
      .catch(() => {});
  }, [isAuthenticated]);

  // Bildirimler sayfasını ziyaret edince sayacı sıfırla
  useEffect(() => {
    if (pathname === "/uzman/bildirimler") {
      setUnreadCount(0);
    }
  }, [pathname]);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    const unsub = subscribeToNotificationStream((data) => {
      setUnreadCount((prev) => prev + 1);
      if (data.type === "DANGER_PANIC") {
        setPanicMessage(data.message);
      } else if (data.type === "WARNING") {
        toast.warning(data.message, {
          icon: <AlertTriangle className="size-4 text-amber-600" />,
          duration: 10000,
          description: "Admin uyarısı",
        });
      } else if (data.type === "INFO") {
        toast.info(data.message, {
          icon: <Info className="size-4 text-blue-600" />,
          duration: 5000,
          description: "Admin bildirimi",
        });
      }
    });
    return unsub;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <UzmanAuthGuard>
      <div className="flex h-screen overflow-hidden bg-muted">
        <UzmanSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} unreadNotifCount={unreadCount} />

        {sidebarOpen && (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            aria-label="Menuyu kapat"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>

        {panicMessage && (
          <DangerPanicOverlay
            message={panicMessage}
            onDismiss={() => setPanicMessage(null)}
          />
        )}
      </div>
    </UzmanAuthGuard>
  );
}
