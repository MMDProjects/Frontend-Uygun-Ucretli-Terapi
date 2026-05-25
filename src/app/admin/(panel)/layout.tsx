"use client";

import { useState } from "react";
import { AdminSidebar } from "@/features/admin/components/admin-sidebar";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
    </div>
  );
}
