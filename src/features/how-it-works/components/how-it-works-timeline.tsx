"use client";

import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

import type { HowItWorksStep } from "../data/steps";

type HowItWorksTimelineProps = {
  steps: readonly HowItWorksStep[];
  activeIndex: number;
  /** 0–100: otomatik döngü ile sürekli güncellenen doluluk */
  progressPercent: number;
  onSelectStep: (index: number) => void;
};

/** Masaüstü: orta sütun pin — mobil: sol dar sütun (çizgiyle hizalı) */
const PIN_WRAP =
  "relative z-[2] flex w-12 shrink-0 justify-center md:w-20 md:max-w-full md:justify-self-center";

/**
 * Masaüstü: sol 1–3–5 alt alta; sağ 2 ve 4 kartlar arası satırlarda (birleşimde) ortalanır.
 * grid satırları: auto | esnek ara | auto | esnek ara | auto
 */
const DESKTOP_GRID =
  "md:grid md:grid-cols-[minmax(0,1fr)_4.5rem_minmax(0,1fr)] md:grid-rows-[auto_minmax(2rem,auto)_auto_minmax(2rem,auto)_auto] md:items-stretch md:gap-x-3 md:gap-y-0";

const DESKTOP_PLACE: readonly { card: string; pin: string }[] = [
  { card: "md:col-start-1 md:row-start-1", pin: "md:col-start-2 md:row-start-1 md:self-center" },
  {
    card: "md:col-start-3 md:row-start-2 md:self-center",
    pin: "md:col-start-2 md:row-start-2 md:self-center",
  },
  { card: "md:col-start-1 md:row-start-3", pin: "md:col-start-2 md:row-start-3 md:self-center" },
  {
    card: "md:col-start-3 md:row-start-4 md:self-center",
    pin: "md:col-start-2 md:row-start-4 md:self-center",
  },
  { card: "md:col-start-1 md:row-start-5", pin: "md:col-start-2 md:row-start-5 md:self-center" },
];

function SpineProgressBar({ progressPercent }: { progressPercent: number }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute top-2 bottom-2 z-0 flex w-3 -translate-x-1/2 justify-center",
        /* mobil: pin sütununun merkezi — kartlar sağda tam genişlik */
        "left-[1.5rem]",
        /* md+: grid orta sütun merkezi */
        "md:left-1/2",
      )}
      aria-hidden
    >
      <div className="relative h-full w-2.5 overflow-hidden rounded-full bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]">
        <div
          className="absolute left-0 right-0 top-0 rounded-full bg-primary"
          style={{ height: `${Math.min(100, Math.max(0, progressPercent))}%` }}
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 h-[150%] rounded-full bg-gradient-to-b from-transparent via-white/35 to-transparent how-it-works-spine-gloss",
          )}
        />
      </div>
    </div>
  );
}

function StepPin({ isReached, isCurrent }: { isReached: boolean; isCurrent: boolean }) {
  return (
    <span
      className={cn(
        "relative z-[1] box-border flex size-9 shrink-0 items-center justify-center rounded-full border-[3px] border-background bg-card shadow-md ring-4 ring-background transition-[background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none sm:size-10",
        isReached
          ? cn(
              "border-primary bg-primary",
              isCurrent && "how-it-works-pin-glow",
            )
          : "border-border bg-muted",
      )}
      aria-hidden
    />
  );
}

type StepPanelProps = {
  step: HowItWorksStep;
  isActive: boolean;
  align: "left" | "right";
  onSelect: () => void;
};

/** Üst ~60% koyu hero + alt beyaz içerik — referans kart düzeni */
function StepPanel({ step, isActive, align, onSelect }: StepPanelProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group w-full max-w-none overflow-hidden rounded-[2rem] border border-border/60 bg-white text-left shadow-sm transition-[box-shadow,border-color] duration-300 md:max-w-md",
        "hover:border-primary/30 hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isActive && "border-primary/30 shadow-lg ring-1 ring-primary/15",
      )}
      aria-current={isActive ? "step" : undefined}
    >
      {/* Üst: primary arka plan — yüksek */}
      <div className="relative overflow-hidden bg-primary px-5 pb-6 pt-6 sm:px-6 sm:pb-8 sm:pt-7">
        <div className="flex min-h-0 flex-col gap-4 md:flex-row md:items-stretch md:gap-4">
          <div
            className={cn(
              "flex min-h-0 min-w-0 flex-1 flex-col gap-3",
              align === "right" && "md:order-2 md:text-right",
            )}
          >
            {/* Adım badge — hero section stiliyle tutarlı */}
            <span className={cn("w-fit rounded-full bg-muted px-3 py-1 text-xs font-medium text-primary-hover", align === "right" && "md:ml-auto")}>
              Adım {step.order}
            </span>
            <h3 className="text-balance text-xl font-bold leading-tight tracking-tight text-white sm:text-2xl">
              {step.title}
            </h3>
            <p className="text-sm leading-snug text-white/80">{step.cardTagline}</p>
          </div>

          <div
            className={cn(
              "relative mx-auto aspect-[4/3] w-full max-w-sm shrink-0 overflow-hidden rounded-[1.5rem] md:mx-0 md:aspect-auto md:min-h-0 md:w-56 md:self-stretch",
              align === "right" && "md:order-1",
            )}
          >
            <Image
              src={step.imageSrc}
              alt={step.imageAlt}
              fill
              className="object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
              sizes="(max-width: 768px) 90vw, 10rem"
            />
          </div>
        </div>
      </div>

      {/* Alt: beyaz alan */}
      <div className="border-t border-border/50 bg-white px-5 py-4 sm:px-6 sm:py-5">
        <p className="text-sm font-semibold leading-snug text-primary-hover sm:text-base">{step.summary}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.detail}</p>
        <Link
          href={step.linkHref}
          onClick={(e) => e.stopPropagation()}
          className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {step.linkLabel}
        </Link>
      </div>
    </button>
  );
}

export function HowItWorksTimeline({
  steps,
  activeIndex,
  progressPercent,
  onSelectStep,
}: HowItWorksTimelineProps) {
  return (
    <ol className={cn("relative mx-auto w-full max-w-7xl list-none pb-0", DESKTOP_GRID)}>
      <SpineProgressBar progressPercent={progressPercent} />

      {steps.map((step, index) => {
        const isActive = index === activeIndex;
        const pinReached = index <= activeIndex;
        const place = DESKTOP_PLACE[index] ?? DESKTOP_PLACE[0];
        /** Sol sütun: 0,2,4 — sağ: 1,3 */
        const align: "left" | "right" = index % 2 === 0 ? "left" : "right";

        return (
          <li
            key={step.id}
            className={cn(
              /* mobil: pin kartın dikey ortasında (masaüstündeki self-center gibi) — çubukla hizalı görünür */
              "flex flex-row items-center gap-3 pb-5 last:pb-0 md:contents",
              "sm:gap-3.5 sm:pb-6 sm:last:pb-0",
            )}
          >
            <div className={cn(PIN_WRAP, place.pin)}>
              <StepPin isReached={pinReached} isCurrent={isActive} />
            </div>
            <div
              className={cn(
                "min-w-0 flex-1 md:max-w-md md:justify-self-center",
                place.card,
              )}
            >
              <StepPanel
                step={step}
                isActive={isActive}
                align={align}
                onSelect={() => onSelectStep(index)}
              />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
