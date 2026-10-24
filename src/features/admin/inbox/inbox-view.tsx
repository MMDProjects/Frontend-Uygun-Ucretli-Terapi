"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useInboxStream } from "@/hooks/use-inbox-stream";
import { cn } from "@/lib/utils";
import { getConversation } from "@/services/inbox/conversations.service";
import type { ConversationDetail } from "@/services/inbox/types";
import { ContactPanel } from "./contact-panel";
import { ConversationList } from "./conversation-list";
import { MessageThread, type MessageThreadHandle } from "./message-thread";

interface DetailState {
  id: string;
  data: ConversationDetail;
}

export function InboxView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("c");

  const [detailState, setDetailState] = useState<DetailState | null>(null);
  const [detailVersion, setDetailVersion] = useState(0);
  const [listRefresh, setListRefresh] = useState(0);
  const [mobilePanel, setMobilePanel] = useState(false);
  const threadRef = useRef<MessageThreadHandle>(null);

  const detail = detailState && detailState.id === selectedId ? detailState.data : null;

  const setSelected = useCallback(
    (id: string | null) => {
      setMobilePanel(false);
      router.replace(id ? `${pathname}?c=${encodeURIComponent(id)}` : pathname, {
        scroll: false,
      });
    },
    [router, pathname],
  );

  useEffect(() => {
    if (!selectedId) return;
    let cancelled = false;
    getConversation(selectedId)
      .then((data) => {
        if (!cancelled) setDetailState({ id: selectedId, data });
      })
      .catch((err) => {
        if (cancelled) return;
        toast.error(err instanceof Error ? err.message : "Konuşma yüklenemedi");
        setSelected(null);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedId, detailVersion, setSelected]);

  const refreshAll = useCallback(() => {
    setDetailVersion((v) => v + 1);
    setListRefresh((v) => v + 1);
  }, []);

  useInboxStream({
    onMessageCreated: (event) => {
      setListRefresh((v) => v + 1);
      if (event.conversationId !== selectedId) return;
      threadRef.current?.pushMessage(event.message);
      if (event.message.senderType === "CLIENT") setDetailVersion((v) => v + 1);
    },
    onConversationUpdated: (event) => {
      setListRefresh((v) => v + 1);
      if (event.conversationId === selectedId) setDetailVersion((v) => v + 1);
    },
  });

  return (
    <div className="-m-4 flex h-[calc(100vh-3.5rem)] overflow-hidden bg-card sm:-m-6">
      <aside
        className={cn(
          "w-full shrink-0 border-r border-border lg:block lg:w-80",
          selectedId ? "hidden" : "block",
        )}
      >
        <ConversationList
          selectedId={selectedId}
          refreshKey={listRefresh}
          onSelect={setSelected}
        />
      </aside>

      <section
        className={cn(
          "min-w-0 flex-1 lg:flex",
          selectedId && !mobilePanel ? "flex" : "hidden",
        )}
      >
        {selectedId ? (
          <MessageThread
            key={selectedId}
            ref={threadRef}
            conversationId={selectedId}
            detail={detail}
            onBack={() => setSelected(null)}
            onOpenPanel={() => setMobilePanel(true)}
            onChanged={refreshAll}
          />
        ) : (
          <div className="flex h-full flex-1 flex-col items-center justify-center gap-2 bg-muted/40 text-muted-foreground">
            <MessageCircle className="size-10" />
            <p className="text-sm">Bir konuşma seçin</p>
          </div>
        )}
      </section>

      <aside
        className={cn(
          "w-full shrink-0 border-l border-border lg:w-80",
          selectedId ? "lg:block" : "lg:hidden",
          selectedId && mobilePanel ? "block" : "hidden",
        )}
      >
        {selectedId ? (
          <ContactPanel
            detail={detail}
            onBack={() => setMobilePanel(false)}
            onChanged={refreshAll}
          />
        ) : null}
      </aside>
    </div>
  );
}
