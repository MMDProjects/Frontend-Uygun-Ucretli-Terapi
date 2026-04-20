import { PageIntro } from "@/components/common/page-intro";

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;

  return (
    <>
      <PageIntro
        title={slug.replaceAll("-", " ")}
        description="Blog detay, icerik bloklari ve ilgili yazilar alani icin temel sayfa olusturuldu."
      />
      <section className="pb-16">
        <div className="page-shell">
          <article className="surface-card max-w-4xl p-8">
            <div className="space-y-4 text-muted-foreground">
              <p>
                Bu alan ilerleyen asamalarda CMS veya API kaynakli blog icerigiyle
                beslenecek.
              </p>
              <p>
                Mevcut kurulum, route yapisi ve sayfa kabugunu hazir hale getirir.
              </p>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
