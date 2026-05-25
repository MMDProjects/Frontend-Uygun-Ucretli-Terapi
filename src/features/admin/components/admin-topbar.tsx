"use client";

import { Bell, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface AdminTopBarProps {
  pendingCount?: number;
  userLabel?: string;
  onMenuClick?: () => void;
  pageTitle?: string;
}

export function AdminTopBar({
  pendingCount = 0,
  userLabel = "Admin",
  onMenuClick,
  pageTitle,
}: AdminTopBarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4 shadow-sm sm:px-6">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
          aria-label="Menüyü aç"
        >
          <Menu className="size-5" />
        </Button>
        {pageTitle ? (
          <h1 className="text-sm font-semibold sm:text-base text-foreground">
            {pageTitle}
          </h1>
        ) : (
          <h1 className="text-sm font-semibold sm:text-base">
            <span className="text-primary">Psikolog</span> Yönetim Paneli
          </h1>
        )}
      </div>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="relative gap-2"
        >
          <Bell className="size-4" />
          <span className="hidden sm:inline">Bekleyen</span>
          {pendingCount > 0 ? (
            <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
              {pendingCount > 99 ? "99+" : pendingCount}
            </span>
          ) : null}
        </Button>
        <div className="hidden h-6 w-px bg-border sm:block" />
        <span className="hidden text-sm text-muted-foreground sm:inline">
          {userLabel}
        </span>
        <div className="hidden h-6 w-px bg-border sm:block" />
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Link href="/admin/giris?cikis=1">
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Çıkış</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
