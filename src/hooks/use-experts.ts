"use client";

import { useCallback, useEffect, useState } from "react";
import {
  clampExpertPriorityScore,
  getExpertDetail,
  listExperts,
  sortExpertsByPriority,
  toggleExpertActive,
  toggleExpertPublish,
  updateExpertPriorityScore,
} from "@/services/users/experts-list.service";
import type { ExpertDetail, ExpertListItem } from "@/types/dto/expert-list";

interface UseExpertsResult {
  experts: ExpertListItem[];
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

export function useExperts(): UseExpertsResult {
  const [experts, setExperts] = useState<ExpertListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<ExpertDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listExperts();
      setExperts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Uzman listesi yüklenemedi");
      setExperts([]);
    } finally {
      setLoading(false);
    }
  }, []);

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
    const isActive = current?.status !== "active";
    // Optimistik güncelleme
    setExperts((prev) =>
      sortExpertsByPriority(
        prev.map((e) => (e.id === expertId ? { ...e, status: isActive ? "active" : "inactive" } : e))
      )
    );
    setDetail((d) => (d?.id === expertId ? { ...d, status: isActive ? "active" : "inactive" } : d));
    // API çağrısı
    await toggleExpertActive(expertId, isActive);
  }, [experts]);

  const togglePublish = useCallback(async (expertId: string, isPublished: boolean) => {
    await toggleExpertPublish(expertId, isPublished);
    setExperts((prev) =>
      sortExpertsByPriority(
        prev.map((e) => (e.id === expertId ? { ...e, isPublished } : e))
      )
    );
    setDetail((d) => (d?.id === expertId ? { ...d, isPublished } : d));
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    experts,
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
