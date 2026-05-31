import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getBlog } from "@/lib/services/public.service";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;

  let blog;
  try {
    blog = await getBlog(slug);
  } catch {
    notFound();
  }

  const authorName =
    `${blog.expertProfile.user.firstName} ${blog.expertProfile.user.lastName}`.trim();
  const dateLabel = new Date(blog.createdAt).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white">
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
              <span className="rounded-full bg-white/70 px-3 py-0.5 font-medium text-primary">
                {blog.expertProfile.title}
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

          {/* Yazar kutusu */}
          <div className="mt-12 flex items-center gap-4 rounded-2xl border border-border/60 bg-[#e6f0ee] p-6">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
              {authorName.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-foreground">{authorName}</p>
              <p className="text-sm text-muted-foreground">{blog.expertProfile.title}</p>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition hover:border-primary/30 hover:text-primary"
            >
              <ArrowLeft className="size-4" />
              Tüm Yazılara Dön
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
