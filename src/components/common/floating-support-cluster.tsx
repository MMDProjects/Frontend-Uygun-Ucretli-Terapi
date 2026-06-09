"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircleMore, HelpCircle } from "lucide-react";

import { siteConfig } from "@/lib/constants/site";
import { WheelOfFortune } from "@/features/common/wheel-of-fortune";
import { WelcomeOnboardingCard } from "@/components/common/welcome-onboarding-card";
import { useAuthStore } from "@/lib/stores/auth-store";

const ONBOARD_KEY_PREFIX = "psk_ob_";

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
  const { isAuthenticated, userId, displayName, role } = useAuthStore();

  const [wheelOpen, setWheelOpen] = useState(false);
  const [onboardOpen, setOnboardOpen] = useState(false);
  const [showOnboardBtn, setShowOnboardBtn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated || !userId || role !== "danisan") {
      setShowOnboardBtn(false);
      return;
    }
    const dismissed = localStorage.getItem(`${ONBOARD_KEY_PREFIX}${userId}`);
    setShowOnboardBtn(!dismissed);
  }, [mounted, isAuthenticated, userId, role]);

  const handleOnboardClose = () => {
    setOnboardOpen(false);
    setShowOnboardBtn(false);
    if (userId) {
      localStorage.setItem(`${ONBOARD_KEY_PREFIX}${userId}`, "1");
    }
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-5 sm:right-5">
        {/* Onboarding ? butonu — sadece ilk kez gösterilir */}
        {showOnboardBtn && (
          <button
            type="button"
            onClick={() => setOnboardOpen(true)}
            className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-lg ring-2 ring-primary/30 transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Başlangıç rehberini aç"
          >
            <HelpCircle className="size-5" />
          </button>
        )}

        {/* Çark butonu */}
        <button
          type="button"
          onClick={() => setWheelOpen(true)}
          className="inline-flex size-14 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-lg ring-2 ring-primary/30 transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label="Çarkı çevir ve ödül kazan"
        >
          <WheelIcon className="size-7" />
        </button>

        {/* Canlı Destek */}
        <Link
          href={siteConfig.whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold !text-white shadow-lg transition hover:bg-primary-hover hover:!text-white [&_svg]:!text-white"
        >
          <MessageCircleMore className="size-4" aria-hidden />
          Canlı Destek
        </Link>
      </div>

      {wheelOpen && <WheelOfFortune onClose={() => setWheelOpen(false)} />}

      {onboardOpen && (
        <WelcomeOnboardingCard
          displayName={displayName}
          onClose={handleOnboardClose}
        />
      )}
    </>
  );
}
