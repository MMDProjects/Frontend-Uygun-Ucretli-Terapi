"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useDanisanUsers } from "@/hooks/use-danisan-users";
import { ROLE_LABELS } from "@/lib/danisan-user-meta";
import type { DanisanRole, DanisanUser } from "@/types/dto/user-list";
import { DanisanDetailDialog } from "./danisan-detail-dialog";
import { DanisanUsersTable } from "./danisan-users-table";
import { DanisanUsersToolbar } from "./danisan-users-toolbar";
import { UserWarningDialog } from "./user-warning-dialog";

export function DanisanUsersView() {
  const { users, setUsers, loading, error, refetch } = useDanisanUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<DanisanRole[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<
    Array<"active" | "inactive">
  >([]);

  const [warningOpen, setWarningOpen] = useState(false);
  const [warningUser, setWarningUser] = useState<DanisanUser | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailUser, setDetailUser] = useState<DanisanUser | null>(null);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return users.filter((user) => {
      const matchSearch =
        q.length === 0 ||
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.id.includes(q) ||
        `#${user.id}`.toLowerCase().includes(q);

      const matchRole =
        selectedRoles.length === 0 || selectedRoles.includes(user.role);

      const matchStatus =
        selectedStatuses.length === 0 ||
        selectedStatuses.includes(user.status);

      return matchSearch && matchRole && matchStatus;
    });
  }, [users, searchQuery, selectedRoles, selectedStatuses]);

  const handleRoleToggle = (role: DanisanRole, checked: boolean) => {
    setSelectedRoles((prev) =>
      checked ? [...prev, role] : prev.filter((r) => r !== role)
    );
  };

  const handleStatusToggleFilter = (
    status: "active" | "inactive",
    checked: boolean
  ) => {
    setSelectedStatuses((prev) =>
      checked ? [...prev, status] : prev.filter((s) => s !== status)
    );
  };

  const handleRoleChangeRow = (userId: string, role: DanisanRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role } : u))
    );
    const u = users.find((x) => x.id === userId);
    if (u) {
      toast.success(
        `${u.name}: rol “${ROLE_LABELS[role]}” olarak güncellendi (yerel, API TODO)`
      );
    }
  };

  const handleStatusToggleRow = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const next: DanisanUser["status"] =
          u.status === "active" ? "inactive" : "active";
        toast.success(
          `${u.name} ${next === "active" ? "aktifleştirildi" : "pasifleştirildi"} (yerel, API TODO)`
        );
        return { ...u, status: next };
      })
    );
  };

  const handleOpenDetail = (user: DanisanUser) => {
    setDetailUser(user);
    setDetailOpen(true);
  };

  const handleOpenWarning = (user: DanisanUser) => {
    setWarningUser(user);
    setWarningOpen(true);
  };

  const handleSendWarning = (message: string) => {
    if (!warningUser) return;
    toast.success(`${warningUser.name} için uyarı kaydedildi (API TODO)`);
    console.warn("[warning stub]", warningUser.id, message);
    setWarningOpen(false);
    setWarningUser(null);
  };

  const handleNotifyStub = (user: DanisanUser) => {
    toast.success(`${user.name}: bildirim kuyruğu (yakında)`);
  };

  return (
    <div className="flex-1 space-y-6">
      <DanisanUsersToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedRoles={selectedRoles}
        onRoleToggle={handleRoleToggle}
        selectedStatuses={selectedStatuses}
        onStatusToggle={handleStatusToggleFilter}
        onClearFilters={() => {
          setSelectedRoles([]);
          setSelectedStatuses([]);
        }}
        onRefresh={refetch}
        loading={loading}
      />

      <DanisanUsersTable
        users={filteredUsers}
        loading={loading}
        error={error}
        onRefresh={refetch}
        onOpenDetail={handleOpenDetail}
        onOpenWarning={handleOpenWarning}
        onRoleChange={handleRoleChangeRow}
        onStatusToggle={handleStatusToggleRow}
        onNotifyStub={handleNotifyStub}
      />

      <div className="rounded-lg border border-[#3178C6]/25 bg-[#3178C6]/5 px-4 py-3 text-sm text-[#24292E] dark:border-[#3178C6]/40 dark:text-foreground">
        <p className="font-medium text-[#3178C6] dark:text-[#6BA3E8]">
          İpucu
        </p>
        <p className="mt-1 text-muted-foreground">
          Detay için satıra veya isme tıklayın. Rol ve durum değişiklikleri şu an
          yalnızca arayüzde; backend endpoint’leri bağlandığında servis katmanına
          taşınacak.
        </p>
      </div>

      <UserWarningDialog
        open={warningOpen}
        onOpenChange={setWarningOpen}
        userName={warningUser?.name ?? ""}
        onSendWarning={handleSendWarning}
      />

      {detailUser ? (
        <DanisanDetailDialog
          user={detailUser}
          open={detailOpen}
          onOpenChange={(open) => {
            setDetailOpen(open);
            if (!open) {
              window.setTimeout(() => setDetailUser(null), 300);
            }
          }}
        />
      ) : null}
    </div>
  );
}
