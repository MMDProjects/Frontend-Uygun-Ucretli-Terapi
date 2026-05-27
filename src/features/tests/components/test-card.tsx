import Link from "next/link";

import type { ApiTest } from "@/lib/services/public.service";

type TestCardProps = {
  test: ApiTest;
};

export function TestCard({ test }: TestCardProps) {
  return (
    <article className="relative flex min-h-[18rem] flex-col overflow-hidden rounded-[2rem] border border-border/60 bg-white p-6 shadow-sm lg:rounded-[2.25rem]">
      <h3 className="text-lg font-semibold text-primary-hover">{test.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
        {test.description}
      </p>
      <Link
        href={`/testler/${test.slug}`}
        className="absolute bottom-4 right-4 z-[3] inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-center text-sm font-semibold !text-white shadow-sm transition-colors hover:bg-primary-hover hover:!text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none"
      >
        Teste Başla
      </Link>
    </article>
  );
}
