"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getExperts, type ApiExpertSummary } from "@/lib/services/public.service";
import { ExpertCardApi } from "./expert-card-api";
import { EXPERTS_PAGE_SIZE } from "../constants";

type Props = {
  initialCount: number;
  total: number;
  standardPrice?: number;
  discountedPrice?: number;
};

// İlk sayfa sunucuda üretilir (SEO); sonraki sayfalar burada eklenir.
export function ExpertsLoadMore({ initialCount, total, standardPrice, discountedPrice }: Props) {
  const [extra, setExtra] = useState<ApiExpertSummary[]>([]);
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
      // Yalnızca page ve limit gönderilir; backend tanımsız parametreye 400 döner.
      const res = await getExperts({ page: nextPage, limit: EXPERTS_PAGE_SIZE });
      // Boş sayfa geldiyse sonsuz denemeyi önle
      setServerTotal(res.data.length === 0 ? loaded : res.total);
      setExtra((prev) => {
        const seen = new Set(prev.map((e) => e.id));
        return [...prev, ...res.data.filter((e) => !seen.has(e.id))];
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
      {extra.map((expert) => (
        <ExpertCardApi
          key={expert.id}
          expert={expert}
          standardPrice={standardPrice}
          discountedPrice={discountedPrice}
          className="!rounded-[2rem] border-border/60 bg-white shadow-sm"
        />
      ))}
      <div className="col-span-full flex flex-col items-center gap-3 pt-4">
        <p className="text-sm text-muted-foreground">
          {Math.min(loaded, serverTotal)} / {serverTotal} uzman gösteriliyor
        </p>
        {error && (
          <p className="text-sm text-red-600">Uzmanlar yüklenemedi, lütfen tekrar deneyin.</p>
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
