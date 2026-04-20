"use client";

import * as React from "react";

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDelayMs() {
  return randomInt(30_000, 90_000);
}

type LiveUserCountProps = {
  min?: number;
  max?: number;
};

export function LiveUserCount({ min = 8, max = 47 }: LiveUserCountProps) {
  /** Ilk deger yalnizca mount sonrasi set edilir; SSR ile client ilk paint eslesir. */
  const [count, setCount] = React.useState<number | null>(null);

  React.useEffect(() => {
    let timeoutId: number | undefined;
    let cancelled = false;

    const scheduleNext = () => {
      if (cancelled) return;
      timeoutId = window.setTimeout(() => {
        setCount(randomInt(min, max));
        scheduleNext();
      }, randomDelayMs());
    };

    const firstId = window.setTimeout(() => {
      setCount(randomInt(min, max));
      scheduleNext();
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(firstId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [min, max]);

  return (
    <div className="inline-flex h-9 items-center gap-2 rounded-full border border-border/80 bg-white/95 px-4 text-xs font-semibold text-foreground shadow-sm backdrop-blur-sm">
      <span className="relative flex size-3">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500/80 opacity-70" />
        <span className="relative inline-flex size-3 rounded-full bg-emerald-600" />
      </span>
      <span>
        Su an{" "}
        {count === null ? (
          <span
            className="inline-block min-w-[1.25rem] animate-pulse rounded bg-muted align-middle text-transparent tabular-nums"
            aria-hidden
          >
            00
          </span>
        ) : (
          <span className="tabular-nums">{count}</span>
        )}{" "}
        kisi inceliyor
      </span>
    </div>
  );
}

