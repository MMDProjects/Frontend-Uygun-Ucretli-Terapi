import { create } from "zustand";

export type UserRole = "danisan" | "uzman" | "admin";

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
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
  setLoading: (loading: boolean) => void;
  markFreeConsultSeen: () => void;
  markMusaitlikSet: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  userId: null,
  displayName: null,
  email: null,
  role: null,
  hasSeenFreeConsultPopup: false,
  hasSetMusaitlik: false,
  setSession: (payload) =>
    set({
      isAuthenticated: true,
      isLoading: false,
      userId: payload.userId,
      displayName: payload.displayName,
      email: payload.email,
      role: payload.role,
      hasSetMusaitlik: false,
    }),
  clearSession: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("free_consult_seen");
    }
    set({
      isAuthenticated: false,
      isLoading: false,
      userId: null,
      displayName: null,
      email: null,
      role: null,
      hasSeenFreeConsultPopup: false,
      hasSetMusaitlik: false,
    });
  },
  setLoading: (loading) => set({ isLoading: loading }),
  markFreeConsultSeen: () => set({ hasSeenFreeConsultPopup: true }),
  markMusaitlikSet: () => set({ hasSetMusaitlik: true }),
}));
