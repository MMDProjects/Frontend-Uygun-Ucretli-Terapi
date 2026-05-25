"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { getRefreshToken, getAccessToken } from "@/lib/auth-cookies";
import { refreshSession } from "@/lib/services/auth.service";
import { useAuthStore, type UserRole } from "@/lib/stores/auth-store";

const DEMO_ROLES: UserRole[] = ["admin", "uzman", "danisan"];

export function AuthInitializer() {
  useEffect(() => {
    if (getRefreshToken()) {
      refreshSession();
    } else if (getAccessToken()) {
      // Demo/stub session: restore Zustand from cookies (no backend call needed)
      const role = Cookies.get("userRole") as UserRole | undefined;
      if (role && DEMO_ROLES.includes(role) && !useAuthStore.getState().isAuthenticated) {
        useAuthStore.getState().setSession({
          userId: "demo",
          displayName: role === "admin" ? "Admin" : "Kullanıcı",
          email: "",
          role,
        });
      }
    }
  }, []);

  return null;
}
