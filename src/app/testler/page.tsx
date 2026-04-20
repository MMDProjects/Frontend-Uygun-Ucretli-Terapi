import Link from "next/link";

import { Button } from "@/components/ui/button";
import { testsPreview } from "@/features/shared/data/mock-content";

export default function TestsPage() {
  return (
    <>
      <section className="section-shell relative overflow-hidden border-b border-border/70 bg-[#cce1de]">
        <div className="page-shell">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-primary-hover sm:text-5xl">
              Testler
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-8">
              Kısa ve anlaşılır psikolojik testlerle kendinizi daha iyi tanıyın.
              Test sonucunda puan özetinizi görebilir, uzman eşleşmesi için sonraki
              adımı planlayabilirsiniz.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 pt-10 sm:pt-12 lg:pt-16">
        <div className="page-shell grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {testsPreview.map((test) => (
            <article key={test.slug} className="surface-card flex h-full flex-col p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Ortalama {test.durationMinutes} dk
              </p>
              <h2 className="mt-3 text-xl font-semibold text-primary-hover">
                {test.title}
              </h2>
              <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
                {test.description}
              </p>
              <Button asChild className="mt-6 w-fit">
                <Link href={`/testler/${test.slug}`}>Teste Başla</Link>
              </Button>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
