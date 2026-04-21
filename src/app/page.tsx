import type { Metadata } from "next";

import {
  AboutHomeSection,
  FinalCtaSection,
  HeroSection,
  HomeBentoSection,
  HomeFaqSection,
  OfferingsShowcaseSection,
  PortfolioSection,
  TestimonialsSection,
} from "@/features/home";
import { siteConfig } from "@/lib/constants/site";

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

export default function Home() {
  return (
    <>
      <HeroSection />
      <OfferingsShowcaseSection />
      <PortfolioSection />
      <HomeBentoSection />
      <TestimonialsSection />
      <AboutHomeSection />
      <HomeFaqSection />
      <FinalCtaSection />
    </>
  );
}
