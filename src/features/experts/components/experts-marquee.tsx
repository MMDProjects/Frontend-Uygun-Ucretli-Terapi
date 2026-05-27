import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { ApiExpertSummary } from "@/lib/services/public.service";

type ExpertMiniCardProps = {
  expert: ApiExpertSummary;
};

function ExpertMiniCard({ expert }: ExpertMiniCardProps) {
  const name = `${expert.user.firstName} ${expert.user.lastName}`.trim();
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="mx-2 w-56 shrink-0 overflow-hidden rounded-2xl border border-border/60 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-muted">
          {expert.avatarUrl ? (
            <Image
              src={expert.avatarUrl}
              alt={name}
              fill
              className="object-cover object-center"
              sizes="48px"
            />
          ) : (
            <span className="flex size-full items-center justify-center text-sm font-bold text-primary">
              {initials}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-primary-hover">{name}</p>
          <p className="truncate text-xs text-muted-foreground">{expert.title}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        <Star className="size-3 fill-warning text-warning shrink-0" aria-hidden />
        <span className="text-xs font-semibold tabular-nums text-foreground">
          {expert.rating.toFixed(1)}
        </span>
        {expert.tags[0] && (
          <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-primary-hover">
            {expert.tags[0].name}
          </span>
        )}
      </div>

      <Link
        href={`/uzmanlar/${expert.id}`}
        className="mt-3 flex h-8 w-full items-center justify-center rounded-full bg-primary text-xs font-semibold text-white transition hover:bg-primary-hover"
      >
        Profili İncele
      </Link>
    </div>
  );
}

type Props = {
  experts: ApiExpertSummary[];
};

export function ExpertsMarquee({ experts }: Props) {
  if (experts.length === 0) return null;

  const doubled = [...experts, ...experts];

  return (
    <section className="overflow-hidden border-y border-border/50 bg-[#e6f0ee] py-8">
      <div className="mb-5 page-shell">
        <h2 className="text-xl font-semibold tracking-tight text-primary-hover">
          Öne Çıkan Uzmanlarımız
        </h2>
      </div>
      <div className="overflow-hidden">
        <div className="experts-scroll-track" aria-hidden="true">
          {doubled.map((expert, i) => (
            <ExpertMiniCard key={`${expert.id}-${i}`} expert={expert} />
          ))}
        </div>
      </div>
    </section>
  );
}
