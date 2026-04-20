"use client";

import Image from "next/image";

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
      <div className="relative h-full w-2.5 overflow-hidden rounded-full bg-muted/95 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]">
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
  const { Icon } = step;
  const textAlignBottom = align === "left" ? "text-left" : "text-left md:text-right";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        /* Uzman kartı (`surface-card`) ile aynı köşe yarıçapı ve kenarlık */
        "group w-full max-w-none overflow-hidden rounded-[var(--radius)] border border-border bg-card text-left shadow-sm transition-[box-shadow,border-color] duration-300 md:max-w-md",
        "hover:border-primary/20 hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isActive && "border-primary/25 shadow-lg ring-1 ring-primary/15",
      )}
      aria-current={isActive ? "step" : undefined}
    >
      {/* Hero: koyu yeşil, grid doku, beyaz başlık + sticker görsel */}
      <div
        className={cn(
          "relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary-hover",
          "px-5 pb-4 pt-4 sm:px-6 sm:pb-5 sm:pt-5",
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "22px 22px",
          }}
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-active/40 via-transparent to-transparent" aria-hidden />

        <div className="relative flex min-h-0 flex-col gap-3 md:flex-row md:items-stretch md:gap-4">
          <div
            className={cn(
              "flex min-h-0 min-w-0 flex-1 flex-col gap-2",
              align === "right" && "md:order-2 md:text-right",
            )}
          >
            <div
              className={cn(
                "flex flex-wrap items-center gap-2",
                align === "right" && "md:flex-row-reverse",
              )}
            >
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white/15 shadow-inner ring-1 ring-white/25 backdrop-blur-sm sm:size-11">
                <Icon className="size-[1.125rem] text-white sm:size-5" aria-hidden />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75">
                Adım {step.order}
              </span>
            </div>
            <h3 className="text-balance text-xl font-bold leading-[1.15] tracking-tight text-white sm:text-2xl sm:leading-tight">
              {step.title}
            </h3>
            <p className="max-w-prose text-sm leading-snug text-white/88 sm:text-[0.9375rem]">{step.cardTagline}</p>
          </div>

          <div
            className={cn(
              "relative mx-auto aspect-[4/3] w-full max-w-sm shrink-0 overflow-hidden rounded-2xl border-[4px] border-white/45 shadow-xl ring-1 ring-black/10 md:mx-0 md:aspect-auto md:min-h-0 md:w-40 md:self-stretch",
              align === "right" && "md:order-1",
            )}
          >
            <Image
              src={step.imageSrc}
              alt={step.imageAlt}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
              sizes="(max-width: 768px) 90vw, 11rem"
            />
          </div>
        </div>
      </div>

      {/* Alt: beyaz alan — özet + detay */}
      <div className={cn("border-t border-border/50 bg-card px-5 py-4 sm:px-6 sm:py-4", textAlignBottom)}>
        <p className="text-sm font-medium leading-snug text-foreground sm:text-base">{step.summary}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.detail}</p>
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
