"use client";

import { useCallback, useEffect, useState } from "react";
import {
  approveExpertApplication,
  listExpertApplications,
  rejectExpertApplication,
} from "@/services/experts/expert-applications.service";
import { expertApplicationRejectSchema } from "@/lib/expert-application-schemas";
import type { ExpertApplication } from "@/types/dto/expert-application";

interface UseExpertApplicationsResult {
  applications: ExpertApplication[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  approve: (applicationId: string) => Promise<void>;
  reject: (applicationId: string, rejectionReason: string) => Promise<void>;
}

export function useExpertApplications(): UseExpertApplicationsResult {
  const [applications, setApplications] = useState<ExpertApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listExpertApplications();
      setApplications(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Başvurular yüklenemedi");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const approve = useCallback(async (applicationId: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== applicationId));
    try {
      await approveExpertApplication(applicationId);
    } catch {
      const data = await listExpertApplications();
      setApplications(data);
      throw new Error("Onay sunucuya iletilemedi. Liste güncellendi.");
    }
  }, []);

  const reject = useCallback(async (applicationId: string, rejectionReason: string) => {
    const parsed = expertApplicationRejectSchema.safeParse({ rejectionReason });
    if (!parsed.success) {
      const msg = parsed.error.flatten().fieldErrors.rejectionReason?.[0];
      throw new Error(msg ?? "Geçersiz red gerekçesi");
    }

    setApplications((prev) => prev.filter((a) => a.id !== applicationId));
    try {
      await rejectExpertApplication(applicationId, parsed.data.rejectionReason);
    } catch {
      const data = await listExpertApplications();
      setApplications(data);
      throw new Error("Red işlemi sunucuya iletilemedi. Liste güncellendi.");
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return {
    applications,
    loading,
    error,
    refetch,
    approve,
    reject,
  };
}
