import { getOptionalApiBase } from "@/lib/http-client";
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

let resultsStore: TestResultSubmission[] = buildMockSubmissions();

function cloneResults(r: TestResultSubmission[]): TestResultSubmission[] {
  return JSON.parse(JSON.stringify(r)) as TestResultSubmission[];
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
  return false;
}

function mapSubmissionRow(row: Record<string, unknown>): TestResultSubmission | null {
  const id = String(row.id ?? "");
  if (!id) return null;
  return row as unknown as TestResultSubmission;
}

function mapResultsFromResponse(payload: unknown): TestResultSubmission[] {
  if (!isRecord(payload)) return [];
  const data = isRecord(payload.data) ? payload.data : null;
  if (!data) return [];
  const raw =
    (Array.isArray(data.submissions) ? data.submissions : null) ??
    (Array.isArray(data.results) ? data.results : null) ??
    (Array.isArray(data.test_results) ? data.test_results : null);
  if (!raw) return [];
  return raw
    .filter(isRecord)
    .map(mapSubmissionRow)
    .filter((s): s is TestResultSubmission => s !== null);
}

export async function listTestResults(
  filters: TestResultsListFilters = {},
  accessToken?: string | null
): Promise<TestResultSubmission[]> {
  const base = getOptionalApiBase();
  if (!base) {
    return applyResultFilters(cloneResults(resultsStore), filters);
  }

  try {
    const params = new URLSearchParams();
    if (filters.testId) params.set("testId", filters.testId);
    if (filters.search) params.set("search", filters.search);
    const qs = params.toString();
    const path = `${base}/admin/test-results${qs ? `?${qs}` : ""}`;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
    const res = await fetch(path, {
      method: "GET",
      headers,
      credentials: "include",
    });
    if (!res.ok) {
      console.warn("[listTestResults] HTTP", res.status, "- using store");
      return applyResultFilters(cloneResults(resultsStore), filters);
    }
    const payload: unknown = await res.json();
    if (!responseLooksSuccessful(payload)) {
      return applyResultFilters(cloneResults(resultsStore), filters);
    }
    const mapped = mapResultsFromResponse(payload);
    if (mapped.length > 0) {
      resultsStore = cloneResults(mapped);
    }
    return applyResultFilters(cloneResults(resultsStore), filters);
  } catch (e) {
    console.warn("[listTestResults] failed - using store", e);
    return applyResultFilters(cloneResults(resultsStore), filters);
  }
}

export async function getTestResult(
  id: string,
  accessToken?: string | null
): Promise<TestResultSubmission | null> {
  const base = getOptionalApiBase();
  if (!base) {
    return cloneResults(resultsStore).find((s) => s.id === id) ?? null;
  }
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
    const res = await fetch(`${base}/admin/test-results/${encodeURIComponent(id)}`, {
      method: "GET",
      headers,
      credentials: "include",
    });
    if (!res.ok) {
      return cloneResults(resultsStore).find((s) => s.id === id) ?? null;
    }
    const payload: unknown = await res.json();
    if (!responseLooksSuccessful(payload) || !isRecord(payload)) {
      return cloneResults(resultsStore).find((s) => s.id === id) ?? null;
    }
    const data = isRecord(payload.data) ? payload.data : null;
    if (!data) {
      return cloneResults(resultsStore).find((s) => s.id === id) ?? null;
    }
    const row = data.submission ?? data.result ?? data;
    if (!isRecord(row)) {
      return cloneResults(resultsStore).find((s) => s.id === id) ?? null;
    }
    return mapSubmissionRow(row as Record<string, unknown>);
  } catch {
    return cloneResults(resultsStore).find((s) => s.id === id) ?? null;
  }
}
