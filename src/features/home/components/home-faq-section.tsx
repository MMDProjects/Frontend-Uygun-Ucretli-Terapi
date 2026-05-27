import Link from "next/link";

import { SectionHeading } from "@/components/common/section-heading";
import { Button } from "@/components/ui/button";
import { getSss } from "@/lib/services/public.service";

export async function HomeFaqSection() {
  const faqs = await getSss("GENEL").catch(() => []);
  // Ana sayfada ilk 6 soruyu göster
  const displayFaqs = faqs.slice(0, 6);

  return (
    <section
      className="bg-[#e6f0ee] py-20"
      aria-labelledby="home-faq-heading"
    >
      <div className="page-shell space-y-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            title="Sıkça sorulan sorular"
            description="Satış ve kayıt öncesi merak edilen başlıkların özeti; tüm liste için SSS sayfasını ziyaret edin."
            titleId="home-faq-heading"
          />
          <Button asChild variant="outline" className="w-full shrink-0 sm:w-auto">
            <Link href="/sss">Tüm SSS</Link>
          </Button>
        </div>

        {displayFaqs.length === 0 ? null : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {displayFaqs.map((item) => (
              <article
                key={item.id}
                className="rounded-[2rem] border border-border/60 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-primary-hover">
                  {item.question}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
