"use client";

import { useEffect } from "react";
import { getRefreshToken } from "@/lib/auth-cookies";
import { refreshSession } from "@/lib/services/auth.service";

export function AuthInitializer() {
  useEffect(() => {
    if (getRefreshToken()) {
      refreshSession();
    }
  }, []);

  return null;
}
