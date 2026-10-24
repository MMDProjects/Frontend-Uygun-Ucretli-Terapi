import type { Metadata } from "next";
import { ExpertsHeroSection } from "@/features/experts/components/experts-hero-section";
import { ExpertCardApi } from "@/features/experts/components/expert-card-api";
import { ExpertsLoadMore } from "@/features/experts/components/experts-load-more";
import { EXPERTS_PAGE_SIZE } from "@/features/experts/constants";
import { getExperts, getPublicPricing } from "@/lib/services/public.service";

export const metadata: Metadata = {
  title: "Uzmanlarımız",
  description:
    "Admin onaylı psikolog, terapist ve psikolojik danışmanlarımızı inceleyin. Ücretsiz ön görüşme ile size en uygun uzmanı bulun.",
  alternates: {
    canonical: "/uzmanlar",
  },
  openGraph: {
    title: "Uzmanlarımız | Yeçamer",
    description:
      "Admin onaylı psikolog, terapist ve psikolojik danışmanlarımızı inceleyin. Ücretsiz ön görüşme ile size en uygun uzmanı bulun.",
    url: "https://yecamer.com.tr/uzmanlar",
  },
};

export const revalidate = 0;

export default async function ExpertsPage() {
  let experts: Awaited<ReturnType<typeof getExperts>>["data"] = [];
  let total = 0;
  let error = false;
  let standardPrice: number | undefined;
  let discountedPrice: number | undefined;

  try {
    const [expertsRes, pricing] = await Promise.all([
      getExperts({ page: 1, limit: EXPERTS_PAGE_SIZE }),
      getPublicPricing(),
    ]);
    experts = expertsRes.data;
    total = expertsRes.total;
    standardPrice = pricing.standardPrice;
    discountedPrice = pricing.discountedPrice;
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
            <p className="col-span-full py-12 text-center text-sm text-muted-foreground">
              Henüz yayında uzman bulunmuyor.
            </p>
          ) : (
            experts.map((expert) => (
              <ExpertCardApi
                key={expert.id}
                expert={expert}
                standardPrice={standardPrice}
                discountedPrice={discountedPrice}
                className="!rounded-[2rem] border-border/60 bg-white shadow-sm"
              />
            ))
          )}
          {!error && experts.length > 0 && (
            <ExpertsLoadMore
              initialCount={experts.length}
              total={total}
              standardPrice={standardPrice}
              discountedPrice={discountedPrice}
            />
          )}
        </div>
      </section>
    </>
  );
}
