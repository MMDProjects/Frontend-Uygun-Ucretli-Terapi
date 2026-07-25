import { apiFetch } from "@/lib/api";
import { getOptionalApiBase } from "@/lib/http-client";
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

export async function getKvkkAdminContent(): Promise<KvkkAdminData | null> {
  const base = getOptionalApiBase();
  if (!base) return null;
  try {
    const payload = await apiFetch<{ success: boolean; data: KvkkAdminData }>(
      "/admin/content/kvkk"
    );
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
  const payload = await apiFetch<{ success: boolean; message: string }>(
    "/admin/content/kvkk",
    { method: "POST", body: { version, sections } }
  );

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
