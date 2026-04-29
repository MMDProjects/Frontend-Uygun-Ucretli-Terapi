"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import * as Popover from "@radix-ui/react-popover";
import {
  MessageCircle, ChevronDown, ChevronUp,
  Send, ShieldCheck, PenLine, Clock,
  Search, SlidersHorizontal, ArrowDownWideNarrow, X,
  ChevronLeft, ChevronRight,
} from "lucide-react";

import { useAuthStore } from "@/lib/stores/auth-store";
import { useForumStore, type ForumThread } from "@/lib/stores/forum-store";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 15;

const ALL_TAGS = [
  "Kaygı", "Depresyon", "Stres", "Uyku", "İlişki",
  "Aile", "Panik Atak", "Tükenmişlik", "Özgüven", "Yas",
  "Travma", "Öfke", "Motivasyon", "Sosyal Fobi", "Diğer",
];

type SortKey = "activity" | "newest" | "oldest" | "most-replies";

const SORT_LABELS: Record<SortKey, string> = {
  activity: "Son aktivite",
  newest: "En yeni",
  oldest: "En eski",
  "most-replies": "En çok yanıt",
};

const pillIconBtn =
  "flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-white text-primary shadow-sm transition-colors hover:bg-muted/70 hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const searchSubmitBtn =
  "flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

function formatDateShort(iso: string) {
  return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

/* ─── Inline Thread Card ────────────────────────────────────────────────── */
function ThreadCard({ thread }: { thread: ForumThread }) {
  const { displayName, role } = useAuthStore();
  const { replies, addReply } = useForumStore();

  const [expanded, setExpanded] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const threadReplies = replies
    .filter((r) => r.threadId === thread.id)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const visibleReplies = expanded ? threadReplies : threadReplies.slice(0, 2);
  const hiddenCount = threadReplies.length - 2;

  const isExpert = role === "uzman";
  const isThreadAuthor = displayName === thread.authorName;
  const canReply = isExpert || (role === "danisan" && isThreadAuthor);

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyText.trim() || !canReply || !displayName || !role) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 350));
    addReply(thread.id, replyText.trim(), displayName, displayName, role as "danisan" | "uzman");
    setReplyText("");
    setSubmitting(false);
    setExpanded(true);
  }

  return (
    <article className="overflow-hidden rounded-[2rem] border border-border/60 bg-white shadow-sm transition hover:shadow-md lg:rounded-[2.25rem]">
      <div className="flex items-start gap-3 p-5 pb-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#e6f0ee] text-sm font-bold text-primary-hover">
          {getInitials(thread.authorName)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{thread.authorName}</span>
            <span className="rounded-full bg-muted px-2 py-0.5 font-medium">Danışan</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {formatDateShort(thread.createdAt)}
            </span>
          </div>
          <Link href={`/forum/konu/${thread.id}`} className="group mt-1 block">
            <h2 className="font-semibold text-foreground transition group-hover:text-primary">
              {thread.title}
            </h2>
          </Link>
          <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {thread.content}
          </p>
          {thread.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {thread.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {threadReplies.length > 0 && (
        <div className="space-y-2 border-t border-border/40 px-5 py-3">
          {visibleReplies.map((reply) => (
            <div key={reply.id} className="flex items-start gap-2.5">
              <div className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                reply.authorRole === "uzman" ? "bg-primary text-white" : "bg-muted text-primary-hover"
              )}>
                {getInitials(reply.authorName)}
              </div>
              <div className="min-w-0 flex-1 rounded-2xl bg-muted/50 px-3 py-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-sm font-semibold text-foreground">{reply.authorName}</span>
                  {reply.authorRole === "uzman" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white">
                      <ShieldCheck className="size-3" />
                      Uzman
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">{formatDate(reply.createdAt)}</span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-foreground">{reply.content}</p>
              </div>
            </div>
          ))}
          {threadReplies.length > 2 && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1 text-xs font-medium text-primary transition hover:text-primary-hover"
            >
              {expanded
                ? <><ChevronUp className="size-3.5" />Yanıtları gizle</>
                : <><ChevronDown className="size-3.5" />{hiddenCount} yanıt daha gör</>
              }
            </button>
          )}
        </div>
      )}

      <div className="border-t border-border/40 px-5 py-3">
        {canReply ? (
          <form onSubmit={handleReply} className="flex items-end gap-2">
            <div className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
              isExpert ? "bg-primary text-white" : "bg-[#e6f0ee] text-primary-hover"
            )}>
              {displayName ? getInitials(displayName) : "?"}
            </div>
            <div className="relative flex-1">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={isExpert ? "Uzman yanıtı yaz..." : "Takip sorusu sor..."}
                rows={1}
                onInput={(e) => {
                  const el = e.currentTarget;
                  el.style.height = "auto";
                  el.style.height = Math.min(el.scrollHeight, 120) + "px";
                }}
                className="w-full resize-none rounded-2xl border border-border/60 bg-muted/40 px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ring/25"
              />
            </div>
            <button
              type="submit"
              disabled={submitting || !replyText.trim()}
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-sm transition hover:bg-primary-hover disabled:opacity-50"
              aria-label="Gönder"
            >
              {submitting
                ? <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                : <Send className="size-4" />
              }
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              Bu konuya yalnızca uzmanlar ve konu sahibi yanıt verebilir.
            </p>
            <Link
              href={`/forum/konu/${thread.id}`}
              className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary transition hover:text-primary-hover"
            >
              <MessageCircle className="size-3.5" />
              {thread.replyCount} yanıt
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function ForumPage() {
  const { role } = useAuthStore();
  const { threads } = useForumStore();

  const [query, setQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>("activity");
  const [page, setPage] = useState(1);

  const replyTotal = threads.reduce((s, t) => s + t.replyCount, 0);

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setPage(1);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setQuery(inputValue.trim());
    setPage(1);
  }

  function clearFilters() {
    setQuery("");
    setInputValue("");
    setSelectedTags([]);
    setSort("activity");
    setPage(1);
  }

  const filtered = useMemo(() => {
    let result = [...threads];

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.content.toLowerCase().includes(q)
      );
    }

    if (selectedTags.length > 0) {
      result = result.filter((t) =>
        selectedTags.some((tag) => t.tags.includes(tag))
      );
    }

    result.sort((a, b) => {
      if (sort === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sort === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sort === "most-replies") return b.replyCount - a.replyCount;
      return new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime();
    });

    return result;
  }, [threads, query, selectedTags, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const hasActiveFilters = query || selectedTags.length > 0 || sort !== "activity";

  return (
    <>
      {/* Hero */}
      <section className="section-shell relative overflow-hidden border-b border-border/70 bg-[#cce1de]">
        <div className="page-shell">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            {/* Sol: başlık + açıklama + istatistik */}
            <div className="w-full max-w-xl shrink-0 space-y-3">
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-primary-hover sm:text-5xl">
                Psikoloji Forumu
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-8">
                Danışanların sorularını uzmanların yanıtladığı güvenli alan. Her konu yalnızca konu sahibi ve onaylı uzmanlar arasında gerçekleşir.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span><strong className="text-foreground">{threads.length}</strong> konu</span>
                <span><strong className="text-foreground">{replyTotal}</strong> yanıt</span>
              </div>
            </div>

            {/* Sağ: arama + filtre + sırala + yeni konu */}
            <div className="w-full min-w-0 shrink-0 self-center max-w-lg xl:max-w-xl">
              <form
                className="w-full"
                onSubmit={handleSearch}
                role="search"
                aria-label="Forum konularında ara"
              >
                <div className="flex w-full min-w-0 flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-3">
                  {/* Arama pill */}
                  <div className={cn(
                    "flex min-h-11 min-w-0 flex-1 flex-row items-center gap-2 bg-white shadow-sm transition-shadow",
                    "rounded-3xl px-3 py-2 sm:gap-0 sm:rounded-full sm:py-1.5 sm:pl-6 sm:pr-2",
                    "focus-within:shadow-md focus-within:ring-2 focus-within:ring-ring/25",
                  )}>
                    <label className="sr-only" htmlFor="forum-search">Konu ara</label>
                    <input
                      id="forum-search"
                      type="search"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Konu başlığı veya içerik ara"
                      autoComplete="off"
                      className={cn(
                        "min-h-9 w-full min-w-0 flex-1 border-0 bg-transparent text-sm text-foreground outline-none",
                        "placeholder:text-muted-foreground",
                        "sm:min-h-11 sm:py-2 sm:pr-2",
                      )}
                    />
                    <button type="submit" className={searchSubmitBtn} aria-label="Ara">
                      <Search className="size-5" strokeWidth={2} aria-hidden />
                    </button>
                  </div>

                  {/* Filtre / Sırala / Yeni Konu */}
                  <div className="flex shrink-0 items-center justify-center gap-2 sm:justify-start">
                    {/* Etiket Filtresi */}
                    <Popover.Root modal={false}>
                      <Popover.Trigger asChild>
                        <button
                          type="button"
                          className={cn(pillIconBtn, selectedTags.length > 0 && "border-primary bg-primary/10 text-primary-hover")}
                          aria-haspopup="dialog"
                          aria-label="Etikete göre filtrele"
                        >
                          <SlidersHorizontal className="size-5" strokeWidth={2} aria-hidden />
                        </button>
                      </Popover.Trigger>
                      <Popover.Portal>
                        <Popover.Content
                          side="bottom"
                          align="end"
                          sideOffset={10}
                          collisionPadding={16}
                          className="z-[60] w-[min(calc(100vw-2rem),20rem)] rounded-[var(--radius)] border border-border/80 bg-card p-4 shadow-xl outline-none"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-semibold text-foreground">Etikete Göre Filtrele</p>
                                <p className="text-xs text-muted-foreground">Birden fazla etiket seçebilirsiniz.</p>
                              </div>
                              {selectedTags.length > 0 && (
                                <button
                                  type="button"
                                  onClick={() => { setSelectedTags([]); setPage(1); }}
                                  className="text-xs font-medium text-primary transition hover:text-primary-hover"
                                >
                                  Temizle
                                </button>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {ALL_TAGS.map((tag) => {
                                const active = selectedTags.includes(tag);
                                return (
                                  <button
                                    key={tag}
                                    type="button"
                                    onClick={() => toggleTag(tag)}
                                    className={cn(
                                      "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition",
                                      active
                                        ? "border-primary bg-primary text-white"
                                        : "border-border bg-muted text-muted-foreground hover:border-primary/40 hover:text-primary"
                                    )}
                                  >
                                    {tag}
                                    {active && <X className="size-3" />}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </Popover.Content>
                      </Popover.Portal>
                    </Popover.Root>

                    {/* Sıralama */}
                    <Popover.Root modal={false}>
                      <Popover.Trigger asChild>
                        <button
                          type="button"
                          className={cn(pillIconBtn, sort !== "activity" && "border-primary bg-primary/10 text-primary-hover")}
                          aria-haspopup="dialog"
                          aria-label="Sırala"
                        >
                          <ArrowDownWideNarrow className="size-5" strokeWidth={2} aria-hidden />
                        </button>
                      </Popover.Trigger>
                      <Popover.Portal>
                        <Popover.Content
                          side="bottom"
                          align="end"
                          sideOffset={10}
                          collisionPadding={16}
                          className="z-[60] w-[min(calc(100vw-2rem),18rem)] rounded-[var(--radius)] border border-border/80 bg-card p-4 shadow-xl outline-none"
                        >
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm font-semibold text-foreground">Sırala</p>
                              <p className="text-xs text-muted-foreground">Listeleme biçimini seçin.</p>
                            </div>
                            <div className="space-y-2">
                              {(["activity", "newest", "oldest", "most-replies"] as SortKey[]).map((key) => (
                                <button
                                  key={key}
                                  type="button"
                                  onClick={() => { setSort(key); setPage(1); }}
                                  className={cn(
                                    "w-full rounded-xl border px-3 py-2 text-left text-sm transition",
                                    sort === key
                                      ? "border-primary bg-muted text-primary-hover"
                                      : "border-border bg-background text-foreground hover:bg-muted/60"
                                  )}
                                >
                                  {SORT_LABELS[key]}
                                </button>
                              ))}
                            </div>
                          </div>
                        </Popover.Content>
                      </Popover.Portal>
                    </Popover.Root>

                    {/* Yeni Konu Aç — sadece danışan */}
                    {role === "danisan" && (
                      <Link
                        href="/forum/yeni-konu"
                        className={cn(pillIconBtn, "bg-primary text-white border-primary hover:bg-primary-hover hover:text-white")}
                        aria-label="Yeni konu aç"
                      >
                        <PenLine className="size-5" strokeWidth={2} aria-hidden />
                      </Link>
                    )}
                  </div>
                </div>
              </form>

              {/* Aktif filtre etiketleri */}
              {(query || selectedTags.length > 0) && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {query && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-white/80 px-3 py-1 text-xs font-medium text-primary-hover">
                      &quot;{query}&quot;
                      <button type="button" onClick={() => { setQuery(""); setInputValue(""); setPage(1); }} aria-label="Aramayı temizle">
                        <X className="size-3" />
                      </button>
                    </span>
                  )}
                  {selectedTags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-white/80 px-3 py-1 text-xs font-medium text-primary-hover">
                      {tag}
                      <button type="button" onClick={() => toggleTag(tag)} aria-label={`${tag} filtresini kaldır`}>
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Thread akışı */}
      <div className="bg-[#e6f0ee]">
        <div className="page-shell py-6">
          {/* Sonuç bilgisi + filtre temizle */}
          {hasActiveFilters && (
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">{filtered.length}</strong> konu bulundu
                {totalPages > 1 && (
                  <span> — sayfa {page}/{totalPages}</span>
                )}
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-medium text-primary transition hover:text-primary-hover"
              >
                Filtreleri temizle
              </button>
            </div>
          )}

          {paginated.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <MessageCircle className="size-12 text-muted-foreground" />
              <p className="font-semibold">
                {hasActiveFilters ? "Arama kriterlerinize uygun konu bulunamadı" : "Henüz konu yok"}
              </p>
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex h-10 items-center rounded-full border border-border bg-white px-5 text-sm font-semibold text-foreground transition hover:bg-muted"
                >
                  Filtreleri temizle
                </button>
              ) : role === "danisan" && (
                <Link href="/forum/yeni-konu" className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-hover">
                  İlk konuyu aç
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {paginated.map((thread) => (
                  <ThreadCard key={thread.id} thread={thread} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex size-10 items-center justify-center rounded-full border border-border bg-white text-sm text-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Önceki sayfa"
                  >
                    <ChevronLeft className="size-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                      if (idx > 0 && typeof arr[idx - 1] === "number" && (p as number) - (arr[idx - 1] as number) > 1) {
                        acc.push("…");
                      }
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((item, idx) =>
                      item === "…" ? (
                        <span key={`ellipsis-${idx}`} className="flex size-10 items-center justify-center text-sm text-muted-foreground">
                          …
                        </span>
                      ) : (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setPage(item as number)}
                          className={cn(
                            "flex size-10 items-center justify-center rounded-full border text-sm font-medium shadow-sm transition",
                            page === item
                              ? "border-primary bg-primary text-white"
                              : "border-border bg-white text-foreground hover:bg-muted"
                          )}
                          aria-label={`Sayfa ${item}`}
                          aria-current={page === item ? "page" : undefined}
                        >
                          {item}
                        </button>
                      )
                    )
                  }

                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="flex size-10 items-center justify-center rounded-full border border-border bg-white text-sm text-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Sonraki sayfa"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
