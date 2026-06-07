"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/common/section-heading";
import { siteConfig } from "@/lib/constants/site";

export function AboutHomeSection() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
    if (!apiUrl) return;
    fetch(`${apiUrl}/settings`)
      .then((r) => r.json())
      .then((data) => { if (data.videoUrl) setVideoUrl(data.videoUrl); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (modalOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [modalOpen]);

  function openModal() { if (videoUrl) setModalOpen(true); }
  function closeModal() { setModalOpen(false); }

  return (
    <section className="bg-[#cce1de] py-20" aria-labelledby="home-about-heading">
      <div className="page-shell space-y-8">
        <SectionHeading
          title="Biz kimiz?"
          description="Güven, şeffaflık ve erişilebilirliği ön planda tutan bir ekiple psikolojik danışmanlığı herkes için ulaşılabilir kılıyoruz."
          titleId="home-about-heading"
        />

        <div className="grid items-stretch gap-5 lg:grid-cols-[1fr_1fr]">

          {/* Sol: Kapak görseli + play butonu */}
          <div
            className="relative min-h-[300px] overflow-hidden rounded-[2rem] border border-border/60 bg-black/30 shadow-sm"
            role="img"
            aria-label="Tanıtım videosu kapak görseli"
          >
            <Image
              src="/images/image.png"
              alt=""
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={openModal}
                aria-label="Videoyu oynat"
                disabled={!videoUrl}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-primary shadow-md transition hover:scale-110 hover:bg-white disabled:cursor-default disabled:opacity-60 disabled:hover:scale-100"
              >
                <Play className="ml-1 h-8 w-8 fill-current" aria-hidden />
              </button>
            </div>
          </div>

          {/* Sağ: PsikoDestek ile tanışın */}
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

      {/* Video modal — dikey video için optimize */}
      <dialog
        ref={dialogRef}
        onClick={(e) => { if (e.target === dialogRef.current) closeModal(); }}
        className="m-auto max-h-[90dvh] w-full max-w-2xl rounded-[2rem] bg-black p-0 shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm open:flex open:flex-col"
      >
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm font-semibold text-white">Tanıtım Videosu</span>
          <button
            onClick={closeModal}
            aria-label="Kapat"
            className="flex size-8 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <X className="size-5" />
          </button>
        </div>
        {modalOpen && videoUrl && (
          videoUrl.includes("player.cloudinary.com") || videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be") || videoUrl.includes("vimeo.com") ? (
            <iframe
              src={videoUrl}
              allow="autoplay; fullscreen; encrypted-media"
              allowFullScreen
              className="aspect-video w-full"
            />
          ) : (
            <video
              src={videoUrl}
              controls
              autoPlay
              playsInline
              className="w-full flex-1 object-contain"
            />
          )
        )}
      </dialog>
    </section>
  );
}
