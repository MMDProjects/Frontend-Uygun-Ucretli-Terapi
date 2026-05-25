"use client";

import { useCallback, useEffect, useState } from "react";
import { getPendingTasks } from "@/services/admin/pending-tasks.service";
import type { PendingTaskDto } from "@/types/dto/pending-task";

interface UsePendingTasksResult {
  tasks: PendingTaskDto[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Loads pending task counts for the admin dashboard (service layer, no fetch in UI).
 */
export function usePendingTasks(
  accessToken?: string | null
): UsePendingTasksResult {
  const [tasks, setTasks] = useState<PendingTaskDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPendingTasks(accessToken);
      setTasks(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Yükleme hatası");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void load();
  }, [load]);

  return { tasks, loading, error, refetch: load };
}
