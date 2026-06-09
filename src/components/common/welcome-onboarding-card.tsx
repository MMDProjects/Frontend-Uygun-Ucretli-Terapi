"use client";

import Link from "next/link";
import { X, FlaskConical, UserSearch, ClipboardList, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    icon: FlaskConical,
    label: "Test Arşiviniz",
    desc: "Tamamladığınız testlerin sonuçlarına göz atın",
    href: "/testlerim",
  },
  {
    icon: UserSearch,
    label: "Uzman Bul",
    desc: "Size en uygun uzmanı keşfedip talep gönderin",
    href: "/uzmanlar",
  },
  {
    icon: ClipboardList,
    label: "Profilim",
    desc: "Hesap bilgilerinizi görüntüleyin ve yönetin",
    href: "/profilim",
  },
] as const;

type Props = {
  displayName: string | null;
  onClose: () => void;
};

export function WelcomeOnboardingCard({ displayName, onClose }: Props) {
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
      role="dialog"
      aria-modal="true"
      aria-label="Hoş geldiniz rehberi"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl animate-onboard-in">
        {/* Üst yeşil alan */}
        <div className="relative bg-gradient-to-br from-[#016a59] to-[#014a3e] px-6 pb-8 pt-6">
          {/* Kapat */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="absolute right-4 top-4 flex size-8 cursor-pointer items-center justify-center rounded-full text-white/70 transition hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            <X className="size-4" />
          </button>

          {/* Avatar + isim */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-white/20 text-lg font-bold text-white ring-2 ring-white/30">
              {initials}
            </div>
            <div>
              <div className="flex items-center justify-center gap-1.5">
                <Sparkles className="size-3.5 text-[#99c3bd]" aria-hidden />
                <p className="text-base font-bold text-white">
                  {firstName ? `Hoş geldiniz, ${firstName}!` : "Hoş geldiniz!"}
                </p>
                <Sparkles className="size-3.5 text-[#99c3bd]" aria-hidden />
              </div>
              <p className="mt-1 text-xs text-white/70">
                Hesabınızla neler yapabileceğinize göz atın
              </p>
            </div>
          </div>

          {/* Alt dekoratif yay */}
          <div className="absolute -bottom-px left-0 right-0 h-6 rounded-t-3xl bg-white" />
        </div>

        {/* İçerik */}
        <div className="px-6 pb-6 pt-2">
          <div className="space-y-1">
            {FEATURES.map(({ icon: Icon, label, desc, href }) => (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className="group flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-[#e6f0ee]"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#e6f0ee] transition-colors group-hover:bg-[#cce1de]">
                  <Icon className="size-4 text-[#016a59]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{desc}</p>
                </div>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>

          <Button
            onClick={onClose}
            className="mt-5 w-full font-semibold"
          >
            Keşfetmeye Başla
          </Button>
        </div>
      </div>
    </div>
  );
}
