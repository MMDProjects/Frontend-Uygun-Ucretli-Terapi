"use client";

import { Suspense, useState } from "react";
import { IncomingRequestsView } from "@/components/admin/incoming-requests-view";
import { PageHeader } from "@/features/admin/components/page-header";
import { cn } from "@/lib/utils";

type Tab = "bireysel" | "kurumsal";

const TABS: { label: string; value: Tab }[] = [
  { label: "İletişim Formları", value: "bireysel" },
  { label: "Kurumsal Formlar", value: "kurumsal" },
];

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden />
    </div>
  );
}

export default function GelenTaleplerPage() {
  const [activeTab, setActiveTab] = useState<Tab>("bireysel");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gelen Talepler"
        description="İletişim formları ve uzman görüşme taleplerini buradan yönetin."
      />

      {/* Underline tab stili */}
      <div className="border-b border-border/60">
        <nav className="flex gap-0">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "px-5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px",
                activeTab === tab.value
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === "bireysel" && (
        <Suspense fallback={<LoadingFallback />}>
          <IncomingRequestsView isCorporate={false} />
        </Suspense>
      )}

      {activeTab === "kurumsal" && (
        <Suspense fallback={<LoadingFallback />}>
          <IncomingRequestsView isCorporate={true} />
        </Suspense>
      )}

    </div>
  );
}
