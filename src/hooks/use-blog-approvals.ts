"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  approveBlogApproval,
  listPendingBlogApprovals,
  rejectBlogApproval,
  submitAdminBlogRevision,
} from "@/services/blog/blog-approvals.service";
import { blogApprovalRejectSchema } from "@/lib/blog-approval-schemas";
import type { BlogApprovalDto } from "@/types/dto/blog-approval";

const PAGE_LIMIT = 20;

interface UseBlogApprovalsResult {
  approvals: BlogApprovalDto[];
  page: number;
  total: number;
  limit: number;
  setPage: (page: number) => void;
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
      const res = await listPendingBlogApprovals(target, PAGE_LIMIT);
      if (requestId !== requestRef.current) return;
      const lastPage = Math.max(1, Math.ceil(res.total / PAGE_LIMIT));
      if (target > lastPage) {
        // Sayfa boşaldı: bir önceki (son) sayfaya geç, efekt yeniden çeker.
        setPage(lastPage);
        return;
      }
      setApprovals(res.data);
      setTotal(res.total);
      setLoading(false);
    } catch (e) {
      if (requestId !== requestRef.current || silent) return;
      setError(e instanceof Error ? e.message : "Blog onay kuyruğu yüklenemedi");
      setApprovals([]);
      setTotal(0);
      setLoading(false);
    }
  }, []);

  const load = useCallback(() => fetchPage(page), [fetchPage, page]);

  const approve = useCallback(
    async (id: string) => {
      setApprovals((prev) => prev.filter((item) => item.id !== id));
      setTotal((t) => Math.max(0, t - 1));
      try {
        await approveBlogApproval(id);
      } catch {
        await fetchPage(page, true);
        throw new Error("Onay sunucuya iletilemedi. Liste güncellendi.");
      }
      await fetchPage(page, true);
    },
    [fetchPage, page]
  );

  const reject = useCallback(
    async (id: string, revisionNote: string) => {
      const parsed = blogApprovalRejectSchema.safeParse({ revisionNote });
      if (!parsed.success) {
        const msg = parsed.error.flatten().fieldErrors.revisionNote?.[0];
        throw new Error(msg ?? "Geçersiz revize notu");
      }

      setApprovals((prev) => prev.filter((item) => item.id !== id));
      setTotal((t) => Math.max(0, t - 1));
      try {
        await rejectBlogApproval(id, parsed.data.revisionNote);
      } catch {
        await fetchPage(page, true);
        throw new Error("Red işlemi sunucuya iletilemedi. Liste güncellendi.");
      }
      await fetchPage(page, true);
    },
    [fetchPage, page]
  );

  const saveAdminRevision = useCallback(
    async (id: string, data: { title: string; excerpt: string; content: string }) => {
      try {
        await submitAdminBlogRevision(id, data);
      } catch {
        await fetchPage(page, true);
        throw new Error("Revizyon sunucuya iletilemedi. Liste güncellendi.");
      }
      setApprovals((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, title: data.title, excerpt: data.excerpt, content: data.content } : item
        )
      );
    },
    [fetchPage, page]
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
    void fetchPage(page);
  }, [fetchPage, page]);

  return {
    approvals,
    setApprovals,
    page,
    total,
    limit: PAGE_LIMIT,
    setPage,
    loading,
    error,
    refetch: load,
    approve,
    reject,
    saveAdminRevision,
    updateLocalApproval,
  };
}
