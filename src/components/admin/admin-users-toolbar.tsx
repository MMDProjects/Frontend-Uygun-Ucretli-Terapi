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
import { ADMIN_ROLE_LABELS } from "@/lib/admin-user-meta";
import { PageHeader } from "@/features/admin/components/page-header";
import { cn } from "@/lib/utils";
import type { AdminUserRole } from "@/types/dto/admin-user-list";

const ROLE_OPTIONS: AdminUserRole[] = ["admin", "personel"];

interface AdminUsersToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedRoles: AdminUserRole[];
  onRoleToggle: (role: AdminUserRole, checked: boolean) => void;
  selectedStatuses: Array<"active" | "inactive">;
  onStatusToggle: (status: "active" | "inactive", checked: boolean) => void;
  onClearFilters: () => void;
  onRefresh: () => void;
  loading: boolean;
}

export function AdminUsersToolbar({
  searchQuery,
  onSearchChange,
  selectedRoles,
  onRoleToggle,
  selectedStatuses,
  onStatusToggle,
  onClearFilters,
  onRefresh,
  loading,
}: AdminUsersToolbarProps) {
  const filterCount = selectedRoles.length + selectedStatuses.length;

  return (
    <PageHeader title="Admin / personel yönetimi" description="Yönetici ve personel hesaplarını görüntüleyin, rol ve durum değişikliklerini yönetin.">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          placeholder="Admin veya personel ara (ad, e-posta, ID)…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full md:w-[320px]"
          aria-label="Admin veya personel ara"
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
            <DropdownMenuLabel>Yetki tipi</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {ROLE_OPTIONS.map((role) => (
              <DropdownMenuCheckboxItem
                key={role}
                checked={selectedRoles.includes(role)}
                onCheckedChange={(checked) =>
                  onRoleToggle(role, Boolean(checked))
                }
              >
                {ADMIN_ROLE_LABELS[role]}
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
