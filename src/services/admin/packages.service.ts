import { getOptionalApiBase } from "@/lib/http-client";
import { getAccessToken } from "@/lib/auth-cookies";

export interface AdminPackage {
  id: string;
  name: string;
  sessionCount: number;
  price: string;
  description: string;
}

export interface UpdatePackageDto {
  name?: string;
  sessionCount?: number;
  price?: number;
  description?: string;
}

function authHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? getAccessToken() : undefined;
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getAdminPackages(): Promise<AdminPackage[]> {
  const base = getOptionalApiBase();
  if (!base) return [];
  const res = await fetch(`${base}/packages`, { headers: authHeaders() });
  if (!res.ok) {
    const body = await res.json().catch(() => null) as { message?: string } | null;
    throw new Error(body?.message ?? `Paketler yüklenemedi (${res.status})`);
  }
  return (await res.json()) as AdminPackage[];
}

export async function updateAdminPackage(
  id: string,
  dto: UpdatePackageDto
): Promise<void> {
  const base = getOptionalApiBase();
  if (!base) return;
  const res = await fetch(`${base}/admin/packages/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null) as { message?: string } | null;
    throw new Error(err?.message ?? "Paket güncellenemedi");
  }
}
