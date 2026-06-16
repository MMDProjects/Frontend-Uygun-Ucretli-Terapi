import Link from "next/link";

import { siteConfig } from "@/lib/constants/site";

export function SiteFooter() {

  return (
    <footer className="bg-[#cce1de] text-[#1a1a1a]">
      <div className="page-shell py-10 lg:py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          <div className="space-y-3">
            <p className="text-lg font-semibold text-primary">
              {siteConfig.brandShortName}
            </p>
            <p className="text-sm leading-6 text-[#1a1a1a]/85">
              Güven odaklı uzman keşfi, testler ve iletişim akışları için tasarlanan
              mobil öncelikli platform altyapısı.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-primary">İletişim</p>
            <address className="not-italic">
              <p className="text-sm">
                <a
                  href={siteConfig.contact.phoneHref}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  {siteConfig.contact.phoneDisplay}
                </a>
              </p>
              <p className="mt-1 text-sm">
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  {siteConfig.contact.email}
                </a>
              </p>
            </address>
          </div>

          <div className="space-y-4 md:col-span-2 lg:col-span-1">
            <p className="text-sm font-semibold text-primary">Sosyal medya</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {siteConfig.socialLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-primary/20 pt-6 text-center text-sm text-[#1a1a1a]/75">
          <p>© 2022 {siteConfig.brandShortName}. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
