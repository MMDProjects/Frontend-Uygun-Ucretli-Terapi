"use client";

import type { RefObject } from "react";

import { cn } from "@/lib/utils";

import type { HowItWorksStep } from "../data/steps";

type HowItWorksStepNumbersProps = {
  steps: readonly HowItWorksStep[];
  activeIndex: number;
  scrollerRef: RefObject<HTMLDivElement | null>;
  onScroll?: () => void;
  onSelectStep: (index: number) => void;
};

/**
 * W şekli: 01 sol üst → 02 sol alt → 03 orta üst (tepe) → 04 sağ alt → 05 sağ üst.
 * (index sırası 0–4 = adım 01–05)
 */
const SCATTER_POSITIONS: readonly { top: string; left: string }[] = [
  { top: "14%", left: "10%" },
  { top: "70%", left: "24%" },
  { top: "12%", left: "50%" },
  { top: "70%", left: "76%" },
  { top: "14%", left: "90%" },
];

export function HowItWorksStepNumbers({
  steps,
  activeIndex,
  scrollerRef,
  onScroll,
  onSelectStep,
}: HowItWorksStepNumbersProps) {
  return (
    <div
      ref={scrollerRef}
      onScroll={onScroll ?? undefined}
      className={cn(
        "relative h-full min-h-[14rem] w-full max-w-xl lg:min-h-full",
      )}
      role="group"
      aria-label="Adım numaraları"
    >
      {steps.map((step, index) => {
        const pos = SCATTER_POSITIONS[index] ?? SCATTER_POSITIONS[0];
        const isCurrent = index === activeIndex;
        const isReached = index <= activeIndex;
        return (
          <div
            key={step.id}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2",
              isCurrent ? "z-20" : isReached ? "z-[15]" : "z-10",
            )}
            style={{ top: pos.top, left: pos.left }}
          >
            <button
              type="button"
              data-step-index={index}
              onClick={() => onSelectStep(index)}
              className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-full border-[3px] sm:size-14 md:size-16",
                "transition-[background-color,border-color,color,box-shadow] duration-300 ease-out motion-reduce:transition-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isReached
                  ? cn(
                      "border-white bg-primary text-white shadow-md ring-1 ring-primary/25",
                      isCurrent && "how-it-works-pin-glow",
                    )
                  : "border-background bg-card text-primary shadow-md ring-1 ring-primary/10 hover:bg-muted/70",
              )}
              aria-current={isCurrent ? "step" : undefined}
              aria-label={`${step.order} ${step.title}`}
            >
              <span
                className={cn(
                  "font-bold tabular-nums tracking-tighter transition-colors duration-300 motion-reduce:transition-none",
                  "text-base leading-none sm:text-lg md:text-xl",
                  isReached ? "text-white" : "text-primary",
                )}
              >
                {step.order}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
