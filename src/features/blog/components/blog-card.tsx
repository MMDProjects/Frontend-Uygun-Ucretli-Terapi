import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { BlogPostPreview } from "@/types/domain";

type BlogCardProps = {
  post: BlogPostPreview;
};

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="surface-card flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[16/10] w-full bg-muted">
        <Image
          src="/images/blog-card-placeholder.svg"
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-primary">
            {post.category}
          </span>
          <span>{post.dateLabel}</span>
        </div>
        <h3 className="mt-3 text-lg font-semibold leading-snug text-primary-hover">
          <Link href={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground line-clamp-3">
          {post.excerpt}
        </p>
        <p className="mt-4 text-xs text-muted-foreground">{post.authorName}</p>
        <Button asChild variant="ghost" className="mt-2 w-fit px-0">
          <Link href={`/blog/${post.slug}`}>Yazıyı oku</Link>
        </Button>
      </div>
    </article>
  );
}
