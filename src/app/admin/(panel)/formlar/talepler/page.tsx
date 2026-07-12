"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, RefreshCw, X } from "lucide-react";
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const danisanEmail = searchParams.get("danisan");

  const [activeTab, setActiveTab] = useState<Tab>("bireysel");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<IncomingRequestStatus[]>([]);
  const filterCount = selectedStatuses.length;

  const clearDanisanFilter = () => router.push("/admin/formlar/talepler");

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

      {danisanEmail && (
        <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm">
          <span className="text-muted-foreground">Filtre:</span>
          <span className="font-medium text-foreground">{danisanEmail}</span>
          <span className="text-muted-foreground">e-postalı danışanın talepleri</span>
          <button
            type="button"
            onClick={clearDanisanFilter}
            className="ml-auto inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
          >
            <X className="size-3.5" />
            Filtreyi temizle
          </button>
        </div>
      )}

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
          filterEmail={danisanEmail}
        />
      )}

      {activeTab === "kurumsal" && (
        <IncomingRequestsView
          isCorporate={true}
          searchQuery={searchQuery}
          selectedStatuses={selectedStatuses}
          filterEmail={danisanEmail}
        />
      )}
    </div>
  );
}
