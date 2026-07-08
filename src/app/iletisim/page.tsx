import type { Metadata } from "next";
import { Mail, MessageCircle, Clock, ShieldCheck, HelpCircle, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Soru, randevu, öneri veya şikayet bildirimlerinizi iletebilirsiniz. Mesai saatleri içinde ortalama 4 saat içinde yanıt veriyoruz.",
  openGraph: {
    title: "İletişim | Çaremer",
    description:
      "Soru, randevu, öneri veya şikayet bildirimlerinizi iletebilirsiniz.",
    url: "https://caremer.online/iletisim",
  },
};

import { ContactForm } from "@/features/contact/components/contact-form";

export default function ContactPage() {
  return (
    <>
      <section className="section-shell relative overflow-hidden border-b border-border/70 bg-[#cce1de]">
        <div className="page-shell">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-primary-hover sm:text-5xl">
              İletişim
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-8">
              Soru, randevu, öneri veya şikayet bildirimlerinizi tek bir form
              üzerinden iletebilirsiniz. Konu seçimine göre talebiniz doğru ekibe
              yönlendirilir.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#e6f0ee] py-12">
        <div className="page-shell grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-border/60 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-primary-hover">
              Size nasıl yardımcı olabiliriz?
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Aklınızdaki her türlü soru veya talebiniz için buradayız. Formu
              doldurmanız yeterli — ilgili ekibimiz en kısa sürede size dönüş yapar.
            </p>

            <ul className="mt-6 space-y-5">
              {/* <li className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-primary">
                  <Mail className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-primary-hover">E-posta</p>
                  <p className="text-sm text-muted-foreground">uygunucretliterapi@gmail.com — genel bilgi ve talepler için</p>
                </div>
              </li> */}
              <li className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-primary">
                  <MessageCircle className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-primary-hover">Canlı Destek</p>
                  <p className="text-sm text-muted-foreground">WhatsApp üzerinden anlık destek alabilir, ön görüşme talebinde bulunabilirsiniz.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-primary">
                  <Clock className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-primary-hover">Yanıt Süresi</p>
                  <p className="text-sm text-muted-foreground">Mesai saatleri içinde gelen talepler ortalama 4 saat, diğerleri en geç 24 saat içinde yanıtlanır.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-primary">
                  <ShieldCheck className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-primary-hover">Gizlilik</p>
                  <p className="text-sm text-muted-foreground">Paylaştığınız tüm bilgiler KVKK kapsamında korunur ve yalnızca talebinizin işlenmesi amacıyla kullanılır.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-primary">
                  <HelpCircle className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-primary-hover">Sık Sorulan Sorular</p>
                  <p className="text-sm text-muted-foreground">Yaygın sorularınız için SSS sayfamızı ziyaret edebilir, hızlıca yanıt bulabilirsiniz.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-primary">
                  <Star className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-primary-hover">Değerlendirme</p>
                  <p className="text-sm text-muted-foreground">Hizmet kalitemizi geliştirmek için geri bildirimleriniz bizim için çok değerlidir.</p>
                </div>
              </li>
            </ul>
          </div>

          <ContactForm
            title="Bize Ulaşın"
            description="Soru, randevu, öneri veya diğer taleplerinizi tek form üzerinden iletebilirsiniz."
          />
        </div>
      </section>
    </>
  );
}
