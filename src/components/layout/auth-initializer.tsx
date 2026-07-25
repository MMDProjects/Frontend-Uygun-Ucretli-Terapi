"use client";

import { useEffect } from "react";
import { getAccessToken, getRefreshToken, getRole } from "@/lib/auth-cookies";
import { getMyProfile, refreshSession } from "@/lib/services/auth.service";
import { useAuthStore, type UserRole } from "@/lib/stores/auth-store";

// StrictMode'da useEffect iki kez çalışır; token rotation olduğu için ikinci istek
// zaten silinmiş refresh token'ı gönderir → clearSession tetiklenir. Guard bunu önler.
let initialized = false;

export function AuthInitializer() {
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    if (initialized) return;
    initialized = true;

    async function init() {
      if (getAccessToken()) {
        // apiFetch zaten 401'de otomatik refresh + store güncelleme yapıyor.
        // Başarılı olursa store set edilir; başarısız olursa clearSession zaten çağrılır.
        try {
          const me = await getMyProfile();
          useAuthStore.getState().setSession({
            userId: me.id,
            displayName: `${me.firstName} ${me.lastName}`.trim(),
            email: me.email,
            role: (getRole() ?? me.role).toLowerCase() as UserRole,
          });
        } catch {
          // apiFetch 401 → tryRefreshToken → başarısızsa clearSession zaten yapıldı.
          // Geçici hata (ağ/5xx) durumunda ise cookie'ler hâlâ durur; refresh token
          // varken oturumu login'e düşürmemek için bir kez daha dene. refreshSession
          // artık api.ts'teki singleton'a delege ettiği için çift rotation riski yok.
          if (getRefreshToken()) {
            await refreshSession();
          }
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
