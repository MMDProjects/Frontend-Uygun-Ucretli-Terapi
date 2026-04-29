"use client";

import Link from "next/link";
import { ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";

import type { TestResult, TestResultLevel } from "@/types/domain";

type PreviousResultsSectionProps = {
  results: TestResult[];
};

const levelConfig: Record<TestResultLevel, { label: string; color: string; bg: string; Icon: typeof TrendingUp }> = {
  Yüksek: {
    label: "Yüksek",
    color: "text-destructive",
    bg: "bg-destructive/10",
    Icon: TrendingUp,
  },
  Orta: {
    label: "Orta",
    color: "text-warning",
    bg: "bg-warning/10",
    Icon: Minus,
  },
  Düşük: {
    label: "Düşük",
    color: "text-primary",
    bg: "bg-primary/10",
    Icon: TrendingDown,
  },
};

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
      <div
        className="h-full rounded-full bg-primary transition-all duration-500"
        style={{ width: `${score}%` }}
      />
    </div>
  );
}

export function PreviousResultsSection({ results }: PreviousResultsSectionProps) {
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
          <Link
            href="/testlerim"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition hover:text-primary-hover"
          >
            Tümünü Gör
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((result) => {
            const { label, color, bg, Icon } = levelConfig[result.level];
            return (
              <article
                key={result.id}
                className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
                    {result.title}
                  </h3>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${bg} ${color}`}
                  >
                    <Icon className="size-3" />
                    {label}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                    <span>Puan</span>
                    <span className="font-bold text-foreground">{result.score}/100</span>
                  </div>
                  <ScoreBar score={result.score} />
                </div>

                <p className="text-xs leading-relaxed text-muted-foreground">
                  {result.recommendation}
                </p>

                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{result.dateLabel}</span>
                  <Link
                    href={`/testler/${result.slug}`}
                    className="text-xs font-semibold text-primary transition hover:text-primary-hover"
                  >
                    Tekrar Yap
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
