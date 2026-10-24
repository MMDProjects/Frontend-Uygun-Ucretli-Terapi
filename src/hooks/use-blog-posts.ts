"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { listBlogPosts } from "@/services/blog/blog-posts.service";
import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-cookies";
import type { BlogPostDto } from "@/types/dto/blog-post";

const PAGE_LIMIT = 20;

interface UseBlogPostsResult {
  posts: BlogPostDto[];
  page: number;
  total: number;
  limit: number;
  setPage: (page: number) => void;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export function useBlogPosts(): UseBlogPostsResult {
  const [posts, setPosts] = useState<BlogPostDto[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestRef = useRef(0);

  const fetchPage = useCallback(async (target: number, silent = false) => {
    const requestId = ++requestRef.current;
    if (!silent) {
      setLoading(true);
      setError(null);
    }
    try {
      const res = await listBlogPosts(target, PAGE_LIMIT);
      if (requestId !== requestRef.current) return;
      const lastPage = Math.max(1, Math.ceil(res.total / PAGE_LIMIT));
      if (target > lastPage) {
        // Sayfa boşaldı: bir önceki (son) sayfaya geç, efekt yeniden çeker.
        setPage(lastPage);
        return;
      }
      setPosts(res.data);
      setTotal(res.total);
      setLoading(false);
    } catch (e) {
      if (requestId !== requestRef.current || silent) return;
      setError(e instanceof Error ? e.message : "Bloglar yüklenemedi");
      setPosts([]);
      setTotal(0);
      setLoading(false);
    }
  }, []);

  const load = useCallback(() => fetchPage(page), [fetchPage, page]);

  useEffect(() => {
    void fetchPage(page);
  }, [fetchPage, page]);

  const remove = useCallback(async (id: string) => {
    const token = getAccessToken();
    await apiFetch(`/admin/blogs/${id}`, { method: "DELETE", token });
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setTotal((t) => Math.max(0, t - 1));
    await fetchPage(page, true);
  }, [fetchPage, page]);

  return {
    posts,
    page,
    total,
    limit: PAGE_LIMIT,
    setPage,
    loading,
    error,
    refetch: load,
    remove,
  };
}
