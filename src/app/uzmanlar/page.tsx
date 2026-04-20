import { ExpertCard } from "@/features/experts/components/expert-card";
import { ExpertsHeroSection } from "@/features/experts/components/experts-hero-section";
import { featuredExperts } from "@/features/shared/data/mock-content";

export default function ExpertsPage() {
  return (
    <>
      <ExpertsHeroSection />
      <section className="pb-16 pt-10 sm:pt-12 lg:pt-16">
        <div className="page-shell grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {featuredExperts.map((expert) => (
            <ExpertCard key={expert.slug} expert={expert} />
          ))}
        </div>
      </section>
    </>
  );
}
