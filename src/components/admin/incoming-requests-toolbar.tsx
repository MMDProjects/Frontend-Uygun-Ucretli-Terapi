"use client";

import { Filter, RefreshCw } from "lucide-react";
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
import { INCOMING_STATUS_LABELS } from "@/lib/incoming-request-meta";
import type { IncomingRequestStatus } from "@/types/dto/incoming-request";
import { cn } from "@/lib/utils";

const STATUSES: IncomingRequestStatus[] = ["new", "in_progress", "resolved"];

interface IncomingRequestsToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedStatuses: IncomingRequestStatus[];
  onStatusToggle: (status: IncomingRequestStatus, checked: boolean) => void;
  onClearFilters: () => void;
  onRefresh: () => void;
  loading: boolean;
  danisanFilterId: string | null;
}

export function IncomingRequestsToolbar({
  searchQuery,
  onSearchChange,
  selectedStatuses,
  onStatusToggle,
  onClearFilters,
  onRefresh,
  loading,
}: IncomingRequestsToolbarProps) {
  const filterCount = selectedStatuses.length;

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center justify-end">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          placeholder="Ara (ad, e-posta, konu)..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full md:w-[300px]"
          aria-label="Talep ara"
        />
        <DropdownMenu>
          <DropdownMenuTrigger
            type="button"
            className={cn(
              buttonVariants({ variant: "outline", size: "default" }),
              "gap-2"
            )}
          >
            <Filter className="size-4" />
            Durum
            {filterCount > 0 ? (
              <Badge variant="secondary" className="rounded-full px-1.5">
                {filterCount}
              </Badge>
            ) : null}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>Islem durumu</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {STATUSES.map((status) => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={selectedStatuses.includes(status)}
                onCheckedChange={(checked) =>
                  onStatusToggle(status, Boolean(checked))
                }
              >
                {INCOMING_STATUS_LABELS[status]}
              </DropdownMenuCheckboxItem>
            ))}
            {filterCount > 0 ? (
              <>
                <DropdownMenuSeparator />
                <button
                  type="button"
                  className="w-full rounded-md px-1.5 py-1.5 text-left text-sm text-destructive hover:bg-destructive/10"
                  onClick={onClearFilters}
                >
                  Filtreleri temizle
                </button>
              </>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          type="button"
          variant="outline"
          onClick={() => void onRefresh()}
          disabled={loading}
          className="shrink-0 transition-colors hover:bg-muted/80 active:scale-[0.98]"
        >
          <RefreshCw className={`mr-2 size-4 ${loading ? "animate-spin" : ""}`} />
          Yenile
        </Button>
      </div>
    </div>
  );
}
