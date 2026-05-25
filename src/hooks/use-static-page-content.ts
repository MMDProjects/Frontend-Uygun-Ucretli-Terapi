"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getStaticPageContent,
  updateStaticPageContent,
} from "@/services/content/static-page-content.service";
import type {
  StaticPageContent,
  StaticPageContentUpdatePayload,
} from "@/types/dto/static-page-content";

interface UseStaticPageContentResult {
  content: StaticPageContent | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  save: (payload: StaticPageContentUpdatePayload) => Promise<string>;
}

export function useStaticPageContent(): UseStaticPageContentResult {
  const [content, setContent] = useState<StaticPageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getStaticPageContent();
      setContent(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "İçerik yüklenemedi");
      setContent(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const save = useCallback(async (payload: StaticPageContentUpdatePayload) => {
    setSaving(true);
    setError(null);
    try {
      const res = await updateStaticPageContent(payload);
      if (!res.success) {
        throw new Error(res.message || "Kaydetme işlemi başarısız");
      }
      setContent(res.data);
      return res.message || "Kaydedildi";
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Kaydetme sırasında hata oluştu";
      setError(message);
      throw new Error(message);
    } finally {
      setSaving(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { content, loading, saving, error, refetch: load, save };
}
