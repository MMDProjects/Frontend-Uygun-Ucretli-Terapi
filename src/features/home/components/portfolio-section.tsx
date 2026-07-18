"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/common/section-heading";
import { ExpertCardApi } from "@/features/experts/components/expert-card-api";
import type { ApiExpertSummary } from "@/lib/services/public.service";

type Props = {
  experts: ApiExpertSummary[];
};

export function PortfolioSection({ experts }: Props) {
  if (experts.length === 0) return null;

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    [Autoplay({ delay: 3500, stopOnInteraction: true, stopOnMouseEnter: true })],
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section
      className="bg-[#cce1de] py-20"
      aria-labelledby="home-recommended-experts-heading"
    >
      <div className="page-shell space-y-8">
        <div className="flex items-end justify-between">
          <SectionHeading
            title="Önerilen uzmanlarımız"
            description="Alanında deneyimli, uzmanlar"
            titleId="home-recommended-experts-heading"
          />
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Önceki uzman"
              className="flex size-9 items-center justify-center rounded-full border border-[#016a59]/30 bg-white text-[#016a59] transition-colors hover:bg-[#016a59] hover:text-white"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              aria-label="Sonraki uzman"
              className="flex size-9 items-center justify-center rounded-full border border-[#016a59]/30 bg-white text-[#016a59] transition-colors hover:bg-[#016a59] hover:text-white"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-5">
            {experts.map((expert) => (
              <div
                key={expert.id}
                className="min-w-0 shrink-0 grow-0 basis-full pl-5 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <ExpertCardApi
                  expert={expert}
                  className="!rounded-[2rem] border-border/60 bg-white shadow-sm"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
