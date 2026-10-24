"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  listTestResults,
  TEST_RESULTS_PAGE_LIMIT,
} from "@/services/tests/test-results.service";
import type {
  TestResultSubmission,
  TestResultsListFilters,
} from "@/types/dto/psychometric-test";

interface UseTestResultsResult {
  submissions: TestResultSubmission[];
  total: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTestResults(
  filters: TestResultsListFilters,
  page: number
): UseTestResultsResult {
  const [submissions, setSubmissions] = useState<TestResultSubmission[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestRef = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++requestRef.current;
    setLoading(true);
    setError(null);
    try {
      const res = await listTestResults(filters, undefined, {
        page,
        limit: TEST_RESULTS_PAGE_LIMIT,
      });
      if (requestId !== requestRef.current) return;
      setSubmissions(res.data);
      setTotal(res.total);
    } catch (e) {
      if (requestId !== requestRef.current) return;
      setError(e instanceof Error ? e.message : "Yükleme hatası");
      setSubmissions([]);
      setTotal(0);
    } finally {
      if (requestId === requestRef.current) setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    void load();
  }, [load]);

  return { submissions, total, loading, error, refetch: load };
}
