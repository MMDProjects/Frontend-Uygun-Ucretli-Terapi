import { getOptionalApiBase } from "@/lib/http-client";
import { getAccessToken } from "@/lib/auth-cookies";
import type { PsychometricTestDefinition } from "@/types/dto/psychometric-test";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SavePsychometricTestPayload = Omit<
  PsychometricTestDefinition,
  "id" | "updatedAt"
> & { id?: string };

interface BackendTest {
  id: string;
  title: string;
  slug: string;
  description: string;
  isActive: boolean;
  definition?: PsychometricTestDefinition | null;
}

// ─── In-memory fallback (geliştirme / API yokken) ────────────────────────────

function cloneTests(tests: PsychometricTestDefinition[]): PsychometricTestDefinition[] {
  return JSON.parse(JSON.stringify(tests)) as PsychometricTestDefinition[];
}

let memStore: PsychometricTestDefinition[] = [];

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function authHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? getAccessToken() : undefined;
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function mapBackendTest(row: BackendTest): PsychometricTestDefinition | null {
  if (!row.definition) return null;
  const def = row.definition;
  return {
    ...def,
    questions: def.questions ?? [],
    subscales: def.subscales ?? [],
    interpretationBands: def.interpretationBands ?? [],
    id: row.id,
  };
}

// ─── List ─────────────────────────────────────────────────────────────────────

export async function listTests(): Promise<PsychometricTestDefinition[]> {
  const base = getOptionalApiBase();
  if (!base) return cloneTests(memStore);

  try {
    const res = await fetch(`${base}/admin/tests`, {
      method: "GET",
      headers: authHeaders(),
    });
    if (!res.ok) return cloneTests(memStore);

    const rows: BackendTest[] = await res.json();
    const mapped = rows
      .map(mapBackendTest)
      .filter((t): t is PsychometricTestDefinition => t !== null);

    memStore = cloneTests(mapped);
    return cloneTests(mapped);
  } catch {
    return cloneTests(memStore);
  }
}

export async function getTest(id: string): Promise<PsychometricTestDefinition | null> {
  const all = await listTests();
  return all.find((t) => t.id === id) ?? null;
}

// ─── Save (create / update) ───────────────────────────────────────────────────

export async function saveTest(
  payload: SavePsychometricTestPayload
): Promise<PsychometricTestDefinition> {
  const now = new Date().toISOString();
  const definition: PsychometricTestDefinition = {
    id: payload.id ?? "",
    title: payload.title,
    description: payload.description,
    disclaimer: payload.disclaimer,
    subscales: payload.subscales,
    interpretationBands: payload.interpretationBands,
    questions: payload.questions,
    updatedAt: now,
  };

  const base = getOptionalApiBase();
  if (!base) {
    const idx = memStore.findIndex((t) => t.id === payload.id);
    const saved = { ...definition, id: payload.id || `local-${Date.now()}` };
    if (idx >= 0) memStore[idx] = saved;
    else memStore = [...memStore, saved];
    return cloneTests([saved])[0];
  }

  const isEdit = Boolean(payload.id);
  const method = isEdit ? "PUT" : "POST";
  const url = isEdit
    ? `${base}/admin/tests/${encodeURIComponent(payload.id!)}`
    : `${base}/admin/tests`;

  const body = {
    title: payload.title,
    slug: toSlug(payload.title),
    description: payload.description,
    isActive: true,
    definition,
  };

  const res = await fetch(url, {
    method,
    headers: authHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`Test kaydedilemedi (${res.status})`);

  const saved: BackendTest = await res.json();
  const mapped = mapBackendTest(saved) ?? { ...definition, id: saved.id };
  const idx = memStore.findIndex((t) => t.id === mapped.id);
  if (idx >= 0) memStore[idx] = mapped;
  else memStore = [...memStore, mapped];
  return cloneTests([mapped])[0];
}

// ─── Delete ──────────────────────────────────────────────────────────────────

export async function deleteTest(id: string): Promise<void> {
  const base = getOptionalApiBase();
  if (!base) {
    memStore = memStore.filter((t) => t.id !== id);
    return;
  }
  const res = await fetch(`${base}/admin/tests/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Test silinemedi (${res.status})`);
  memStore = memStore.filter((t) => t.id !== id);
}

// ─── Seeded defaults (scoring mocks) ─────────────────────────────────────────

export function getDefaultSeededTests(): PsychometricTestDefinition[] {
  return cloneTests(memStore);
}

export function __resetTestStoreForTests(): void {
  memStore = [];
}
