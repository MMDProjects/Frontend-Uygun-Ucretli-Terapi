"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/stores/auth-store";
import { logout } from "@/lib/services/auth.service";
import { siteConfig } from "@/lib/constants/site";
import { getAssignedQuestions } from "@/lib/services/forum.service";

type NavItem = { label: string; href: string; badge?: number };
type NavGroup = { title: string; items: NavItem[] };

const groups: NavGroup[] = [
  {
    title: "Panel",
    items: [
      { label: "Kontrol Paneli", href: "/uzman/dashboard" },
      { label: "Profilim", href: "/uzman/profil" },
      { label: "Belgelerim", href: "/uzman/belgeler" },
    ],
  },
  {
    title: "Danışanlar",
    items: [
      { label: "Müsaitlik", href: "/uzman/musaitlik" },
      { label: "Forum Soruları", href: "/uzman/forum" },
    ],
  },
  {
    title: "İçerik",
    items: [
      { label: "Blog Yazılarım", href: "/uzman/blog" },
      { label: "Bildirimler", href: "/uzman/bildirimler" },
    ],
  },
];

interface UzmanSidebarProps {
  open: boolean;
  onClose: () => void;
  unreadNotifCount?: number;
}

export function UzmanSidebar({ open, onClose, unreadNotifCount = 0 }: UzmanSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { displayName } = useAuthStore();
  const [pendingForumCount, setPendingForumCount] = useState(0);

  useEffect(() => {
    getAssignedQuestions()
      .then((qs) => setPendingForumCount(qs.filter((q) => q.status === "ATANDI").length))
      .catch(() => {});
  }, []);

  function getBadge(href: string): number {
    if (href === "/uzman/bildirimler") return unreadNotifCount;
    if (href === "/uzman/forum") return pendingForumCount;
    return 0;
  }

  const name = displayName ?? "Uzman";
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
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
        <div className="mb-4 px-4 pt-4">
          <Link href="/uzman/dashboard" className="flex items-center gap-2.5">
            <Image
              src={siteConfig.brandLogoUrl}
              alt={`${siteConfig.brandDisplayName} logosu`}
              width={34}
              height={34}
              className="size-[34px] shrink-0 rounded-full object-cover"
            />
            <div className="min-w-0">
              <span className="block truncate text-sm font-semibold leading-tight text-white">
                {siteConfig.brandDisplayName}
              </span>
              <span className="block text-[10px] text-white/50">Uzman Paneli</span>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col overflow-hidden px-4">
          {groups.map((group) => (
            <div key={group.title} className="mt-3 first:mt-0">
              <p className="mb-1 px-2 text-[10px] font-medium uppercase tracking-wider text-white/40">
                {group.title}
              </p>
              <ul className="space-y-0.5 pl-2">
                {group.items.map((item) => {
                  const active =
                    pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const badge = getBadge(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center justify-between rounded-md py-1 pl-2 pr-1 text-sm transition-colors",
                          active
                            ? "bg-white/15 font-medium text-white"
                            : "text-white/70 hover:bg-white/10 hover:text-white"
                        )}
                      >
                        <span>{item.label}</span>
                        {badge > 0 ? (
                          <span className="rounded-full bg-destructive px-1.5 py-0 text-[10px] font-medium text-white">
                            {badge}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Profile row */}
        <div className="mt-3 border-t border-white/10 px-4 pb-4 pt-3">
          <div className="flex items-center gap-2.5 rounded-md px-2 py-1.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-semibold text-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium leading-tight text-white">
                {name}
              </p>
              <p className="truncate text-[10px] text-white/50">Uzman</p>
            </div>
            <div className="flex items-center gap-1">
              <Link
                href="/uzman/bildirimler"
                className="rounded-md p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Bildirimler"
              >
                <Bell className="size-4" />
              </Link>
              <button
                type="button"
                onClick={() => { void logout().then(() => router.push("/giris")); }}
                className="rounded-md p-1 text-red-400 transition-colors hover:bg-white/10 hover:text-red-300"
                aria-label="Çıkış yap"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
