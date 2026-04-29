"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  FileText,
  Calendar,
  MessageSquare,
  PenSquare,
  Bell,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/stores/auth-store";
import { siteConfig } from "@/lib/constants/site";
import { MOCK_UZMAN_PROFILE, MOCK_NOTIFICATIONS, MOCK_DANISAN_REQUESTS } from "@/features/uzman/data/mock-uzman";

const NAV_ITEMS = [
  { href: "/uzman/dashboard", label: "Kontrol Paneli", icon: LayoutDashboard },
  { href: "/uzman/profil", label: "Profilim", icon: User },
  { href: "/uzman/belgeler", label: "Belgelerim", icon: FileText },
  { href: "/uzman/musaitlik", label: "Müsaitlik", icon: Calendar },
  { href: "/uzman/talepler", label: "Talepler", icon: MessageSquare },
  { href: "/uzman/blog", label: "Blog Yazılarım", icon: PenSquare },
  { href: "/uzman/bildirimler", label: "Bildirimler", icon: Bell },
];

interface UzmanSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function UzmanSidebar({ open, onClose }: UzmanSidebarProps) {
  const pathname = usePathname();
  const { displayName, clearSession } = useAuthStore();

  const unreadNotifCount = MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length;
  const pendingRequestCount = MOCK_DANISAN_REQUESTS.filter(
    (r) => r.status === "Beklemede"
  ).length;

  function getBadge(href: string) {
    if (href === "/uzman/bildirimler") return unreadNotifCount;
    if (href === "/uzman/talepler") return pendingRequestCount;
    return 0;
  }

  const initials = (displayName ?? MOCK_UZMAN_PROFILE.name)
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#014a3e] transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src={siteConfig.brandLogoUrl}
              alt="Logo"
              width={32}
              height={32}
              className="size-8 rounded-full object-cover"
            />
            <span className="text-sm font-bold text-white leading-tight">
              {siteConfig.brandDisplayName}
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="flex size-7 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Menüyü kapat"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3" aria-label="Uzman panel navigasyonu">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-white/40">
            Panel
          </p>
          <ul className="space-y-0.5">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              const badge = getBadge(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                      active
                        ? "bg-white/15 text-white"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="size-4 shrink-0" />
                      {label}
                    </span>
                    {badge > 0 && (
                      <span className="flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User card + logout */}
        <div className="border-t border-white/10 p-3">
          <div className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {displayName ?? MOCK_UZMAN_PROFILE.name}
              </p>
              <p className="truncate text-xs text-white/50">
                {MOCK_UZMAN_PROFILE.title}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={clearSession}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut className="size-4" />
            Çıkış Yap
          </button>
        </div>
      </aside>
    </>
  );
}
