import Image from "next/image";
import Link from "next/link";
import { HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";

import { LiveUserCount } from "@/components/common/live-user-count";
import { Button } from "@/components/ui/button";

import { HomePersonalizedStrip } from "./home-personalized-strip";

const heroStats = [
  { value: "50+", label: "Onaylı uzman" },
  { value: "7/24", label: "Canlı destek" },
  { value: "%100", label: "Online hizmet" },
] as const;

const heroFloatTags = [
  {
    icon: HeartHandshake,
    label: "Online danışmanlık",
    positionClass: "right-0 top-[16%] sm:right-[-0.25rem] lg:right-[-0.5rem]",
  },
  {
    icon: ShieldCheck,
    label: "KVKK uyumlu",
    positionClass: "left-0 top-[36%] sm:left-[-0.25rem] lg:left-[-0.5rem]",
  },
  {
    icon: Sparkles,
    label: "Ücretsiz ön görüşme",
    positionClass: "right-0 top-[56%] sm:right-[-0.25rem] lg:right-[-0.5rem]",
  },
] as const;

const heroPortraitSrc = "/images/herosect.png";

export function HeroSection() {
  return (
    <section
      className="hero-full-bleed relative flex min-h-[100svh] flex-col overflow-hidden border-b border-border/70 bg-[#cce1de] lg:min-h-[100dvh] lg:max-h-[100dvh] lg:overflow-y-auto"
      aria-labelledby="home-hero-title"
    >
      <div className="relative page-shell flex min-h-0 flex-1 flex-col justify-center py-8 sm:py-10 lg:py-0 lg:pt-2 lg:pb-4">
        <div className="grid min-h-0 flex-1 items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12 xl:gap-16">
          {/* Sol: metin + CTA + istatistik */}
          <div className="flex min-h-0 flex-col justify-center space-y-6 lg:max-w-xl xl:max-w-2xl">
            <div className="space-y-3">
              <HomePersonalizedStrip />
            </div>
            <h1
              id="home-hero-title"
              className="text-balance text-5xl font-semibold tracking-tight text-primary-hover sm:text-6xl lg:text-7xl lg:leading-[1.06] xl:leading-[1.05]"
            >
              Güvenilir psikolojik destek ile{" "}
              <span>yaşamın her döneminde</span> yanınızdayız.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-8">
              Deneyimli uzmanlarla güvenli bir ortamda duygularınızı anlayın; zihinsel
              esnekliğinizi artırmak için tasarlanmış profesyonel destek modeli.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Button asChild className="h-12 min-w-[9.5rem] px-7 text-base">
                <Link href="/uzmanlar">Uzman bul</Link>
              </Button>
              <Button asChild variant="outline" className="h-12 min-w-[9.5rem] px-7 text-base">
                <Link href="/testler">Ücretsiz test yap</Link>
              </Button>
            </div>
            <dl className="grid grid-cols-3 gap-4 border-t border-border/80 pt-6 sm:gap-6 sm:pt-8">
              {heroStats.map((item) => (
                <div key={item.label}>
                  <dt className="sr-only">{item.label}</dt>
                  <dd className="text-2xl font-bold tabular-nums text-primary sm:text-3xl">
                    {item.value}
                  </dd>
                  <p className="mt-1 text-xs leading-snug text-muted-foreground sm:text-sm">
                    {item.label}
                  </p>
                </div>
              ))}
            </dl>
          </div>

          {/* Sağ: görsel + yüzen etiketler */}
          <div className="relative mx-auto w-full max-w-lg min-h-[280px] lg:mx-0 lg:max-w-none lg:min-h-[min(100%,420px)] lg:h-full">
            <div className="relative z-[1] flex h-full min-h-[280px] items-center justify-center lg:min-h-[360px]">
              <div className="relative isolate aspect-[4/5] w-full max-w-[340px] overflow-hidden rounded-[2rem] bg-transparent sm:max-w-[380px] lg:aspect-[3/4] lg:max-w-full">
                <Image
                  src={heroPortraitSrc}
                  alt="Profesyonel ekip fotoğrafı"
                  fill
                  unoptimized
                  className="bg-transparent object-contain object-center"
                  sizes="(max-width: 1024px) 90vw, 42vw"
                />
              </div>

              <ul className="pointer-events-none absolute inset-0 z-[2]" aria-label="Öne çıkan özellikler">
                {heroFloatTags.map(({ icon: Icon, label, positionClass }) => (
                  <li
                    key={label}
                    className={`pointer-events-auto absolute inline-flex h-9 items-center gap-2 rounded-full border border-border/80 bg-white/95 px-4 text-xs font-semibold text-foreground shadow-sm backdrop-blur-sm ${positionClass}`}
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-primary">
                      <Icon className="size-3.5" aria-hidden />
                    </span>
                    <span className="leading-tight">{label}</span>
                  </li>
                ))}
                <li className="pointer-events-auto absolute left-0 top-[76%] sm:left-[-0.25rem] lg:left-[-0.5rem]">
                  <LiveUserCount />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
