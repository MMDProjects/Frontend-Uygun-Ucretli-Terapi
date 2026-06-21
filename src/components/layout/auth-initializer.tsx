"use client";

import { useEffect } from "react";
import { getRefreshToken } from "@/lib/auth-cookies";
import { refreshSession } from "@/lib/services/auth.service";
import { useAuthStore } from "@/lib/stores/auth-store";

// StrictMode'da useEffect iki kez çalışır; token rotation yaptığı için
// ikinci istek geçersiz token ile gelip clearSession() tetikler.
// Module-level flag ile ilk çalışma tamamlanmadan ikincisini engelle.
let initialized = false;

export function AuthInitializer() {
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    if (initialized) return;
    initialized = true;

    if (getRefreshToken()) {
      refreshSession().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [setLoading]);

  return null;
}
