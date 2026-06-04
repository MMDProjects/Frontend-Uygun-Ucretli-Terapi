import { create } from "zustand";
import type { AdminNotification } from "@/lib/services/admin.service";

interface AdminNotificationStore {
  notifications: AdminNotification[];
  unreadCount: number;
  addNotification: (notification: AdminNotification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  loadNotifications: (notifications: AdminNotification[]) => void;
  clearAll: () => void;
}

export const useAdminNotificationStore = create<AdminNotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: !notification.isRead ? state.unreadCount + 1 : state.unreadCount,
    })),

  markAsRead: (id) =>
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      );
      const unread = updated.filter((n) => !n.isRead).length;
      return { notifications: updated, unreadCount: unread };
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),

  loadNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    }),

  clearAll: () => ({
    notifications: [],
    unreadCount: 0,
  }),
}));
