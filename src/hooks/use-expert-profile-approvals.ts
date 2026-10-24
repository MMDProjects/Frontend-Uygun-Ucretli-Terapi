"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  approveExpertProfileApproval,
  listExpertProfileApprovals,
  rejectExpertProfileApproval,
} from "@/services/experts/expert-profile-approvals.service";
import { expertProfileRejectSchema } from "@/lib/expert-profile-approval-schemas";
import type { ExpertProfileApproval } from "@/types/dto/expert-profile-approval";

const PAGE_LIMIT = 20;

interface UseExpertProfileApprovalsResult {
  items: ExpertProfileApproval[];
  page: number;
  total: number;
  limit: number;
  setPage: (page: number) => void;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  approve: (approvalId: string) => Promise<void>;
  reject: (approvalId: string, revisionNote: string) => Promise<void>;
}

export function useExpertProfileApprovals(): UseExpertProfileApprovalsResult {
  const [items, setItems] = useState<ExpertProfileApproval[]>([]);
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
      const res = await listExpertProfileApprovals(target, PAGE_LIMIT);
      if (requestId !== requestRef.current) return;
      const lastPage = Math.max(1, Math.ceil(res.total / PAGE_LIMIT));
      if (target > lastPage) {
        // Sayfa boşaldı: bir önceki (son) sayfaya geç, efekt yeniden çeker.
        setPage(lastPage);
        return;
      }
      setItems(res.data);
      setTotal(res.total);
      setLoading(false);
    } catch (e) {
      if (requestId !== requestRef.current || silent) return;
      setError(e instanceof Error ? e.message : "Profil onayları yüklenemedi");
      setItems([]);
      setTotal(0);
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => fetchPage(page), [fetchPage, page]);

  const approve = useCallback(
    async (approvalId: string) => {
      setItems((prev) => prev.filter((a) => a.id !== approvalId));
      setTotal((t) => Math.max(0, t - 1));
      try {
        await approveExpertProfileApproval(approvalId);
      } catch {
        await fetchPage(page, true);
        throw new Error("Onay sunucuya iletilemedi. Liste güncellendi.");
      }
      await fetchPage(page, true);
    },
    [fetchPage, page]
  );

  const reject = useCallback(
    async (approvalId: string, revisionNote: string) => {
      const parsed = expertProfileRejectSchema.safeParse({ revisionNote });
      if (!parsed.success) {
        const msg = parsed.error.flatten().fieldErrors.revisionNote?.[0];
        throw new Error(msg ?? "Geçersiz revize notu");
      }

      setItems((prev) => prev.filter((a) => a.id !== approvalId));
      setTotal((t) => Math.max(0, t - 1));
      try {
        await rejectExpertProfileApproval(approvalId, parsed.data.revisionNote);
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
    items,
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
