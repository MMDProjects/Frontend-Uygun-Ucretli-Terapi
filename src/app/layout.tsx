import type { Metadata, Viewport } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { SiteShell } from "@/components/layout/site-shell";
import { AuthInitializer } from "@/components/layout/auth-initializer";
import { siteConfig } from "@/lib/constants/site";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#016a59",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: siteConfig.name,
    template: `%s | Yeçamer`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: siteConfig.siteUrl,
    siteName: "Yeçamer",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Yeçamer — Online Danışmanlık Platformu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className="min-h-full bg-background text-foreground"
        suppressHydrationWarning
      >
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white opacity-0 transition focus:translate-y-0 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          İçeriğe atla
        </a>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-E7G8NHQ42B"
          strategy="beforeInteractive"
        />
        <Script id="google-analytics" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-E7G8NHQ42B');
          `}
        </Script>
        <AuthInitializer />
        <SiteShell>{children}</SiteShell>
        <Toaster />
      </body>
    </html>
  );
}
