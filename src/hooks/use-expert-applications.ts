"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  approveExpertApplication,
  listExpertApplications,
  rejectExpertApplication,
} from "@/services/experts/expert-applications.service";
import { expertApplicationRejectSchema } from "@/lib/expert-application-schemas";
import type { ExpertApplication } from "@/types/dto/expert-application";

const PAGE_LIMIT = 20;

interface UseExpertApplicationsResult {
  applications: ExpertApplication[];
  page: number;
  total: number;
  limit: number;
  setPage: (page: number) => void;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  approve: (applicationId: string) => Promise<void>;
  reject: (applicationId: string, rejectionReason: string) => Promise<void>;
}

export function useExpertApplications(): UseExpertApplicationsResult {
  const [applications, setApplications] = useState<ExpertApplication[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestRef = useRef(0);

  // silent: kuyruktan öğe çıktıktan sonra sayfayı sessizce tazelemek için.
  const fetchPage = useCallback(async (target: number, silent = false) => {
    const requestId = ++requestRef.current;
    if (!silent) {
      setLoading(true);
      setError(null);
    }
    try {
      const res = await listExpertApplications(target, PAGE_LIMIT);
      if (requestId !== requestRef.current) return;
      const lastPage = Math.max(1, Math.ceil(res.total / PAGE_LIMIT));
      if (target > lastPage) {
        // Sayfa boşaldı: bir önceki (son) sayfaya geç, efekt yeniden çeker.
        setPage(lastPage);
        return;
      }
      setApplications(res.data);
      setTotal(res.total);
      setLoading(false);
    } catch (e) {
      if (requestId !== requestRef.current || silent) return;
      setError(e instanceof Error ? e.message : "Başvurular yüklenemedi");
      setApplications([]);
      setTotal(0);
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => fetchPage(page), [fetchPage, page]);

  const approve = useCallback(
    async (applicationId: string) => {
      setApplications((prev) => prev.filter((a) => a.id !== applicationId));
      setTotal((t) => Math.max(0, t - 1));
      try {
        await approveExpertApplication(applicationId);
      } catch {
        await fetchPage(page, true);
        throw new Error("Onay sunucuya iletilemedi. Liste güncellendi.");
      }
      await fetchPage(page, true);
    },
    [fetchPage, page]
  );

  const reject = useCallback(
    async (applicationId: string, rejectionReason: string) => {
      const parsed = expertApplicationRejectSchema.safeParse({ rejectionReason });
      if (!parsed.success) {
        const msg = parsed.error.flatten().fieldErrors.rejectionReason?.[0];
        throw new Error(msg ?? "Geçersiz red gerekçesi");
      }

      setApplications((prev) => prev.filter((a) => a.id !== applicationId));
      setTotal((t) => Math.max(0, t - 1));
      try {
        await rejectExpertApplication(applicationId, parsed.data.rejectionReason);
      } catch {
        await fetchPage(page, true);
        throw new Error("Red işlemi sunucuya iletilemedi. Liste güncellendi.");
      }
      await fetchPage(page, true);
    },
    [fetchPage, page]
  );

  useEffect(() => {
    void fetchPage(page);
  }, [fetchPage, page]);

  return {
    applications,
    page,
    total,
    limit: PAGE_LIMIT,
    setPage,
    loading,
    error,
    refetch,
    approve,
    reject,
  };
}
