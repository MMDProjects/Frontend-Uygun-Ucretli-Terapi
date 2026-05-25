"use client";

import { useCallback, useEffect, useState } from "react";
import {
  approveExpertProfileApproval,
  listExpertProfileApprovals,
  rejectExpertProfileApproval,
} from "@/services/experts/expert-profile-approvals.service";
import { expertProfileRejectSchema } from "@/lib/expert-profile-approval-schemas";
import type { ExpertProfileApproval } from "@/types/dto/expert-profile-approval";

interface UseExpertProfileApprovalsResult {
  items: ExpertProfileApproval[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  approve: (approvalId: string) => Promise<void>;
  reject: (approvalId: string, revisionNote: string) => Promise<void>;
}

export function useExpertProfileApprovals(): UseExpertProfileApprovalsResult {
  const [items, setItems] = useState<ExpertProfileApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listExpertProfileApprovals();
      setItems(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Profil onayları yüklenemedi");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const approve = useCallback(async (approvalId: string) => {
    setItems((prev) => prev.filter((a) => a.id !== approvalId));
    try {
      await approveExpertProfileApproval(approvalId);
    } catch {
      const data = await listExpertProfileApprovals();
      setItems(data);
      throw new Error("Onay sunucuya iletilemedi. Liste güncellendi.");
    }
  }, []);

  const reject = useCallback(async (approvalId: string, revisionNote: string) => {
    const parsed = expertProfileRejectSchema.safeParse({ revisionNote });
    if (!parsed.success) {
      const msg = parsed.error.flatten().fieldErrors.revisionNote?.[0];
      throw new Error(msg ?? "Geçersiz revize notu");
    }

    setItems((prev) => prev.filter((a) => a.id !== approvalId));
    try {
      await rejectExpertProfileApproval(approvalId, parsed.data.revisionNote);
    } catch {
      const data = await listExpertProfileApprovals();
      setItems(data);
      throw new Error("Red işlemi sunucuya iletilemedi. Liste güncellendi.");
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return {
    items,
    loading,
    error,
    refetch,
    approve,
    reject,
  };
}
