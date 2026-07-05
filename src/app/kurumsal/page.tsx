import { Building2, Users, BarChart3, ShieldCheck, Headphones, Award } from "lucide-react";

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
              Kurumlara özel online destek çözümleri için bizimle iletişime
              geçin. İhtiyacınıza uygun model ve teklif çalışmasını birlikte
              planlayalım.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#e6f0ee] py-12">
        <div className="page-shell grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-border/60 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-primary-hover">
              Kurumlara özel yaklaşım
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Çalışan refahı, üretkenlik ve kurumsal iklim üzerinde doğrudan etkisi
              olan online destek programlarını kurumunuzun yapısına göre
              tasarlıyoruz.
            </p>

            <ul className="mt-6 space-y-5">
              <li className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-primary">
                  <Users className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-primary-hover">Çalışan Destek Programı</p>
                  <p className="text-sm text-muted-foreground">Bireysel ve grup seanslarıyla çalışanların stres, kaygı ve tükenmişlikle başa çıkmasını destekliyoruz.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-primary">
                  <Building2 className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-primary-hover">Kurumsal Danışmanlık</p>
                  <p className="text-sm text-muted-foreground">İş yeri psikolojisi, liderlik koçluğu ve ekip dinamikleri üzerine stratejik danışmanlık hizmetleri sunuyoruz.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-primary">
                  <BarChart3 className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-primary-hover">Ölçülebilir Sonuçlar</p>
                  <p className="text-sm text-muted-foreground">Süreç boyunca düzenli raporlarla çalışan memnuniyeti, devamsızlık ve üretkenlik üzerindeki etkiyi takip ediyoruz.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-primary">
                  <Award className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-primary-hover">Eğitim ve Atölyeler</p>
                  <p className="text-sm text-muted-foreground">Stres yönetimi, iletişim becerileri ve psikolojik dayanıklılık konularında yüz yüze veya online atölyeler düzenliyoruz.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-primary">
                  <ShieldCheck className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-primary-hover">Veri Güvenliği</p>
                  <p className="text-sm text-muted-foreground">Tüm çalışan verileri KVKK uyumlu, AES-256 şifreli altyapımızda saklanır. Bireysel bilgiler kurumla paylaşılmaz.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-primary">
                  <Headphones className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-primary-hover">Dedicated Destek</p>
                  <p className="text-sm text-muted-foreground">Her kurumsal müşterimize özel hesap yöneticisi atanır; süreç boyunca tek noktadan destek alırsınız.</p>
                </div>
              </li>
            </ul>
          </div>

          <ContactForm
            title="Kurumsal İletişim Formu"
            description="Kurumunuzun ihtiyaçlarını iletin, ekip sizinle en kısa sürede iletişime geçsin."
            variant="corporate"
          />
        </div>
      </section>
    </>
  );
}
