import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const testHighlights = [
  {
    name: "Depresyon Belirti Testi",
    field: "Duygu durumu",
    description: "Mevcut ruh halinizi kisa sorularla degerlendirin.",
  },
  {
    name: "Anksiyete Duzeyi Testi",
    field: "Kaygi analizi",
    description: "Gunluk yasam kaygi etkisini puanlayarak gorun.",
  },
  {
    name: "Stres Farkindalik Testi",
    field: "Stres yonetimi",
    description: "Stres tetikleyicilerinizi erken fark edin.",
  },
] as const;

export function HomeBentoSection() {
  return (
    <section className="bg-muted py-12 sm:py-16 lg:py-20" aria-labelledby="home-bento-title">
      <div className="page-shell">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr]">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <article className="rounded-[1.75rem] border border-border bg-background p-6 shadow-sm lg:col-span-3 lg:min-h-[200px]">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
                Testlerle kendinizi taniyin
              </p>
              <h2
                id="home-bento-title"
                className="mt-3 text-balance text-2xl font-bold tracking-tight text-primary-hover sm:text-3xl"
              >
                Bilimsel olceklere dayali testlerle dogru adimi daha net atin
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                Kisa surede tamamlanan testler sayesinde ruh halinizi olcun, sonuclari
                yorumlayin ve size uygun destek yolunu belirleyin.
              </p>
            </article>

            {testHighlights.map((item) => (
              <article
                key={item.name}
                className="rounded-[1.75rem] border border-border bg-background p-5 shadow-sm lg:min-h-[200px]"
              >
                <p className="text-sm font-semibold text-primary">{item.field}</p>
                <h3 className="mt-2 text-lg font-bold text-foreground">{item.name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
              </article>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-[1fr_2fr]">
            <article className="relative min-h-[200px] overflow-hidden rounded-[1.75rem] border border-border bg-background shadow-sm">
              <Image
                src="/images/herosect.png"
                alt="Kristina profil gorseli"
                fill
                sizes="(max-width: 640px) 100vw, 16vw"
                className="object-cover object-top"
              />
            </article>

            <article className="rounded-[1.75rem] border border-border bg-background p-5 shadow-sm sm:min-h-[200px]">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
                Test deneyimi
              </p>
              <h3 className="mt-2 text-xl font-bold text-foreground">Kisa, anlasilir ve guvenli</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Her test adim adim ilerler; sonuc ekraninda guclu alanlariniz ve riskli
                basliklariniz sade bir dille ozetlenir.
              </p>
            </article>

            <article className="rounded-[1.75rem] border border-border bg-primary p-4 shadow-sm sm:col-span-2">
              <Button
                asChild
                variant="secondary"
                className="h-12 w-full rounded-full bg-white px-6 text-sm font-semibold text-primary hover:bg-white/90"
              >
                <Link href="/testler">Testlere hemen basla</Link>
              </Button>
            </article>

            <article className="rounded-[1.75rem] border border-border bg-[#cce1de] p-5 shadow-sm sm:col-span-2 sm:min-h-[150px]">
              <p className="text-sm font-semibold text-primary-active">Sonuc ve yonlendirme</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                Test sonrasinda uygun uzman alanlarini gorur, isterseniz tek tikla
                psikolojik destek talebine gecis yapabilirsiniz.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
