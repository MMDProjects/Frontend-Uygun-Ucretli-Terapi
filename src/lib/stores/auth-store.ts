import { create } from "zustand";

export type UserRole = "danisan" | "uzman" | "admin";

type AuthState = {
  isAuthenticated: boolean;
  userId: string | null;
  displayName: string | null;
  email: string | null;
  role: UserRole | null;
  hasSeenFreeConsultPopup: boolean;
  hasSetMusaitlik: boolean;
  setSession: (payload: {
    userId: string;
    displayName: string;
    email: string;
    role: UserRole;
  }) => void;
  clearSession: () => void;
  markFreeConsultSeen: () => void;
  markMusaitlikSet: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userId: null,
  displayName: null,
  email: null,
  role: null,
  hasSeenFreeConsultPopup: false,
  hasSetMusaitlik: false,
  setSession: (payload) =>
    set({
      isAuthenticated: true,
      userId: payload.userId,
      displayName: payload.displayName,
      email: payload.email,
      role: payload.role,
      hasSetMusaitlik: false,
    }),
  clearSession: () =>
    set({
      isAuthenticated: false,
      userId: null,
      displayName: null,
      email: null,
      role: null,
      hasSetMusaitlik: false,
    }),
  markFreeConsultSeen: () => set({ hasSeenFreeConsultPopup: true }),
  markMusaitlikSet: () => set({ hasSetMusaitlik: true }),
}));
