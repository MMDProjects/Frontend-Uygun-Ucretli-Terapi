import { Sparkles } from "lucide-react";

import { SectionHeading } from "@/components/common/section-heading";

const offerings = [
  {
    title: "Online danismanlik",
    description:
      "Guvenli gorusme altyapisi ile uzmaninizla surekli ve takip edilebilir bir destek akisi sunariz.",
  },
  {
    title: "Kisisel eslestirme",
    description:
      "Ihtiyaciniza uygun uzmanlari tek ekranda karsilastirip dogru uzmanla surece hizli baslamanizi saglariz.",
  },
  {
    title: "Olculebilir ilerleme",
    description:
      "Testler, notlar ve surec odakli yonlendirmeler ile gelisiminizi adim adim gorunur hale getiririz.",
  },
  {
    title: "Gizlilik ve guven",
    description:
      "KVKK odakli veri yonetimi ve acik riza akislariyla tum sureci guvenli, seffaf ve kontrollu tutariz.",
  },
] as const;

export function OfferingsShowcaseSection() {
  return (
    <section className="bg-[#e6f0ee] py-20" aria-labelledby="home-offerings-heading">
      <div className="page-shell space-y-8">
        <div className="flex items-start justify-between gap-4">
          <SectionHeading
            title="Neler sundugumuzu tek bakista gorun"
            description="Online danismanlik surecinde guvenli gorusme, uzman eslestirme, olculebilir ilerleme ve KVKK uyumlu veri korumasi sunuyoruz."
            titleId="home-offerings-heading"
          />
          <div className="hidden rounded-full bg-primary/10 p-3 text-primary md:block">
            <Sparkles className="size-6" aria-hidden />
          </div>
        </div>

        <div className="grid gap-5 md:gap-x-5 md:gap-y-8 md:grid-cols-2 xl:gap-4 xl:grid-cols-4">
          {offerings.map((item, index) => {
            if (index === 1) {
              return (
                <div key={item.title} className="relative isolate overflow-visible pb-3 md:pb-4 xl:pb-0">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-0 translate-x-2 -translate-y-4 rotate-[4deg] rounded-[2rem] bg-[#cce1de] md:translate-x-3 md:-translate-y-6 md:rotate-[6deg] xl:translate-x-5 xl:-translate-y-10 xl:rotate-[8deg]"
                  />
                  <article
                    className="offerings-card-shake relative z-10 translate-y-2 rotate-[-2deg] overflow-hidden rounded-[2rem] border border-border/60 bg-white p-6 shadow-sm md:translate-y-3 md:rotate-[-3deg] xl:translate-y-5 xl:rotate-[-5deg]"
                    style={{ animationDelay: `${index * 0.55}s` }}
                  >
                    <h3 className="text-xl font-semibold leading-tight text-primary-hover">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
                  </article>
                </div>
              );
            }

            return (
              <article
                key={item.title}
                className="offerings-card-shake relative overflow-hidden rounded-[2rem] border border-border/60 bg-white p-6 shadow-sm"
                style={{ animationDelay: `${index * 0.55}s` }}
              >
                <h3 className="text-xl font-semibold leading-tight text-primary-hover">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
