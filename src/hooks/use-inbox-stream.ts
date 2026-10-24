"use client";

import { useEffect, useRef } from "react";
import { getAccessToken } from "@/lib/auth-cookies";
import { tryRefreshToken } from "@/lib/api";
import type {
  InboxConversationUpdatedEvent,
  InboxMessageCreatedEvent,
} from "@/services/inbox/types";

export interface InboxStreamHandlers {
  onMessageCreated?: (event: InboxMessageCreatedEvent) => void;
  onConversationUpdated?: (event: InboxConversationUpdatedEvent) => void;
  onCountsChanged?: () => void;
}

const MIN_DELAY_MS = 1000;
const MAX_DELAY_MS = 30000;

function parse<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function useInboxStream(handlers: InboxStreamHandlers): void {
  const handlersRef = useRef(handlers);
  useEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(() => {
    let es: EventSource | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let delay = MIN_DELAY_MS;
    let stopped = false;

    const scheduleReconnect = () => {
      if (stopped) return;
      timer = setTimeout(() => void connect(), delay);
      delay = Math.min(delay * 2, MAX_DELAY_MS);
    };

    const connect = async () => {
      if (stopped) return;
      const token = getAccessToken() ?? (await tryRefreshToken());
      if (stopped) return;
      if (!token) {
        scheduleReconnect();
        return;
      }
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
      const source = new EventSource(
        `${apiUrl}/admin/inbox/stream?token=${encodeURIComponent(token)}`,
      );
      es = source;

      source.onopen = () => {
        delay = MIN_DELAY_MS;
      };
      source.addEventListener("message.created", (e) => {
        const data = parse<InboxMessageCreatedEvent>((e as MessageEvent<string>).data);
        if (data) handlersRef.current.onMessageCreated?.(data);
      });
      source.addEventListener("conversation.updated", (e) => {
        const data = parse<InboxConversationUpdatedEvent>(
          (e as MessageEvent<string>).data,
        );
        if (data) handlersRef.current.onConversationUpdated?.(data);
      });
      source.addEventListener("counts.changed", () => {
        handlersRef.current.onCountsChanged?.();
      });
      source.onerror = () => {
        source.close();
        if (es === source) es = null;
        scheduleReconnect();
      };
    };

    void connect();

    return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
      es?.close();
    };
  }, []);
}
