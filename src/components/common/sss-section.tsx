"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ApiSss } from "@/lib/services/public.service";

type Props = {
  items: ApiSss[];
  title?: string;
};

export function SssSection({ items, title = "Sıkça Sorulan Sorular" }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (items.length === 0) return null;

  return (
    <section className="bg-white py-12">
      <div className="page-shell max-w-3xl">
        <h2 className="mb-8 text-2xl font-semibold tracking-tight text-primary-hover sm:text-3xl">
          {title}
        </h2>
        <div className="space-y-2">
          {items.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className={cn(
                  "overflow-hidden rounded-2xl border transition-colors",
                  isOpen ? "border-primary/30 bg-primary/5" : "border-border/60 bg-white",
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-primary-hover">{item.question}</span>
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                      isOpen && "rotate-180",
                    )}
                    aria-hidden
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5">
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
