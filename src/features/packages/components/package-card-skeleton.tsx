export function PackageCardSkeleton() {
  return (
    <div className="surface-card p-6">
      <div className="skeleton h-4 w-20 rounded-full" />
      <div className="skeleton mt-3 h-8 w-32 rounded-full" />
      <div className="mt-4 space-y-2">
        <div className="skeleton h-4 w-full rounded-full" />
        <div className="skeleton h-4 w-10/12 rounded-full" />
      </div>
      <div className="skeleton mt-6 h-8 w-24 rounded-full" />
    </div>
  );
}
