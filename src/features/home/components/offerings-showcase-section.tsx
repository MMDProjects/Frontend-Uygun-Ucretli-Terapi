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
    <section className="bg-background py-14 sm:py-16 lg:py-20" aria-labelledby="home-offerings-heading">
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

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {offerings.map((item, index) => {
            if (index === 1) {
              return (
                <div key={item.title} className="relative isolate overflow-visible">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-0 translate-x-5 -translate-y-10 rotate-[8deg] rounded-[2rem] bg-[#99c3bd]"
                  />
                  <article className="relative z-10 translate-y-5 rotate-[-5deg] overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary to-primary-hover p-6 text-white shadow-sm">
                    <h3 className="text-xl font-semibold leading-tight">{item.title}</h3>
                    <p className="mt-6 text-sm leading-6 text-white/90">{item.description}</p>
                  </article>
                </div>
              );
            }

            return (
              <article
                key={item.title}
                className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary-hover to-primary p-6 text-white shadow-sm"
              >
                <h3 className="text-xl font-semibold leading-tight">{item.title}</h3>
                <p className="mt-6 text-sm leading-6 text-white/90">{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
