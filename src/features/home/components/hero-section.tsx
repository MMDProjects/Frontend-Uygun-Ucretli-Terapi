import Image from "next/image";
import Link from "next/link";

import { LiveUserCount } from "@/components/common/live-user-count";
import { Button } from "@/components/ui/button";

import { HomePersonalizedStrip } from "./home-personalized-strip";

const centerFloatTags = ["Gizlilik önceliği"] as const;
const centerBottomTags = ["Online", "Bilinçli destek"] as const;

// Orta kutu yatay slider — fotoğraf 1: terapist ve danışan oturumu
const heroBentoMainImageSrc =
  "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=1170&auto=format&fit=crop";

// Orta kutu yatay slider — fotoğraf 2: huzurlu doğa, yeşil orman yolu
const heroBentoSecondaryImageSrc =
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1171&auto=format&fit=crop";

// Sağ alt kutu dikey slider — fotoğraf 3: sahilde meditasyon
const heroBentoTertiaryImageSrc =
  "https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=1173&auto=format&fit=crop";

// Sağ alt kutu dikey slider — fotoğraf 4: dağ ve gün doğumu (umut teması)
const heroBentoQuaternaryImageSrc =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1170&auto=format&fit=crop";

const heroBackgroundImageSrc =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const heroRightBottomSliderImages = [
  {
    src: heroBentoTertiaryImageSrc,
    alt: "Sahilde meditasyon yapan huzurlu bir kişi",
  },
  {
    src: heroBentoQuaternaryImageSrc,
    alt: "Dağ zirvesinde gün doğumu — umut ve yeni başlangıç teması",
  },
] as const;

const heroCenterSliderImages = [
  {
    src: heroBentoMainImageSrc,
    alt: "Terapist ve danışan arasında güven veren bir görüşme anı",
  },
  {
    src: heroBentoSecondaryImageSrc,
    alt: "Huzur veren yeşil orman yolu — zihinsel dinginlik teması",
  },
  {
    src: heroBentoMainImageSrc,
    alt: "Terapist ve danışan arasında güven veren bir görüşme anı",
  },
] as const;

const heroRightBottomLoopImages = [
  ...heroRightBottomSliderImages,
  heroRightBottomSliderImages[0],
] as const;

export function HeroSection() {
  return (
    <section
      className="hero-full-bleed relative flex min-h-[100svh] flex-col overflow-hidden border-b border-border/70 bg-[#cce1de]"
      aria-labelledby="home-hero-title"
    >
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <Image
          src={heroBackgroundImageSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-[1.04] object-cover blur-[3px] motion-reduce:scale-100 motion-reduce:blur-none"
        />
        <div className="absolute inset-0 bg-[#cce1de]/35" />
      </div>

      <div className="page-shell relative z-10 flex min-h-0 flex-1 flex-col justify-center py-6 sm:py-8 lg:py-10">
        <HomePersonalizedStrip />

        <div className="grid min-h-0 w-full max-lg:flex-none grid-cols-1 items-stretch gap-4 sm:gap-5 lg:flex-1 lg:grid-cols-12 lg:grid-rows-1 lg:gap-5 lg:[grid-template-rows:minmax(0,1fr)]">
          {/* Sol: başlık + CTA */}
          <div className="flex flex-col justify-center gap-6 rounded-[2rem] border border-border/60 bg-white p-6 shadow-sm sm:p-8 lg:col-span-4 lg:h-full lg:min-h-0 lg:rounded-[2.25rem] lg:p-8">
            <p className="inline-flex w-fit items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-primary-hover">
              Online danışmanlık
            </p>

            <h1
              id="home-hero-title"
              className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[2.65rem] lg:leading-[1.12]"
            >
              <span className="flex flex-wrap items-end gap-x-3 gap-y-1">
                <span>Profesyonel destek</span>
                <span
                  className="hidden h-9 w-px shrink-0 bg-border sm:block"
                  aria-hidden
                />
                <span className="text-primary">daha sakin</span>
              </span>
              <span className="mt-2 block text-foreground">ve anlamlı adımlar</span>
            </h1>

            <p className="max-w-prose text-base leading-relaxed text-muted-foreground sm:text-[1.05rem] sm:leading-8">
              Deneyimli uzmanlarla güvenli bir ortamda duygularınızı anlayın; zihinsel
              esnekliğinizi güçlendirmek için tasarlanmış şeffaf ve KVKK uyumlu destek
              modeli.
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <Button asChild size="lg" className="shadow-sm">
                <Link href="/uzmanlar">Uzman bul</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-primary/90 bg-white shadow-sm"
              >
                <Link href="/testler">Ücretsiz test yap</Link>
              </Button>
            </div>
          </div>

          {/* Orta: dikey görsel alanı */}
          <div className="relative min-h-[280px] overflow-hidden rounded-[2rem] border border-border/60 bg-muted shadow-sm sm:min-h-[340px] lg:col-span-5 lg:h-full lg:min-h-0 lg:rounded-[2.5rem]">
            <div className="hero-horizontal-slider-track absolute inset-0">
              {heroCenterSliderImages.map((item, index) => (
                <div key={`${item.src}-${index}`} className="relative h-full w-1/3 shrink-0">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover object-center"
                  />
                </div>
              ))}
            </div>
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute right-4 top-4 z-[2] flex items-center gap-1.5"
              aria-hidden
            >
              <span className="hero-indicator-dot hero-indicator-dot-horizontal-b" />
              <span className="hero-indicator-dot hero-indicator-dot-horizontal-a" />
            </div>

            <div className="absolute left-4 top-4 z-[1] flex flex-col items-start gap-2 sm:left-5 sm:top-5">
              {centerFloatTags.map((label) => (
                <span
                  key={label}
                  className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-primary-hover"
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="absolute bottom-22 right-4 z-[1] max-w-[12.5rem] sm:bottom-24 sm:right-5 sm:max-w-[13.5rem]">
              <div className="w-full rounded-[2rem] border border-border/60 bg-white p-3.5 shadow-md sm:p-4">
                <p className="text-[2rem] font-bold tabular-nums text-primary sm:text-3xl">
                  30+
                </p>
                <p className="mt-1 text-[0.95rem] leading-snug text-muted-foreground sm:text-sm">
                  Onaylı uzmanla güvenilir destek alın
                </p>
              </div>
            </div>

            <div className="absolute bottom-6 right-4 z-[1] flex max-w-[14rem] flex-wrap justify-center gap-2 sm:bottom-7 sm:right-5 sm:max-w-[15rem]">
              {centerBottomTags.map((label) => (
                <span
                  key={label}
                  className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-primary-hover"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Sağ: üst metin + alt küçük kart */}
          <div className="flex min-h-0 flex-col gap-4 lg:col-span-3 lg:h-full">
            <div className="flex min-h-0 flex-1 flex-col justify-center rounded-[2rem] border border-border/60 bg-white p-6 shadow-sm sm:p-7 lg:rounded-[2.25rem]">
              <h2 className="text-xl font-bold tracking-tight text-primary-hover sm:text-[1.35rem]">
                Sunduklarımızı keşfedin
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
                Testler, paketler ve süreç rehberiyle size uygun adımları tek ekranda
                kolayca keşfedin; ihtiyaçlarınıza göre şekillenen içeriklerle hangi
                noktadan başlamanız gerektiğini net bir şekilde görün.
              </p>
              <Link
                href="/nasil-calisir"
                className="mt-4 inline-flex text-sm font-semibold text-primary underline-offset-4 hover:underline"
              >
                Nasıl çalışır?
              </Link>
            </div>

            <div className="relative min-h-[220px] flex-1 overflow-hidden rounded-[2rem] border border-border/60 bg-muted shadow-sm lg:min-h-0 lg:rounded-[2.25rem]">
              <div className="hero-vertical-slider-track absolute inset-0">
                {heroRightBottomLoopImages.map((item, index) => (
                  <div key={`${item.src}-${index}`} className="relative h-1/3 w-full">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 28vw"
                      className="object-cover object-center"
                    />
                  </div>
                ))}
              </div>
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute right-4 top-4 z-[2] flex flex-col items-center gap-1.5"
                aria-hidden
              >
                <span className="hero-indicator-dot hero-indicator-dot-vertical-a" />
                <span className="hero-indicator-dot hero-indicator-dot-vertical-b" />
              </div>
              <p className="absolute left-4 top-4 z-[1] inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium text-primary-hover">
                Topluluk
              </p>
              <div className="absolute bottom-4 right-4 z-[1] pointer-events-auto sm:bottom-5 sm:right-5">
                <LiveUserCount className="h-auto rounded-full bg-muted px-3 py-1 text-xs text-primary-hover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
