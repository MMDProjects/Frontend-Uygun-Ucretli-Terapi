"use client";

import { useEffect } from "react";
import { Tag, ShieldCheck, MessageCircle, Lock, FileCheck } from "lucide-react";

const BANNER_HEIGHT_CSS = "7rem";
const DEFAULT_HEIGHT_CSS = "4.5rem";

type BannerItem = { icon: React.ReactNode; text: string };

function useBannerItems(std: number, disc: number): BannerItem[] {
  return [
    {
      icon: <Tag className="size-3.5 shrink-0" strokeWidth={2} />,
      text: `Yeni kullanıcılara özel: ${std.toLocaleString("tr-TR")} TL yerine ${disc.toLocaleString("tr-TR")} TL — ilk seansta geçerli!`,
    },
    {
      icon: <ShieldCheck className="size-3.5 shrink-0" strokeWidth={2} />,
      text: "Admin onaylı, sertifikalı uzman profilleri",
    },
    {
      icon: <MessageCircle className="size-3.5 shrink-0" strokeWidth={2} />,
      text: "Ücretsiz ön görüşme imkânı — WhatsApp üzerinden hemen başla",
    },
    {
      icon: <Lock className="size-3.5 shrink-0" strokeWidth={2} />,
      text: "KVKK uyumlu, güvenli ve gizli platformdur",
    },
    {
      icon: <FileCheck className="size-3.5 shrink-0" strokeWidth={2} />,
      text: "Her uzman belgelerini danışanlarıyla şeffaf paylaşır",
    },
  ];
}

export function AnnouncementBanner({
  standardPrice,
  discountedPrice,
}: {
  standardPrice?: number;
  discountedPrice?: number;
}) {
  const std = standardPrice ?? 1500;
  const disc = discountedPrice ?? 1000;
  const items = useBannerItems(std, disc);
  const track = [...items, ...items];

  useEffect(() => {
    document.documentElement.style.setProperty("--site-header-height", BANNER_HEIGHT_CSS);
    return () => {
      document.documentElement.style.setProperty("--site-header-height", DEFAULT_HEIGHT_CSS);
    };
  }, []);

  return (
    <div className="w-full overflow-hidden bg-[#014a3e] py-2 text-white">
      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <div
        className="flex items-center whitespace-nowrap text-sm font-medium"
        style={{ animation: "marquee-scroll 40s linear infinite" }}
      >
        {track.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 px-10 opacity-90">
            {item.icon}
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}
