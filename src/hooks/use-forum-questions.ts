"use client";

import { useCallback, useEffect, useState } from "react";
import {
  listAdminForumQuestions,
  assignForumQuestion,
  approveForumAnswer,
  deleteAdminForumQuestion,
  type AdminForumQuestion,
} from "@/services/forum/forum-admin.service";

type Tab = "ONAY_BEKLIYOR" | "ATANDI" | "CEVAPLANDI";

interface UseForumQuestionsResult {
  questions: AdminForumQuestion[];
  loading: boolean;
  error: string | null;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  refetch: () => Promise<void>;
  assign: (questionId: string, expertProfileId: string) => Promise<void>;
  approveAnswer: (answerId: string, questionId: string) => Promise<void>;
  deleteQuestion: (questionId: string) => Promise<void>;
}

export function useForumQuestions(): UseForumQuestionsResult {
  const [questions, setQuestions] = useState<AdminForumQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("ONAY_BEKLIYOR");

  const load = useCallback(async (tab: Tab) => {
    setLoading(true);
    setError(null);
    try {
      const data = await listAdminForumQuestions(tab);
      setQuestions(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sorular yüklenemedi");
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleTabChange = useCallback(
    (tab: Tab) => {
      setActiveTab(tab);
      void load(tab);
    },
    [load]
  );

  const assign = useCallback(
    async (questionId: string, expertProfileId: string) => {
      await assignForumQuestion(questionId, expertProfileId);
      setQuestions((prev) => prev.filter((q) => q.id !== questionId));
    },
    []
  );

  const approveAnswer = useCallback(
    async (answerId: string, questionId: string) => {
      await approveForumAnswer(answerId);
      // Onaylanan cevabı local'de işaretle
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId
            ? {
                ...q,
                answers: q.answers.map((a) =>
                  a.id === answerId ? { ...a, isApproved: true } : a
                ),
              }
            : q
        )
      );
    },
    []
  );

  const deleteQuestion = useCallback(async (questionId: string) => {
    await deleteAdminForumQuestion(questionId);
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
  }, []);

  useEffect(() => {
    void load(activeTab);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    questions,
    loading,
    error,
    activeTab,
    setActiveTab: handleTabChange,
    refetch: () => load(activeTab),
    assign,
    approveAnswer,
    deleteQuestion,
  };
}
