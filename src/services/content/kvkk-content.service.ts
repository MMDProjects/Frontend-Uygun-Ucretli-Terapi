import { getOptionalApiBase } from "@/lib/http-client";
import { getAccessToken } from "@/lib/auth-cookies";
import type { KvkkSection } from "@/lib/services/public.service";

export type KvkkVersionMeta = {
  id: string;
  version: string;
  publishedAt: string;
  isActive: boolean;
};

export type KvkkActiveVersion = {
  id: string | null;
  version: string;
  sections: KvkkSection[];
  publishedAt: string | null;
};

export type KvkkAdminData = {
  active: KvkkActiveVersion;
  history: KvkkVersionMeta[];
};

function authHeaders(): HeadersInit {
  const token = getAccessToken();
  const headers: HeadersInit = { "Content-Type": "application/json", Accept: "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function getKvkkAdminContent(): Promise<KvkkAdminData | null> {
  const base = getOptionalApiBase();
  if (!base) return null;
  try {
    const res = await fetch(`${base}/admin/content/kvkk`, {
      headers: authHeaders(),
      credentials: "include",
    });
    if (!res.ok) return null;
    const payload = (await res.json()) as { success: boolean; data: KvkkAdminData };
    return payload?.data ?? null;
  } catch {
    return null;
  }
}

export async function publishKvkkVersion(
  version: string,
  sections: KvkkSection[]
): Promise<{ success: boolean; message: string }> {
  const base = getOptionalApiBase();
  if (!base) return { success: false, message: "API bağlantısı yok" };
  const res = await fetch(`${base}/admin/content/kvkk`, {
    method: "POST",
    headers: authHeaders(),
    credentials: "include",
    body: JSON.stringify({ version, sections }),
  });
  const payload = (await res.json()) as { success: boolean; message: string };
  if (!res.ok) throw new Error(payload?.message ?? "Yayınlama başarısız");

  // /kvkk sayfasının ISR cache'ini sıfırla
  try {
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: "/kvkk" }),
    });
  } catch {
    // revalidate başarısız olsa da publish başarılı sayılır
  }

  return payload;
}
