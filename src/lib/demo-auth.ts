import Cookies from "js-cookie";

const STORAGE_KEY = "psiko_admin_demo_users";

const ACCESS_COOKIE = "accessToken";
const ROLE_COOKIE = "userRole";
const ADMIN_ROLE = "admin";

export interface DemoRegisteredUser {
  email: string;
  password: string;
  name: string;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function loadDemoUsers(): DemoRegisteredUser[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (row): row is DemoRegisteredUser =>
          typeof row === "object" &&
          row !== null &&
          typeof (row as DemoRegisteredUser).email === "string" &&
          typeof (row as DemoRegisteredUser).password === "string" &&
          typeof (row as DemoRegisteredUser).name === "string"
      )
      .map((u) => ({
        ...u,
        email: normalizeEmail(u.email),
      }));
  } catch {
    return [];
  }
}

export function registerDemoUser(
  user: Omit<DemoRegisteredUser, "email"> & { email: string }
): { ok: true } | { ok: false; message: string } {
  const email = normalizeEmail(user.email);
  if (!email || !user.password) {
    return { ok: false, message: "E-posta ve şifre zorunludur." };
  }
  if (user.password.length < 4) {
    return { ok: false, message: "Şifre en az 4 karakter olmalıdır." };
  }
  const users = loadDemoUsers();
  if (users.some((u) => u.email === email)) {
    return { ok: false, message: "Bu e-posta ile zaten kayıt var." };
  }
  users.push({
    email,
    password: user.password,
    name: user.name.trim() || "Kullanıcı",
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  return { ok: true };
}

export function verifyDemoLogin(
  email: string,
  password: string
): DemoRegisteredUser | null {
  const e = normalizeEmail(email);
  return (
    loadDemoUsers().find((u) => u.email === e && u.password === password) ??
    null
  );
}

/** Sets cookies expected by middleware (admin stub). */
export function setAdminSessionCookies(tokenSuffix: string = "demo"): void {
  const token = `${tokenSuffix}-${Date.now()}`;
  Cookies.set(ACCESS_COOKIE, token, {
    path: "/",
    expires: 7,
    sameSite: "lax",
  });
  Cookies.set(ROLE_COOKIE, ADMIN_ROLE, {
    path: "/",
    expires: 7,
    sameSite: "lax",
  });
}
