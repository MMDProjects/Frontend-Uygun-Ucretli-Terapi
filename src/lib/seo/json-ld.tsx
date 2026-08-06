import { siteConfig } from "@/lib/constants/site";

/**
 * JSON-LD (schema.org) bloğunu sayfaya gömer.
 * `<` kaçışlanır: soru/cevap ve bio gibi kullanıcı üretimi alanlar
 * script bağlamında XSS'e yol açmasın.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteConfig.siteUrl}/#organization`,
  name: siteConfig.brandDisplayName,
  alternateName: "uygun ücretli Terapi",
  url: siteConfig.siteUrl,
  logo: `${siteConfig.siteUrl}${siteConfig.brandLogoUrl}`,
  image: `${siteConfig.siteUrl}/og-image.png`,
  description: siteConfig.description,
  telephone: siteConfig.contact.phoneDisplay,
  sameAs: siteConfig.socialLinks.map((link) => link.href),
};

export const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteConfig.siteUrl}/#website`,
  name: siteConfig.brandDisplayName,
  alternateName: "uygun ücretli Terapi",
  url: siteConfig.siteUrl,
  publisher: { "@id": `${siteConfig.siteUrl}/#organization` },
};
