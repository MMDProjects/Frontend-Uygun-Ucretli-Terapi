"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  clampExpertPriorityScore,
  getExpertDetail,
  listExpertsPage,
  sortExpertsByPriority,
  toggleExpertActive,
  toggleExpertPublish,
  updateExpertPriorityScore,
} from "@/services/users/experts-list.service";
import type { ExpertDetail, ExpertListItem } from "@/types/dto/expert-list";

const PAGE_LIMIT = 20;

interface UseExpertsResult {
  experts: ExpertListItem[];
  page: number;
  total: number;
  limit: number;
  setPage: (page: number) => void;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updatePriority: (expertId: string, score: number) => Promise<void>;
  toggleExpertStatus: (expertId: string) => Promise<void>;
  togglePublish: (expertId: string, isPublished: boolean) => Promise<void>;
  detail: ExpertDetail | null;
  detailLoading: boolean;
  openDetail: (expertId: string) => Promise<void>;
  closeDetail: () => void;
}

export function useExperts(search = ""): UseExpertsResult {
  const [experts, setExperts] = useState<ExpertListItem[]>([]);
  // Sayfa numarası aramaya bağlı tutulur: arama değişince otomatik 1. sayfaya döner.
  const [pageState, setPageState] = useState({ search, page: 1 });
  const page = pageState.search === search ? pageState.page : 1;
  const setPage = useCallback(
    (next: number) => setPageState({ search, page: next }),
    [search]
  );
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<ExpertDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const requestRef = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++requestRef.current;
    setLoading(true);
    setError(null);
    try {
      const res = await listExpertsPage({ page, limit: PAGE_LIMIT, search });
      if (requestId !== requestRef.current) return;
      const lastPage = Math.max(1, Math.ceil(res.total / PAGE_LIMIT));
      if (page > lastPage) {
        // Sayfa boşaldı (ör. son uzman silindi): son sayfaya geç, efekt yeniden çeker.
        setPageState({ search, page: lastPage });
        return;
      }
      setExperts(res.data);
      setTotal(res.total);
      setLoading(false);
    } catch (e) {
      if (requestId !== requestRef.current) return;
      setError(e instanceof Error ? e.message : "Uzman listesi yüklenemedi");
      setExperts([]);
      setTotal(0);
      setLoading(false);
    }
  }, [page, search]);

  const openDetail = useCallback(async (expertId: string) => {
    setDetailLoading(true);
    try {
      const data = await getExpertDetail(expertId);
      setDetail(data);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const closeDetail = useCallback(() => {
    setDetail(null);
  }, []);

  const updatePriority = useCallback(async (expertId: string, score: number) => {
    await updateExpertPriorityScore(expertId, score);
    const next = clampExpertPriorityScore(score);
    setExperts((prev) =>
      sortExpertsByPriority(
        prev.map((e) => (e.id === expertId ? { ...e, priorityScore: next } : e))
      )
    );
    setDetail((d) => (d?.id === expertId ? { ...d, priorityScore: next } : d));
  }, []);

  const toggleExpertStatus = useCallback(async (expertId: string) => {
    const current = experts.find((e) => e.id === expertId);
    const previousStatus = current?.status ?? "inactive";
    const isActive = previousStatus !== "active";
    // Optimistik güncelleme
    setExperts((prev) =>
      sortExpertsByPriority(
        prev.map((e) => (e.id === expertId ? { ...e, status: isActive ? "active" : "inactive" } : e))
      )
    );
    setDetail((d) => (d?.id === expertId ? { ...d, status: isActive ? "active" : "inactive" } : d));
    try {
      await toggleExpertActive(expertId, isActive);
    } catch (e) {
      // Rollback
      setExperts((prev) =>
        sortExpertsByPriority(
          prev.map((ex) => (ex.id === expertId ? { ...ex, status: previousStatus } : ex))
        )
      );
      setDetail((d) => (d?.id === expertId ? { ...d, status: previousStatus } : d));
      throw e;
    }
  }, [experts]);

  const togglePublish = useCallback(async (expertId: string, isPublished: boolean) => {
    const current = experts.find((e) => e.id === expertId);
    const previousPublished = current?.isPublished ?? false;
    // Optimistik güncelleme
    setExperts((prev) =>
      sortExpertsByPriority(
        prev.map((e) => (e.id === expertId ? { ...e, isPublished } : e))
      )
    );
    setDetail((d) => (d?.id === expertId ? { ...d, isPublished } : d));
    try {
      await toggleExpertPublish(expertId, isPublished);
    } catch (e) {
      // Rollback
      setExperts((prev) =>
        sortExpertsByPriority(
          prev.map((ex) => (ex.id === expertId ? { ...ex, isPublished: previousPublished } : ex))
        )
      );
      setDetail((d) => (d?.id === expertId ? { ...d, isPublished: previousPublished } : d));
      throw e;
    }
  }, [experts]);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    experts,
    page,
    total,
    limit: PAGE_LIMIT,
    setPage,
    loading,
    error,
    refetch: load,
    updatePriority,
    toggleExpertStatus,
    togglePublish,
    detail,
    detailLoading,
    openDetail,
    closeDetail,
  };
}
