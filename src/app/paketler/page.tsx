import { getPackages, getSss } from "@/lib/services/public.service";
import type { ApiPackage } from "@/lib/services/public.service";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { SssSection } from "@/components/common/sss-section";

export const revalidate = 0;

function PackageCardApi({
  pkg,
  highlighted,
}: {
  pkg: ApiPackage;
  highlighted: boolean;
}) {
  const price = Number(pkg.price);
  const priceLabel = price
    ? price.toLocaleString("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 })
    : "—";

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

      <span
        className={cn(
          "w-fit rounded-full px-3 py-1 text-xs font-semibold",
          highlighted ? "bg-white/20 text-white" : "bg-muted text-primary-hover",
        )}
      >
        {pkg.sessionCount} Seans
      </span>

      <h3
        className={cn(
          "mt-4 text-2xl font-bold tracking-tight",
          highlighted ? "text-white" : "text-primary-hover",
        )}
      >
        {pkg.name}
      </h3>

      <p className={cn("mt-3 text-3xl font-bold", highlighted ? "text-white" : "text-primary")}>
        {priceLabel}
      </p>

      <p
        className={cn(
          "mt-3 text-sm leading-6",
          highlighted ? "text-white/80" : "text-muted-foreground",
        )}
      >
        {pkg.description}
      </p>

      <div className={cn("my-6 h-px w-full", highlighted ? "bg-white/20" : "bg-border/60")} />

      <div className="flex-1" />

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

export default async function PackagesPage() {
  let packages: ApiPackage[] = [];
  let sssItems: Awaited<ReturnType<typeof getSss>> = [];
  try {
    [packages, sssItems] = await Promise.all([getPackages(), getSss("PAKETLER")]);
  } catch {
    packages = [];
    sssItems = [];
  }

  const midIndex = Math.floor(packages.length / 2);

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
        {packages.length === 0 ? (
          <div className="page-shell">
            <p className="text-center text-sm text-muted-foreground py-12">
              Paketler yükleniyor...
            </p>
          </div>
        ) : (
          <div className="page-shell grid gap-6 md:grid-cols-2 xl:grid-cols-5 xl:items-start">
            {packages.map((pkg, i) => (
              <PackageCardApi key={pkg.id} pkg={pkg} highlighted={i === midIndex} />
            ))}
          </div>
        )}
      </section>

      <SssSection items={sssItems} title="Paketler Hakkında Sıkça Sorulan Sorular" />
    </>
  );
}
