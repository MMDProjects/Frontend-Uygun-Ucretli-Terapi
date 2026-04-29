import { BlogCard } from "@/features/blog/components/blog-card";
import { BlogHeroSection } from "@/features/blog/components/blog-hero-section";
import { blogPostsPreview } from "@/features/shared/data/mock-content";

const bentoSpanPattern = [
  "xl:col-span-6",
  "xl:col-span-3",
  "xl:col-span-3",
  "xl:col-span-4",
  "xl:col-span-4",
  "xl:col-span-4",
] as const;

export default function BlogPage() {
  return (
    <>
      <BlogHeroSection />

      <section className="bg-[#e6f0ee] py-12">
        <div className="page-shell grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-12">
          {blogPostsPreview.map((post, index) => (
            <div
              key={post.slug}
              className={bentoSpanPattern[index % bentoSpanPattern.length]}
            >
              <BlogCard
                post={post}
                className="!rounded-[2rem] lg:!rounded-[2.25rem]"
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
