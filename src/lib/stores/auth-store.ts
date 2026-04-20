import { create } from "zustand";

type AuthState = {
  isAuthenticated: boolean;
  displayName: string | null;
  /** JWT / session geldiğinde çağrılacak; şimdilik yapı hazır. */
  setSession: (payload: {
    isAuthenticated: boolean;
    displayName: string | null;
  }) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  displayName: null,
  setSession: (payload) => set(payload),
  clearSession: () => set({ isAuthenticated: false, displayName: null }),
}));
