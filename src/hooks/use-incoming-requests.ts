"use client";

import { useCallback, useEffect, useState } from "react";
import { getAccessToken } from "@/lib/auth-cookies";
import { listIncomingRequests } from "@/services/forms/incoming-requests.service";
import type { IncomingRequest } from "@/types/dto/incoming-request";

interface UseIncomingRequestsResult {
  requests: IncomingRequest[];
  setRequests: React.Dispatch<React.SetStateAction<IncomingRequest[]>>;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useIncomingRequests(): UseIncomingRequestsResult {
  const [requests, setRequests] = useState<IncomingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getAccessToken();
      const data = await listIncomingRequests(token ?? null);
      setRequests(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Yükleme hatası");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { requests, setRequests, loading, error, refetch: load };
}
