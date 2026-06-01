"use client";

import { useState } from "react";
import { BlogPostsView } from "@/components/admin/blog-posts-view";
import { BlogApprovalsView } from "@/components/admin/blog-approvals-view";
import { PageHeader } from "@/features/admin/components/page-header";
import { cn } from "@/lib/utils";

type Tab = "yazilar" | "onaylar";

const TABS: { label: string; value: Tab }[] = [
  { label: "Blog Yazıları", value: "yazilar" },
  { label: "Onay Bekleyenler", value: "onaylar" },
];

export default function BlogPage() {
  const [activeTab, setActiveTab] = useState<Tab>("yazilar");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blog Yönetimi"
        description="Uzman blog yazılarını inceleyin ve onay bekleyenleri yönetin."
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

      {activeTab === "yazilar" && <BlogPostsView hideHeader />}
      {activeTab === "onaylar" && <BlogApprovalsView hideHeader />}
    </div>
  );
}
