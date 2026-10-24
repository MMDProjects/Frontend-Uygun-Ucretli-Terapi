"use client";

import { PageHeader } from "@/features/admin/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInboxCounts } from "@/hooks/use-inbox-counts";
import { EntriesPanel } from "./entries-panel";
import { UnansweredPanel } from "./unanswered-panel";

export function KnowledgeView() {
  const { counts } = useInboxCounts();
  const open = counts?.openUnanswered ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bilgi Bankası"
        description="Elif'in cevap verirken kullandığı bilgiler. Elif'in cevaplayamadığı sorular burada birikir; bir kez cevaplayıp eklediğinizde Elif bir dahakine bilir."
      />
      <Tabs defaultValue="unanswered">
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="unanswered" className="gap-2">
            Cevaplanamayan Sorular
            {open > 0 ? (
              <span className="rounded-full bg-primary px-1.5 text-xs font-semibold text-white">
                {open}
              </span>
            ) : null}
          </TabsTrigger>
          <TabsTrigger value="entries">Kayıtlar</TabsTrigger>
        </TabsList>
        <TabsContent value="unanswered" className="mt-4">
          <UnansweredPanel />
        </TabsContent>
        <TabsContent value="entries" className="mt-4">
          <EntriesPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
