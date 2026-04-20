type PageIntroProps = {
  title: string;
  description: string;
};

export function PageIntro({ title, description }: PageIntroProps) {
  return (
    <section className="section-shell">
      <div className="page-shell">
        <div className="max-w-3xl space-y-4">
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-primary-hover sm:text-5xl">
            {title}
          </h1>
          <p className="text-lg leading-8 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
