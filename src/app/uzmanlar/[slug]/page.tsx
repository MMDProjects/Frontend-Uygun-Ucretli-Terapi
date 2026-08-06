import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, Award, FileText, MessageSquare, Phone, BookOpen, Calendar } from "lucide-react";

import { getExpert, getExpertBlogs } from "@/lib/services/public.service";
import { FavoriteButton } from "@/features/experts/components/favorite-button";

export const revalidate = 0;

type ExpertDetailPageProps = {
  params: Promise<{ slug: string }>;
};

function truncate(text: string, maxLength: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength).replace(/\s+\S*$/, "")}…`;
}

export async function generateMetadata({ params }: ExpertDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  let expert: Awaited<ReturnType<typeof getExpert>>;
  try {
    expert = await getExpert(slug);
  } catch {
    return {};
  }

  const name = `${expert.user.firstName} ${expert.user.lastName}`.trim();
  const title = expert.title ? `${name} — ${expert.title}` : name;
  const description = truncate(expert.bio ?? "", 155);

  return {
    title,
    description,
    alternates: {
      canonical: `/uzmanlar/${slug}`,
    },
    openGraph: {
      title: `${title} | Yeçamer`,
      description,
      url: `https://yecamer.com.tr/uzmanlar/${slug}`,
      ...(expert.avatarUrl ? { images: [{ url: expert.avatarUrl, alt: name }] } : {}),
    },
  };
}

export default async function ExpertDetailPage({ params }: ExpertDetailPageProps) {
  const { slug } = await params;

  let expert: Awaited<ReturnType<typeof getExpert>> | null = null;
  try {
    expert = await getExpert(slug);
  } catch {
    notFound();
  }

  if (!expert) notFound();

  const blogs = await getExpertBlogs(expert.id).catch(() => []);

  const name = `${expert.user.firstName} ${expert.user.lastName}`.trim();
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
              {expert.avatarUrl ? (
                <Image
                  src={expert.avatarUrl}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              ) : (
                <span className="flex size-full items-center justify-center bg-primary text-3xl font-bold text-white">
                  {name.charAt(0)}
                </span>
              )}
            </div>

            {/* Bilgiler */}
            <div className="flex-1 space-y-3">
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-primary-hover sm:text-5xl">
                {name}
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

              {/* Favori butonu */}
              <FavoriteButton expertId={expert.id} />

              {/* Etiketler */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {expert.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                  >
                    {tag.name}
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
          {/* Sol: Biyografi + eğitim */}
          <div className="space-y-5">
            <article className="surface-card !rounded-[2rem] p-6">
              <h2 className="mb-3 text-base font-bold text-primary-hover">Hakkında</h2>
              <p className="text-sm leading-7 text-muted-foreground">{expert.bio}</p>
            </article>

            {expert.education && (
              <article className="surface-card !rounded-[2rem] p-6">
                <h2 className="mb-3 text-base font-bold text-primary-hover">Eğitim</h2>
                <p className="text-sm leading-7 text-muted-foreground whitespace-pre-line">
                  {expert.education}
                </p>
              </article>
            )}

            {blogs.length > 0 && (
              <article className="surface-card !rounded-[2rem] p-6">
                <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-primary-hover">
                  <BookOpen className="size-4" />
                  Uzmanın Yazıları
                </h2>
                <div className="space-y-3">
                  {blogs.map((blog) => (
                    <Link
                      key={blog.id}
                      href={`/blog/${blog.slug}`}
                      className="flex flex-col gap-1 rounded-2xl border border-border/60 bg-muted/40 px-4 py-3 transition-colors hover:bg-primary/5"
                    >
                      <span className="text-sm font-semibold text-foreground line-clamp-2">
                        {blog.title}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="size-3" />
                        {new Date(blog.createdAt).toLocaleDateString("tr-TR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </Link>
                  ))}
                </div>
              </article>
            )}

            <article className="surface-card !rounded-[2rem] p-6">
              <h2 className="mb-4 text-base font-bold text-primary-hover">Belgeler & Sertifikalar</h2>
              <div className="space-y-3">
                {expert.certificateUrl ? (
                  <a
                    href={expert.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-2xl border border-primary/25 bg-primary/5 px-4 py-3 transition hover:bg-primary/10"
                  >
                    <Award className="size-4 shrink-0 text-primary" />
                    <span className="text-sm font-medium text-foreground">Sertifika / Diploma</span>
                    <span className="ml-auto text-xs font-semibold text-primary">PDF görüntüle →</span>
                  </a>
                ) : (
                  <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/40 px-4 py-3">
                    <Award className="size-4 shrink-0 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Sertifika / Diploma</span>
                    <span className="ml-auto text-xs text-muted-foreground">Bekleniyor</span>
                  </div>
                )}

                {expert.cvUrl ? (
                  <>
                    <a
                      href={expert.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-2xl border border-primary/25 bg-primary/5 px-4 py-3 transition hover:bg-primary/10"
                    >
                      <FileText className="size-4 shrink-0 text-primary" />
                      <span className="text-sm font-medium text-foreground">Özgeçmiş (CV)</span>
                      <span className="ml-auto text-xs font-semibold text-primary">PDF görüntüle →</span>
                    </a>
                    <div className="overflow-hidden rounded-2xl border border-border/60 bg-muted/30">
                      <div className="flex items-center justify-between border-b border-border/40 px-4 py-2">
                        <span className="text-xs font-semibold text-muted-foreground">CV Önizleme</span>
                        <a
                          href={expert.cvUrl}
                          download
                          className="text-xs font-semibold text-primary transition hover:text-primary-hover"
                        >
                          İndir
                        </a>
                      </div>
                      <iframe
                        src={`${expert.cvUrl}#page=1&view=FitH`}
                        title="CV Önizleme"
                        className="h-64 w-full border-0"
                        loading="lazy"
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/40 px-4 py-3">
                    <FileText className="size-4 shrink-0 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Özgeçmiş (CV)</span>
                    <span className="ml-auto text-xs text-muted-foreground">Bekleniyor</span>
                  </div>
                )}
              </div>
            </article>
          </div>

          {/* Sağ: İletişim CTA */}
          <aside className="space-y-4">
            <div className="surface-card !rounded-[2rem] p-6">
              <h2 className="mb-1 text-base font-bold text-primary-hover">Görüşme Talebi</h2>
              <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                {name} ile görüşmek için iletişim formumuzu kullanın. Ekibimiz sizi en kısa sürede arayacak.
              </p>
              <Link
                href={`/iletisim?konu=randevu&uzman=${encodeURIComponent(name)}`}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover"
              >
                <MessageSquare className="size-4 shrink-0" />
                Görüşme Talep Et
              </Link>
              <Link
                href="/iletisim"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
              >
                <Phone className="size-4 shrink-0" />
                İletişime Geç
              </Link>
            </div>
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
