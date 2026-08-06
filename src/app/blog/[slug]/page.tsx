import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { getBlog } from "@/lib/services/public.service";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 0;

function excerptFromHtml(html: string, maxLength: number): string {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).replace(/\s+\S*$/, "")}…`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  let blog: Awaited<ReturnType<typeof getBlog>>;
  try {
    blog = await getBlog(slug);
  } catch {
    return {};
  }

  const authorName =
    blog.authorName?.trim() ||
    `${blog.expertProfile.user.firstName} ${blog.expertProfile.user.lastName}`.trim();
  const description = excerptFromHtml(blog.content ?? "", 155);

  return {
    title: blog.title,
    description,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      type: "article",
      title: `${blog.title} | Yeçamer`,
      description,
      url: `https://yecamer.com.tr/blog/${slug}`,
      publishedTime: blog.createdAt,
      authors: [authorName],
      ...(blog.coverImageUrl ? { images: [{ url: blog.coverImageUrl, alt: blog.title }] } : {}),
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;

  let blog;
  try {
    blog = await getBlog(slug);
  } catch {
    notFound();
  }

  const authorName = blog.authorName?.trim() || `${blog.expertProfile.user.firstName} ${blog.expertProfile.user.lastName}`.trim();
  const dateLabel = new Date(blog.createdAt).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white !pt-0">
      {/* Kapak resmi — en üstte */}
      {blog.coverImageUrl && (
        <div className="relative aspect-[21/9] w-full bg-muted">
          <Image
            src={blog.coverImageUrl}
            alt={blog.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      )}

      {/* Hero */}
      <section className="section-shell border-b border-border/70 bg-[#cce1de]">
        <div className="page-shell">
          <Link
            href="/blog"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            Tüm Yazılar
          </Link>
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-0.5 text-sm font-semibold text-white">
                <ShieldCheck className="size-3.5" />
                Uzman
              </span>
              <span>·</span>
              <span>{authorName}</span>
              <span>·</span>
              <span>{dateLabel}</span>
            </div>
            <h1 className="text-balance text-3xl font-bold tracking-tight text-primary-hover sm:text-4xl lg:text-5xl">
              {blog.title}
            </h1>
          </div>
        </div>
      </section>

      {/* İçerik */}
      <section className="section-shell">
        <div className="page-shell max-w-3xl">
          <div className="max-w-none leading-relaxed text-foreground">
            {blog.content.split("\n").map((paragraph, i) =>
              paragraph.trim() ? (
                <p key={i} className="mb-4 text-base leading-7 text-foreground">
                  {paragraph}
                </p>
              ) : null
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
