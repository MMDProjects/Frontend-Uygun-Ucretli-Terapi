"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { HOW_IT_WORKS_STEPS } from "../data/steps";
import { HowItWorksStepNumbers } from "./how-it-works-step-numbers";
import { HowItWorksTimeline } from "./how-it-works-timeline";

const STEP_COUNT = HOW_IT_WORKS_STEPS.length;
/** Bir tur: 1→5 adım + çubuk baştan sona (ms) — yavaş dolma */
const CYCLE_DURATION_MS = 22_000;

/**
 * Sürekli animasyonda `activeIndex` geçişini hafif geciktirir: pinler kartta fotoğraf
 * ortasında kalır (konum değişmez), üstteki vurgulu numara / aktif pin daha geç
 * değişir — böylece “sayı foto üst kenarında” erken sıçraması azalır.
 * `progress01 * STEP_COUNT` birimiyle aynı ölçekte (≈0.35–0.5 arası denenebilir).
 */
const ACTIVE_STEP_TIME_BIAS = 0.4;

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

function wrapElapsed(elapsed: number, cycle: number): number {
  const x = elapsed % cycle;
  return x < 0 ? x + cycle : x;
}

export function HowItWorksFlow() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [progress01, setProgress01] = useState(0);
  const anchorRef = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();
  const rafRef = useRef<number>(0);

  const activeIndex = useMemo(() => {
    const t = progress01 * STEP_COUNT;
    if (reducedMotion) {
      return Math.min(STEP_COUNT - 1, Math.max(0, Math.floor(t + 1e-9)));
    }
    return Math.min(
      STEP_COUNT - 1,
      Math.max(0, Math.floor(t - ACTIVE_STEP_TIME_BIAS + 1e-9)),
    );
  }, [progress01, reducedMotion]);

  /** Otomatik: çubuk sürekli dolar, adım sınırlarında 1→2→…→5 */
  useEffect(() => {
    if (reducedMotion) {
      anchorRef.current = null;
      return;
    }

    if (anchorRef.current === null) {
      anchorRef.current = performance.now();
    }

    const tick = (now: number) => {
      const anchor = anchorRef.current ?? now;
      const elapsed = wrapElapsed(now - anchor, CYCLE_DURATION_MS);
      setProgress01(elapsed / CYCLE_DURATION_MS);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reducedMotion]);

  /** prefers-reduced-motion: çubuk adım adım sıçrar (sürekli dolma yok) */
  useEffect(() => {
    if (!reducedMotion) return;

    let step = 0;
    const tickMs = CYCLE_DURATION_MS / STEP_COUNT;
    const id = window.setInterval(() => {
      step = (step + 1) % STEP_COUNT;
      setProgress01(step / STEP_COUNT);
    }, tickMs);

    return () => clearInterval(id);
  }, [reducedMotion]);

  const scrollRailToStep = useCallback(
    (index: number) => {
      const root = scrollerRef.current;
      if (!root) return;
      const target = root.querySelector<HTMLElement>(`[data-step-index="${index}"]`);
      target?.scrollIntoView({
        inline: "center",
        block: "nearest",
        behavior: reducedMotion ? "auto" : "smooth",
      });
    },
    [reducedMotion],
  );

  const scrollToStep = useCallback(
    (index: number, jumpProgress = true) => {
      if (jumpProgress && !reducedMotion) {
        const p = (index + 0.5) / STEP_COUNT;
        anchorRef.current = performance.now() - p * CYCLE_DURATION_MS;
        setProgress01(p);
      }
      if (jumpProgress && reducedMotion) {
        setProgress01((index + 0.5) / STEP_COUNT);
      }
      /** Yalnızca tıklamada şerit kayar; animasyon activeIndex ile asla kaydırmaz. */
      scrollRailToStep(index);
    },
    [reducedMotion, scrollRailToStep],
  );

  return (
    <>
      <section className="section-shell relative overflow-hidden border-b border-border/70 bg-[#cce1de]">
        <div className="page-shell space-y-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch lg:justify-between lg:gap-10">
            <div className="w-full max-w-xl shrink-0 space-y-3 lg:pb-1">
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-primary-hover sm:text-5xl">
                Nasıl çalışır?
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-8">
                Uzman seçiminden ilk seansa kadar her adımı şeffaf ve öngörülebilir biçimde tasarladık.
                Aşağıdaki adımlara tıklayarak süreci keşfedebilirsiniz.
              </p>
            </div>

            <div className="flex min-h-[14rem] w-full max-w-xl shrink-0 flex-col self-stretch justify-center lg:min-h-0">
              <HowItWorksStepNumbers
                steps={HOW_IT_WORKS_STEPS}
                activeIndex={activeIndex}
                scrollerRef={scrollerRef}
                onSelectStep={(i) => scrollToStep(i, true)}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#e6f0ee] py-12">
        <div className="page-shell">
          <h2 className="sr-only">Süreç özeti</h2>
          <HowItWorksTimeline
            steps={HOW_IT_WORKS_STEPS}
            activeIndex={activeIndex}
            progressPercent={progress01 * 100}
            onSelectStep={(i) => scrollToStep(i, true)}
          />

        </div>
      </section>
    </>
  );
}
