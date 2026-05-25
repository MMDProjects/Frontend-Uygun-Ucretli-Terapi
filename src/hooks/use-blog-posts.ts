"use client";

import { useCallback, useEffect, useState } from "react";
import { listBlogPosts } from "@/services/blog/blog-posts.service";
import type { BlogPostDto } from "@/types/dto/blog-post";

interface UseBlogPostsResult {
  posts: BlogPostDto[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
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

  return { posts, loading, error, refetch: load };
}
