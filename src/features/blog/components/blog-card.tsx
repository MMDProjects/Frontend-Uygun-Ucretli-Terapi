import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import type { BlogPostPreview } from "@/types/domain";

type BlogCardProps = {
  post: BlogPostPreview;
  className?: string;
};

export function BlogCard({ post, className }: BlogCardProps) {
  return (
    <article className={cn("surface-card relative flex h-full min-h-[21rem] flex-col overflow-hidden", className)}>
      <div className="relative aspect-[16/10] w-full shrink-0 bg-muted">
        <Image
          src={post.imageSrc ?? "/images/blog-card-placeholder.svg"}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-6 pb-0">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-primary">
            {post.category}
          </span>
          <span className="ml-auto text-right">{post.dateLabel}</span>
        </div>
        <h3 className="mt-3 text-lg font-semibold leading-snug text-primary-hover">
          <Link href={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h3>
        <div className="relative mt-2 min-h-[7rem] flex-1 overflow-hidden pb-14">
          <p className="absolute inset-0 overflow-hidden pr-0.5 text-sm leading-6 text-muted-foreground">
            {post.excerpt}
          </p>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[5.5rem] bg-gradient-to-t from-card from-20% via-card/75 to-transparent [mask-image:linear-gradient(to_top,black_26%,transparent_100%)] backdrop-blur-[4px] motion-reduce:backdrop-blur-none supports-[backdrop-filter]:backdrop-blur-[12px]"
          />
        </div>
      </div>
      <Link
        href={`/blog/${post.slug}`}
        className="absolute bottom-4 right-4 z-[3] inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-center text-sm font-semibold !text-white shadow-sm transition-colors hover:bg-primary-hover hover:!text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none"
      >
        Yazıyı oku
      </Link>
    </article>
  );
}
