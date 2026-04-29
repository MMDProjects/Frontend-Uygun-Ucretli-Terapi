import { create } from "zustand";

export type UserRole = "danisan" | "uzman" | "admin";

type AuthState = {
  isAuthenticated: boolean;
  displayName: string | null;
  role: UserRole | null;
  hasSeenFreeConsultPopup: boolean;
  hasSetMusaitlik: boolean;
  setSession: (payload: {
    isAuthenticated: boolean;
    displayName: string | null;
    role?: UserRole | null;
  }) => void;
  clearSession: () => void;
  markFreeConsultSeen: () => void;
  markMusaitlikSet: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  displayName: null,
  role: null,
  hasSeenFreeConsultPopup: false,
  hasSetMusaitlik: false,
  setSession: (payload) =>
    set({ ...payload, role: payload.role ?? null, hasSetMusaitlik: false }),
  clearSession: () =>
    set({
      isAuthenticated: false,
      displayName: null,
      role: null,
      hasSetMusaitlik: false,
    }),
  markFreeConsultSeen: () => set({ hasSeenFreeConsultPopup: true }),
  markMusaitlikSet: () => set({ hasSetMusaitlik: true }),
}));
