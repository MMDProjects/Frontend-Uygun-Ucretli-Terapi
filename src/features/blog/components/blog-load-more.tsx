"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getBlogs, type ApiBlog } from "@/lib/services/public.service";
import { BLOG_PAGE_SIZE, BlogCardApi, bentoSpanPattern } from "./blog-card-api";

type Props = {
  initialCount: number;
  total: number;
};

// İlk sayfa sunucuda üretilir (SEO); sonraki sayfalar burada eklenir.
export function BlogLoadMore({ initialCount, total }: Props) {
  const [extra, setExtra] = useState<ApiBlog[]>([]);
  const [nextPage, setNextPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [serverTotal, setServerTotal] = useState(total);

  const loaded = initialCount + extra.length;
  const hasMore = loaded < serverTotal;

  async function loadMore() {
    setLoading(true);
    setError(false);
    try {
      // Yalnızca page ve limit gönderilir.
      const res = await getBlogs(nextPage, BLOG_PAGE_SIZE);
      // Boş sayfa geldiyse sonsuz denemeyi önle
      setServerTotal(res.data.length === 0 ? loaded : res.total);
      setExtra((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        return [...prev, ...res.data.filter((p) => !seen.has(p.id))];
      });
      setNextPage((p) => p + 1);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {extra.map((post, index) => (
        <div
          key={post.id}
          className={bentoSpanPattern[(initialCount + index) % bentoSpanPattern.length]}
        >
          <BlogCardApi post={post} className="!rounded-[2rem] lg:!rounded-[2.25rem]" />
        </div>
      ))}
      <div className="col-span-full flex flex-col items-center gap-3 pt-4">
        <p className="text-sm text-muted-foreground">
          {Math.min(loaded, serverTotal)} / {serverTotal} yazı gösteriliyor
        </p>
        {error && (
          <p className="text-sm text-red-600">Yazılar yüklenemedi, lütfen tekrar deneyin.</p>
        )}
        {hasMore && (
          <Button type="button" variant="outline" disabled={loading} onClick={loadMore}>
            {loading ? "Yükleniyor…" : error ? "Tekrar dene" : "Daha fazla yükle"}
          </Button>
        )}
      </div>
    </>
  );
}
