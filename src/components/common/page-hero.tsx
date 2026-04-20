import { Button } from "@/components/ui/button";

type PageHeroProps = {
  title: string;
  description: string;
  primaryLabel?: string;
  secondaryLabel?: string;
};

export function PageHero({
  title,
  description,
  primaryLabel,
  secondaryLabel,
}: PageHeroProps) {
  return (
    <section className="section-shell">
      <div className="page-shell">
        <div className="surface-card overflow-hidden bg-[linear-gradient(135deg,#e6f0ee_0%,#ffffff_55%,#f5faf8_100%)] p-8 sm:p-12">
          <div className="max-w-3xl space-y-5">
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-primary-hover sm:text-5xl">
              {title}
            </h1>
            <p className="text-lg leading-8 text-muted-foreground">
              {description}
            </p>
            {primaryLabel || secondaryLabel ? (
              <div className="flex flex-wrap gap-3 pt-2">
                {primaryLabel ? <Button>{primaryLabel}</Button> : null}
                {secondaryLabel ? (
                  <Button variant="outline">{secondaryLabel}</Button>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
