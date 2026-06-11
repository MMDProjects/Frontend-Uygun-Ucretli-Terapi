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
import { PageHeader } from "@/features/admin/components/page-header";
import { cn } from "@/lib/utils";

interface DanisanUsersToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedStatuses: Array<"active" | "inactive">;
  onStatusToggle: (status: "active" | "inactive", checked: boolean) => void;
  onClearFilters: () => void;
  onRefresh: () => void;
  loading: boolean;
}

export function DanisanUsersToolbar({
  searchQuery,
  onSearchChange,
  selectedStatuses,
  onStatusToggle,
  onClearFilters,
  onRefresh,
  loading,
}: DanisanUsersToolbarProps) {
  const filterCount = selectedStatuses.length;

  return (
    <PageHeader title="Danışan yönetimi" description="Platformdaki danışan hesaplarını görüntüleyin ve durum değişikliklerini yönetin.">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          placeholder="Danışan ara (isim, e-posta, ID)…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full md:w-[300px]"
          aria-label="Danışan ara"
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
            Filtrele
            {filterCount > 0 ? (
              <Badge variant="secondary" className="rounded-full px-1.5">
                {filterCount}
              </Badge>
            ) : null}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48" align="end">
            <DropdownMenuLabel>Durum</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={selectedStatuses.includes("active")}
              onCheckedChange={(checked) =>
                onStatusToggle("active", Boolean(checked))
              }
            >
              Aktif
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedStatuses.includes("inactive")}
              onCheckedChange={(checked) =>
                onStatusToggle("inactive", Boolean(checked))
              }
            >
              Pasif
            </DropdownMenuCheckboxItem>
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
          className="shrink-0"
        >
          <RefreshCw
            className={`mr-2 size-4 ${loading ? "animate-spin" : ""}`}
          />
          Yenile
        </Button>
      </div>
    </PageHeader>
  );
}
