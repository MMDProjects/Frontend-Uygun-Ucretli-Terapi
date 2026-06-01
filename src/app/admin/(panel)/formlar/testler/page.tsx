"use client";

import { useState } from "react";
import { TestsListView } from "@/components/admin/tests-list-view";
import { TestResultsView } from "@/components/admin/test-results-view";
import { PsychometricTestBuilderView } from "@/components/admin/psychometric-test-builder-view";
import { PageHeader } from "@/features/admin/components/page-header";
import { cn } from "@/lib/utils";

type Tab = "testler" | "sonuclar" | "olusturucu";

const TABS: { label: string; value: Tab }[] = [
  { label: "Mevcut Testler", value: "testler" },
  { label: "Test Sonuçları", value: "sonuclar" },
  { label: "Test Oluşturucu", value: "olusturucu" },
];

export default function TestlerPage() {
  const [activeTab, setActiveTab] = useState<Tab>("testler");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Test Yönetimi"
        description="Psikometrik testleri inceleyin, sonuçları görüntüleyin ve yeni testler oluşturun."
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

      {activeTab === "testler" && <TestsListView hideHeader />}
      {activeTab === "sonuclar" && <TestResultsView hideHeader />}
      {activeTab === "olusturucu" && <PsychometricTestBuilderView hideHeader />}
    </div>
  );
}
