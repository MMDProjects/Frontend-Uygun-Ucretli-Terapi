import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
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

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
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
        <AuthInitializer />
        <SiteShell>{children}</SiteShell>
        <Toaster />
      </body>
    </html>
  );
}
