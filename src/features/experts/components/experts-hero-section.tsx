"use client";

import { ArrowDownWideNarrow, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

/** Search bar ile aynı beyaz kart görünümü — boyut arama ile eşit (44px) */
const pillIconBtn =
  "flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-white text-primary shadow-sm transition-colors hover:bg-muted/70 hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const searchSubmitBtn =
  "flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export function ExpertsHeroSection() {
  const [query, setQuery] = useState("");

  return (
    <section className="section-shell relative overflow-hidden border-b border-border/70 bg-[#cce1de]">
      <div className="page-shell">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="w-full max-w-xl shrink-0 space-y-3">
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-primary-hover sm:text-5xl">
              Uzmanlarımız
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-8">
              Admin onaylı profiller; uzmanlık alanları ve yıldız puanıyla
              güvenilir eşleşme. Aşağıdan arayın, filtreleyin veya sıralayın — fiyat
              bilgisi yalnızca paketler sayfasında yer alır.
            </p>
          </div>

          <div className="w-full min-w-0 shrink-0 self-center max-w-lg xl:max-w-xl">
            <form
              className="w-full"
              onSubmit={(e) => {
                e.preventDefault();
              }}
              role="search"
              aria-label="Uzman ara ve filtrele"
            >
              <div className="flex w-full min-w-0 flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-3">
                {/* Yalnızca arama alanı + gönder — pill */}
                <div
                  className={cn(
                    "flex min-h-11 min-w-0 flex-1 flex-row items-center gap-2 bg-white shadow-sm transition-shadow",
                    "rounded-3xl px-3 py-2 sm:gap-0 sm:rounded-full sm:py-1.5 sm:pl-6 sm:pr-2",
                    "focus-within:shadow-md focus-within:ring-2 focus-within:ring-ring/25",
                  )}
                >
                  <label className="sr-only" htmlFor="experts-search">
                    İsim veya anahtar kelime
                  </label>
                  <input
                    id="experts-search"
                    type="search"
                    name="q"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="İsim, anahtar kelime veya uzmanlık alanı"
                    autoComplete="off"
                    className={cn(
                      "min-h-9 w-full min-w-0 flex-1 border-0 bg-transparent text-sm text-foreground outline-none",
                      "placeholder:text-muted-foreground",
                      "sm:min-h-11 sm:py-2 sm:pr-2",
                    )}
                  />
                  <button
                    type="submit"
                    className={searchSubmitBtn}
                    aria-label="Ara"
                  >
                    <Search className="size-5" strokeWidth={2} aria-hidden />
                  </button>
                </div>

                {/* Pill dışı — sağda filtre & sırala */}
                <div className="flex shrink-0 items-center justify-center gap-2 sm:justify-start">
                  <button
                    type="button"
                    className={pillIconBtn}
                    aria-haspopup="dialog"
                    aria-label="Filtrele"
                  >
                    <SlidersHorizontal className="size-5" strokeWidth={2} aria-hidden />
                  </button>
                  <button
                    type="button"
                    className={pillIconBtn}
                    aria-haspopup="listbox"
                    aria-label="Sırala"
                  >
                    <ArrowDownWideNarrow className="size-5" strokeWidth={2} aria-hidden />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
