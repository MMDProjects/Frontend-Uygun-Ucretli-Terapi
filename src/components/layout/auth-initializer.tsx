"use client";

import { useEffect } from "react";
import { getAccessToken, getRefreshToken, getRole } from "@/lib/auth-cookies";
import { getMyProfile, refreshSession } from "@/lib/services/auth.service";
import { useAuthStore, type UserRole } from "@/lib/stores/auth-store";

// StrictMode'da useEffect iki kez çalışır; token rotation yaptığı için
// ikinci istek geçersiz token ile gelip clearSession() tetikler.
// Module-level flag ile ilk çalışma tamamlanmadan ikincisini engelle.
let initialized = false;

export function AuthInitializer() {
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    async function init() {
      if (getAccessToken()) {
        // Access token geçerli — /me ile store'u doldur, refresh yapma
        try {
          const me = await getMyProfile();
          useAuthStore.getState().setSession({
            userId: me.id,
            displayName: `${me.firstName} ${me.lastName}`.trim(),
            email: me.email,
            role: (getRole() ?? me.role).toLowerCase() as UserRole,
          });
        } catch {
          // /me başarısız → refresh'e düş
          if (getRefreshToken()) await refreshSession();
        }
      } else if (getRefreshToken()) {
        // Access token yok ama refresh var → yeni access token al
        await refreshSession();
      }
    }

    init().finally(() => setLoading(false));
  }, [setLoading]);

  return null;
}
