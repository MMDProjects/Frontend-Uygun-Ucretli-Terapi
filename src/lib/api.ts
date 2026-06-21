import { getAccessToken, getRefreshToken, getRole, setTokens, clearTokens } from "@/lib/auth-cookies";
import { useAuthStore } from "@/lib/stores/auth-store";

const BASE = () => {
  const url =
    (typeof window === "undefined" && process.env.INTERNAL_API_URL) ||
    process.env.NEXT_PUBLIC_API_URL;
  if (!url) throw new Error("NEXT_PUBLIC_API_URL tanımlı değil");
  return url.replace(/\/$/, "");
};

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
  isFormData?: boolean;
  _isRetry?: boolean;
};

async function tryRefreshToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;
  try {
    const res = await fetch(`${BASE()}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) {
      clearTokens();
      useAuthStore.getState().clearSession();
      return null;
    }
    const data = (await res.json()) as { accessToken: string; refreshToken: string; user: { role: string; id: string; email: string; firstName: string; lastName: string } };
    setTokens(data.accessToken, data.refreshToken, data.user.role);
    useAuthStore.getState().setSession({
      userId: data.user.id,
      displayName: `${data.user.firstName} ${data.user.lastName}`.trim(),
      email: data.user.email,
      role: data.user.role.toLowerCase() as import("@/lib/stores/auth-store").UserRole,
    });
    return data.accessToken;
  } catch {
    return null;
  }
}

export async function apiFetch<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  const { method = "GET", body, token, isFormData = false, _isRetry = false } = opts;

  const resolvedToken = token ?? (typeof window !== "undefined" ? getAccessToken() : null);

  const headers: Record<string, string> = {};
  if (!isFormData && body !== undefined) headers["Content-Type"] = "application/json";
  if (resolvedToken) headers["Authorization"] = `Bearer ${resolvedToken}`;

  const res = await fetch(`${BASE()}${path}`, {
    method,
    headers,
    body: isFormData ? (body as FormData) : body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Sadece gerçek bir auth token gönderdikse 401'de refresh dene.
  // Token yoksa (login/register gibi public endpoint) 401 = yanlış kimlik → direkt hata.
  if (res.status === 401 && !_isRetry && resolvedToken) {
    const newToken = await tryRefreshToken();
    if (newToken) {
      return apiFetch<T>(path, { ...opts, token: newToken, _isRetry: true });
    }
    clearTokens();
    if (typeof window !== "undefined") {
      const role = getRole();
      window.location.href = role === "uzman" ? "/uzman/giris" : role === "admin" ? "/admin/giris" : "/giris";
    }
    throw new Error("Oturum süresi doldu, lütfen tekrar giriş yapın");
  }

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = json?.message ?? res.statusText ?? "İstek başarısız";
    throw new Error(Array.isArray(msg) ? msg.join(", ") : msg);
  }

  return json as T;
}
