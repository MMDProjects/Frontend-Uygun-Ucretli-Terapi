"use client";

import { useState } from "react";
import { Bell, CheckCheck, MessageCircle, AlertCircle, Info } from "lucide-react";
import { MOCK_NOTIFICATIONS } from "@/features/uzman/data/mock-uzman";
import type { UzmanNotification, UzmanNotificationType } from "@/types/domain";
import { cn } from "@/lib/utils";

const TYPE_CONFIG: Record<
  UzmanNotificationType,
  { icon: React.ElementType; className: string; iconClass: string }
> = {
  admin_message: {
    icon: MessageCircle,
    className: "border-blue-200 bg-blue-50",
    iconClass: "bg-blue-100 text-blue-600",
  },
  profil_reddedildi: {
    icon: AlertCircle,
    className: "border-red-200 bg-red-50",
    iconClass: "bg-red-100 text-red-600",
  },
  blog_reddedildi: {
    icon: AlertCircle,
    className: "border-orange-200 bg-orange-50",
    iconClass: "bg-orange-100 text-orange-600",
  },
  sistem: {
    icon: Info,
    className: "border-border/60 bg-white",
    iconClass: "bg-muted text-muted-foreground",
  },
};

function NotificationItem({
  notif,
  onMarkRead,
}: {
  notif: UzmanNotification;
  onMarkRead: (id: string) => void;
}) {
  const config = TYPE_CONFIG[notif.type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-4 transition",
        config.className,
        !notif.isRead && "shadow-sm"
      )}
    >
      {!notif.isRead && (
        <div className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-primary" />
      )}
      <div className="flex items-start gap-3 pl-2">
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl",
            config.iconClass
          )}
        >
          <Icon className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-sm",
              notif.isRead ? "text-muted-foreground" : "font-semibold text-foreground"
            )}
          >
            {notif.message}
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground">{notif.createdAt}</p>
        </div>
        {!notif.isRead && (
          <button
            type="button"
            onClick={() => onMarkRead(notif.id)}
            className="flex shrink-0 items-center gap-1.5 rounded-xl border border-border/60 px-2.5 py-1 text-[10px] font-semibold text-muted-foreground transition hover:border-primary/30 hover:text-primary"
            aria-label="Okundu işaretle"
          >
            <CheckCheck className="size-3" />
            Okundu
          </button>
        )}
      </div>
    </div>
  );
}

export default function UzmanBildirimlerPage() {
  const [notifications, setNotifications] = useState<UzmanNotification[]>(
    MOCK_NOTIFICATIONS
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  function markRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {unreadCount > 0
            ? `${unreadCount} okunmamış bildirim`
            : "Tüm bildirimler okundu"}
        </p>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <CheckCheck className="size-3.5" />
            Tümünü Okundu İşaretle
          </button>
        )}
      </div>

      {/* List */}
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-white py-16 text-center">
          <Bell className="mb-3 size-10 text-muted-foreground/40" />
          <p className="text-sm font-semibold text-muted-foreground">
            Henüz bildirim yok
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <NotificationItem
              key={notif.id}
              notif={notif}
              onMarkRead={markRead}
            />
          ))}
        </div>
      )}
    </div>
  );
}
