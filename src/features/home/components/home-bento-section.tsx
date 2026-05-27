import Image from "next/image";
import Link from "next/link";

import { SectionHeading } from "@/components/common/section-heading";
import { TestCard } from "@/features/tests";
import { getTests } from "@/lib/services/public.service";

const therapyImageSrc =
  "https://images.unsplash.com/photo-1604881991720-f91add269bed?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0";

export async function HomeBentoSection() {
  const tests = await getTests().catch(() => []);
  const featuredTests = tests.slice(0, 3);

  return (
    <section className="bg-muted py-20" aria-labelledby="home-bento-title">
      <div className="page-shell space-y-8">
        <SectionHeading
          title="Testlerle kendinizi tanıyın"
          description="Kısa sürede tamamlanan bilimsel testlerle ruh halinizi ölçün, sonuçları yorumlayın ve size uygun destek yolunu belirleyin."
          titleId="home-bento-title"
        />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr]">
          {/* Sol: öne çıkan kart + 3 test kartı */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {/* Öne çıkan kart */}
            <article className="relative overflow-hidden rounded-[2rem] bg-primary p-6 shadow-sm sm:col-span-3">
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full border border-white/10"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -bottom-8 right-24 h-32 w-32 rounded-full border border-white/5"
                aria-hidden
              />
              <p className="relative z-10 text-xs font-semibold uppercase tracking-[0.08em] text-secondary">
                Ücretsiz &amp; Anonim
              </p>
              <h2 className="relative z-10 mt-3 text-balance text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Kendinizi daha iyi anlamak için doğru yer
              </h2>
              <p className="relative z-10 mt-3 max-w-2xl text-sm leading-7 text-white/80">
                Her test adım adım ilerler; sonuç ekranında güçlü alanlarınız ve
                riskli başlıklarınız sade bir dille özetlenir. Tamamen gizli,
                herhangi bir kayıt gerektirmez.
              </p>
            </article>

            {featuredTests.length === 0
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-72 animate-pulse rounded-[2rem] bg-muted-foreground/10" />
                ))
              : featuredTests.map((test) => (
                  <TestCard key={test.id} test={test} />
                ))}
          </div>

          {/* Sağ: fotoğraf + buton + sonuç */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-[1fr_2fr] lg:grid-cols-1">
            {/* Fotoğraf */}
            <article className="relative min-h-[200px] overflow-hidden rounded-[2rem] border border-border/60 shadow-sm">
              <Image
                src={therapyImageSrc}
                alt="Danışmanlık seansı — iki kişinin destekleyici el teması"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover object-center"
              />
            </article>

            {/* Sonuç ve yönlendirme */}
            <article className="flex flex-col justify-center rounded-[2rem] border border-border/60 bg-white p-6 shadow-sm sm:col-span-2 lg:col-span-1">
              <h3 className="text-xl font-bold tracking-tight text-primary-hover">
                Sonuç ve yönlendirme
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
                Test sonrasında uygun uzman alanlarını görür, isterseniz tek
                tıkla psikolojik destek talebine geçiş yapabilirsiniz.
              </p>
              <Link
                href="/uzmanlar"
                className="mt-4 inline-flex text-sm font-semibold text-primary underline-offset-4 hover:underline"
              >
                Uzman bul →
              </Link>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
