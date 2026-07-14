"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useDanisanUsers } from "@/hooks/use-danisan-users";
import type { DanisanUser } from "@/types/dto/user-list";
import { DanisanDetailDialog } from "./danisan-detail-dialog";
import { DanisanUsersTable } from "./danisan-users-table";
import { DanisanUsersToolbar } from "./danisan-users-toolbar";
import { UserWarningDialog } from "./user-warning-dialog";

export function DanisanUsersView() {
  const { users, setUsers, loading, error, refetch } = useDanisanUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<Array<"active" | "inactive">>([]);

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

      const matchStatus =
        selectedStatuses.length === 0 ||
        selectedStatuses.includes(user.status);

      return matchSearch && matchStatus;
    });
  }, [users, searchQuery, selectedStatuses]);

  const handleStatusToggleFilter = (
    status: "active" | "inactive",
    checked: boolean
  ) => {
    setSelectedStatuses((prev) =>
      checked ? [...prev, status] : prev.filter((s) => s !== status)
    );
  };

  const handleStatusToggleRow = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    toast.error(
      `${user?.name ?? "Kullanıcı"} durumu değiştirilemedi: bu özellik henüz backend'e bağlı değil.`
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

  const handleSendWarning = (_message: string, _type: string) => {
    if (!warningUser) return;
    toast.error(
      `${warningUser.name} için uyarı gönderilemedi: bu özellik henüz backend'e bağlı değil.`
    );
    setWarningOpen(false);
    setWarningUser(null);
  };

  const handleNotifyStub = (user: DanisanUser) => {
    toast.error(`${user.name}: bildirim gönderme özelliği henüz aktif değil.`);
  };

  return (
    <div className="flex-1 space-y-6">
      <DanisanUsersToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStatuses={selectedStatuses}
        onStatusToggle={handleStatusToggleFilter}
        onClearFilters={() => setSelectedStatuses([])}
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
        onStatusToggle={handleStatusToggleRow}
        onNotifyStub={handleNotifyStub}
      />

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
