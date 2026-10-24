"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getAccessToken } from "@/lib/auth-cookies";
import { listUsers, USERS_PAGE_LIMIT } from "@/services/users/users-list.service";
import type { DanisanUser, UserListStatus } from "@/types/dto/user-list";

interface UseDanisanUsersParams {
  page: number;
  search?: string;
  status?: UserListStatus;
}

interface UseDanisanUsersResult {
  users: DanisanUser[];
  total: number;
  setUsers: React.Dispatch<React.SetStateAction<DanisanUser[]>>;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDanisanUsers({
  page,
  search,
  status,
}: UseDanisanUsersParams): UseDanisanUsersResult {
  const [users, setUsers] = useState<DanisanUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestRef = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++requestRef.current;
    setLoading(true);
    setError(null);
    try {
      const token = getAccessToken();
      const res = await listUsers(
        { page, limit: USERS_PAGE_LIMIT, search, status },
        token ?? null
      );
      if (requestId !== requestRef.current) return;
      setUsers(res.data);
      setTotal(res.total);
    } catch (e) {
      if (requestId !== requestRef.current) return;
      setError(e instanceof Error ? e.message : "Yükleme hatası");
      setUsers([]);
      setTotal(0);
    } finally {
      if (requestId === requestRef.current) setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    void load();
  }, [load]);

  return { users, total, setUsers, loading, error, refetch: load };
}
