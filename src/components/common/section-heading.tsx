type SectionHeadingProps = {
  title: string;
  description: string;
  /** Bölüm `aria-labelledby` ile eşleşmesi için h2 kimliği */
  titleId?: string;
};

export function SectionHeading({
  title,
  description,
  titleId,
}: SectionHeadingProps) {
  return (
    <div className="max-w-2xl space-y-3">
      <h2
        id={titleId}
        className="text-balance text-3xl font-semibold tracking-tight text-primary-hover sm:text-4xl"
      >
        {title}
      </h2>
      <p className="text-base leading-7 text-muted-foreground">{description}</p>
    </div>
  );
}
