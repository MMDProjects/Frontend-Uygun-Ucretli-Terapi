"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getAccessToken } from "@/lib/auth-cookies";
import { listIncomingRequests } from "@/services/forms/incoming-requests.service";
import type {
  IncomingRequest,
  IncomingRequestStatus,
} from "@/types/dto/incoming-request";

export const INCOMING_REQUESTS_PAGE_LIMIT = 20;

interface UseIncomingRequestsParams {
  page: number;
  isCorporate?: boolean;
  statuses: IncomingRequestStatus[];
  search: string;
  email?: string | null;
  /** Sayfa boşaldıysa (ör. son kayıt çözüldü) son dolu sayfaya geçmek için. */
  onPageOverflow?: (lastPage: number) => void;
}

interface UseIncomingRequestsResult {
  requests: IncomingRequest[];
  setRequests: React.Dispatch<React.SetStateAction<IncomingRequest[]>>;
  total: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useIncomingRequests({
  page,
  isCorporate,
  statuses,
  search,
  email,
  onPageOverflow,
}: UseIncomingRequestsParams): UseIncomingRequestsResult {
  const [requests, setRequests] = useState<IncomingRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestRef = useRef(0);
  const overflowRef = useRef(onPageOverflow);
  useEffect(() => {
    overflowRef.current = onPageOverflow;
  }, [onPageOverflow]);

  // Dizi bağımlılığı yerine kararlı bir anahtar kullanılır.
  const statusKey = statuses.join(",");

  const load = useCallback(async () => {
    const requestId = ++requestRef.current;
    setLoading(true);
    setError(null);
    try {
      const token = getAccessToken();
      const res = await listIncomingRequests(
        {
          page,
          limit: INCOMING_REQUESTS_PAGE_LIMIT,
          isCorporate,
          statuses: statusKey ? (statusKey.split(",") as IncomingRequestStatus[]) : [],
          search,
          email,
        },
        token ?? null
      );
      if (requestId !== requestRef.current) return;
      const lastPage = Math.max(1, Math.ceil(res.total / INCOMING_REQUESTS_PAGE_LIMIT));
      if (page > lastPage && overflowRef.current) {
        overflowRef.current(lastPage);
        return;
      }
      setRequests(res.data);
      setTotal(res.total);
      setLoading(false);
    } catch (e) {
      if (requestId !== requestRef.current) return;
      setError(e instanceof Error ? e.message : "Yükleme hatası");
      setRequests([]);
      setTotal(0);
      setLoading(false);
    }
  }, [page, isCorporate, statusKey, search, email]);

  useEffect(() => {
    void load();
  }, [load]);

  return { requests, setRequests, total, loading, error, refetch: load };
}
