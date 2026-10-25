"use client";

import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type Ref,
} from "react";
import {
  ArrowDown,
  ArrowLeft,
  BookPlus,
  Info,
  Loader2,
  MessageCircle,
  ShieldAlert,
  TriangleAlert,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { listMessages, sendMessage } from "@/services/inbox/conversations.service";
import type { ConversationDetail, InboxMessage } from "@/services/inbox/types";
import { AddToKnowledgeDialog } from "./add-to-knowledge-dialog";
import {
  agentName,
  ChannelBadge,
  contactName,
  dayKey,
  formatDayLabel,
  formatTime,
} from "./labels";
import { EXTERNAL_SOURCE_INSTAGRAM_APP } from "./constants";
import { HandoffCard } from "./handoff-card";
import { MessageComposer } from "./message-composer";

const PAGE_SIZE = 50;
const NEAR_BOTTOM_PX = 120;
const LOAD_OLDER_THRESHOLD_PX = 80;

export interface MessageThreadHandle {
  pushMessage: (message: InboxMessage) => void;
}

type PendingScroll = { type: "bottom" } | { type: "restore"; prevHeight: number };

interface KnowledgeDraft {
  title: string;
  content: string;
}

interface MessageThreadProps {
  ref?: Ref<MessageThreadHandle>;
  conversationId: string;
  detail: ConversationDetail | null;
  onBack: () => void;
  onOpenPanel: () => void;
  onChanged: () => void;
}

function mergeMessages(base: InboxMessage[], extra: InboxMessage[]): InboxMessage[] {
  const seen = new Set(base.map((m) => m.id));
  const added = extra.filter((m) => !seen.has(m.id));
  if (added.length === 0) return base;
  return [...base, ...added].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
}

interface ThreadRow {
  message: InboxMessage;
  showDay: boolean;
  previousClient: string;
}

function buildRows(messages: InboxMessage[]): ThreadRow[] {
  const rows: ThreadRow[] = [];
  let lastDay = "";
  let lastClientContent = "";
  for (const message of messages) {
    const key = dayKey(message.createdAt);
    rows.push({ message, showDay: key !== lastDay, previousClient: lastClientContent });
    lastDay = key;
    if (message.senderType === "CLIENT") lastClientContent = message.content;
  }
  return rows;
}

export function MessageThread({
  ref,
  conversationId,
  detail,
  onBack,
  onOpenPanel,
  onChanged,
}: MessageThreadProps) {
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [draft, setDraft] = useState<KnowledgeDraft | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const nearBottomRef = useRef(true);
  const pendingScrollRef = useRef<PendingScroll | null>(null);
  const loadingOlderRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    listMessages(conversationId, { limit: PAGE_SIZE })
      .then((list) => {
        if (cancelled) return;
        pendingScrollRef.current = { type: "bottom" };
        setMessages((prev) => mergeMessages(list, prev));
        setHasMore(list.length >= PAGE_SIZE);
      })
      .catch((err) => {
        if (cancelled) return;
        toast.error(err instanceof Error ? err.message : "Mesajlar yüklenemedi");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [conversationId]);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    const pending = pendingScrollRef.current;
    if (!el || !pending) return;
    pendingScrollRef.current = null;
    if (pending.type === "bottom") {
      el.scrollTop = el.scrollHeight;
      nearBottomRef.current = true;
    } else {
      el.scrollTop += el.scrollHeight - pending.prevHeight;
    }
  }, [messages]);

  const addMessage = useCallback((message: InboxMessage, forceBottom: boolean) => {
    if (forceBottom || nearBottomRef.current) {
      pendingScrollRef.current = { type: "bottom" };
    } else {
      setShowNew(true);
    }
    setMessages((prev) => mergeMessages(prev, [message]));
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      pushMessage: (message) => {
        if (message.conversationId !== conversationId) return;
        addMessage(message, false);
      },
    }),
    [conversationId, addMessage],
  );

  async function loadOlder() {
    const first = messages[0];
    if (loadingOlderRef.current || !hasMore || !first) return;
    loadingOlderRef.current = true;
    setLoadingOlder(true);
    try {
      const older = await listMessages(conversationId, {
        before: first.createdAt,
        limit: PAGE_SIZE,
      });
      const el = scrollRef.current;
      if (el) pendingScrollRef.current = { type: "restore", prevHeight: el.scrollHeight };
      setMessages((prev) => mergeMessages(prev, older));
      setHasMore(older.length >= PAGE_SIZE);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Eski mesajlar yüklenemedi");
    } finally {
      loadingOlderRef.current = false;
      setLoadingOlder(false);
    }
  }

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    nearBottomRef.current = distance < NEAR_BOTTOM_PX;
    if (nearBottomRef.current && showNew) setShowNew(false);
    if (el.scrollTop < LOAD_OLDER_THRESHOLD_PX) void loadOlder();
  }

  function scrollToBottom() {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    setShowNew(false);
  }

  async function handleSend(content: string) {
    try {
      const message = await sendMessage(conversationId, content);
      addMessage(message, true);
    } finally {
      onChanged();
    }
  }

  const canWrite = detail ? detail.windowOpen && detail.status !== "CLOSED" : false;
  const rows = buildRows(messages);

  return (
    <div className="relative flex h-full min-h-0 min-w-0 flex-1 flex-col bg-muted/40">
      <header className="flex items-center gap-2 border-b border-border bg-card px-3 py-2.5">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="lg:hidden"
          onClick={onBack}
          aria-label="Konuşma listesine dön"
        >
          <ArrowLeft className="size-4" />
        </Button>
        {detail ? (
          <>
            <ChannelBadge channel={detail.channel} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {contactName(detail.contact)}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {detail.status === "CLOSED"
                  ? "Kapalı"
                  : detail.isBotActive
                    ? "Elif yanıtlıyor"
                    : "Personelde"}
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 animate-pulse space-y-1.5">
            <div className="h-3.5 w-40 rounded bg-muted" />
            <div className="h-3 w-24 rounded bg-muted" />
          </div>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="lg:hidden"
          onClick={onOpenPanel}
          aria-label="Danışan bilgileri"
        >
          <Info className="size-4" />
        </Button>
      </header>

      {detail?.flaggedCrisis ? (
        <div className="flex items-center gap-2 bg-destructive px-4 py-2 text-xs font-medium text-white sm:text-sm">
          <ShieldAlert className="size-4 shrink-0" />
          Kriz ifadesi tespit edildi — Elif bu konuşmada devre dışı
        </div>
      ) : null}

      {detail && !detail.isBotActive && detail.handoffReason ? (
        <HandoffCard detail={detail} />
      ) : null}

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-5"
      >
        {loading ? (
          <div className="space-y-4">
            {[false, true, false, true].map((right, i) => (
              <div
                key={i}
                className={cn("flex animate-pulse", right ? "justify-end" : "justify-start")}
              >
                <div className="h-12 w-2/3 max-w-sm rounded-2xl bg-muted" />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <MessageCircle className="size-8" />
            <p className="text-sm">Bu konuşmada henüz mesaj yok</p>
          </div>
        ) : (
          <div className="space-y-3">
            {hasMore ? (
              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={() => void loadOlder()}
                  disabled={loadingOlder}
                >
                  {loadingOlder ? <Loader2 className="size-3 animate-spin" /> : null}
                  Eski mesajları yükle
                </Button>
              </div>
            ) : null}

            {rows.map(({ message: m, showDay, previousClient }) => {
              const isClient = m.senderType === "CLIENT";
              const label =
                m.senderType === "CLIENT"
                  ? "Danışan"
                  : m.senderType === "BOT"
                    ? "Elif"
                    : m.externalSource === EXTERNAL_SOURCE_INSTAGRAM_APP
                      ? "Instagram uygulamasından"
                      : agentName(m.agentUser);
              return (
                <div key={m.id} className="space-y-3">
                  {showDay ? (
                    <div className="flex justify-center">
                      <span className="rounded-full bg-muted px-3 py-0.5 text-[11px] text-muted-foreground">
                        {formatDayLabel(m.createdAt)}
                      </span>
                    </div>
                  ) : null}
                  <div className={cn("flex", isClient ? "justify-start" : "justify-end")}>
                    <div
                      className={cn(
                        "flex max-w-[85%] flex-col gap-0.5 sm:max-w-[70%]",
                        isClient ? "items-start" : "items-end",
                      )}
                    >
                      <span className="px-1 text-[11px] font-medium text-muted-foreground">
                        {label}
                      </span>
                      <div
                        className={cn(
                          "whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2 text-sm",
                          m.senderType === "CLIENT" &&
                            "rounded-tl-sm border border-border bg-white text-foreground",
                          m.senderType === "BOT" &&
                            "rounded-tr-sm bg-sky-100 text-sky-950",
                          m.senderType === "AGENT" &&
                            "rounded-tr-sm bg-primary text-white",
                        )}
                      >
                        {m.content}
                      </div>
                      <div className="flex items-center gap-2 px-1">
                        <span className="text-[11px] text-muted-foreground">
                          {formatTime(m.createdAt)}
                        </span>
                        {m.senderType === "AGENT" ? (
                          <button
                            type="button"
                            onClick={() =>
                              setDraft({ title: previousClient, content: m.content })
                            }
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                          >
                            <BookPlus className="size-3" />
                            Bilgi bankasına ekle
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showNew ? (
        <button
          type="button"
          onClick={scrollToBottom}
          className="absolute bottom-24 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-white shadow-lg"
        >
          <ArrowDown className="size-3.5" />
          Yeni mesaj
        </button>
      ) : null}

      {!detail ? null : canWrite ? (
        <MessageComposer
          botActive={detail.isBotActive}
          channel={detail.channel}
          onSend={handleSend}
        />
      ) : (
        <div className="flex items-start gap-2 border-t border-border bg-amber-50 px-4 py-3 text-xs text-amber-900 sm:text-sm">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          {detail.status === "CLOSED"
            ? "Bu konuşma kapalı; mesaj yazılamaz."
            : "24 saatlik mesajlaşma penceresi kapandı. Danışan yeniden yazana kadar serbest mesaj gönderemezsiniz."}
        </div>
      )}

      <AddToKnowledgeDialog
        open={draft !== null}
        onOpenChange={(open) => {
          if (!open) setDraft(null);
        }}
        initialTitle={draft?.title ?? ""}
        initialContent={draft?.content ?? ""}
      />
    </div>
  );
}
