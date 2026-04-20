import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/constants/site";

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 w-full bg-transparent">
      <div className="page-shell flex min-h-[var(--site-header-height)] items-center justify-between gap-4 py-3 lg:grid lg:grid-cols-3 lg:items-center lg:justify-center lg:gap-6 lg:py-2">
        <div className="flex min-w-0 shrink-0 items-center lg:justify-self-start">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2.5 text-lg font-bold text-primary"
          >
            <Image
              src={siteConfig.brandLogoUrl}
              alt={`${siteConfig.brandDisplayName} logosu`}
              width={44}
              height={44}
              priority
              className="size-11 shrink-0 rounded-full object-cover"
            />
            <span className="truncate leading-tight">
              {siteConfig.brandDisplayName}
            </span>
          </Link>
        </div>

        <nav
          aria-label="Ana navigasyon"
          className="hidden min-w-0 justify-center lg:flex lg:justify-self-center"
        >
          <div className="inline-flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full border border-border/90 bg-white px-2 py-1.5 shadow-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {siteConfig.navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3 lg:justify-self-end">
          <Button asChild variant="outline" className="hidden min-w-[7.5rem] sm:inline-flex">
            <Link href="/giris">Giriş Yap</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="sm:hidden">
            <Link href="/giris">Giriş</Link>
          </Button>
          <Button asChild className="min-w-[7.5rem]">
            <Link href="/uzman-basvurusu">Uzman Ol</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
