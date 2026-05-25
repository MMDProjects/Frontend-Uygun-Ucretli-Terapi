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
import type { DanisanRole } from "@/types/dto/user-list";
import { ROLE_LABELS } from "@/lib/danisan-user-meta";
import { PageHeader } from "@/features/admin/components/page-header";
import { cn } from "@/lib/utils";

const ROLES: DanisanRole[] = ["danisan", "premium_danisan", "guest"];

interface DanisanUsersToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedRoles: DanisanRole[];
  onRoleToggle: (role: DanisanRole, checked: boolean) => void;
  selectedStatuses: Array<"active" | "inactive">;
  onStatusToggle: (status: "active" | "inactive", checked: boolean) => void;
  onClearFilters: () => void;
  onRefresh: () => void;
  loading: boolean;
}

export function DanisanUsersToolbar({
  searchQuery,
  onSearchChange,
  selectedRoles,
  onRoleToggle,
  selectedStatuses,
  onStatusToggle,
  onClearFilters,
  onRefresh,
  loading,
}: DanisanUsersToolbarProps) {
  const filterCount = selectedRoles.length + selectedStatuses.length;

  return (
    <PageHeader title="Danışan yönetimi" description="Platformdaki danışan hesaplarını görüntüleyin, rol ve durum değişikliklerini yönetin.">
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
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>Rol</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {ROLES.map((role) => (
              <DropdownMenuCheckboxItem
                key={role}
                checked={selectedRoles.includes(role)}
                onCheckedChange={(checked) =>
                  onRoleToggle(role, Boolean(checked))
                }
              >
                {ROLE_LABELS[role]}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator />
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
                <DropdownMenuItemClear onClear={onClearFilters} />
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

function DropdownMenuItemClear({ onClear }: { onClear: () => void }) {
  return (
    <button
      type="button"
      className="w-full rounded-md px-1.5 py-1.5 text-left text-sm text-destructive hover:bg-destructive/10"
      onClick={onClear}
    >
      Filtreleri temizle
    </button>
  );
}
