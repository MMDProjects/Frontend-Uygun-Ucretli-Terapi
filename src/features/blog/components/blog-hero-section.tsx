"use client";

import * as Popover from "@radix-ui/react-popover";
import { ArrowDownWideNarrow, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

const pillIconBtn =
  "flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-white text-primary shadow-sm transition-colors hover:bg-muted/70 hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const searchSubmitBtn =
  "flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export function BlogHeroSection() {
  const [query, setQuery] = useState("");
  const [activeSort, setActiveSort] = useState<"newest" | "oldest" | "category">("newest");

  return (
    <section className="section-shell relative overflow-hidden border-b border-border/70 bg-[#cce1de]">
      <div className="page-shell">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="w-full max-w-xl shrink-0 space-y-3">
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-primary-hover sm:text-5xl">
              Blog
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-8">
              Uzmanlarımızın kaleme aldığı kanıta dayalı içeriklerle kaygı, ilişkiler, duygu yönetimi ve günlük psikolojik iyi oluş konularında güvenilir bilgiye ulaşın.
            </p>
          </div>

          <div className="w-full min-w-0 shrink-0 self-center max-w-lg xl:max-w-xl">
            <form
              className="w-full"
              onSubmit={(e) => e.preventDefault()}
              role="search"
              aria-label="Blog ara ve filtrele"
            >
              <div className="flex w-full min-w-0 flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-3">
                <div
                  className={cn(
                    "flex min-h-11 min-w-0 flex-1 flex-row items-center gap-2 bg-white shadow-sm transition-shadow",
                    "rounded-3xl px-3 py-2 sm:gap-0 sm:rounded-full sm:py-1.5 sm:pl-6 sm:pr-2",
                    "focus-within:shadow-md focus-within:ring-2 focus-within:ring-ring/25",
                  )}
                >
                  <label className="sr-only" htmlFor="blog-search">
                    Blog ara
                  </label>
                  <input
                    id="blog-search"
                    type="search"
                    name="q"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Konu veya başlık ara"
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
                  <Popover.Root modal={false}>
                    <Popover.Trigger asChild>
                      <button type="button" className={pillIconBtn} aria-haspopup="dialog" aria-label="Filtrele">
                        <SlidersHorizontal className="size-5" strokeWidth={2} aria-hidden />
                      </button>
                    </Popover.Trigger>
                    <Popover.Portal>
                      <Popover.Content
                        side="bottom"
                        align="end"
                        sideOffset={10}
                        collisionPadding={16}
                        className="z-[60] w-[min(calc(100vw-2rem),18rem)] rounded-[var(--radius)] border border-border/80 bg-card p-4 shadow-xl outline-none"
                      >
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-foreground">Kategoriye göre filtrele</p>
                            <p className="text-xs text-muted-foreground">İlgilendiğiniz konuyu seçin.</p>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {["Psikoloji", "İlişkiler", "Yaşam", "Kaygı", "Travma", "Aile", "Duygu Düzenleme"].map((cat) => (
                              <button
                                key={cat}
                                type="button"
                                className="rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-medium text-primary-hover transition hover:bg-accent/40"
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        </div>
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>

                  <Popover.Root modal={false}>
                    <Popover.Trigger asChild>
                      <button type="button" className={pillIconBtn} aria-haspopup="dialog" aria-label="Sırala">
                        <ArrowDownWideNarrow className="size-5" strokeWidth={2} aria-hidden />
                      </button>
                    </Popover.Trigger>
                    <Popover.Portal>
                      <Popover.Content
                        side="bottom"
                        align="end"
                        sideOffset={10}
                        collisionPadding={16}
                        className="z-[60] w-[min(calc(100vw-2rem),18rem)] rounded-[var(--radius)] border border-border/80 bg-card p-4 shadow-xl outline-none"
                      >
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-foreground">Sırala</p>
                            <p className="text-xs text-muted-foreground">Listeleme biçimini seçin.</p>
                          </div>
                          <div className="space-y-2">
                            {[
                              { key: "newest" as const, label: "En yeni önce" },
                              { key: "oldest" as const, label: "En eski önce" },
                              { key: "category" as const, label: "Kategoriye göre" },
                            ].map((opt) => (
                              <button
                                key={opt.key}
                                type="button"
                                onClick={() => setActiveSort(opt.key)}
                                className={cn(
                                  "w-full rounded-xl border px-3 py-2 text-left text-sm transition",
                                  activeSort === opt.key
                                    ? "border-primary bg-muted text-primary-hover"
                                    : "border-border bg-background text-foreground hover:bg-muted/60",
                                )}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
