"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useAdminUsers } from "@/hooks/use-admin-users";
import { ADMIN_ROLE_LABELS } from "@/lib/admin-user-meta";
import type { AdminUser, AdminUserRole } from "@/types/dto/admin-user-list";
import { AdminDetailDialog } from "./admin-detail-dialog";
import { AdminUsersTable } from "./admin-users-table";
import { AdminUsersToolbar } from "./admin-users-toolbar";
import { UserWarningDialog } from "./user-warning-dialog";

export function AdminUsersView() {
  const { users, setUsers, loading, error, refetch } = useAdminUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<AdminUserRole[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<
    Array<"active" | "inactive">
  >([]);
  const [warningOpen, setWarningOpen] = useState(false);
  const [warningUser, setWarningUser] = useState<AdminUser | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailUser, setDetailUser] = useState<AdminUser | null>(null);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return users.filter((user) => {
      const matchSearch =
        q.length === 0 ||
        user.fullName.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.id.toLowerCase().includes(q);
      const matchRole =
        selectedRoles.length === 0 || selectedRoles.includes(user.role);
      const matchStatus =
        selectedStatuses.length === 0 || selectedStatuses.includes(user.status);

      return matchSearch && matchRole && matchStatus;
    });
  }, [users, searchQuery, selectedRoles, selectedStatuses]);

  const handleRoleToggle = (role: AdminUserRole, checked: boolean) => {
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

  const handleRoleChangeRow = (userId: string, role: AdminUserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role } : u))
    );
    const selected = users.find((x) => x.id === userId);
    if (selected) {
      toast.success(
        `${selected.fullName}: yetki tipi “${ADMIN_ROLE_LABELS[role]}” olarak güncellendi (yerel, API TODO)`
      );
    }
  };

  const handleStatusToggleRow = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const next = u.status === "active" ? "inactive" : "active";
        toast.success(
          `${u.fullName} ${next === "active" ? "aktifleştirildi" : "pasifleştirildi"} (yerel, API TODO)`
        );
        return { ...u, status: next };
      })
    );
  };

  const handleOpenDetail = (user: AdminUser) => {
    setDetailUser(user);
    setDetailOpen(true);
  };

  const handleOpenWarning = (user: AdminUser) => {
    setWarningUser(user);
    setWarningOpen(true);
  };

  const handleSendWarning = (message: string) => {
    if (!warningUser) return;
    toast.success(`${warningUser.fullName} için uyarı kaydedildi (API TODO)`);
    console.warn("[admin warning stub]", warningUser.id, message);
    setWarningOpen(false);
    setWarningUser(null);
  };

  const handleNotifyStub = (user: AdminUser) => {
    toast.success(`${user.fullName}: bildirim kuyruğu (yakında)`);
  };

  return (
    <div className="flex-1 space-y-6">
      <AdminUsersToolbar
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

      <AdminUsersTable
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
        <p className="font-medium text-[#3178C6] dark:text-[#6BA3E8]">İpucu</p>
        <p className="mt-1 text-muted-foreground">
          Detay için satıra veya isme tıklayın. Yetki tipi ve durum değişiklikleri
          şu an yalnızca arayüzde; endpoint kararı netleştiğinde servis katmanına
          taşınacak.
        </p>
      </div>

      <UserWarningDialog
        open={warningOpen}
        onOpenChange={setWarningOpen}
        userName={warningUser?.fullName ?? ""}
        recipientKind="personel üyesine"
        onSendWarning={handleSendWarning}
      />

      {detailUser ? (
        <AdminDetailDialog
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
