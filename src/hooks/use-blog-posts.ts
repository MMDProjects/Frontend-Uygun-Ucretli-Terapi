"use client";

import { useCallback, useEffect, useState } from "react";
import { listBlogPosts } from "@/services/blog/blog-posts.service";
import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-cookies";
import type { BlogPostDto } from "@/types/dto/blog-post";

interface UseBlogPostsResult {
  posts: BlogPostDto[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export function useBlogPosts(): UseBlogPostsResult {
  const [posts, setPosts] = useState<BlogPostDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listBlogPosts();
      setPosts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bloglar yüklenemedi");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const remove = useCallback(async (id: string) => {
    const token = getAccessToken();
    await apiFetch(`/admin/blogs/${id}`, { method: "DELETE", token });
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return { posts, loading, error, refetch: load, remove };
}
