"use client";

import { Search } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { FilterPopover, filterChip } from "@/components/shared/filter-popover";
import { SortPopover } from "@/components/shared/sort-popover";

const searchSubmitBtn =
  "flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const TAGS = ["Kaygı", "Stres", "Depresyon", "Özgüven", "Öfke", "İlişki"];

const SORT_OPTIONS = [
  { key: "duration-asc", label: "Süreye göre (kısa → uzun)" },
  { key: "duration-desc", label: "Süreye göre (uzun → kısa)" },
  { key: "name-asc", label: "İsme göre (A-Z)" },
];

export function TestsHeroSection() {
  const [query, setQuery] = useState("");
  const [activeSort, setActiveSort] = useState("duration-asc");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  function toggleTag(tag: string) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  return (
    <section className="section-shell relative overflow-hidden border-b border-border/70 bg-[#cce1de]">
      <div className="page-shell">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="w-full max-w-xl shrink-0 space-y-3">
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-primary-hover sm:text-5xl">
              Testler
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-8">
              Kısa ve anlaşılır psikolojik testlerle kendinizi daha iyi tanıyın.
              Test sonucunda puan özetinizi görebilir, uzman eşleşmesi için
              sonraki adımı planlayabilirsiniz.
            </p>
          </div>

          <div className="w-full min-w-0 shrink-0 self-center max-w-lg xl:max-w-xl">
            <form
              className="w-full"
              onSubmit={(e) => e.preventDefault()}
              role="search"
              aria-label="Test ara ve filtrele"
            >
              <div className="flex w-full min-w-0 flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-3">
                <div
                  className={cn(
                    "flex min-h-11 min-w-0 flex-1 flex-row items-center gap-2 bg-white shadow-sm transition-shadow",
                    "rounded-3xl px-3 py-2 sm:gap-0 sm:rounded-full sm:py-1.5 sm:pl-6 sm:pr-2",
                    "focus-within:shadow-md focus-within:ring-2 focus-within:ring-ring/25",
                  )}
                >
                  <label className="sr-only" htmlFor="tests-search">
                    Test ara
                  </label>
                  <input
                    id="tests-search"
                    type="search"
                    name="q"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Test adı veya konu"
                    autoComplete="off"
                    className={cn(
                      "min-h-9 w-full min-w-0 flex-1 border-0 bg-transparent text-sm text-foreground outline-none",
                      "placeholder:text-muted-foreground",
                      "sm:min-h-11 sm:py-2 sm:pr-2",
                    )}
                  />
                  <button type="submit" className={searchSubmitBtn} aria-label="Ara">
                    <Search className="size-5" strokeWidth={2} aria-hidden />
                  </button>
                </div>

                <div className="flex shrink-0 items-center justify-center gap-2 sm:justify-start">
                  <FilterPopover
                    activeCount={activeTags.length}
                    onClear={() => setActiveTags([])}
                  >
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-foreground">Konu</p>
                      <div className="flex flex-wrap gap-1.5">
                        {TAGS.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleTag(tag)}
                            className={filterChip(activeTags.includes(tag))}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </FilterPopover>

                  <SortPopover
                    options={SORT_OPTIONS}
                    value={activeSort}
                    onChange={setActiveSort}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
