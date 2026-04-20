import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/constants/site";

export function AboutHomeSection() {
  return (
    <section
      className="bg-[#2a3230] py-12 text-white sm:py-16 lg:py-20"
      aria-labelledby="home-about-heading"
    >
      <div className="page-shell">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div
            className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black/30 shadow-lg"
            role="img"
            aria-label="Biz kimiz videosu kapak görseli; oynat düğmesi dekoratif"
          >
            <Image
              src="/images/image.png"
              alt=""
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-primary shadow-md">
                <Play className="ml-1 h-8 w-8 fill-current" aria-hidden />
              </span>
            </div>
          </div>
          <div className="space-y-5">
            <h2
              id="home-about-heading"
              className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl"
            >
              Biz kimiz?
            </h2>
            <p className="text-base leading-7 text-white/85">
              {siteConfig.brandShortName} ekibi, online psikolojik danışmanlıkta güven, şeffaflık ve
              erişilebilirliği ön planda tutar. Misyonumuz, doğru uzmanla güvenli
              bir bağ kurmanızı kolaylaştırmaktır.
            </p>
            <Button asChild variant="secondary" className="min-h-11">
              <Link href="/hakkimizda">Hakkımızda</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
