"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircleMore } from "lucide-react";

import { siteConfig } from "@/lib/constants/site";
import { WheelOfFortune } from "@/features/common/wheel-of-fortune";

function WheelIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    </svg>
  );
}

export function FloatingSupportCluster() {
  const [wheelOpen, setWheelOpen] = useState(false);

  return (
    <>
      <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:right-5 sm:bottom-5">
        <button
          type="button"
          onClick={() => setWheelOpen(true)}
          className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-lg ring-2 ring-secondary/30 transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
          aria-label="Çarkı çevir ve ödül kazan"
        >
          <WheelIcon className="size-7" />
        </button>

        <Link
          href={siteConfig.whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold !text-white shadow-lg transition hover:bg-primary-hover hover:!text-white [&_svg]:!text-white"
        >
          <MessageCircleMore className="size-4" aria-hidden />
          Canlı Destek
        </Link>
      </div>

      {wheelOpen && <WheelOfFortune onClose={() => setWheelOpen(false)} />}
    </>
  );
}
