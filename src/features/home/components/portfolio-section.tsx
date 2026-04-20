import { SectionHeading } from "@/components/common/section-heading";
import { ExpertCard } from "@/features/experts/components/expert-card";
import { recommendedHomeExperts } from "@/features/shared/data/mock-content";

export function PortfolioSection() {
  return (
    <section
      className="bg-[#cce1de] py-12 sm:py-16 lg:py-20"
      aria-labelledby="home-recommended-experts-heading"
    >
      <div className="page-shell space-y-8">
        <SectionHeading
          title="Önerilen uzmanlarımız"
          description="Admin onaylı profiller; yıldız puanı, uzmanlık alanları ve kısa tanıtımlarla güvenilir eşleşmeye ilk adımı atın. Fiyat bilgisi yalnızca paketler sayfasında yer alır."
          titleId="home-recommended-experts-heading"
        />
        <div
          className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
          role="list"
          aria-label="Önerilen uzmanlar"
        >
          {recommendedHomeExperts.map((expert) => (
            <div key={expert.slug} role="listitem" className="min-h-0">
              <ExpertCard expert={expert} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
