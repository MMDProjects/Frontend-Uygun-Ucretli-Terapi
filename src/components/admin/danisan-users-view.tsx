"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Pager } from "@/components/shared/pager";
import { useDanisanUsers } from "@/hooks/use-danisan-users";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { USERS_PAGE_LIMIT } from "@/services/users/users-list.service";
import type { DanisanUser } from "@/types/dto/user-list";
import { DanisanDetailDialog } from "./danisan-detail-dialog";
import { DanisanUsersTable } from "./danisan-users-table";
import { DanisanUsersToolbar } from "./danisan-users-toolbar";
import { UserWarningDialog } from "./user-warning-dialog";

export function DanisanUsersView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<Array<"active" | "inactive">>([]);
  const debouncedSearch = useDebouncedValue(searchQuery.trim(), 300);
  // İkisi birden seçiliyse ya da hiçbiri seçili değilse durum filtresi gönderilmez
  const statusParam = selectedStatuses.length === 1 ? selectedStatuses[0] : undefined;

  // Arama/filtre değişince sayfa 1'e döner (sayfa, ait olduğu filtre anahtarıyla tutulur)
  const filterKey = `${debouncedSearch}|${statusParam ?? ""}`;
  const [pageState, setPageState] = useState({ key: filterKey, page: 1 });
  const page = pageState.key === filterKey ? pageState.page : 1;

  const { users, total, loading, error, refetch } = useDanisanUsers({
    page,
    search: debouncedSearch || undefined,
    status: statusParam,
  });

  const [warningOpen, setWarningOpen] = useState(false);
  const [warningUser, setWarningUser] = useState<DanisanUser | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailUser, setDetailUser] = useState<DanisanUser | null>(null);

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
        users={users}
        loading={loading}
        error={error}
        onRefresh={refetch}
        onOpenDetail={handleOpenDetail}
        onOpenWarning={handleOpenWarning}
        onStatusToggle={handleStatusToggleRow}
        onNotifyStub={handleNotifyStub}
      />

      <Pager
        page={page}
        total={total}
        limit={USERS_PAGE_LIMIT}
        disabled={loading}
        onChange={(next) => setPageState({ key: filterKey, page: next })}
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
