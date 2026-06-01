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

      <div className="flex gap-1 rounded-lg border border-border bg-muted/40 p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "rounded-md px-4 py-1.5 text-sm transition-colors",
              activeTab === tab.value
                ? "bg-white font-medium text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
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
