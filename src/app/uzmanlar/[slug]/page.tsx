"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Star, Award, FileText } from "lucide-react";

import { featuredExperts } from "@/features/shared/data/mock-content";
import { RequestForm } from "@/features/experts/components/request-form";

type ExpertDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default function ExpertDetailPage({ params }: ExpertDetailPageProps) {
  const { slug } = use(params);
  const expert = featuredExperts.find((item) => item.slug === slug);

  if (!expert) notFound();

  const fullStars = Math.floor(expert.rating);
  const hasHalf = expert.rating % 1 >= 0.5;

  return (
    <>
      {/* Hero başlık */}
      <section className="border-b border-border/70 bg-[#cce1de] pt-[calc(var(--site-header-height)+2rem)] pb-10">
        <div className="page-shell">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            {/* Fotoğraf */}
            <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl border-2 border-white shadow-md sm:size-28">
              {expert.photoUrl ? (
                <Image
                  src={expert.photoUrl}
                  alt={expert.name}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              ) : (
                <span className="flex size-full items-center justify-center bg-primary text-3xl font-bold text-white">
                  {expert.name.charAt(0)}
                </span>
              )}
            </div>

            {/* Bilgiler */}
            <div className="flex-1 space-y-3">
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-primary-hover sm:text-5xl">
                {expert.name}
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-8">
                {expert.title}
              </p>

              {/* Yıldız puanı */}
              <div className="mt-2 flex items-center gap-1.5">
                <span className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const filled = i < fullStars;
                    const half = !filled && i === fullStars && hasHalf;
                    return (
                      <Star
                        key={i}
                        className={`size-4 ${filled || half ? "fill-warning text-warning" : "text-border"}`}
                      />
                    );
                  })}
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {expert.rating.toFixed(1)}
                </span>
              </div>

              {/* Etiketler */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {expert.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* İçerik */}
      <section className="bg-[#e6f0ee] py-10">
        <div className="page-shell grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Sol: Biyografi + belgeler */}
          <div className="space-y-5">
            {/* Hakkında */}
            <article className="surface-card !rounded-[2rem] p-6">
              <h2 className="mb-3 text-base font-bold text-primary-hover">Hakkında</h2>
              <p className="text-sm leading-7 text-muted-foreground">{expert.bio}</p>
            </article>

            {/* Belgeler */}
            <article className="surface-card !rounded-[2rem] p-6">
              <h2 className="mb-4 text-base font-bold text-primary-hover">Belgeler & Sertifikalar</h2>
              <div className="space-y-3">
                {[
                  { label: "Diploma / Lisans Belgesi", icon: Award },
                  { label: "Uzmanlık Sertifikası", icon: FileText },
                  { label: "Özgeçmiş (CV)", icon: FileText },
                ].map(({ label, icon: Icon }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 rounded-[2rem] border border-border/60 bg-muted/40 px-4 py-3"
                  >
                    <Icon className="size-4 shrink-0 text-primary" />
                    <span className="text-sm font-medium text-foreground">{label}</span>
                    <span className="ml-auto text-xs font-medium text-muted-foreground">PDF</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Belgeler uzmanlık onayı tamamlandıktan sonra görüntülenebilir.
              </p>
            </article>
          </div>

          {/* Sağ: Talep formu */}
          <aside className="space-y-4">
            <RequestForm expertName={expert.name} expertSlug={expert.slug} />

            {/* Bilgi kartı */}
            <div className="surface-card !rounded-[2rem] p-5 text-center">
              <p className="text-xs leading-relaxed text-muted-foreground">
                Tüm görüşmeler güvenli, şifreli bağlantı üzerinden gerçekleştirilir.
                Kişisel verileriniz KVKK kapsamında korunur.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
