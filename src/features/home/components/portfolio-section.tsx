import { SectionHeading } from "@/components/common/section-heading";
import { ExpertCard } from "@/features/experts/components/expert-card";
import { recommendedHomeExperts } from "@/features/shared/data/mock-content";
import Image from "next/image";

export function PortfolioSection() {
  if (recommendedHomeExperts.length === 0) {
    return null;
  }

  return (
    <section
      className="min-h-[100svh] bg-[#cce1de] pb-8 pt-[calc(var(--site-header-height)+1rem)] sm:pb-10 sm:pt-[calc(var(--site-header-height)+1.25rem)]"
      aria-labelledby="home-recommended-experts-heading"
    >
      <div className="page-shell h-full space-y-5 py-2 sm:space-y-6 sm:py-3">
        <SectionHeading
          title="Önerilen uzmanlarımız"
          titleId="home-recommended-experts-heading"
        />
        <div
          className="grid h-full min-h-[calc(100svh-var(--site-header-height)-8rem)] grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4"
          role="list"
          aria-label="Önerilen uzman görsel ızgarası"
        >
          {Array.from({ length: 4 }, (_, columnIndex) => {
            const columnExpert =
              recommendedHomeExperts[columnIndex % recommendedHomeExperts.length];
            const topIsSmall = columnIndex % 2 === 0;

            return (
              <div
                key={`mosaic-col-${columnIndex}`}
                className="flex h-full flex-col gap-3 lg:gap-4"
              >
                <article
                  role="listitem"
                  className={`relative min-h-0 overflow-hidden rounded-3xl bg-white/60 ${
                    topIsSmall ? "flex-[4]" : "flex-[6]"
                  }`}
                >
                  {topIsSmall ? (
                    <Image
                      src={columnExpert.photoUrl}
                      alt={`${columnExpert.name} profil fotoğrafı`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 639px) 48vw, (max-width: 1023px) 31vw, 19vw"
                    />
                  ) : (
                    <ExpertCard
                      expert={columnExpert}
                      showPhoto={false}
                      className="h-full min-h-0 rounded-3xl border-white/70 shadow-none"
                    />
                  )}
                </article>

                <article
                  role="listitem"
                  className={`relative min-h-0 overflow-hidden rounded-3xl bg-white/60 ${
                    topIsSmall ? "flex-[6]" : "flex-[4]"
                  }`}
                >
                  {topIsSmall ? (
                    <ExpertCard
                      expert={columnExpert}
                      showPhoto={false}
                      className="h-full min-h-0 rounded-3xl border-white/70 shadow-none"
                    />
                  ) : (
                    <Image
                      src={columnExpert.photoUrl}
                      alt={`${columnExpert.name} profil fotoğrafı`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 639px) 48vw, (max-width: 1023px) 31vw, 19vw"
                    />
                  )}
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
