"use client";

import { useState, useEffect } from "react";
import { Bell, CheckCheck, MessageCircle, AlertCircle, Info, Siren } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/features/admin/components/page-header";
import {
  getMyUzmanNotifications,
  markUzmanNotificationRead,
  type ApiUzmanNotification,
} from "@/lib/services/uzman.service";
import type { UzmanNotificationType } from "@/types/domain";
import { cn } from "@/lib/utils";

const TYPE_CONFIG: Record<
  UzmanNotificationType,
  { icon: React.ElementType; className: string; iconClass: string; label?: string }
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
  danger_panic: {
    icon: Siren,
    className: "border-red-500 bg-red-50",
    iconClass: "bg-red-600 text-white animate-pulse",
    label: "ACİL",
  },
};

function NotificationItem({
  notif,
  onMarkRead,
}: {
  notif: ApiUzmanNotification;
  onMarkRead: (id: string) => void;
}) {
  const config = TYPE_CONFIG[notif.type];
  const Icon = config.icon;
  const isDanger = notif.type === "danger_panic";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-4 transition",
        config.className,
        !notif.isRead && "shadow-sm",
        isDanger && "border-l-4 border-l-red-600",
      )}
    >
      {!notif.isRead && !isDanger && (
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
          {config.label && (
            <span className="mb-1 inline-flex items-center rounded-full bg-red-600 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-white">
              {config.label}
            </span>
          )}
          <p
            className={cn(
              "text-sm",
              notif.isRead ? "text-muted-foreground" : "font-semibold text-foreground",
              isDanger && "font-semibold text-red-700",
            )}
          >
            {notif.message}
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            {new Date(notif.createdAt).toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
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
  const [notifications, setNotifications] = useState<ApiUzmanNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyUzmanNotifications()
      .then(setNotifications)
      .catch((e: unknown) => toast.error(e instanceof Error ? e.message : "Bildirimler yüklenemedi."))
      .finally(() => setLoading(false));
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  async function markRead(id: string) {
    try {
      await markUzmanNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Bildirim okundu olarak işaretlenemedi.");
    }
  }

  async function markAllRead() {
    const unread = notifications.filter((n) => !n.isRead);
    try {
      await Promise.all(unread.map((n) => markUzmanNotificationRead(n.id)));
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Bildirimler okundu olarak işaretlenemedi.");
    }
  }

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="h-10 w-48 skeleton rounded-xl" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 skeleton rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Bildirimler"
        description={unreadCount > 0 ? `${unreadCount} okunmamış bildirim` : "Tüm bildirimler okundu"}
      >
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            className="flex items-center gap-1.5 rounded-xl border border-border/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:border-primary/30 hover:text-primary"
          >
            <CheckCheck className="size-3.5" />
            Tümünü Okundu İşaretle
          </button>
        )}
      </PageHeader>

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
