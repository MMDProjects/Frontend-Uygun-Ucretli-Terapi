import type { Metadata } from "next";

import {
  AboutHomeSection,
  HeroSection,
  HomeBentoSection,
  HomeFaqSection,
  OfferingsShowcaseSection,
  PortfolioSection,
} from "@/features/home";
import { ExpertsMarquee } from "@/features/experts/components/experts-marquee";
import { TestsCtaSection } from "@/features/home/components/tests-cta-section";
import { siteConfig } from "@/lib/constants/site";
import { getExperts } from "@/lib/services/public.service";

const homeDescription =
  "Online psikolojik danışmanlıkta güvenilir uzmanlar, KVKK uyumu, testler ve şeffaf süreç — tek platformda.";

export const metadata: Metadata = {
  title: "Ana Sayfa",
  description: homeDescription,
  openGraph: {
    title: `Ana Sayfa | ${siteConfig.name}`,
    description: homeDescription,
    locale: "tr_TR",
    type: "website",
  },
};

export const revalidate = 300;

export default async function Home() {
  let experts: Awaited<ReturnType<typeof getExperts>>["data"] = [];
  try {
    const res = await getExperts({ limit: 10 });
    experts = res.data;
  } catch {
    experts = [];
  }

  return (
    <>
      <HeroSection />
      <ExpertsMarquee experts={experts} />
      <OfferingsShowcaseSection />
      <PortfolioSection experts={experts} />
      <TestsCtaSection />
      <HomeBentoSection />
      <AboutHomeSection />
      <HomeFaqSection />
    </>
  );
}
