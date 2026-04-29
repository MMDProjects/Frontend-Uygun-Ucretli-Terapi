import { ExpertCard } from "@/features/experts/components/expert-card";
import { ExpertsHeroSection } from "@/features/experts/components/experts-hero-section";
import { featuredExperts } from "@/features/shared/data/mock-content";

export default function ExpertsPage() {
  return (
    <>
      <ExpertsHeroSection />
      <section className="bg-[#e6f0ee] py-12">
        <div className="page-shell grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredExperts.map((expert) => (
            <ExpertCard
              key={expert.slug}
              expert={expert}
              className="!rounded-[2rem] border-border/60 bg-white shadow-sm"
            />
          ))}
        </div>
      </section>
    </>
  );
}
