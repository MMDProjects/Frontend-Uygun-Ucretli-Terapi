"use client";

import { Suspense, useState } from "react";
import { IncomingRequestsView } from "@/components/admin/incoming-requests-view";
import { ExpertRequestsAdminView } from "@/components/admin/expert-requests-admin-view";
import { cn } from "@/lib/utils";

type Tab = "iletisim" | "uzman";

const TABS: { label: string; value: Tab; description: string }[] = [
  {
    label: "İletişim Formları",
    value: "iletisim",
    description: "Ziyaretçilerden gelen genel iletişim talepleri",
  },
  {
    label: "Uzman Talepleri",
    value: "uzman",
    description: "Danışanların uzmanlara gönderdiği görüşme talepleri",
  },
];

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-16">
      <div
        className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent"
        aria-hidden
      />
    </div>
  );
}

export default function GelenTaleplerPage() {
  const [activeTab, setActiveTab] = useState<Tab>("iletisim");

  return (
    <div className="space-y-6">
      {/* Sekme başlıkları */}
      <div className="flex flex-wrap gap-2 border-b border-border/60 pb-4">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-semibold transition",
              activeTab === tab.value
                ? "bg-primary text-white"
                : "border border-border/60 bg-white text-muted-foreground hover:border-primary/30 hover:text-primary"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground -mt-2">
        {TABS.find((t) => t.value === activeTab)?.description}
      </p>

      {activeTab === "iletisim" && (
        <Suspense fallback={<LoadingFallback />}>
          <IncomingRequestsView />
        </Suspense>
      )}

      {activeTab === "uzman" && (
        <Suspense fallback={<LoadingFallback />}>
          <ExpertRequestsAdminView />
        </Suspense>
      )}
    </div>
  );
}
