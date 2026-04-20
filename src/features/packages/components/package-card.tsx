import type { PackagePlan } from "@/types/domain";

type PackageCardProps = {
  plan: PackagePlan;
};

export function PackageCard({ plan }: PackageCardProps) {
  return (
    <article className="surface-card flex h-full flex-col p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
        {plan.sessionCount} Seans
      </p>
      <h3 className="mt-3 text-2xl font-semibold text-primary-hover">
        {plan.name}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
        {plan.description}
      </p>
      <p className="mt-6 text-3xl font-semibold text-primary">{plan.priceLabel}</p>
    </article>
  );
}
