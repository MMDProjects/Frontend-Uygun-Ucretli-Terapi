import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ACCESS_COOKIE = "accessToken";
const ROLE_COOKIE = "userRole";
const ADMIN_ROLE = "admin";

const ADMIN_PROTECTED_PREFIXES = [
  "/admin/dashboard",
  "/admin/kullanicilar",
  "/admin/uzman-onay",
  "/admin/uzmanlar",
  "/admin/icerik",
  "/admin/formlar",
  "/admin/ayarlar",
  "/admin/bildirimler",
] as const;

function isProtectedAdminRoute(pathname: string): boolean {
  return ADMIN_PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

function isAuthenticatedAdmin(request: NextRequest): boolean {
  const token = request.cookies.get(ACCESS_COOKIE)?.value;
  const role = request.cookies.get(ROLE_COOKIE)?.value;
  if (!token) return false;
  return role === ADMIN_ROLE;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Admin logout: clear cookies and redirect to login
  if (
    pathname.startsWith("/admin/giris") &&
    request.nextUrl.searchParams.get("cikis") === "1"
  ) {
    const target = new URL("/admin/giris", request.url);
    const res = NextResponse.redirect(target);
    res.cookies.set(ACCESS_COOKIE, "", { path: "/", maxAge: 0 });
    res.cookies.set(ROLE_COOKIE, "", { path: "/", maxAge: 0 });
    return res;
  }

  const admin = isAuthenticatedAdmin(request);

  // Authenticated admin trying to reach login → redirect to dashboard
  if (pathname.startsWith("/admin/giris") && admin) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // Protected admin routes → require admin auth
  if (isProtectedAdminRoute(pathname) && !admin) {
    return NextResponse.redirect(new URL("/admin/giris", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
