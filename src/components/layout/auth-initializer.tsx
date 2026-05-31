"use client";

import { useEffect } from "react";
import { getRefreshToken } from "@/lib/auth-cookies";
import { refreshSession } from "@/lib/services/auth.service";
import { useAuthStore } from "@/lib/stores/auth-store";

export function AuthInitializer() {
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    if (getRefreshToken()) {
      refreshSession().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [setLoading]);

  return null;
}
