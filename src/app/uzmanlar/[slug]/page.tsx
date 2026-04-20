import { notFound } from "next/navigation";

import { PageIntro } from "@/components/common/page-intro";
import { featuredExperts } from "@/features/shared/data/mock-content";

type ExpertDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ExpertDetailPage({
  params,
}: ExpertDetailPageProps) {
  const { slug } = await params;
  const expert = featuredExperts.find((item) => item.slug === slug);

  if (!expert) {
    notFound();
  }

  return (
    <>
      <PageIntro
        title={expert.name}
        description={`${expert.title} profili icin fiyat bilgisiz detay yapisi hazirlandi. Talep gonderme ve belge goruntuleme adimlari sonraki iterasyonda eklenecek.`}
      />
      <section className="pb-16">
        <div className="page-shell grid gap-6 lg:grid-cols-[1fr_320px]">
          <article className="surface-card p-8">
            <p className="text-sm leading-7 text-muted-foreground">
              {expert.bio}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {expert.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-primary-hover"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
          <aside className="surface-card p-6">
            <p className="text-sm font-semibold text-primary">Canli Destek</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Detay sayfasinda sabit destek butonu ve talep akisina uygun alan
              ayrilmistir.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
