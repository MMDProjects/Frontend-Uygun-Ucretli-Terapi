"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X, FlaskConical, UserSearch, ClipboardList, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Button } from "@/components/ui/button";

const STORAGE_KEY_PREFIX = "psk_ob_";

const FEATURES = [
  {
    icon: FlaskConical,
    label: "Test Arşiviniz",
    desc: "Önceki sonuçlarınızı görüntüleyin",
    href: "/testlerim",
  },
  {
    icon: UserSearch,
    label: "Uzman Bul",
    desc: "Size uygun uzmanı keşfedin",
    href: "/uzmanlar",
  },
  {
    icon: ClipboardList,
    label: "Profilim",
    desc: "Hesap bilgilerinizi yönetin",
    href: "/profilim",
  },
] as const;

export function WelcomeOnboardingCard() {
  const { isAuthenticated, userId, displayName, role } = useAuthStore();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!isAuthenticated || !userId || role !== "danisan") {
      setVisible(false);
      return;
    }

    const key = `${STORAGE_KEY_PREFIX}${userId}`;
    if (localStorage.getItem(key)) return;

    // Sayfa yüklendikten kısa süre sonra göster
    timerRef.current = setTimeout(() => setVisible(true), 700);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [mounted, isAuthenticated, userId, role]);

  const dismiss = () => {
    setVisible(false);
    if (userId) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${userId}`, "1");
    }
  };

  if (!mounted || !visible) return null;

  const firstName = displayName?.split(" ")[0] ?? displayName ?? "";
  const initials =
    displayName
      ?.split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() ?? "•";

  return (
    <div
      role="complementary"
      aria-label="Hoş geldiniz bildirimi"
      className="fixed bottom-4 right-4 z-[50] w-[calc(100vw-2rem)] max-w-[22rem] animate-onboard-in sm:bottom-6 sm:right-6"
    >
      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_8px_40px_rgba(1,106,89,0.14),0_2px_12px_rgba(0,0,0,0.07)]">
        {/* Üst renk şeridi */}
        <div className="h-[3px] bg-gradient-to-r from-[#016a59] via-[#4d978b] to-[#99c3bd]" />

        <div className="p-5">
          {/* Başlık satırı */}
          <div className="flex items-start gap-3">
            {/* Baş harf avatar */}
            <div
              aria-hidden
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#e6f0ee] text-[13px] font-bold text-[#016a59]"
            >
              {initials}
            </div>

            <div className="min-w-0 flex-1 pt-0.5">
              <p className="truncate text-sm font-semibold text-foreground">
                {firstName ? `Hoş geldiniz, ${firstName}!` : "Hoş geldiniz!"}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Hesabınızla yapabilecekleriniz
              </p>
            </div>

            {/* Kapat butonu */}
            <button
              type="button"
              onClick={dismiss}
              aria-label="Bildirimi kapat"
              className="cursor-pointer rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Özellik linkleri */}
          <div className="mt-4 space-y-0.5">
            {FEATURES.map(({ icon: Icon, label, desc, href }) => (
              <Link
                key={href}
                href={href}
                onClick={dismiss}
                className="group flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2 transition-colors hover:bg-[#e6f0ee]"
              >
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#e6f0ee] transition-colors group-hover:bg-[#cce1de]">
                  <Icon className="size-3.5 text-[#016a59]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-foreground">{label}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{desc}</p>
                </div>
                <ArrowRight className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>

          {/* CTA */}
          <Button
            onClick={dismiss}
            size="sm"
            className="mt-4 h-9 w-full text-xs font-semibold"
          >
            Keşfetmeye Başla
          </Button>
        </div>
      </div>
    </div>
  );
}
