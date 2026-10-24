import type { Metadata } from "next";
import {
  BLOG_PAGE_SIZE,
  BlogCardApi,
  bentoSpanPattern,
} from "@/features/blog/components/blog-card-api";
import { BlogHeroSection } from "@/features/blog/components/blog-hero-section";
import { BlogLoadMore } from "@/features/blog/components/blog-load-more";
import { getBlogs } from "@/lib/services/public.service";
import type { ApiBlog } from "@/lib/services/public.service";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Psikoloji, kişisel gelişim ve ruh sağlığı üzerine uzman yazıları. Güncel makaleler ve rehberler.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog | Yeçamer",
    description:
      "Psikoloji, kişisel gelişim ve ruh sağlığı üzerine uzman yazıları.",
    url: "https://yecamer.com.tr/blog",
  },
};

export const revalidate = 0;

export default async function BlogPage() {
  let posts: ApiBlog[] = [];
  let total = 0;
  let error = false;

  try {
    const res = await getBlogs(1, BLOG_PAGE_SIZE);
    posts = res.data;
    total = res.total;
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
          {!error && posts.length > 0 && (
            <BlogLoadMore initialCount={posts.length} total={total} />
          )}
        </div>
      </section>
    </>
  );
}
