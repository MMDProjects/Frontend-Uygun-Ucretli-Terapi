"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, LogOut, User, ClipboardList, FlaskConical, LayoutDashboard } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/constants/site";
import { useAuthStore } from "@/lib/stores/auth-store";

const navItems = [
  { href: "/uzmanlar", label: "Uzmanlar" },
  { href: "/blog", label: "Blog" },
  { href: "/testler", label: "Testler" },
  { href: "/paketler", label: "Paketler" },
  { href: "/nasil-calisir", label: "Nasıl Çalışır" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
  { href: "/kurumsal", label: "Kurumsal" },
  { href: "/forum", label: "Forum" },
];

const mobileNavItems = [
  { href: "/uzmanlar", label: "Uzmanlar" },
  { href: "/blog", label: "Blog" },
  { href: "/testler", label: "Testler" },
  { href: "/paketler", label: "Paketler" },
  { href: "/nasil-calisir", label: "Nasıl Çalışır" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
  { href: "/kurumsal", label: "Kurumsal" },
  { href: "/forum", label: "Forum" },
];

const linkCls =
  "shrink-0 inline-flex h-9 items-center rounded-full px-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-primary";

function UserAccountMenu() {
  const { displayName, role, clearSession } = useAuthStore();

  const initials = displayName
    ? displayName
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "K";

  const danisanMenuItems = [
    { href: "/profilim", label: "Profilim", icon: User },
    { href: "/taleplerim", label: "Taleplerim", icon: ClipboardList },
    { href: "/testlerim", label: "Testlerim", icon: FlaskConical },
  ];

  const uzmanMenuItems = [
    { href: "/uzman/dashboard", label: "Uzman Paneli", icon: LayoutDashboard },
  ];

  const userMenuItems = role === "uzman" ? uzmanMenuItems : danisanMenuItems;

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-border/90 bg-white py-1.5 pl-1.5 pr-3 shadow-sm transition hover:shadow-md"
          aria-label="Hesap menüsü"
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
            {initials}
          </span>
          <span className="hidden max-w-[120px] truncate text-sm font-semibold text-foreground sm:block">
            {displayName ?? "Hesabım"}
          </span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="end"
          sideOffset={8}
          className="z-50 w-52 overflow-hidden rounded-2xl border border-border/80 bg-white shadow-lg outline-none"
        >
          <div className="border-b border-border/50 px-4 py-3">
            <p className="text-xs font-medium text-muted-foreground">Giriş yapıldı</p>
            <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
              {displayName ?? "Hesabım"}
            </p>
          </div>

          {userMenuItems.map(({ href, label, icon: Icon }) => (
            <Popover.Close asChild key={href}>
              <Link
                href={href}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-primary"
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </Link>
            </Popover.Close>
          ))}

          <div className="border-t border-border/50">
            <Popover.Close asChild>
              <button
                type="button"
                onClick={clearSession}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-destructive transition hover:bg-destructive/5"
              >
                <LogOut className="size-4 shrink-0" />
                Çıkış Yap
              </button>
            </Popover.Close>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, role } = useAuthStore();

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 w-full bg-transparent">
        <div className="page-shell flex min-h-[var(--site-header-height)] items-center justify-between gap-3 py-3 lg:grid lg:grid-cols-[auto_1fr_auto] lg:gap-4 lg:py-2">

          {/* Sol: Logo */}
          <div className="flex shrink-0 items-center lg:justify-self-start">
            <div className="inline-flex items-center rounded-full border border-border/90 bg-white px-2 py-1.5 shadow-sm">
              <Link href="/" className="flex items-center gap-2.5 text-lg font-bold text-primary">
                <Image
                  src={siteConfig.brandLogoUrl}
                  alt={`${siteConfig.brandDisplayName} logosu`}
                  width={36}
                  height={36}
                  priority
                  className="size-9 shrink-0 rounded-full object-cover"
                />
                <span className="hidden truncate leading-tight lg:block">
                  {siteConfig.brandDisplayName}
                </span>
              </Link>
            </div>
          </div>

          {/* Orta: Nav (desktop) */}
          <nav aria-label="Ana navigasyon" className="hidden min-w-0 justify-center lg:flex lg:justify-self-center">
            <div className="inline-flex max-w-full items-center gap-0 overflow-hidden rounded-full border border-border/90 bg-white px-1.5 py-1.5 shadow-sm">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className={linkCls}>
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Sağ: Auth alanı + mobil hamburger */}
          <div className="flex shrink-0 items-center justify-end gap-2 lg:justify-self-end">
            {isAuthenticated ? (
              <UserAccountMenu />
            ) : (
              <div className="inline-flex items-center gap-1 rounded-full border border-border/90 bg-white py-1.5 px-1.5 shadow-sm">
                <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                  <Link href="/giris">Giriş Yap</Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="sm:hidden">
                  <Link href="/giris">Giriş</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/uzman-basvurusu">Uzman Ol</Link>
                </Button>
              </div>
            )}

            {/* Mobil hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border/90 bg-white shadow-sm lg:hidden"
              aria-label="Menüyü aç"
            >
              {mobileOpen
                ? <X className="size-5 text-primary" />
                : <Menu className="size-5 text-primary" />
              }
            </button>
          </div>
        </div>
      </header>

      {/* Mobil overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobil nav panel */}
      <div
        className={cn(
          "fixed inset-x-0 top-[var(--site-header-height)] z-30 transition-all duration-200 lg:hidden",
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="page-shell py-3">
          <nav className="overflow-hidden rounded-2xl border border-border/80 bg-white shadow-lg">
            {mobileNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block border-b border-border/50 px-5 py-3 text-sm font-medium text-muted-foreground transition last:border-0 hover:bg-muted hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated && role === "uzman" && (
              <Link
                href="/uzman/dashboard"
                onClick={() => setMobileOpen(false)}
                className="block border-t border-border/50 px-5 py-3 text-sm font-medium text-primary transition hover:bg-muted"
              >
                Uzman Paneli
              </Link>
            )}
            {isAuthenticated && role !== "uzman" && (
              <>
                <Link
                  href="/profilim"
                  onClick={() => setMobileOpen(false)}
                  className="block border-t border-border/50 px-5 py-3 text-sm font-medium text-primary transition hover:bg-muted"
                >
                  Profilim
                </Link>
                <Link
                  href="/taleplerim"
                  onClick={() => setMobileOpen(false)}
                  className="block border-b border-border/50 px-5 py-3 text-sm font-medium text-primary transition hover:bg-muted"
                >
                  Taleplerim
                </Link>
                <Link
                  href="/testlerim"
                  onClick={() => setMobileOpen(false)}
                  className="block px-5 py-3 text-sm font-medium text-primary transition hover:bg-muted"
                >
                  Testlerim
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}
