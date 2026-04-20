import Image from "next/image";

import { SectionHeading } from "@/components/common/section-heading";
import { homeTestimonials } from "@/features/shared/data/mock-content";

export function TestimonialsSection() {
  return (
    <section
      className="section-shell bg-background"
      aria-labelledby="home-testimonials-heading"
    >
      <div className="page-shell space-y-10">
        <SectionHeading
          title="Danışanlarımız ne söylüyor?"
          description="Onaylı yorum akışı API ile bağlandığında burada güncel referanslar görünecektir; şimdilik örnek ifadeler gösterilmektedir."
          titleId="home-testimonials-heading"
        />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {homeTestimonials.map((item) => (
            <blockquote
              key={item.id}
              className="surface-card flex flex-col p-6 text-center sm:text-left"
            >
              <div className="mx-auto flex h-16 w-16 shrink-0 overflow-hidden rounded-full border border-border bg-muted sm:mx-0">
                <Image
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
              <cite className="mt-4 block text-sm font-semibold not-italic text-primary">
                {item.name}
              </cite>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                “{item.quote}”
              </p>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
