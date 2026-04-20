import Link from "next/link";

import { SectionHeading } from "@/components/common/section-heading";
import { Button } from "@/components/ui/button";
import { homeFaqItems } from "@/features/shared/data/mock-content";

const midpoint = Math.ceil(homeFaqItems.length / 2);
const leftColumn = homeFaqItems.slice(0, midpoint);
const rightColumn = homeFaqItems.slice(midpoint);

export function HomeFaqSection() {
  return (
    <section
      className="section-shell bg-background"
      aria-labelledby="home-faq-heading"
    >
      <div className="page-shell space-y-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            title="Sıkça sorulan sorular"
            description="Satış ve kayıt öncesi merak edilen başlıkların özeti; tüm liste için SSS sayfasını ziyaret edin."
            titleId="home-faq-heading"
          />
          <Button asChild variant="outline" className="min-h-11 w-full shrink-0 sm:w-auto">
            <Link href="/sss">Tüm SSS</Link>
          </Button>
        </div>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-8">
            {leftColumn.map((item) => (
              <article key={item.question}>
                <h3 className="text-lg font-semibold text-primary-hover">
                  {item.question}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
          <div className="space-y-8">
            {rightColumn.map((item) => (
              <article key={item.question}>
                <h3 className="text-lg font-semibold text-primary-hover">
                  {item.question}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
