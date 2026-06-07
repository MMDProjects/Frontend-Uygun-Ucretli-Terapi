import type React from "react";
import { Check } from "lucide-react";
import { getPackages, getSss } from "@/lib/services/public.service";
import type { ApiPackage } from "@/lib/services/public.service";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { SssSection } from "@/components/common/sss-section";

export const revalidate = 0;

function parseFeatures(description: string): string[] {
  return description
    .split("\n")
    .map((l) => l.replace(/^[-•*]\s+/, "").trim())
    .filter(Boolean);
}

function PackageCard({
  pkg,
  highlighted,
}: {
  pkg: ApiPackage;
  highlighted: boolean;
}) {
  const price = Number(pkg.price);
  const priceLabel = price
    ? price.toLocaleString("tr-TR", {
        style: "currency",
        currency: "TRY",
        maximumFractionDigits: 0,
      })
    : "—";

  const features = parseFeatures(pkg.description);

  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-2xl border p-5 transition-shadow",
        highlighted
          ? "border-primary bg-primary text-white shadow-xl xl:-my-3 xl:rounded-3xl xl:p-7"
          : "border-border/60 bg-white text-foreground shadow-sm hover:shadow-md",
      )}
    >
      {highlighted && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-4 py-1 text-xs font-bold tracking-wide text-primary shadow-sm">
          En Popüler
        </span>
      )}

      {/* Seans badge */}
      <span
        className={cn(
          "w-fit rounded-full px-3 py-1 text-xs font-semibold",
          highlighted
            ? "bg-white/20 text-white"
            : "bg-muted text-primary-hover",
        )}
      >
        {pkg.sessionCount} Seans
      </span>

      {/* Paket adı */}
      <h3
        className={cn(
          "mt-3 text-lg font-bold leading-snug",
          highlighted ? "text-white" : "text-primary-hover",
        )}
      >
        {pkg.name}
      </h3>

      {/* Fiyat */}
      <p
        className={cn(
          "mt-2 text-3xl font-bold tracking-tight",
          highlighted ? "text-white" : "text-primary",
        )}
      >
        {priceLabel}
      </p>

      {/* Ayraç */}
      <div
        className={cn(
          "my-4 h-px w-full",
          highlighted ? "bg-white/20" : "bg-border/60",
        )}
      />

      {/* Özellik listesi */}
      <ul className="flex-1 space-y-2">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span
              className={cn(
                "mt-0.5 flex shrink-0 items-center justify-center rounded-full",
                highlighted
                  ? "text-white/90"
                  : "text-primary",
              )}
            >
              <Check className="size-3.5 stroke-[2.5]" />
            </span>
            <span
              className={cn(
                "text-xs leading-5",
                highlighted ? "text-white/85" : "text-muted-foreground",
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
          "mt-6 inline-flex h-10 w-full items-center justify-center rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer",
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
    [packages, sssItems] = await Promise.all([
      getPackages(),
      getSss("PAKETLER"),
    ]);
  } catch {
    packages = [];
    sssItems = [];
  }

  const midIndex = Math.floor(packages.length / 2);

  return (
    <>
      {/* Hero */}
      <section className="section-shell relative overflow-hidden border-b border-border/70 bg-[#cce1de]">
        <div className="page-shell">
          <div className="max-w-2xl space-y-3">
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-primary-hover sm:text-5xl">
              Paketler ve Fiyatlar
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              Seans ve ücret bilgileri yalnızca bu sayfada gösterilir. Size
              uygun paketi seçerek sürece net bir planla başlayabilirsiniz.
            </p>
          </div>
        </div>
      </section>

      {/* Paket kartları */}
      <section className="bg-[#e6f0ee] py-16">
        {packages.length === 0 ? (
          <div className="page-shell">
            <p className="py-12 text-center text-sm text-muted-foreground">
              Paketler yükleniyor…
            </p>
          </div>
        ) : (
          <div className="page-shell">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5 xl:items-center">
              {packages.map((pkg, i) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  highlighted={i === midIndex}
                />
              ))}
            </div>

            {/* Alt not */}
            <p className="mt-8 text-center text-xs text-muted-foreground">
              Tüm paketler online seans içerir. Ödeme randevu aşamasında
              gerçekleşir.
            </p>
          </div>
        )}
      </section>

      <SssSection
        items={sssItems}
        title="Paketler Hakkında Sıkça Sorulan Sorular"
      />
    </>
  );
}
