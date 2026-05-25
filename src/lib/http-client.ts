import type { ApiResponse } from "@/types/dto/api";
import { getAccessToken } from "@/lib/auth-cookies";

const getBaseUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }
  return url.replace(/\/$/, "");
};

/** Returns API base URL or null when unset (e.g. mock-only dev). */
export function getOptionalApiBase(): string | null {
  const url = process.env.NEXT_PUBLIC_API_URL;
  return url ? url.replace(/\/$/, "") : null;
}

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions extends Omit<RequestInit, "body"> {
  method?: HttpMethod;
  body?: unknown;
  accessToken?: string | null;
}

/**
 * Thin fetch wrapper: base URL, JSON, Authorization, normalized ApiResponse errors.
 * Handles raw NestJS responses (no success/data envelope) by wrapping them.
 */
export async function httpRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = "GET", body, accessToken, headers: initHeaders, ...rest } =
    options;

  const headers = new Headers(initHeaders);
  if (!headers.has("Content-Type") && body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  // Use explicit token if provided, otherwise auto-inject from cookie (client-side only)
  const autoToken =
    typeof window !== "undefined" ? getAccessToken() : undefined;
  const token = accessToken !== undefined ? accessToken : (autoToken ?? null);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const url = `${getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    ...rest,
  });

  const json = (await res.json().catch(() => null)) as unknown;

  if (!res.ok) {
    const errJson = json as { message?: string } | null;
    const message = errJson?.message ?? res.statusText ?? "Request failed";
    throw new Error(message);
  }

  if (!json) {
    throw new Error("Empty response");
  }

  // NestJS returns raw JSON without success/data envelope — wrap it
  if (typeof (json as Record<string, unknown>).success !== "boolean") {
    return { success: true, data: json as T } as ApiResponse<T>;
  }

  const apiRes = json as ApiResponse<T>;
  if (!apiRes.success) {
    throw new Error(apiRes.message || "Request unsuccessful");
  }

  return apiRes;
}
