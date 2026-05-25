"use client";

import { useCallback, useEffect, useState } from "react";
import { listAdminUsers } from "@/services/users/admin-users-list.service";
import type { AdminUser } from "@/types/dto/admin-user-list";

interface UseAdminUsersResult {
  users: AdminUser[];
  setUsers: React.Dispatch<React.SetStateAction<AdminUser[]>>;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAdminUsers(): UseAdminUsersResult {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listAdminUsers();
      setUsers(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Yükleme hatası");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { users, setUsers, loading, error, refetch: load };
}
