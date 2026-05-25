"use client";

import { useCallback, useEffect, useState } from "react";
import { getAccessToken } from "@/lib/auth-cookies";
import { listTestResults } from "@/services/tests/test-results.service";
import type {
  TestResultSubmission,
  TestResultsListFilters,
} from "@/types/dto/psychometric-test";

interface UseTestResultsResult {
  submissions: TestResultSubmission[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTestResults(
  filters: TestResultsListFilters
): UseTestResultsResult {
  const [submissions, setSubmissions] = useState<TestResultSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getAccessToken();
      const data = await listTestResults(filters, token ?? null);
      setSubmissions(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Yükleme hatası");
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void load();
  }, [load]);

  return { submissions, loading, error, refetch: load };
}
