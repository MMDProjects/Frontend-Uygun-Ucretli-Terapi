"use client";

import { Bell, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/services/auth.service";

interface UzmanTopBarProps {
  onMenuClick?: () => void;
  unreadCount?: number;
}

export function UzmanTopBar({ onMenuClick, unreadCount = 0 }: UzmanTopBarProps) {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.replace("/giris");
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4 shadow-sm sm:px-6">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Menüyü aç"
        >
          <Menu className="size-5" />
        </Button>
        <h1 className="text-sm font-semibold sm:text-base">
          <span className="text-primary">Uzman</span> Paneli
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Link href="/uzman/bildirimler" className="relative">
          <Button type="button" variant="outline" size="icon" className="relative size-9">
            <Bell className="size-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="size-4" />
          <span className="hidden sm:inline">Çıkış</span>
        </Button>
      </div>
    </header>
  );
}
