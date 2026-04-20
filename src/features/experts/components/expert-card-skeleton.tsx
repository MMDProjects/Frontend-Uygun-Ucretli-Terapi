export function ExpertCardSkeleton() {
  return (
    <div className="surface-card flex min-h-[20rem] flex-col overflow-hidden">
      <div className="px-6 pt-6">
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <div className="skeleton size-[72px] rounded-2xl" />
            <div className="absolute -left-1 -top-1 z-[1] h-5 w-11 rounded-full border border-border/80 bg-card shadow-sm" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="skeleton h-5 w-40 rounded-full" />
            <div className="skeleton h-4 w-28 rounded-full" />
          </div>
        </div>
      </div>
      <div className="mt-4 flex gap-2 px-6">
        <div className="skeleton h-7 w-20 rounded-full" />
        <div className="skeleton h-7 w-24 rounded-full" />
        <div className="skeleton h-7 w-[4.5rem] rounded-full" />
      </div>
      <div className="relative mt-4 flex min-h-0 flex-1 flex-col px-6 pb-0">
        <div className="relative min-h-[5.5rem] flex-1 space-y-2 overflow-hidden">
          <div className="skeleton h-4 w-full rounded-full" />
          <div className="skeleton h-4 w-11/12 rounded-full" />
          <div className="skeleton h-4 w-4/5 rounded-full" />
          <div className="skeleton h-4 w-full rounded-full" />
          <div className="skeleton h-4 w-10/12 rounded-full" />
        </div>
        <div className="relative z-[2] -mx-6 -mt-[3.25rem] w-[calc(100%+3rem)] py-3.5">
          <div className="skeleton mx-auto h-4 w-28 rounded-full" />
        </div>
      </div>
    </div>
  );
}
