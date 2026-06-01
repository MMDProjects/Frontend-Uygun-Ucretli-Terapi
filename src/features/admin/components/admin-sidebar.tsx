"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/constants/site";
import { useAuthStore } from "@/lib/stores/auth-store";
import { logout } from "@/lib/services/auth.service";

type NavItem = { label: string; href: string; badge?: number };
type NavGroup = { title: string; items: NavItem[] };

const groups: NavGroup[] = [
  {
    title: "Kullanıcı Yönetimi",
    items: [
      { label: "Danışanlar", href: "/admin/kullanicilar/danisanlar" },
      { label: "Admin / Personel", href: "/admin/kullanicilar/adminler" },
    ],
  },
  {
    title: "Uzman ve Onay",
    items: [
      { label: "Yeni Başvurular", href: "/admin/uzman-onay/basvurular" },
      { label: "Profil Onayları", href: "/admin/uzman-onay/profil-onaylari" },
      { label: "Tüm Uzmanlar", href: "/admin/uzmanlar" },
      { label: "Müsaitlik Yönetimi", href: "/admin/musaitlik" },
    ],
  },
  {
    title: "İçerik",
    items: [
      { label: "Blog Yönetimi", href: "/admin/icerik/blog" },
      { label: "Sayfa / Sabit İçerik", href: "/admin/icerik/sayfalar" },
      { label: "SSS Yönetimi", href: "/admin/icerik/sss" },
      { label: "Paketler", href: "/admin/icerik/paketler" },
      { label: "Forum Soruları", href: "/admin/icerik/forum-sorulari" },
      { label: "Gelen Talepler", href: "/admin/formlar/talepler" },
      { label: "Test Yönetimi", href: "/admin/formlar/testler" },
    ],
  },
  {
    title: "Sistem",
    items: [
      { label: "Genel Ayarlar", href: "/admin/ayarlar/genel" },
      { label: "Filtre / Kategori", href: "/admin/ayarlar/kategoriler" },
      { label: "E-posta Şablonları", href: "/admin/ayarlar/email-sablonlari" },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { displayName } = useAuthStore();

  const name = displayName ?? "Admin";
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex h-full flex-col bg-[#014a3e] px-4 py-4 text-white">
      {/* Logo */}
      <div className="mb-4 px-1">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
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
            <span className="block text-[10px] text-white/50">Yonetim Paneli</span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col overflow-y-auto scrollbar-dark">
        {groups.map((group) => (
          <div key={group.title} className="mt-3 first:mt-0">
            <p className="mb-1 px-2 text-[10px] font-medium uppercase tracking-wider text-white/40">
              {group.title}
            </p>
            <ul className="space-y-0.5 pl-2">
              {group.items.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between rounded-md py-1 pl-2 pr-1 text-sm transition-colors",
                        active
                          ? "bg-white/15 font-medium text-white"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      <span>{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 ? (
                        <span className="rounded-full bg-destructive px-1.5 py-0 text-[10px] font-medium text-white">
                          {item.badge}
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
      <div className="mt-3 border-t border-white/10 pt-3">
        <div className="flex items-center gap-2.5 rounded-md px-2 py-1.5">
          {/* Avatar */}
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-semibold text-white">
            {initials}
          </div>

          {/* Name + role */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium leading-tight text-white">
              {name}
            </p>
            <p className="truncate text-[10px] text-white/50">Yönetici</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Link
              href="/admin/bildirimler"
              className="rounded-md p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Bildirimler"
            >
              <Bell className="size-4" />
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              className="rounded-md p-1 text-red-400 transition-colors hover:bg-white/10 hover:text-red-300"
              aria-label="Cikis yap"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
