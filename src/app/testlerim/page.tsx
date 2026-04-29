"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";

import { useAuthStore } from "@/lib/stores/auth-store";
import { Button } from "@/components/ui/button";
import { mockTestResults } from "@/features/shared/data/mock-content";
import type { TestResultLevel } from "@/types/domain";

const levelConfig: Record<TestResultLevel, { label: string; color: string; bg: string; bar: string; icon: typeof TrendingUp }> = {
  Yüksek: { label: "Yüksek", color: "text-destructive", bg: "bg-destructive/10", bar: "bg-destructive", icon: TrendingUp },
  Orta:   { label: "Orta",   color: "text-warning",     bg: "bg-warning/10",     bar: "bg-warning",     icon: Minus },
  Düşük:  { label: "Düşük",  color: "text-primary",     bg: "bg-primary/10",     bar: "bg-primary",     icon: TrendingDown },
};

export default function TestlerimPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/giris?redirect=/testlerim");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <>
      <section className="border-b border-border/70 bg-[#cce1de] pt-[calc(var(--site-header-height)+2rem)] pb-8">
        <div className="page-shell">
          <div className="flex items-center gap-4">
            <div className="space-y-3">
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-primary-hover sm:text-5xl">
                Testlerim
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-8">
                Tamamladığınız psikolojik testler ve sonuçları
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#e6f0ee] py-10">
        <div className="page-shell">
          {mockTestResults.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <p className="font-semibold text-foreground">Henüz test çözmediniz</p>
              <p className="text-sm text-muted-foreground">Testler sayfasından başlayabilirsiniz.</p>
              <Button asChild>
                <Link href="/testler">Testlere Git</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {mockTestResults.map((result) => {
                  const { label, color, bg, bar, icon: Icon } = levelConfig[result.level];
                  return (
                    <article
                      key={result.id}
                      className="relative flex min-h-[18rem] flex-col overflow-hidden rounded-[2rem] border border-border/60 bg-white p-6 shadow-sm lg:rounded-[2.25rem]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-semibold leading-snug text-primary-hover">
                          {result.title}
                        </h3>
                      </div>

                      <span className={`mt-2 inline-flex w-fit items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${bg} ${color}`}>
                        <Icon className="size-3" />
                        {label}
                      </span>

                      <div className="mt-3 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                          <span>Puan</span>
                          <span className="font-bold text-foreground">{result.score}/100</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                          <div
                            className={`h-full rounded-full ${bar} transition-all duration-500`}
                            style={{ width: `${result.score}%` }}
                          />
                        </div>
                      </div>

                      <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
                        {result.recommendation}
                      </p>

                      <span className="mt-3 text-xs text-muted-foreground">{result.dateLabel}</span>

                      <Link
                        href={`/testler/${result.slug}`}
                        className="absolute bottom-4 right-4 z-[3] inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-center text-sm font-semibold !text-white shadow-sm transition-colors hover:bg-primary-hover hover:!text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none"
                      >
                        Tekrar Yap
                      </Link>
                    </article>
                  );
                })}
              </div>

              <div className="rounded-[2rem] border border-dashed border-border/80 bg-muted/30 p-6 text-center">
                <p className="text-sm text-muted-foreground">Yeni bir test çözmek ister misiniz?</p>
                <Button asChild variant="outline" className="mt-3">
                  <Link href="/testler">
                    Tüm Testler
                    <ArrowRight className="ml-1.5 size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
