const BASE = () => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) throw new Error("NEXT_PUBLIC_API_URL tanımlı değil");
  return url.replace(/\/$/, "");
};

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
  isFormData?: boolean;
};

export async function apiFetch<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  const { method = "GET", body, token, isFormData = false } = opts;

  const headers: Record<string, string> = {};
  if (!isFormData && body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE()}${path}`, {
    method,
    headers,
    body: isFormData ? (body as FormData) : body !== undefined ? JSON.stringify(body) : undefined,
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = json?.message ?? res.statusText ?? "İstek başarısız";
    throw new Error(Array.isArray(msg) ? msg.join(", ") : msg);
  }

  return json as T;
}
