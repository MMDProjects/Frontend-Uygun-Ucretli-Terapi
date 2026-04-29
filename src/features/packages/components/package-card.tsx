import { Check } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import type { PackagePlan } from "@/types/domain";

type PackageCardProps = {
  plan: PackagePlan;
};

export function PackageCard({ plan }: PackageCardProps) {
  const highlighted = plan.highlighted ?? false;

  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-[2rem] border p-8 shadow-sm",
        highlighted
          ? "border-primary bg-primary text-white"
          : "border-border/60 bg-white text-foreground",
      )}
    >
      {highlighted && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-1 text-xs font-bold tracking-wide text-primary shadow-sm">
          En Popüler
        </span>
      )}

      {/* Seans sayısı etiketi */}
      <span
        className={cn(
          "w-fit rounded-full px-3 py-1 text-xs font-semibold",
          highlighted ? "bg-white/20 text-white" : "bg-muted text-primary-hover",
        )}
      >
        {plan.sessionCount} Seans
      </span>

      {/* Paket adı */}
      <h3
        className={cn(
          "mt-4 text-2xl font-bold tracking-tight",
          highlighted ? "text-white" : "text-primary-hover",
        )}
      >
        {plan.name}
      </h3>

      {/* Fiyat */}
      <p
        className={cn(
          "mt-3 text-3xl font-bold",
          highlighted ? "text-white" : "text-primary",
        )}
      >
        {plan.priceLabel}
      </p>

      {/* Açıklama */}
      <p
        className={cn(
          "mt-3 text-sm leading-6",
          highlighted ? "text-white/80" : "text-muted-foreground",
        )}
      >
        {plan.description}
      </p>

      {/* Ayırıcı */}
      <div
        className={cn(
          "my-6 h-px w-full",
          highlighted ? "bg-white/20" : "bg-border/60",
        )}
      />

      {/* Özellik listesi */}
      <ul className="flex flex-1 flex-col gap-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <span
              className={cn(
                "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full",
                highlighted ? "bg-white/25" : "bg-muted",
              )}
            >
              <Check
                className={cn(
                  "size-2.5",
                  highlighted ? "text-white" : "text-primary",
                )}
                strokeWidth={3}
              />
            </span>
            <span
              className={cn(
                "text-sm leading-5",
                highlighted ? "text-white/90" : "text-muted-foreground",
              )}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href="/uzmanlar"
        className={cn(
          "mt-8 inline-flex h-11 w-full items-center justify-center rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          highlighted
            ? "bg-white text-primary hover:bg-white/90"
            : "bg-primary text-white hover:bg-primary-hover",
        )}
      >
        Paketi Seç
      </Link>
    </article>
  );
}
