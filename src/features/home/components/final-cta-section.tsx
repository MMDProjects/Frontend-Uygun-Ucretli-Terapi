import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function FinalCtaSection() {
  return (
    <section
      className="bg-[#2a3230] py-12 text-white sm:py-14 lg:py-16"
      aria-labelledby="home-final-cta-heading"
    >
      <div className="page-shell">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-5">
            <h2
              id="home-final-cta-heading"
              className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl"
            >
              Harekete geçmeye hazır mısınız?
            </h2>
            <p className="text-base leading-7 text-white/85">
              Uzmanlarla tanışın, sorularınızı iletin veya ekibimizle iletişime geçin.
              İlk adımı bugün atın.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild variant="secondary" className="min-h-11">
                <Link href="/uzmanlar">Uzmanları incele</Link>
              </Button>
              <Button asChild variant="outline" className="min-h-11 border-white/40 bg-transparent !text-white hover:bg-white/10 hover:!text-white">
                <Link href="/iletisim">İletişime geç</Link>
              </Button>
            </div>
          </div>
          <div
            className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 shadow-lg"
            aria-hidden
          >
            <Image
              src="/images/hero-home.svg"
              alt=""
              fill
              className="object-cover opacity-90"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2a3230]/80 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
