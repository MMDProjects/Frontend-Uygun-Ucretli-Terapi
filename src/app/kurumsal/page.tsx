import { ContactForm } from "@/features/contact/components/contact-form";

export default function CorporatePage() {
  return (
    <>
      <section className="section-shell relative overflow-hidden border-b border-border/70 bg-[#cce1de]">
        <div className="page-shell">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-primary-hover sm:text-5xl">
              Kurumsal
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-8">
              Kurumlara ozel psikolojik destek cozumleri icin bizimle iletisime
              gecin. Ihtiyaciniza uygun model ve teklif calismasini birlikte
              planlayalim.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 pt-10 sm:pt-12 lg:pt-16">
        <div className="page-shell grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="surface-card p-8">
            <h2 className="text-2xl font-semibold text-primary-hover">
              Kurumlara ozel yaklasim
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Bu alan, sirketler icin psikolojik destek programlari ve iletisim
              akislarini tanitacak icerik bolumu olarak ayrildi.
            </p>
          </div>
          <ContactForm
            title="Kurumsal Iletisim Formu"
            description="Kurumunuzun ihtiyaclarini iletin, ekip sizinle en kisa surede iletisime gecsin."
            variant="corporate"
          />
        </div>
      </section>
    </>
  );
}
