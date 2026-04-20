import { PageIntro } from "@/components/common/page-intro";

type TestDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function TestDetailPage({ params }: TestDetailPageProps) {
  const { slug } = await params;

  return (
    <>
      <PageIntro
        title={`${slug} testi`}
        description="Anlik sonuc karti, grafik ve uzman onerisi CTA akisi icin detay ekrani ayrildi."
      />
      <section className="pb-16">
        <div className="page-shell">
          <div className="surface-card p-8">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="skeleton h-32 rounded-3xl" />
              <div className="skeleton h-32 rounded-3xl" />
              <div className="skeleton h-32 rounded-3xl" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
