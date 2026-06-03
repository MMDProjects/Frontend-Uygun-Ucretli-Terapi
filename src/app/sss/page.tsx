import { PageIntro } from "@/components/common/page-intro";
import { getSss } from "@/lib/services/public.service";

export const revalidate = 0;

export default async function FaqPage() {
  let items: Awaited<ReturnType<typeof getSss>> = [];
  try {
    items = await getSss("GENEL");
  } catch {
    items = [];
  }

  return (
    <>
      <PageIntro
        title="Sıkça Sorulan Sorular"
        description="Aklınızdaki soruların cevaplarını burada bulabilirsiniz."
      />
      <section className="pb-16">
        <div className="page-shell space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-12">
              Henüz soru-cevap eklenmemiş.
            </p>
          ) : (
            items
              .sort((a, b) => a.order - b.order)
              .map((item) => (
                <article key={item.id} className="surface-card p-6">
                  <p className="font-semibold text-primary-hover">{item.question}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground whitespace-pre-line">
                    {item.answer}
                  </p>
                </article>
              ))
          )}
        </div>
      </section>
    </>
  );
}
