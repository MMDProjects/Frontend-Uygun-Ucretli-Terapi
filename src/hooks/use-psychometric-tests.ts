"use client";

import { useCallback, useEffect, useState } from "react";
import { getAccessToken } from "@/lib/auth-cookies";
import { listTests } from "@/services/tests/psychometric-tests.service";
import type { PsychometricTestDefinition } from "@/types/dto/psychometric-test";

interface UsePsychometricTestsResult {
  tests: PsychometricTestDefinition[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePsychometricTests(): UsePsychometricTestsResult {
  const [tests, setTests] = useState<PsychometricTestDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getAccessToken();
      const data = await listTests(token ?? null);
      setTests(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Yükleme hatası");
      setTests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { tests, loading, error, refetch: load };
}
