import { ContactForm } from "@/features/contact/components/contact-form";

export default function ContactPage() {
  return (
    <>
      <section className="section-shell relative overflow-hidden border-b border-border/70 bg-[#cce1de]">
        <div className="page-shell">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-primary-hover sm:text-5xl">
              Iletisim
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-8">
              Soru, randevu, oneri veya sikayet bildirimlerinizi tek bir form
              uzerinden iletebilirsiniz. Konu secimine gore talebiniz dogru ekibe
              yonlendirilir.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 pt-10 sm:pt-12 lg:pt-16">
        <div className="page-shell">
          <ContactForm
            title="Bize Ulasin"
            description="Soru, randevu, oneri veya diger taleplerinizi tek form uzerinden iletebilirsiniz."
          />
        </div>
      </section>
    </>
  );
}
