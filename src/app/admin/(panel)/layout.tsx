"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/features/admin/components/admin-sidebar";
import { AdminTopBar } from "@/features/admin/components/admin-topbar";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useAdminNotificationStore } from "@/lib/stores/admin-notification-store";
import { subscribeToNotificationStream } from "@/lib/services/admin.service";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, role } = useAuthStore();
  const { addNotification } = useAdminNotificationStore();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || role !== "admin") {
      router.replace("/admin/giris");
    }
  }, [isAuthenticated, isLoading, role, router]);

  useEffect(() => {
    if (!isAuthenticated || role !== "admin") return;
    const unsubscribe = subscribeToNotificationStream((data) => {
      addNotification({
        id: data.id,
        message: data.message,
        type: data.type,
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    });
    return () => unsubscribe();
  }, [isAuthenticated, role, addNotification]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-muted">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated || role !== "admin") {
    return (
      <div className="flex h-screen items-center justify-center bg-muted">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-muted">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 shadow-lg transition-transform duration-200",
          "md:relative md:z-0 md:shadow-none md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <AdminSidebar />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          aria-label="Menuyu kapat"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
