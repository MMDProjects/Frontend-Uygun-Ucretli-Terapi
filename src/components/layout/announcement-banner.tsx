"use client";

import { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";

const BANNER_HEIGHT_CSS = "7rem";
const DEFAULT_HEIGHT_CSS = "4.5rem";

export function AnnouncementBanner() {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL;
    if (!base) return;
    fetch(`${base.replace(/\/$/, "")}/settings`)
      .then((r) => r.json())
      .then((data) => {
        const list: string[] = data?.announcementItems;
        if (Array.isArray(list) && list.length > 0) setItems(list);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--site-header-height", BANNER_HEIGHT_CSS);
    return () => {
      document.documentElement.style.setProperty("--site-header-height", DEFAULT_HEIGHT_CSS);
    };
  }, []);

  if (items.length === 0) return null;

  const track = [...items, ...items];

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
        {track.map((text, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 px-10 opacity-90">
            <Megaphone className="size-3.5 shrink-0" strokeWidth={2} />
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
