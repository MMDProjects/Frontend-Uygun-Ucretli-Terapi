import { apiFetch } from "@/lib/api";
import { setTokens, clearTokens, getRefreshToken } from "@/lib/auth-cookies";
import { useAuthStore, type UserRole } from "@/lib/stores/auth-store";

type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
  };
};

function applySession(data: AuthResponse) {
  setTokens(data.accessToken, data.refreshToken);
  useAuthStore.getState().setSession({
    userId: data.user.id,
    displayName: `${data.user.firstName} ${data.user.lastName}`.trim(),
    email: data.user.email,
    role: data.user.role.toLowerCase() as UserRole,
  });
}

export async function loginDanisan(email: string, password: string): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
  applySession(data);
  return data;
}

export async function loginUzman(email: string, password: string): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
  if (data.user.role !== "UZMAN" && data.user.role !== "ADMIN") {
    throw new Error("Bu hesap uzman girişi için yetkili değil.");
  }
  applySession(data);
  return data;
}

export async function registerDanisan(payload: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  kvkkConsent: boolean;
}): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>("/auth/register/danisan", {
    method: "POST",
    body: payload,
  });
  applySession(data);
  return data;
}

export async function logout(refreshToken?: string): Promise<void> {
  const token = refreshToken ?? getRefreshToken();
  if (token) {
    await apiFetch("/auth/logout", {
      method: "POST",
      body: { refreshToken: token },
    }).catch(() => {});
  }
  clearTokens();
  useAuthStore.getState().clearSession();
}

export async function refreshSession(): Promise<void> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return;
  try {
    const data = await apiFetch<AuthResponse>("/auth/refresh", {
      method: "POST",
      body: { refreshToken },
    });
    applySession(data);
  } catch (e) {
    // TypeError = network/fetch failure (backend offline) — keep session intact
    if (e instanceof TypeError) return;
    clearTokens();
    useAuthStore.getState().clearSession();
  }
}
