"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ClipboardList } from "lucide-react";
import { getMyTestHistory, type ApiTestResult } from "@/lib/services/danisan.service";

export function TestHistorySection() {
  const [results, setResults] = useState<ApiTestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyTestHistory()
      .then(setResults)
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="border-b border-border/50 bg-white py-10">
        <div className="page-shell">
          <div className="h-6 w-48 skeleton rounded-lg mb-4" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 skeleton rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (results.length === 0) return null;

  return (
    <section className="border-b border-border/50 bg-white py-10">
      <div className="page-shell">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-primary-hover">Önceki Sonuçlarım</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Tamamladığınız testlerin özeti
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.slice(0, 6).map((result) => {
            const date = new Date(result.createdAt).toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });
            return (
              <article
                key={result.id}
                className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <ClipboardList className="size-4 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold leading-snug text-foreground line-clamp-2">
                    {result.test.title}
                  </h3>
                </div>

                <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3">
                  {result.scoreSummary}
                </p>

                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{date}</span>
                  <Link
                    href={`/testler/${result.test.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition hover:text-primary-hover"
                  >
                    Tekrar Yap
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
