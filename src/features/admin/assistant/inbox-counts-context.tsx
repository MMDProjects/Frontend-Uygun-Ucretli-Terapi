"use client";

import { createContext, useContext } from "react";
import { useInboxCounts } from "@/hooks/use-inbox-counts";
import {
  useAttentionAlerts,
  type AttentionAlertControls,
} from "@/hooks/use-attention-alerts";
import type { InboxCounts } from "@/services/inbox/types";

interface Shared {
  counts: InboxCounts | null;
  alerts: AttentionAlertControls | null;
}

const SharedContext = createContext<Shared>({ counts: null, alerts: null });

// Panelde sayaçları ve uyarıları tek yerde (tek SSE bağlantısıyla) çalıştırır.
export function InboxCountsProvider({ children }: { children: React.ReactNode }) {
  const { counts } = useInboxCounts();
  const alerts = useAttentionAlerts(counts);
  return (
    <SharedContext.Provider value={{ counts, alerts }}>{children}</SharedContext.Provider>
  );
}

export function useSharedInboxCounts(): InboxCounts | null {
  return useContext(SharedContext).counts;
}

export function useSharedAttentionAlerts(): AttentionAlertControls | null {
  return useContext(SharedContext).alerts;
}
