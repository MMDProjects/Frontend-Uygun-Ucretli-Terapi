import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const ROLE_KEY = "userRole";

export function getAccessToken(): string | undefined {
  return Cookies.get(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | undefined {
  return Cookies.get(REFRESH_TOKEN_KEY);
}

export function setTokens(
  accessToken: string,
  refreshToken: string,
  role?: string,
): void {
  Cookies.set(ACCESS_TOKEN_KEY, accessToken, { expires: 1 / 96, sameSite: "Lax" }); // 15 dk
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, { expires: 7, sameSite: "Lax" });
  if (role) {
    Cookies.set(ROLE_KEY, role.toLowerCase(), { expires: 7, sameSite: "Lax" });
  }
}

export function getRole(): string | undefined {
  return Cookies.get(ROLE_KEY);
}

export function clearTokens(): void {
  Cookies.remove(ACCESS_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
  Cookies.remove(ROLE_KEY);
}
