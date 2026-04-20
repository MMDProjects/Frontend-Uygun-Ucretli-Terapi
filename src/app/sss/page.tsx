import { PageIntro } from "@/components/common/page-intro";

export default function FaqPage() {
  return (
    <>
      <PageIntro
        title="Sikca sorulan sorular icin temel sayfa"
        description="Admin yonetimli soru-cevap yapisi icin bu rota simdiden hazirlandi."
      />
      <section className="pb-16">
        <div className="page-shell space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <article key={index} className="surface-card p-6">
              <p className="font-semibold text-primary-hover">
                Ornek soru {index + 1}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Icerik sonraki iterasyonda admin kaynakli veriyle beslenecek.
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
