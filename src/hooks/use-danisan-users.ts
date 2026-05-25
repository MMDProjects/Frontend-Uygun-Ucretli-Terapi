"use client";

import { useCallback, useEffect, useState } from "react";
import { getAccessToken } from "@/lib/auth-cookies";
import { listUsers } from "@/services/users/users-list.service";
import type { DanisanUser } from "@/types/dto/user-list";

interface UseDanisanUsersResult {
  users: DanisanUser[];
  setUsers: React.Dispatch<React.SetStateAction<DanisanUser[]>>;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDanisanUsers(): UseDanisanUsersResult {
  const [users, setUsers] = useState<DanisanUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getAccessToken();
      const data = await listUsers(token ?? null);
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
