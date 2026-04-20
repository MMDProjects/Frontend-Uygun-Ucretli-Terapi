import { PageIntro } from "@/components/common/page-intro";

export default function AboutPage() {
  return (
    <>
      <PageIntro
        title="Bizi diger platformlardan ayiran ozellikler"
        description="Hakkimizda sayfasi briefteki revizeye uygun bicimde ekip/hikaye yerine farklastirici deger onerilerine odaklanir."
      />
      <section className="pb-16">
        <div className="page-shell grid gap-6 md:grid-cols-3">
          {[
            "Admin onayli uzman profilleri",
            "Mobil oncelikli deneyim ve skeleton yukleme",
            "Guvenli ve sade talep akis tasarimi",
          ].map((item) => (
            <article key={item} className="surface-card p-6">
              <p className="text-base font-semibold text-primary-hover">{item}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
