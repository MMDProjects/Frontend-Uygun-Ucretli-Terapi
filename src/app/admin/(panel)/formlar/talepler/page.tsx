"use client";

import { useState } from "react";
import { Filter, RefreshCw } from "lucide-react";
import { IncomingRequestsView } from "@/components/admin/incoming-requests-view";
import { PageHeader } from "@/features/admin/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { INCOMING_STATUS_LABELS, INCOMING_STATUS_ORDER } from "@/lib/incoming-request-meta";
import type { IncomingRequestStatus } from "@/types/dto/incoming-request";
import { cn } from "@/lib/utils";

type Tab = "bireysel" | "kurumsal";

const TABS: { label: string; value: Tab }[] = [
  { label: "İletişim Formları", value: "bireysel" },
  { label: "Kurumsal Formlar", value: "kurumsal" },
];

export default function GelenTaleplerPage() {
  const [activeTab, setActiveTab] = useState<Tab>("bireysel");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<IncomingRequestStatus[]>([]);
  const filterCount = selectedStatuses.length;

  const handleStatusToggle = (status: IncomingRequestStatus, checked: boolean) => {
    setSelectedStatuses((prev) =>
      checked ? [...prev, status] : prev.filter((s) => s !== status)
    );
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Gelen Talepler"
        description="İletişim formları ve uzman görüşme taleplerini buradan yönetin."
      >
        <Input
          placeholder="Ara (ad, e-posta, konu)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-[260px]"
        />
        <DropdownMenu>
          <DropdownMenuTrigger
            type="button"
            className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
          >
            <Filter className="size-4" />
            Durum
            {filterCount > 0 && (
              <Badge variant="secondary" className="rounded-full px-1.5">{filterCount}</Badge>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48" align="end">
            <DropdownMenuLabel>İşlem durumu</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {INCOMING_STATUS_ORDER.map((s) => (
              <DropdownMenuCheckboxItem
                key={s}
                checked={selectedStatuses.includes(s)}
                onCheckedChange={(checked) => handleStatusToggle(s, Boolean(checked))}
              >
                {INCOMING_STATUS_LABELS[s]}
              </DropdownMenuCheckboxItem>
            ))}
            {filterCount > 0 && (
              <>
                <DropdownMenuSeparator />
                <button
                  type="button"
                  className="w-full rounded-md px-1.5 py-1.5 text-left text-sm text-destructive hover:bg-destructive/10"
                  onClick={() => setSelectedStatuses([])}
                >
                  Filtreleri temizle
                </button>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </PageHeader>

      {/* Sekmeler */}
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
        <IncomingRequestsView
          isCorporate={false}
          searchQuery={searchQuery}
          selectedStatuses={selectedStatuses}
        />
      )}

      {activeTab === "kurumsal" && (
        <IncomingRequestsView
          isCorporate={true}
          searchQuery={searchQuery}
          selectedStatuses={selectedStatuses}
        />
      )}
    </div>
  );
}
