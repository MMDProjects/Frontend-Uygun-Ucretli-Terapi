import { SectionHeading } from "@/components/common/section-heading";
import { ExpertCard } from "@/features/experts/components/expert-card";
import { recommendedHomeExperts } from "@/features/shared/data/mock-content";

export function PortfolioSection() {
  if (recommendedHomeExperts.length === 0) {
    return null;
  }

  return (
    <section
      className="bg-[#cce1de] py-20"
      aria-labelledby="home-recommended-experts-heading"
    >
      <div className="page-shell space-y-8">
        <SectionHeading
          title="Önerilen uzmanlarımız"
          description="Alanında deneyimli, seçilmiş terapistler"
          titleId="home-recommended-experts-heading"
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {recommendedHomeExperts.slice(0, 4).map((expert) => (
            <ExpertCard
              key={expert.slug}
              expert={expert}
              className="!rounded-[2rem] border-border/60 bg-white shadow-sm"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
