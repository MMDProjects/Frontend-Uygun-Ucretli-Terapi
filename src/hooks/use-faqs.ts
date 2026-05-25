"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createFaq,
  deleteFaq,
  listFaqs,
  updateFaq,
} from "@/services/faq/faq.service";
import type { FaqDto, FaqInput } from "@/types/dto/faq";

interface UseFaqsResult {
  faqs: FaqDto[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  add: (input: FaqInput) => Promise<FaqDto | null>;
  edit: (id: string, input: FaqInput) => Promise<FaqDto | null>;
  remove: (id: string) => Promise<boolean>;
}

export function useFaqs(): UseFaqsResult {
  const [faqs, setFaqs] = useState<FaqDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listFaqs();
      setFaqs(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "SSS kayıtları yüklenemedi");
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const add = useCallback(
    async (input: FaqInput): Promise<FaqDto | null> => {
      try {
        const created = await createFaq(input);
        setFaqs((prev) =>
          [...prev, created].sort((a, b) => a.order - b.order)
        );
        return created;
      } catch (e) {
        setError(e instanceof Error ? e.message : "SSS eklenemedi");
        return null;
      }
    },
    []
  );

  const edit = useCallback(
    async (id: string, input: FaqInput): Promise<FaqDto | null> => {
      try {
        const updated = await updateFaq(id, input);
        setFaqs((prev) =>
          prev
            .map((f) => (f.id === id ? updated : f))
            .sort((a, b) => a.order - b.order)
        );
        return updated;
      } catch (e) {
        setError(e instanceof Error ? e.message : "SSS güncellenemedi");
        return null;
      }
    },
    []
  );

  const remove = useCallback(async (id: string): Promise<boolean> => {
    try {
      await deleteFaq(id);
      setFaqs((prev) => prev.filter((f) => f.id !== id));
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "SSS silinemedi");
      return false;
    }
  }, []);

  return { faqs, loading, error, refetch: load, add, edit, remove };
}
