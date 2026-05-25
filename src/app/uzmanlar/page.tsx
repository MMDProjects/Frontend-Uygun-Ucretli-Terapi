import { ExpertsHeroSection } from "@/features/experts/components/experts-hero-section";
import { ExpertCardApi } from "@/features/experts/components/expert-card-api";
import { ExpertCardSkeleton } from "@/features/experts/components/expert-card-skeleton";
import { getExperts } from "@/lib/services/public.service";

export const revalidate = 60;

export default async function ExpertsPage() {
  let experts: Awaited<ReturnType<typeof getExperts>>["data"] = [];
  let error = false;

  try {
    const res = await getExperts({ limit: 20 });
    experts = res.data;
  } catch {
    error = true;
  }

  return (
    <>
      <ExpertsHeroSection />
      <section className="bg-[#e6f0ee] py-12">
        <div className="page-shell grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {error ? (
            <p className="col-span-full text-center text-sm text-muted-foreground">
              Uzmanlar yüklenemedi. Lütfen daha sonra tekrar deneyin.
            </p>
          ) : experts.length === 0 ? (
            Array.from({ length: 8 }).map((_, i) => (
              <ExpertCardSkeleton key={i} />
            ))
          ) : (
            experts.map((expert) => (
              <ExpertCardApi
                key={expert.id}
                expert={expert}
                className="!rounded-[2rem] border-border/60 bg-white shadow-sm"
              />
            ))
          )}
        </div>
      </section>
    </>
  );
}
