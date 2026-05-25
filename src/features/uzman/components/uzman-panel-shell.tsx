"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { UzmanSidebar } from "@/features/uzman/components/uzman-sidebar";
import { UzmanAuthGuard } from "@/features/uzman/components/uzman-auth-guard";
import { MusaitlikModal } from "@/features/uzman/components/musaitlik-modal";

export function UzmanPanelShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <UzmanAuthGuard>
      <div className="flex h-screen overflow-hidden bg-muted">
        <UzmanSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {sidebarOpen && (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            aria-label="Menuyu kapat"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>

        <MusaitlikModal />
      </div>
    </UzmanAuthGuard>
  );
}
