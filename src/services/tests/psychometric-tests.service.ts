import { getOptionalApiBase } from "@/lib/http-client";
import type { PsychometricTestDefinition } from "@/types/dto/psychometric-test";

const SUBSCALE_IDS = ["cleaning", "checking", "doubt", "obsessing"] as const;

function buildMociSampleQuestions(): PsychometricTestDefinition["questions"] {
  const templates = [
    "Ellerimi veya bedenimi aşırı sıklıkla yıkamak zorunda hissederim.",
    "Kapıların kilitli olup olmadığını veya ocağın kapalı olup olmadığını tekrar tekrar kontrol ederim.",
    "Karar verirken sürekli şüpheye düşer, seçimlerimden emin olamam.",
    "İstenmeyen düşünceleri zihnimden çıkarmak için büyük çaba harcarım.",
    "Hijyen konusunda kurallara uymazsam kötü bir şey olacağına inanırım.",
    "Cihazları veya anahtarları defalarca kontrol etmeden rahat edemem.",
    "Yaptığım işi doğru yapıp yapmadığımdan süphelenirim.",
    "Belirli düşünceleri tekrar tekrar yaşarım ve bunları durdurmakta zorlanırım.",
  ];

  const questions: PsychometricTestDefinition["questions"] = [];
  for (let i = 0; i < 37; i++) {
    const n = i + 1;
    const subscaleId = SUBSCALE_IDS[i % 4];
    const textBase = templates[i % templates.length];
    const text = i < 8 ? textBase : `Örnek madde ${n} (MOCI yapısı — içerik sonra doldurulabilir).`;
    questions.push({
      id: `moci-q-${n}`,
      order: n,
      text,
      subscaleId,
      options: [
        { id: `moci-q-${n}-yes`, label: "Evet", score: 1 },
        { id: `moci-q-${n}-no`, label: "Hayır", score: 0 },
      ],
    });
  }
  return questions;
}

function createInitialTests(): PsychometricTestDefinition[] {
  const moci: PsychometricTestDefinition = {
    id: "test-moci-sample",
    title: "Maudsley OKB Envanteri (MOCI) — örnek yapı",
    description:
      "37 maddelik öz-bildirim ölçeği; obsesif-kompulsif belirtileri tarama amaçlıdır. Bu sürüm yönetim panelinde yapı ve puanlama doğrulaması içindir.",
    disclaimer:
      "Tarama aracıdır; kesin tanı için klinik değerlendirme gerekir. Yüksek sonuçlarda ruh sağlığı uzmanına başvurulması önerilir.",
    updatedAt: "2026-04-01T10:00:00.000Z",
    subscales: [
      {
        id: "cleaning",
        name: "Temizlik / Titizlik",
        description: "Aşırı el yıkama, hijyen takıntıları.",
      },
      {
        id: "checking",
        name: "Kontrol etme",
        description: "Kapı, cihaz vb. tekrarlı kontrol.",
      },
      {
        id: "doubt",
        name: "Şüphecilik",
        description: "Kararsızlık ve karar verememe.",
      },
      {
        id: "obsessing",
        name: "Düşünceleri bastırma",
        description: "İstenmeyen düşünceler ve kontrol çabası.",
      },
    ],
    interpretationBands: [
      {
        id: "moci-b0",
        minScore: 0,
        maxScore: 7,
        title: "Normal sınırlar",
        summary:
          "Obsesif-kompulsif belirtiler yok veya çok hafif düzeyde.",
      },
      {
        id: "moci-b1",
        minScore: 8,
        maxScore: 15,
        title: "Hafif düzey",
        summary: "Hafif düzeyde obsesif-kompulsif belirtiler.",
      },
      {
        id: "moci-b2",
        minScore: 16,
        maxScore: 25,
        title: "Orta düzey",
        summary: "Orta düzeyde obsesif-kompulsif belirtiler.",
      },
      {
        id: "moci-b3",
        minScore: 26,
        maxScore: 37,
        title: "Şiddetli düzey",
        summary: "Şiddetli obsesif-kompulsif belirtiler; uzman değerlendirmesi önerilir.",
      },
    ],
    questions: buildMociSampleQuestions(),
  };

  const brief: PsychometricTestDefinition = {
    id: "test-brief-wellbeing",
    title: "İyi oluş öz-değerlendirme (örnek)",
    description:
      "Farklı şık sayısı ve puan aralığı göstermek için kısa örnek test.",
    updatedAt: "2026-03-15T08:30:00.000Z",
    subscales: [
      {
        id: "general",
        name: "Genel iyi oluş",
        description: "Son günlerdeki genel durum.",
      },
    ],
    interpretationBands: [
      {
        id: "wb-low",
        minScore: 0,
        maxScore: 3,
        title: "Düşük",
        summary: "Destek veya izlem faydalı olabilir.",
      },
      {
        id: "wb-mid",
        minScore: 4,
        maxScore: 7,
        title: "Orta",
        summary: "Kararsız veya dalgalı bir dönem.",
      },
      {
        id: "wb-high",
        minScore: 8,
        maxScore: 12,
        title: "İyi",
        summary: "Genel iyi oluş bildirimi güçlü.",
      },
    ],
    questions: [
      {
        id: "wb-q1",
        order: 1,
        text: "Son bir haftada kendinizi ne kadar rahat hissettiniz?",
        subscaleId: "general",
        options: [
          { id: "wb-q1-o0", label: "Hiç rahat değilim", score: 0 },
          { id: "wb-q1-o1", label: "Az rahat", score: 1 },
          { id: "wb-q1-o2", label: "Kararsız", score: 2 },
          { id: "wb-q1-o3", label: "Rahat", score: 3 },
          { id: "wb-q1-o4", label: "Çok rahat", score: 4 },
        ],
      },
      {
        id: "wb-q2",
        order: 2,
        text: "Uyku düzeninizden memnun musunuz?",
        subscaleId: "general",
        options: [
          { id: "wb-q2-o0", label: "Hayır", score: 0 },
          { id: "wb-q2-o1", label: "Kısmen", score: 2 },
          { id: "wb-q2-o2", label: "Evet", score: 4 },
        ],
      },
      {
        id: "wb-q3",
        order: 3,
        text: "Günlük işlere ilginiz nasıl?",
        subscaleId: "general",
        options: [
          { id: "wb-q3-o0", label: "Çok düşük", score: 0 },
          { id: "wb-q3-o1", label: "Düşük", score: 1 },
          { id: "wb-q3-o2", label: "Orta", score: 2 },
          { id: "wb-q3-o3", label: "Yüksek", score: 3 },
          { id: "wb-q3-o4", label: "Çok yüksek", score: 4 },
        ],
      },
    ],
  };

  return [moci, brief];
}

function cloneTests(tests: PsychometricTestDefinition[]): PsychometricTestDefinition[] {
  return JSON.parse(JSON.stringify(tests)) as PsychometricTestDefinition[];
}

let testStore: PsychometricTestDefinition[] = cloneTests(createInitialTests());

function newId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function responseLooksSuccessful(payload: unknown): boolean {
  if (!isRecord(payload)) return false;
  if (payload.success === true) return true;
  if (payload.status === "success") return true;
  return false;
}

function mapTestFromApiRow(row: Record<string, unknown>): PsychometricTestDefinition | null {
  const id = String(row.id ?? "");
  if (!id) return null;
  return row as unknown as PsychometricTestDefinition;
}

function mapTestsFromResponse(payload: unknown): PsychometricTestDefinition[] {
  if (!isRecord(payload)) return [];
  const data = isRecord(payload.data) ? payload.data : null;
  if (!data) return [];
  const raw =
    (Array.isArray(data.tests) ? data.tests : null) ??
    (Array.isArray(data.psychometric_tests) ? data.psychometric_tests : null);
  if (!raw) return [];
  return raw
    .filter(isRecord)
    .map(mapTestFromApiRow)
    .filter((t): t is PsychometricTestDefinition => t !== null);
}

/**
 * In-memory list (clone). Survives saveTest until page refresh when API is unset.
 */
export async function listTests(
  accessToken?: string | null
): Promise<PsychometricTestDefinition[]> {
  const base = getOptionalApiBase();
  if (!base) {
    return cloneTests(testStore);
  }

  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
    const res = await fetch(`${base}/admin/psychometric-tests`, {
      method: "GET",
      headers,
      credentials: "include",
    });
    if (!res.ok) {
      console.warn("[listTests] HTTP", res.status, "- using in-memory store");
      return cloneTests(testStore);
    }
    const payload: unknown = await res.json();
    if (!responseLooksSuccessful(payload)) {
      return cloneTests(testStore);
    }
    const mapped = mapTestsFromResponse(payload);
    if (mapped.length > 0) {
      testStore = cloneTests(mapped);
      return cloneTests(testStore);
    }
    return cloneTests(testStore);
  } catch (e) {
    console.warn("[listTests] failed - using in-memory store", e);
    return cloneTests(testStore);
  }
}

export async function getTest(
  id: string,
  accessToken?: string | null
): Promise<PsychometricTestDefinition | null> {
  const all = await listTests(accessToken ?? null);
  return all.find((t) => t.id === id) ?? null;
}

/** Fresh clone of factory defaults (for scoring mock submissions; independent of mutated store). */
export function getDefaultSeededTests(): PsychometricTestDefinition[] {
  return cloneTests(createInitialTests());
}

export type SavePsychometricTestPayload = Omit<
  PsychometricTestDefinition,
  "id" | "updatedAt"
> & { id?: string };

/**
 * Creates or replaces a test in the in-memory store. API: POST/PATCH when configured.
 */
export async function saveTest(
  payload: SavePsychometricTestPayload,
  accessToken?: string | null
): Promise<PsychometricTestDefinition> {
  const base = getOptionalApiBase();
  const now = new Date().toISOString();
  const id = payload.id?.trim() || newId("test");

  const full: PsychometricTestDefinition = {
    id,
    title: payload.title,
    description: payload.description,
    disclaimer: payload.disclaimer,
    subscales: payload.subscales,
    interpretationBands: payload.interpretationBands,
    questions: payload.questions,
    updatedAt: now,
  };

  if (!base) {
    const idx = testStore.findIndex((t) => t.id === id);
    if (idx >= 0) testStore[idx] = full;
    else testStore = [...testStore, full];
    return cloneTests([full])[0];
  }

  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
    const method = testStore.some((t) => t.id === id) ? "PATCH" : "POST";
    const path =
      method === "POST"
        ? `${base}/admin/psychometric-tests`
        : `${base}/admin/psychometric-tests/${encodeURIComponent(id)}`;
    const res = await fetch(path, {
      method,
      headers,
      credentials: "include",
      body: JSON.stringify(full),
    });
    if (!res.ok) {
      console.warn("[saveTest] HTTP", res.status, "- persisting locally only");
      const idx = testStore.findIndex((t) => t.id === id);
      if (idx >= 0) testStore[idx] = full;
      else testStore = [...testStore, full];
      return cloneTests([full])[0];
    }
    const json: unknown = await res.json();
    if (isRecord(json) && json.success === true && isRecord(json.data)) {
      const t = json.data.test ?? json.data;
      if (isRecord(t) && t.id) {
        const parsed = mapTestFromApiRow(t as Record<string, unknown>);
        if (parsed) {
          const idx = testStore.findIndex((x) => x.id === parsed.id);
          if (idx >= 0) testStore[idx] = parsed;
          else testStore = [...testStore, parsed];
          return cloneTests([parsed])[0];
        }
      }
    }
    const idx = testStore.findIndex((t) => t.id === id);
    if (idx >= 0) testStore[idx] = full;
    else testStore = [...testStore, full];
    return cloneTests([full])[0];
  } catch (e) {
    console.warn("[saveTest] failed - persisting locally only", e);
    const idx = testStore.findIndex((t) => t.id === id);
    if (idx >= 0) testStore[idx] = full;
    else testStore = [...testStore, full];
    return cloneTests([full])[0];
  }
}

/** Test-only reset for Storybook / future use — not exported to UI */
export function __resetTestStoreForTests(): void {
  testStore = cloneTests(createInitialTests());
}
