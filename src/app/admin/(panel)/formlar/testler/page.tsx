"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { TestsListView } from "@/components/admin/tests-list-view";
import { TestResultsView } from "@/components/admin/test-results-view";
import { PsychometricTestBuilderView } from "@/components/admin/psychometric-test-builder-view";
import { PageHeader } from "@/features/admin/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { usePsychometricTests } from "@/hooks/use-psychometric-tests";

type Tab = "testler" | "sonuclar" | "olusturucu";

const TABS: { label: string; value: Tab }[] = [
  { label: "Mevcut Testler", value: "testler" },
  { label: "Test Sonuçları", value: "sonuclar" },
  { label: "Test Oluşturucu", value: "olusturucu" },
];

export default function TestlerPage() {
  const [activeTab, setActiveTab] = useState<Tab>("testler");
  const [search, setSearch] = useState("");
  const [testFilter, setTestFilter] = useState("__all__");
  const { tests } = usePsychometricTests();

  return (
    <div className="space-y-5">
      <PageHeader
        title="Test Yönetimi"
        description="Psikometrik testleri inceleyin, sonuçları görüntüleyin ve yeni testler oluşturun."
      >
        {activeTab === "testler" && (
          <Input
            placeholder="Test ara…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-[260px]"
          />
        )}
        {activeTab === "sonuclar" && (
          <>
            <Select value={testFilter} onValueChange={(v) => setTestFilter(v ?? "__all__")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tüm testler" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Tüm testler</SelectItem>
                {tests.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="İsim veya e-posta..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[220px]"
            />
          </>
        )}
      </PageHeader>

      <div className="flex gap-1 rounded-lg border border-border bg-muted/40 p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => { setActiveTab(tab.value); setSearch(""); setTestFilter("__all__"); }}
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

      {activeTab === "testler" && (
        <TestsListView hideHeader externalSearch={search} />
      )}
      {activeTab === "sonuclar" && (
        <TestResultsView
          hideHeader
          externalTestFilter={testFilter}
          onTestFilterChange={setTestFilter}
          externalSearch={search}
          onSearchChange={setSearch}
        />
      )}
      {activeTab === "olusturucu" && <PsychometricTestBuilderView hideHeader />}
    </div>
  );
}
