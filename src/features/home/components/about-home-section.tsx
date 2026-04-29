import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/common/section-heading";
import { siteConfig } from "@/lib/constants/site";

export function AboutHomeSection() {
  return (
    <section
      className="bg-[#cce1de] py-20"
      aria-labelledby="home-about-heading"
    >
      <div className="page-shell space-y-8">
        <SectionHeading
          title="Biz kimiz?"
          description="Güven, şeffaflık ve erişilebilirliği ön planda tutan bir ekiple psikolojik danışmanlığı herkes için ulaşılabilir kılıyoruz."
          titleId="home-about-heading"
        />

        <div className="grid items-stretch gap-5 lg:grid-cols-[1fr_1fr]">

          {/* Sol: Video kutusu */}
          <div
            className="relative min-h-[300px] overflow-hidden rounded-[2rem] border border-border/60 bg-black/30 shadow-sm"
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

          {/* Sağ: PsikoDestek ile tanışın kutusu */}
          <div className="flex flex-col justify-center gap-6 rounded-[2rem] border border-border/60 bg-white p-8 shadow-sm">
            <h3 className="text-balance text-2xl font-bold tracking-tight text-primary-hover sm:text-3xl">
              {siteConfig.brandShortName} ile tanışın
            </h3>
            <p className="text-base leading-7 text-muted-foreground">
              {siteConfig.brandShortName} ekibi, online psikolojik danışmanlıkta güven,
              şeffaflık ve erişilebilirliği ön planda tutar. Misyonumuz, doğru
              uzmanla güvenli bir bağ kurmanızı kolaylaştırmaktır.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "KVKK Uyumlu",
                "Güvenli Bağlantı",
                "Onaylı Uzmanlar",
                "Ücretsiz Ön Görüşme",
                "7/24 Erişim",
                "Anonim Testler",
                "Çevrimiçi Seans",
                "Uzman Eşleştirme",
              ].map((badge) => (
                <span
                  key={badge}
                  className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-primary-hover"
                >
                  {badge}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <Link href="/hakkimizda">Hakkımızda</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/uzmanlar">Uzmanları incele</Link>
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
