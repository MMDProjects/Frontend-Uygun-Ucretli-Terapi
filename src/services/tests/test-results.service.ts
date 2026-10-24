import { apiFetch } from "@/lib/api";
import { getOptionalApiBase } from "@/lib/http-client";
import { buildQuery } from "@/lib/pagination";
import { computePsychometricScores } from "@/lib/psychometric-scoring";
import type {
  TestAnswersMap,
  TestResultSubmission,
  TestResultsListFilters,
} from "@/types/dto/psychometric-test";
import { getDefaultSeededTests } from "./psychometric-tests.service";

function mociYesAnswers(n: number): TestAnswersMap {
  const map: TestAnswersMap = {};
  for (let i = 1; i <= n; i++) {
    map[`moci-q-${i}`] = `moci-q-${i}-yes`;
  }
  return map;
}

function buildMockSubmissions(): TestResultSubmission[] {
  const seeded = getDefaultSeededTests();
  const moci = seeded.find((t) => t.id === "test-moci-sample");
  const brief = seeded.find((t) => t.id === "test-brief-wellbeing");
  if (!moci || !brief) return [];

  const ans10 = mociYesAnswers(10);
  const c10 = computePsychometricScores(moci, ans10);

  const ans20 = mociYesAnswers(20);
  const c20 = computePsychometricScores(moci, ans20);

  const ans30 = mociYesAnswers(30);
  const c30 = computePsychometricScores(moci, ans30);

  const briefAns: TestAnswersMap = {
    "wb-q1": "wb-q1-o3",
    "wb-q2": "wb-q2-o2",
    "wb-q3": "wb-q3-o3",
  };
  const cBrief = computePsychometricScores(brief, briefAns);

  return [
    {
      id: "sub-1",
      testId: moci.id,
      testTitle: moci.title,
      userId: "1",
      userName: "Zeynep Kaya",
      userEmail: "zeynep.kaya@example.com",
      submittedAt: "2026-04-10T16:00:00.000Z",
      answers: ans10,
      totalScore: c10.totalScore,
      subscaleScores: c10.subscaleScores,
      matchedBandTitle: c10.band?.title ?? "—",
    },
    {
      id: "sub-2",
      testId: moci.id,
      testTitle: moci.title,
      userId: "2",
      userName: "Can Öztürk",
      userEmail: "can.ozturk@example.com",
      submittedAt: "2026-04-09T11:20:00.000Z",
      answers: ans20,
      totalScore: c20.totalScore,
      subscaleScores: c20.subscaleScores,
      matchedBandTitle: c20.band?.title ?? "—",
    },
    {
      id: "sub-3",
      testId: moci.id,
      testTitle: moci.title,
      userId: "3",
      userName: "Elif Demir",
      userEmail: "elif.demir@example.com",
      submittedAt: "2026-04-08T09:45:00.000Z",
      answers: ans30,
      totalScore: c30.totalScore,
      subscaleScores: c30.subscaleScores,
      matchedBandTitle: c30.band?.title ?? "—",
    },
    {
      id: "sub-4",
      testId: brief.id,
      testTitle: brief.title,
      userId: "1",
      userName: "Zeynep Kaya",
      userEmail: "zeynep.kaya@example.com",
      submittedAt: "2026-04-07T14:00:00.000Z",
      answers: briefAns,
      totalScore: cBrief.totalScore,
      subscaleScores: cBrief.subscaleScores,
      matchedBandTitle: cBrief.band?.title ?? "—",
    },
  ];
}

function applyResultFilters(
  list: TestResultSubmission[],
  filters: TestResultsListFilters
): TestResultSubmission[] {
  let out = list;
  if (filters.testId) {
    out = out.filter((s) => s.testId === filters.testId);
  }
  const q = filters.search?.toLowerCase().trim() ?? "";
  if (q.length > 0) {
    out = out.filter(
      (s) =>
        s.userName.toLowerCase().includes(q) ||
        s.userEmail.toLowerCase().includes(q) ||
        s.testTitle.toLowerCase().includes(q)
    );
  }
  return out;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function responseLooksSuccessful(payload: unknown): boolean {
  if (!isRecord(payload)) return false;
  if (payload.success === true) return true;
  if (payload.status === "success") return true;
  // Backend'imiz { data: [...], total, page, limit } döndürüyor
  if (Array.isArray(payload.data)) return true;
  return false;
}

function parseScoreSummary(summary: string): { totalScore: number; matchedBandTitle: string } {
  const scoreMatch = summary.match(/Puan:\s*(\d+)/);
  const totalScore = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;
  const matchedBandTitle = summary.split(":")[0]?.trim() ?? summary;
  return { totalScore, matchedBandTitle };
}

interface BackendTestResult {
  id: string;
  testId: string;
  userId: string;
  scoreSummary: string;
  createdAt: string;
  user: { firstName: string; lastName: string; email: string };
  test: { title: string; slug: string };
}

function mapBackendResult(row: BackendTestResult): TestResultSubmission {
  const { totalScore, matchedBandTitle } = parseScoreSummary(row.scoreSummary);
  return {
    id: row.id,
    testId: row.testId,
    testTitle: row.test?.title ?? "",
    userId: row.userId,
    userName: `${row.user?.firstName ?? ""} ${row.user?.lastName ?? ""}`.trim(),
    userEmail: row.user?.email ?? "",
    submittedAt: row.createdAt,
    answers: {},
    totalScore,
    subscaleScores: {},
    matchedBandTitle,
  };
}

function mapResultsFromResponse(payload: unknown): TestResultSubmission[] {
  if (!isRecord(payload)) return [];
  // { data: BackendTestResult[], total, page, limit }
  const raw = Array.isArray(payload.data) ? payload.data : [];
  return (raw as BackendTestResult[]).map(mapBackendResult);
}

export const TEST_RESULTS_PAGE_LIMIT = 20;

export interface TestResultsPage {
  data: TestResultSubmission[];
  total: number;
}

export async function listTestResults(
  filters: TestResultsListFilters = {},
  accessToken?: string | null,
  paging: { page?: number; limit?: number } = {}
): Promise<TestResultsPage> {
  const page = paging.page ?? 1;
  const limit = paging.limit ?? TEST_RESULTS_PAGE_LIMIT;

  // Mock veri yalnızca API adresi tanımlı değilken; sayfalama tarayıcıda yapılır
  const base = getOptionalApiBase();
  if (!base) {
    const filtered = applyResultFilters(buildMockSubmissions(), filters);
    return {
      data: filtered.slice((page - 1) * limit, page * limit),
      total: filtered.length,
    };
  }

  const qs = buildQuery({
    page,
    limit,
    testId: filters.testId,
    search: filters.search?.trim() || undefined,
  });
  const payload = await apiFetch<unknown>(`/admin/test-results${qs}`, {
    token: accessToken,
  });
  if (!responseLooksSuccessful(payload)) {
    throw new Error("Test sonuçları yüklenemedi: beklenmeyen sunucu yanıtı");
  }
  const data = mapResultsFromResponse(payload);
  const total =
    isRecord(payload) && typeof payload.total === "number"
      ? payload.total
      : data.length;
  return { data, total };
}

export async function getTestResult(
  id: string,
  accessToken?: string | null
): Promise<TestResultSubmission | null> {
  const base = getOptionalApiBase();
  if (!base) {
    return buildMockSubmissions().find((s) => s.id === id) ?? null;
  }
  const payload = await apiFetch<unknown>(
    `/admin/test-results/${encodeURIComponent(id)}`,
    { token: accessToken }
  );
  if (!responseLooksSuccessful(payload) || !isRecord(payload)) {
    throw new Error("Test sonucu yüklenemedi: beklenmeyen sunucu yanıtı");
  }
  const data = isRecord(payload.data) ? payload.data : null;
  if (!data) return null;
  const row = data.submission ?? data.result ?? data;
  if (!isRecord(row)) return null;
  return mapBackendResult(row as unknown as BackendTestResult);
}
