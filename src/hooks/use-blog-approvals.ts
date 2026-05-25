"use client";

import { useCallback, useEffect, useState } from "react";
import {
  approveBlogApproval,
  listPendingBlogApprovals,
  rejectBlogApproval,
  submitAdminBlogRevision,
} from "@/services/blog/blog-approvals.service";
import { blogApprovalRejectSchema } from "@/lib/blog-approval-schemas";
import type { BlogApprovalDto } from "@/types/dto/blog-approval";

interface UseBlogApprovalsResult {
  approvals: BlogApprovalDto[];
  setApprovals: React.Dispatch<React.SetStateAction<BlogApprovalDto[]>>;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  approve: (id: string) => Promise<void>;
  reject: (id: string, revisionNote: string) => Promise<void>;
  saveAdminRevision: (
    id: string,
    data: { title: string; excerpt: string; content: string }
  ) => Promise<void>;
  updateLocalApproval: (
    id: string,
    data: Partial<Pick<BlogApprovalDto, "title" | "excerpt" | "content">>
  ) => void;
}

export function useBlogApprovals(): UseBlogApprovalsResult {
  const [approvals, setApprovals] = useState<BlogApprovalDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listPendingBlogApprovals();
      setApprovals(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Blog onay kuyruğu yüklenemedi");
      setApprovals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const approve = useCallback(async (id: string) => {
    setApprovals((prev) => prev.filter((item) => item.id !== id));
    try {
      await approveBlogApproval(id);
    } catch {
      const data = await listPendingBlogApprovals();
      setApprovals(data);
      throw new Error("Onay sunucuya iletilemedi. Liste güncellendi.");
    }
  }, []);

  const reject = useCallback(async (id: string, revisionNote: string) => {
    const parsed = blogApprovalRejectSchema.safeParse({ revisionNote });
    if (!parsed.success) {
      const msg = parsed.error.flatten().fieldErrors.revisionNote?.[0];
      throw new Error(msg ?? "Geçersiz revize notu");
    }

    setApprovals((prev) => prev.filter((item) => item.id !== id));
    try {
      await rejectBlogApproval(id, parsed.data.revisionNote);
    } catch {
      const data = await listPendingBlogApprovals();
      setApprovals(data);
      throw new Error("Red işlemi sunucuya iletilemedi. Liste güncellendi.");
    }
  }, []);

  const saveAdminRevision = useCallback(
    async (id: string, data: { title: string; excerpt: string; content: string }) => {
      try {
        await submitAdminBlogRevision(id, data);
      } catch {
        const fresh = await listPendingBlogApprovals();
        setApprovals(fresh);
        throw new Error("Revizyon sunucuya iletilemedi. Liste güncellendi.");
      }
      setApprovals((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, title: data.title, excerpt: data.excerpt, content: data.content } : item
        )
      );
    },
    []
  );

  const updateLocalApproval = useCallback(
    (id: string, data: Partial<Pick<BlogApprovalDto, "title" | "excerpt" | "content">>) => {
      setApprovals((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...data } : item))
      );
    },
    []
  );

  useEffect(() => {
    void load();
  }, [load]);

  return {
    approvals,
    setApprovals,
    loading,
    error,
    refetch: load,
    approve,
    reject,
    saveAdminRevision,
    updateLocalApproval,
  };
}
