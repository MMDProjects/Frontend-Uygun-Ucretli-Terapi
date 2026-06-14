"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ApiSss } from "@/lib/services/public.service";

const PAGE_LABELS: Record<string, string> = {
  GENEL: "Genel",
  TESTLER: "Testler",
  PAKETLER: "Paketler",
  RANDEVU: "Randevu",
  ODEME: "Ödeme",
  UZMAN: "Uzman Seçimi",
  GIZLILIK: "Gizlilik ve Güvenlik",
};

type Props = { items: ApiSss[] };

export function SssFullList({ items }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        Henüz soru-cevap eklenmemiş.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const isOpen = openId === item.id;
        const label = PAGE_LABELS[item.page] ?? item.page;
        return (
          <div
            key={item.id}
            className={cn(
              "overflow-hidden rounded-2xl border transition-colors",
              isOpen
                ? "border-primary/30 bg-primary/5"
                : "border-border/60 bg-white",
            )}
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={isOpen}
            >
              <div className="flex flex-col gap-1.5">
                <span className="inline-flex w-fit items-center rounded-full bg-[#e6f0ee] px-2.5 py-0.5 text-xs font-medium text-[#014a3e]">
                  {label}
                </span>
                <span className="text-sm font-semibold text-primary-hover">
                  {item.question}
                </span>
              </div>
              <ChevronDown
                className={cn(
                  "mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
                aria-hidden
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-5">
                <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
