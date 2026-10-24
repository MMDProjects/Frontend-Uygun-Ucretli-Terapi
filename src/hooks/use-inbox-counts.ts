"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getInboxCounts } from "@/services/inbox/conversations.service";
import type { InboxCounts } from "@/services/inbox/types";
import { useInboxStream } from "./use-inbox-stream";

const DEBOUNCE_MS = 500;

export function useInboxCounts(): { counts: InboxCounts | null; refresh: () => void } {
  const [counts, setCounts] = useState<InboxCounts | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(() => {
    getInboxCounts()
      .then(setCounts)
      .catch(() => {});
  }, []);

  const refresh = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(load, DEBOUNCE_MS);
  }, [load]);

  useEffect(() => {
    load();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [load]);

  useInboxStream({
    onCountsChanged: refresh,
    onMessageCreated: refresh,
    onConversationUpdated: refresh,
  });

  return { counts, refresh };
}
