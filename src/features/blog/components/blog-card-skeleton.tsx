export function BlogCardSkeleton() {
  return (
    <article className="surface-card flex h-full flex-col overflow-hidden">
      <div className="skeleton aspect-[16/10] w-full" />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex gap-2">
          <div className="skeleton h-5 w-20 rounded-full" />
          <div className="skeleton h-5 w-24 rounded-full" />
        </div>
        <div className="skeleton mt-3 h-6 w-full rounded-lg" />
        <div className="mt-3 space-y-2">
          <div className="skeleton h-4 w-full rounded-full" />
          <div className="skeleton h-4 w-11/12 rounded-full" />
        </div>
        <div className="skeleton mt-4 h-4 w-32 rounded-full" />
        <div className="skeleton mt-4 h-9 w-24 rounded-full" />
      </div>
    </article>
  );
}
