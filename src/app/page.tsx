import type { Metadata } from "next";

import {
  AboutHomeSection,
  HeroSection,
  HomeBentoSection,
  HomeFaqSection,
  OfferingsShowcaseSection,
  PortfolioSection,
} from "@/features/home";
import { siteConfig } from "@/lib/constants/site";
import { getExperts } from "@/lib/services/public.service";

const homeDescription =
  "Online danışmanlıkta güvenilir uzmanlar, KVKK uyumu, testler ve şeffaf süreç — tek platformda.";

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

export const revalidate = 0;

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
      <OfferingsShowcaseSection />
      <PortfolioSection experts={experts} />
      <HomeBentoSection />
      <AboutHomeSection />
      <HomeFaqSection />
    </>
  );
}
