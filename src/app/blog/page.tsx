import { BlogHeroSection } from "@/features/blog/components/blog-hero-section";
import { getBlogs } from "@/lib/services/public.service";
import type { ApiBlog } from "@/lib/services/public.service";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export const revalidate = 0;

const bentoSpanPattern = [
  "xl:col-span-6",
  "xl:col-span-3",
  "xl:col-span-3",
  "xl:col-span-4",
  "xl:col-span-4",
  "xl:col-span-4",
] as const;

function BlogCardApi({ post, className }: { post: ApiBlog; className?: string }) {
  const authorName = `${post.expertProfile.user.firstName} ${post.expertProfile.user.lastName}`.trim();
  const dateLabel = new Date(post.createdAt).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const excerpt = post.content
    ? post.content.replace(/<[^>]*>/g, "").slice(0, 140) + "…"
    : "";

  return (
    <article className={cn("surface-card relative flex h-full min-h-[21rem] flex-col overflow-hidden", className)}>
      <div className="relative aspect-[16/10] w-full shrink-0 bg-muted">
        <Image
          src={post.coverImageUrl || "/images/blog-card-placeholder.svg"}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-6 pb-0">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 font-semibold text-white">
            <ShieldCheck className="size-3" />
            Uzman
          </span>
          <span className="font-medium text-foreground">{authorName}</span>
          <span className="ml-auto text-right">{dateLabel}</span>
        </div>
        <h3 className="mt-3 text-base font-semibold leading-snug text-primary-hover line-clamp-2">
          {post.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground line-clamp-3">
          {excerpt}
        </p>
      </div>
      <div className="p-6 pt-4">
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex h-9 items-center rounded-full bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          Devamını Oku
        </Link>
      </div>
    </article>
  );
}

export default async function BlogPage() {
  let posts: ApiBlog[] = [];
  let error = false;

  try {
    const res = await getBlogs(1, 12);
    posts = res.data;
  } catch {
    error = true;
  }

  return (
    <>
      <BlogHeroSection />
      <section className="bg-[#e6f0ee] py-12">
        <div className="page-shell grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-12">
          {error ? (
            <p className="col-span-full text-center text-sm text-muted-foreground">
              Blog yazıları yüklenemedi.
            </p>
          ) : posts.length === 0 ? (
            <p className="col-span-full text-center text-sm text-muted-foreground py-12">
              Henüz blog yazısı yayınlanmamış.
            </p>
          ) : (
            posts.map((post, index) => (
              <div
                key={post.id}
                className={bentoSpanPattern[index % bentoSpanPattern.length]}
              >
                <BlogCardApi
                  post={post}
                  className="!rounded-[2rem] lg:!rounded-[2.25rem]"
                />
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}
