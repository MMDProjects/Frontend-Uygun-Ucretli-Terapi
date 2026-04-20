import { BlogCard } from "@/features/blog/components/blog-card";
import { blogPostsPreview } from "@/features/shared/data/mock-content";

export default function BlogPage() {
  return (
    <>
      <section className="section-shell relative overflow-hidden border-b border-border/70 bg-[#cce1de]">
        <div className="page-shell">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-primary-hover sm:text-5xl">
              Blog
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-8">
              Uzmanlarımızın hazırladığı içeriklerle kaygı, ilişkiler ve günlük
              psikolojik iyi oluş konularında güvenilir bilgiye ulaşın.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 pt-10 sm:pt-12 lg:pt-16">
        <div className="page-shell grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {blogPostsPreview.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </>
  );
}
