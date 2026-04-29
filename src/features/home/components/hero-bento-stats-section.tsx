"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { LiveUserCount } from "@/components/common/live-user-count";

import { homeStats, homeFeatures } from "../data/home-data";

export function HeroBentoStatsSection() {
  return (
    <section
      className="bg-white py-10 sm:py-12 lg:py-16"
      aria-labelledby="hero-stats-title"
    >
      <div className="page-shell">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:grid-rows-2">
          {/* Main hero cell - col span 8 */}
          <div className="relative overflow-hidden rounded-[1.5rem] border border-border bg-primary p-8 sm:p-12 lg:col-span-8 lg:row-span-2 lg:flex lg:flex-col lg:justify-center">
            {/* Decorative circles */}
            <div
              className="pointer-events-none absolute -right-16 -top-20 h-80 w-80 rounded-full border border-white/10"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-10 right-12 h-48 w-48 rounded-full border border-white/5"
              aria-hidden
            />

            <div className="relative z-10 space-y-6">
              {/* Live counter */}
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-sm">
                <span
                  className="inline-block h-2 w-2 rounded-full bg-green-400 animate-pulse"
                  aria-hidden
                />
                <span className="text-xs font-semibold text-white/85">
                  Şu an online uzman arıyor
                </span>
              </div>

              {/* Title */}
              <h1
                id="hero-stats-title"
                className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-3xl xl:text-4xl"
              >
                Profesyonel Psikolojik
                <br />
                Destek, Her Zaman
                <br />
                <span className="text-secondary">Yanı Başınızda</span>
              </h1>

              {/* Subtitle */}
              <p className="max-w-sm text-base leading-relaxed text-white/85 sm:text-lg">
                Alanında uzman terapistlerle birebir çevrimiçi seans alın. Kaygı,
                depresyon, ilişki sorunları ve daha fazlası için güvenli destek.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild>
                  <Link href="/uzmanlar">Uzman Bul →</Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10"
                  asChild
                >
                  <button>Ücretsiz Ön Görüşme</button>
                </Button>
              </div>
            </div>
          </div>

          {/* Stats cells - right column */}
          <div className="grid gap-4 lg:col-span-4 lg:grid-rows-2">
            {homeStats.map((stat, idx) => (
              <div
                key={idx}
                className="rounded-[1.25rem] border border-border bg-muted p-6 sm:p-8 lg:p-6"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  {stat.label}
                </p>
                <div className="mt-4">
                  <div className="text-4xl font-bold text-foreground sm:text-5xl lg:text-4xl">
                    {stat.value}
                    <span className="text-xl font-semibold">{stat.suffix}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {stat.subtext}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Feature cards - bottom row */}
          {homeFeatures.map((feature, idx) => (
            <div
              key={idx}
              className={`rounded-[1.25rem] border border-border p-6 sm:p-8 lg:col-span-4 ${
                feature.type === "security"
                  ? "bg-primary text-white"
                  : feature.type === "rating"
                    ? "bg-accent text-foreground"
                    : "bg-muted text-foreground"
              }`}
            >
              <p
                className={`text-xs font-semibold uppercase tracking-wider ${
                  feature.type === "security"
                    ? "text-secondary"
                    : "text-secondary"
                }`}
              >
                {feature.label}
              </p>
              <div className="mt-4">
                <div
                  className={`text-3xl font-bold sm:text-4xl ${
                    feature.type === "security"
                      ? "text-white"
                      : "text-primary"
                  }`}
                >
                  {feature.value}
                </div>
                <p
                  className={`mt-2 text-sm ${
                    feature.type === "security"
                      ? "text-white/75"
                      : "text-muted-foreground"
                  }`}
                >
                  {feature.subtext}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
