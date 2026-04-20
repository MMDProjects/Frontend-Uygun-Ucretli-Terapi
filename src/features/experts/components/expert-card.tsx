import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import type { Expert } from "@/types/domain";

type ExpertCardProps = {
  expert: Expert;
};

export function ExpertCard({ expert }: ExpertCardProps) {
  const initials = expert.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <article className="surface-card flex h-full min-h-[21rem] flex-col overflow-hidden">
      <div className="px-6 pt-6">
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            <div className="relative size-[72px] overflow-hidden rounded-2xl bg-muted">
              {expert.photoUrl ? (
                <Image
                  src={expert.photoUrl}
                  alt={`${expert.name} profil fotoğrafı`}
                  fill
                  className="object-cover object-center"
                  sizes="72px"
                />
              ) : (
                <span className="flex size-full items-center justify-center text-xl font-semibold text-primary">
                  {initials}
                </span>
              )}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-primary-hover">{expert.name}</h3>
            <p className="text-sm text-muted-foreground">{expert.title}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 px-6">
        <span
          className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium tabular-nums text-primary-hover"
          aria-label={`Puan ${expert.rating.toFixed(1)}`}
        >
          <Star className="size-3 shrink-0 fill-current" aria-hidden />
          <span>{expert.rating.toFixed(1)}</span>
        </span>
        {expert.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-primary-hover"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="relative mt-4 flex min-h-0 flex-1 flex-col px-6 pb-0">
        <div className="relative min-h-[6.25rem] flex-1 overflow-hidden">
          <p className="absolute inset-0 overflow-hidden text-pretty pr-0.5 text-sm leading-6 text-muted-foreground">
            {expert.bio}
          </p>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[5.5rem] bg-gradient-to-t from-card from-20% via-card/75 to-transparent [mask-image:linear-gradient(to_top,black_26%,transparent_100%)] backdrop-blur-[4px] motion-reduce:backdrop-blur-none supports-[backdrop-filter]:backdrop-blur-[12px]"
          />
        </div>

        <Link
          href={`/uzmanlar/${expert.slug}`}
          className="absolute bottom-4 right-4 z-[3] inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-center text-sm font-semibold !text-white shadow-sm transition-colors hover:bg-primary-hover hover:!text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none"
        >
          Profili İncele
        </Link>
      </div>
    </article>
  );
}
