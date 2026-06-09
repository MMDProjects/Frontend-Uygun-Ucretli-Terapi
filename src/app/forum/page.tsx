"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  MessageCircle, ChevronDown, ChevronUp, Clock,
  Search, ArrowDownWideNarrow, X,
  ChevronLeft, ChevronRight, PenLine, ShieldCheck, Trash2, Loader2,
} from "lucide-react";
import * as Popover from "@radix-ui/react-popover";

import { useAuthStore } from "@/lib/stores/auth-store";
import { toast } from "sonner";
import {
  getForumQuestions,
  getAssignedQuestions,
  getMyQuestions,
  deleteQuestion,
  type ForumQuestion,
  type AssignedQuestion,
  type MyQuestion,
} from "@/lib/services/forum.service";
import { cn } from "@/lib/utils";

type ForumTab = "public" | "assigned" | "myquestions";

const ITEMS_PER_PAGE = 15;

type SortKey = "newest" | "oldest" | "most-replies";
const SORT_LABELS: Record<SortKey, string> = {
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

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function QuestionCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-border/60 bg-white shadow-sm lg:rounded-[2.25rem]">
      <div className="flex items-start gap-3 p-5 pb-4">
        <div className="size-10 shrink-0 rounded-full bg-muted shimmer" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-3 w-32 rounded bg-muted shimmer" />
          <div className="h-4 w-3/4 rounded bg-muted shimmer" />
          <div className="h-3 w-full rounded bg-muted shimmer" />
          <div className="h-3 w-2/3 rounded bg-muted shimmer" />
        </div>
      </div>
    </div>
  );
}

function QuestionCard({ question }: { question: ForumQuestion }) {
  const [expanded, setExpanded] = useState(false);
  const answers = question.answers ?? [];
  const visibleAnswers = expanded ? answers : answers.slice(0, 2);
  const hiddenCount = answers.length - 2;

  return (
    <article className="overflow-hidden rounded-[2rem] border border-border/60 bg-white shadow-sm transition hover:border-primary/30 hover:shadow-md lg:rounded-[2.25rem]">
      <div className="flex items-start gap-3 p-5 pb-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#e6f0ee] text-sm font-bold text-primary-hover">
          <MessageCircle className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <span className="rounded-full bg-muted px-2 py-0.5 font-medium">Danışan</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {formatDateShort(question.createdAt)}
            </span>
          </div>
          <Link href={`/forum/konu/${question.id}`} className="group mt-1 block">
            <h2 className="font-semibold text-foreground transition group-hover:text-primary">
              {question.title}
            </h2>
          </Link>
          <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {question.content}
          </p>
        </div>
      </div>

      {answers.length > 0 && (
        <div className="space-y-2 border-t border-border/40 px-5 py-3">
          {visibleAnswers.map((answer, i) => {
            const expertName = `${answer.expertProfile.user.firstName} ${answer.expertProfile.user.lastName}`.trim();
            return (
              <div key={i} className="flex items-start gap-2.5">
                <div className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-xs font-bold text-white">
                  {answer.expertProfile.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={answer.expertProfile.avatarUrl} alt={expertName} className="size-full object-cover" />
                  ) : (
                    getInitials(expertName)
                  )}
                </div>
                <div className="min-w-0 flex-1 rounded-2xl bg-[#e6f0ee] px-3 py-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-sm font-semibold text-foreground">{expertName}</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white">
                      <ShieldCheck className="size-3" />
                      Uzman
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-foreground">{answer.content}</p>
                </div>
              </div>
            );
          })}
          {answers.length > 2 && (
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
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            Bu konuya yalnızca uzmanlar yanıt verebilir.
          </p>
          <Link
            href={`/forum/konu/${question.id}`}
            className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary transition hover:text-primary-hover"
          >
            <MessageCircle className="size-3.5" />
            {answers.length} yanıt
          </Link>
        </div>
      </div>
    </article>
  );
}

function AssignedQuestionCard({ q }: { q: AssignedQuestion }) {
  const answered = q.status === "CEVAPLANDI";
  return (
    <article className="overflow-hidden rounded-[2rem] border border-border/60 bg-white shadow-sm transition hover:border-primary/30 hover:shadow-md lg:rounded-[2.25rem]">
      <div className="flex items-start gap-3 p-5 pb-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#e6f0ee] text-sm font-bold text-primary-hover">
          <MessageCircle className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <span className={cn(
              "rounded-full border px-2 py-0.5 font-semibold text-[10px]",
              answered
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-amber-200 bg-amber-50 text-amber-700"
            )}>
              {answered ? "Yanıtladım" : "Yanıt Bekliyor"}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", year: "numeric" }).format(new Date(q.createdAt))}
            </span>
          </div>
          <Link href={`/forum/konu/${q.id}`} className="group mt-1 block">
            <h2 className="font-semibold text-foreground transition group-hover:text-primary">{q.title}</h2>
          </Link>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{q.content}</p>
        </div>
      </div>
      <div className="border-t border-border/40 px-5 py-3">
        <Link
          href={`/forum/konu/${q.id}`}
          className="inline-flex items-center gap-1 text-xs font-medium text-primary transition hover:text-primary-hover"
        >
          <MessageCircle className="size-3.5" />
          {answered ? "Cevabı görüntüle" : "Cevapla"}
        </Link>
      </div>
    </article>
  );
}

const STATUS_LABELS: Record<MyQuestion["status"], { label: string; className: string }> = {
  ONAY_BEKLIYOR: { label: "Onay Bekliyor", className: "border-amber-200 bg-amber-50 text-amber-700" },
  ATANDI: { label: "Uzmana Atandı", className: "border-blue-200 bg-blue-50 text-blue-700" },
  CEVAPLANDI: { label: "Yanıtlandı", className: "border-green-200 bg-green-50 text-green-700" },
};

function MyQuestionCard({ q, onDelete }: { q: MyQuestion; onDelete: (id: string) => void }) {
  const [deleting, setDeleting] = useState(false);
  const s = STATUS_LABELS[q.status];

  async function handleDelete() {
    if (!confirm("Bu soruyu silmek istediğinizden emin misiniz?")) return;
    setDeleting(true);
    try {
      await deleteQuestion(q.id);
      onDelete(q.id);
      toast.success("Soru silindi.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Soru silinemedi");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <article className="overflow-hidden rounded-[2rem] border border-border/60 bg-white shadow-sm lg:rounded-[2.25rem]">
      <div className="flex items-start gap-3 p-5 pb-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#e6f0ee] text-sm font-bold text-primary-hover">
          <MessageCircle className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <span className={cn("rounded-full border px-2 py-0.5 font-semibold text-[10px]", s.className)}>
              {s.label}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {formatDateShort(q.createdAt)}
            </span>
          </div>
          <h2 className="mt-1 font-semibold text-foreground">{q.title}</h2>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{q.content}</p>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-border/40 px-5 py-3">
        <Link
          href={`/forum/konu/${q.id}`}
          className="inline-flex items-center gap-1 text-xs font-medium text-primary transition hover:text-primary-hover"
        >
          <MessageCircle className="size-3.5" />
          Görüntüle
        </Link>
        {q.status === "ONAY_BEKLIYOR" && (
          <button
            type="button"
            disabled={deleting}
            onClick={handleDelete}
            className="inline-flex items-center gap-1 rounded-xl border border-destructive/30 px-3 py-1 text-xs font-medium text-destructive transition hover:bg-destructive/5 disabled:opacity-50"
          >
            {deleting ? <Loader2 className="size-3 animate-spin" /> : <Trash2 className="size-3" />}
            Sil
          </button>
        )}
      </div>
    </article>
  );
}

export default function ForumPage() {
  const { role } = useAuthStore();

  const [activeTab, setActiveTab] = useState<ForumTab>("public");

  const [questions, setQuestions] = useState<ForumQuestion[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const [assigned, setAssigned] = useState<AssignedQuestion[]>([]);
  const [assignedLoading, setAssignedLoading] = useState(false);
  const [assignedError, setAssignedError] = useState("");

  const [myQuestions, setMyQuestions] = useState<MyQuestion[]>([]);
  const [myQuestionsLoading, setMyQuestionsLoading] = useState(false);

  const [query, setQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");

  useEffect(() => {
    setLoading(true);
    setError("");
    getForumQuestions(page, ITEMS_PER_PAGE)
      .then((res) => {
        setQuestions(res.data);
        setTotal(res.total);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => {
    if (role !== "danisan" || activeTab !== "myquestions") return;
    setMyQuestionsLoading(true);
    getMyQuestions()
      .then(setMyQuestions)
      .catch(() => toast.error("Sorularınız yüklenemedi."))
      .finally(() => setMyQuestionsLoading(false));
  }, [role, activeTab]);

  useEffect(() => {
    if (role !== "uzman" || activeTab !== "assigned") return;
    setAssignedLoading(true);
    setAssignedError("");
    getAssignedQuestions()
      .then(setAssigned)
      .catch((e: Error) => setAssignedError(e.message))
      .finally(() => setAssignedLoading(false));
  }, [role, activeTab]);

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));

  const filtered = useMemo(() => {
    let result = [...questions];
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (t) => t.title.toLowerCase().includes(q) || t.content.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      if (sort === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sort === "most-replies") return (b.answers?.length ?? 0) - (a.answers?.length ?? 0);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return result;
  }, [questions, query, sort]);

  const hasActiveFilters = query || sort !== "newest";

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setQuery(inputValue.trim());
  }

  function clearFilters() {
    setQuery("");
    setInputValue("");
    setSort("newest");
  }

  const replyTotal = questions.reduce((s, q) => s + (q.answers?.length ?? 0), 0);

  return (
    <>
      {/* Hero */}
      <section className="section-shell relative overflow-hidden border-b border-border/70 bg-[#cce1de]">
        <div className="page-shell">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <div className="w-full max-w-xl shrink-0 space-y-3">
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-primary-hover sm:text-5xl">
                Forum
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-8">
                Danışanların sorularını uzmanların yanıtladığı güvenli alan.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span><strong className="text-foreground">{total}</strong> konu</span>
                <span><strong className="text-foreground">{replyTotal}</strong> yanıt</span>
              </div>
            </div>

            <div className="w-full min-w-0 shrink-0 self-center max-w-lg xl:max-w-xl">
              <form className="w-full" onSubmit={handleSearch} role="search" aria-label="Forum konularında ara">
                <div className="flex w-full min-w-0 flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-3">
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
                      className="min-h-9 w-full min-w-0 flex-1 border-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground sm:min-h-11 sm:py-2 sm:pr-2"
                    />
                    <button type="submit" className={searchSubmitBtn} aria-label="Ara">
                      <Search className="size-5" strokeWidth={2} aria-hidden />
                    </button>
                  </div>

                  <div className="flex shrink-0 items-center justify-center gap-2 sm:justify-start">
                    {/* Sıralama */}
                    <Popover.Root modal={false}>
                      <Popover.Trigger asChild>
                        <button
                          type="button"
                          className={cn(pillIconBtn, sort !== "newest" && "border-primary bg-primary/10 text-primary-hover")}
                          aria-label="Sırala"
                        >
                          <ArrowDownWideNarrow className="size-5" strokeWidth={2} aria-hidden />
                        </button>
                      </Popover.Trigger>
                      <Popover.Portal>
                        <Popover.Content
                          side="bottom" align="end" sideOffset={10} collisionPadding={16}
                          className="z-[60] w-[min(calc(100vw-2rem),18rem)] rounded-[var(--radius)] border border-border/80 bg-card p-4 shadow-xl outline-none"
                        >
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm font-semibold text-foreground">Sırala</p>
                              <p className="text-xs text-muted-foreground">Listeleme biçimini seçin.</p>
                            </div>
                            <div className="space-y-2">
                              {(["newest", "oldest", "most-replies"] as SortKey[]).map((key) => (
                                <button
                                  key={key}
                                  type="button"
                                  onClick={() => setSort(key)}
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

                    {/* Yeni Konu */}
                    {role === "danisan" ? (
                      <Link
                        href="/forum/yeni-konu"
                        className={cn(pillIconBtn, "bg-primary text-white border-primary hover:bg-primary-hover hover:text-white")}
                        aria-label="Yeni konu aç"
                      >
                        <PenLine className="size-5" strokeWidth={2} aria-hidden />
                      </Link>
                    ) : role === null ? (
                      <Link
                        href="/giris?redirect=/forum/yeni-konu"
                        className={cn(pillIconBtn, "bg-primary text-white border-primary hover:bg-primary-hover hover:text-white")}
                        aria-label="Soru sormak için giriş yap"
                      >
                        <PenLine className="size-5" strokeWidth={2} aria-hidden />
                      </Link>
                    ) : null}
                  </div>
                </div>
              </form>

              {query && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-white/80 px-3 py-1 text-xs font-medium text-primary-hover">
                    &quot;{query}&quot;
                    <button type="button" onClick={() => { setQuery(""); setInputValue(""); }} aria-label="Aramayı temizle">
                      <X className="size-3" />
                    </button>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Danışan sekme bar */}
          {role === "danisan" && (
            <div className="mt-6 flex gap-1 rounded-full border border-white/40 bg-white/30 p-1 w-fit backdrop-blur-sm">
              <button
                type="button"
                onClick={() => setActiveTab("public")}
                className={cn(
                  "rounded-full px-5 py-1.5 text-sm font-medium transition",
                  activeTab === "public" ? "bg-primary text-white shadow-sm" : "text-primary-hover hover:bg-white/50"
                )}
              >
                Tüm Sorular
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("myquestions")}
                className={cn(
                  "rounded-full px-5 py-1.5 text-sm font-medium transition",
                  activeTab === "myquestions" ? "bg-primary text-white shadow-sm" : "text-primary-hover hover:bg-white/50"
                )}
              >
                Sorularım
              </button>
            </div>
          )}

          {/* Uzman sekme bar — hero altı */}
          {role === "uzman" && (
            <div className="mt-6 flex gap-1 rounded-full border border-white/40 bg-white/30 p-1 w-fit backdrop-blur-sm">
              <button
                type="button"
                onClick={() => setActiveTab("public")}
                className={cn(
                  "rounded-full px-5 py-1.5 text-sm font-medium transition",
                  activeTab === "public"
                    ? "bg-primary text-white shadow-sm"
                    : "text-primary-hover hover:bg-white/50"
                )}
              >
                Tüm Sorular
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("assigned")}
                className={cn(
                  "rounded-full px-5 py-1.5 text-sm font-medium transition",
                  activeTab === "assigned"
                    ? "bg-primary text-white shadow-sm"
                    : "text-primary-hover hover:bg-white/50"
                )}
              >
                Bana Atanan
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Bana Atanan — sadece uzman */}
      {activeTab === "assigned" && (
        <div className="bg-[#e6f0ee]">
          <div className="page-shell py-6">
            {assignedLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => <QuestionCardSkeleton key={i} />)}
              </div>
            ) : assignedError ? (
              <div className="flex flex-col items-center gap-4 py-20 text-center">
                <p className="font-semibold text-destructive">{assignedError}</p>
                <button
                  type="button"
                  onClick={() => setActiveTab("assigned")}
                  className="inline-flex h-10 items-center rounded-full border border-border bg-white px-5 text-sm font-semibold text-foreground transition hover:bg-muted"
                >
                  Tekrar Dene
                </button>
              </div>
            ) : assigned.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-20 text-center">
                <MessageCircle className="size-12 text-muted-foreground" />
                <p className="font-semibold">Henüz size atanmış soru yok</p>
              </div>
            ) : (
              <div className="space-y-3">
                {assigned.map((q) => (
                  <AssignedQuestionCard key={q.id} q={q} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sorularım — danışan */}
      {activeTab === "myquestions" && (
        <div className="bg-[#e6f0ee]">
          <div className="page-shell py-6">
            {myQuestionsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => <QuestionCardSkeleton key={i} />)}
              </div>
            ) : myQuestions.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-20 text-center">
                <MessageCircle className="size-12 text-muted-foreground" />
                <p className="font-semibold">Henüz soru sormadınız</p>
                <Link href="/forum/yeni-konu" className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-hover">
                  İlk soruyu sor
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {myQuestions.map((q) => (
                  <MyQuestionCard
                    key={q.id}
                    q={q}
                    onDelete={(id) => setMyQuestions((prev) => prev.filter((x) => x.id !== id))}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tüm Sorular listesi */}
      {activeTab === "public" && (
      <div className="bg-[#e6f0ee]">
        <div className="page-shell py-6">
          {hasActiveFilters && !loading && (
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">{filtered.length}</strong> konu bulundu
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

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => <QuestionCardSkeleton key={i} />)}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <p className="font-semibold text-destructive">{error}</p>
              <button
                type="button"
                onClick={() => setPage(1)}
                className="inline-flex h-10 items-center rounded-full border border-border bg-white px-5 text-sm font-semibold text-foreground transition hover:bg-muted"
              >
                Tekrar Dene
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <MessageCircle className="size-12 text-muted-foreground" />
              <p className="font-semibold">
                {query ? "Arama kriterlerinize uygun konu bulunamadı" : "Henüz yanıtlanmış konu yok"}
              </p>
              {query ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex h-10 items-center rounded-full border border-border bg-white px-5 text-sm font-semibold text-foreground transition hover:bg-muted"
                >
                  Filtreleri temizle
                </button>
              ) : role === "danisan" ? (
                <Link href="/forum/yeni-konu" className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-hover">
                  İlk soruyu sor
                </Link>
              ) : role === null ? (
                <Link href="/giris?redirect=/forum/yeni-konu" className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-hover">
                  Soru sormak için giriş yap
                </Link>
              ) : null}
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {filtered.map((q) => <QuestionCard key={q.id} question={q} />)}
              </div>

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
                      if (idx > 0 && typeof arr[idx - 1] === "number" && (p as number) - (arr[idx - 1] as number) > 1) acc.push("…");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((item, idx) =>
                      item === "…" ? (
                        <span key={`e-${idx}`} className="flex size-10 items-center justify-center text-sm text-muted-foreground">…</span>
                      ) : (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setPage(item as number)}
                          className={cn(
                            "flex size-10 items-center justify-center rounded-full border text-sm font-medium shadow-sm transition",
                            page === item ? "border-primary bg-primary text-white" : "border-border bg-white text-foreground hover:bg-muted"
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
      )}
    </>
  );
}
