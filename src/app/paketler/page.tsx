import { PackageCard } from "@/features/packages/components/package-card";
import { packagePlans } from "@/features/shared/data/mock-content";

export default function PackagesPage() {
  return (
    <>
      <section className="section-shell relative overflow-hidden border-b border-border/70 bg-[#cce1de]">
        <div className="page-shell">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-primary-hover sm:text-5xl">
              Paketler
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-8">
              Seans ve ücret bilgileri yalnızca bu sayfada gösterilir. Size uygun
              paketi seçerek sürece net bir planla başlayabilirsiniz.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#e6f0ee] py-12">
        <div className="page-shell grid gap-6 md:grid-cols-2 xl:grid-cols-5 xl:items-start">
          {packagePlans.map((plan) => (
            <PackageCard key={plan.name} plan={plan} />
          ))}
        </div>
      </section>
    </>
  );
}
