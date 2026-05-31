"use client";

import { use, useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Send, ShieldCheck, MessageCircle } from "lucide-react";

import { useAuthStore } from "@/lib/stores/auth-store";
import {
  getForumQuestion,
  getAssignedQuestionById,
  createAnswer,
  type ForumQuestion,
  type AssignedQuestionDetail,
} from "@/lib/services/forum.service";
import { cn } from "@/lib/utils";

type PageProps = { params: Promise<{ id: string }> };

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}
function formatDateShort(iso: string) {
  return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
}
function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function PageSkeleton() {
  return (
    <div className="bg-[#e6f0ee] !pt-0">
      <section className="section-shell relative overflow-hidden border-b border-border/70 bg-[#cce1de]">
        <div className="page-shell">
          <div className="h-4 w-28 rounded bg-muted/60 shimmer mb-5" />
          <div className="max-w-2xl space-y-3">
            <div className="h-8 w-3/4 rounded bg-muted/60 shimmer" />
            <div className="h-4 w-48 rounded bg-muted/60 shimmer" />
          </div>
        </div>
      </section>
      <div className="page-shell max-w-3xl py-6 space-y-3">
        <div className="rounded-[2rem] border border-border/60 bg-white p-6 shadow-sm lg:rounded-[2.25rem]">
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-muted shimmer" />
            <div className="h-4 w-5/6 rounded bg-muted shimmer" />
            <div className="h-4 w-4/6 rounded bg-muted shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function KonuDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { displayName, role } = useAuthStore();

  const [question, setQuestion] = useState<ForumQuestion | null>(null);
  const [assignedQuestion, setAssignedQuestion] = useState<AssignedQuestionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundPage, setNotFoundPage] = useState(false);

  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const q = await getForumQuestion(id);
        setQuestion(q);
      } catch {
        // Public endpoint sadece onaylı cevabı olan CEVAPLANDI soruları döndürür.
        // Uzman ise atanmış soruyu doğrudan kendi endpoint'inden çek.
        if (role === "uzman") {
          try {
            const q = await getAssignedQuestionById(id);
            setAssignedQuestion(q);
            return;
          } catch {}
        }
        setNotFoundPage(true);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [id, role]);

  if (loading) return <PageSkeleton />;
  if (notFoundPage) notFound();

  // Uzman, henüz public olmayan soruya bakıyor (ATANDI veya onay bekleyen CEVAPLANDI)
  if (!question && assignedQuestion) {
    const alreadyAnswered = assignedQuestion.status === "CEVAPLANDI" || assignedQuestion.answers.length > 0;

    async function handleAssignedSubmit(e: React.FormEvent) {
      e.preventDefault();
      if (!text.trim()) return;
      setSubmitError("");
      setSubmitting(true);
      try {
        await createAnswer(id, text.trim());
        setText("");
        setSubmitted(true);
      } catch (err: unknown) {
        setSubmitError(err instanceof Error ? err.message : "Bir hata oluştu");
      } finally {
        setSubmitting(false);
      }
    }

    return (
      <div className="bg-[#e6f0ee] !pt-0">
        <section className="section-shell relative overflow-hidden border-b border-border/70 bg-[#cce1de]">
          <div className="page-shell">
            <Link href="/forum" className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-primary">
              <ArrowLeft className="size-4" />
              Tüm Konular
            </Link>
            <div className="max-w-2xl space-y-3">
              <span className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                alreadyAnswered
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-amber-200 bg-amber-50 text-amber-700"
              )}>
                <Clock className="size-3" />
                {alreadyAnswered ? "Yanıtlandı — Onay Bekliyor" : "Yanıt Bekliyor"}
              </span>
              <h1 className="text-balance text-3xl font-semibold tracking-tight text-primary-hover sm:text-4xl">
                {assignedQuestion.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="size-3.5" />{formatDateShort(assignedQuestion.createdAt)}</span>
                <span className="flex items-center gap-1"><MessageCircle className="size-3.5" />{assignedQuestion.answers.length} yanıt</span>
              </div>
            </div>
          </div>
        </section>
        <div className="page-shell max-w-3xl py-6 space-y-3">
          {/* Soru */}
          <article className="rounded-[2rem] border border-border/60 bg-white p-6 shadow-sm lg:rounded-[2.25rem]">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#e6f0ee] text-sm font-bold text-primary-hover">
                <MessageCircle className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">Danışan</span>
                  <span className="text-xs text-muted-foreground">{formatDate(assignedQuestion.createdAt)}</span>
                </div>
                <p className="mt-3 text-base leading-7 text-foreground">{assignedQuestion.content}</p>
              </div>
            </div>
          </article>

          {/* Mevcut cevaplar */}
          {assignedQuestion.answers.map((ans) => {
            const expertName = `${ans.expertProfile.user.firstName} ${ans.expertProfile.user.lastName}`.trim();
            return (
              <article key={ans.id} className="rounded-[2rem] border border-primary/20 bg-[#e6f0ee] p-5 shadow-sm lg:rounded-[2.25rem]">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {getInitials(expertName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-semibold text-foreground">{expertName}</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-white">
                        <ShieldCheck className="size-3" />Uzman
                      </span>
                      {!ans.isApproved && (
                        <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                          Admin Onayı Bekliyor
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">{formatDate(ans.createdAt)}</span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-foreground">{ans.content}</p>
                  </div>
                </div>
              </article>
            );
          })}

          {/* Cevap formu — sadece henüz cevaplanmamışsa */}
          {!alreadyAnswered && !submitted && (
            <div className="rounded-[2rem] border border-border/60 bg-white p-5 shadow-sm lg:rounded-[2.25rem]">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {displayName ? getInitials(displayName) : "U"}
                </div>
                <p className="text-sm font-semibold text-primary-hover">Uzman Yanıtı</p>
              </div>
              <form onSubmit={handleAssignedSubmit} className="space-y-3">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Profesyonel yanıtınızı yazın... (min 20 karakter)"
                  rows={4}
                  maxLength={2000}
                  className="w-full resize-none rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ring/25"
                />
                {submitError && <p className="text-sm text-destructive">{submitError}</p>}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{text.length}/2000</span>
                  <button
                    type="submit"
                    disabled={submitting || text.trim().length < 20}
                    className="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover disabled:opacity-60"
                  >
                    {submitting
                      ? <><span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Gönderiliyor...</>
                      : <><Send className="size-4" />Gönder</>}
                  </button>
                </div>
              </form>
            </div>
          )}

          {submitted && (
            <div className="rounded-[2rem] border border-primary/20 bg-[#e6f0ee] p-5 text-center shadow-sm lg:rounded-[2.25rem]">
              <p className="text-sm font-medium text-primary-hover">Yanıtınız gönderildi. Admin onayından sonra yayınlanacak.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!question) notFound();

  const isUzman = role === "uzman";

  async function handleAnswer(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !isUzman) return;
    setSubmitError("");
    setSubmitting(true);
    try {
      await createAnswer(id, text.trim());
      setText("");
      setSubmitted(true);
      // Soruyu yeniden çek (yeni cevap dahil)
      const updated = await getForumQuestion(id);
      setQuestion(updated);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-[#e6f0ee] !pt-0">
      <section className="section-shell relative overflow-hidden border-b border-border/70 bg-[#cce1de]">
        <div className="page-shell">
          <Link href="/forum" className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-primary">
            <ArrowLeft className="size-4" />
            Tüm Konular
          </Link>
          <div className="max-w-2xl space-y-3">
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-primary-hover sm:text-4xl">
              {question.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="size-3.5" />{formatDateShort(question.createdAt)}</span>
              <span className="flex items-center gap-1"><MessageCircle className="size-3.5" />{question.answers.length} yanıt</span>
            </div>
          </div>
        </div>
      </section>

      <div className="page-shell max-w-3xl py-6 space-y-3">
        {/* Orijinal soru */}
        <article className="rounded-[2rem] border border-border/60 bg-white p-6 shadow-sm lg:rounded-[2.25rem]">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#e6f0ee] text-sm font-bold text-primary-hover">
              <MessageCircle className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">Danışan</span>
                <span className="text-xs text-muted-foreground">{formatDate(question.createdAt)}</span>
              </div>
              <p className="mt-3 text-base leading-7 text-foreground">{question.content}</p>
            </div>
          </div>
        </article>

        {/* Yanıtlar */}
        {question.answers.map((answer, i) => {
          const expertName = `${answer.expertProfile.user.firstName} ${answer.expertProfile.user.lastName}`.trim();
          return (
            <article
              key={i}
              className="rounded-[2rem] border border-primary/20 bg-[#e6f0ee] p-5 shadow-sm lg:rounded-[2.25rem]"
            >
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {getInitials(expertName)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-semibold text-foreground">{expertName}</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-white">
                      <ShieldCheck className="size-3" />Uzman
                    </span>
                    <span className="text-xs text-muted-foreground">{formatDate(answer.createdAt)}</span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-foreground">{answer.content}</p>
                </div>
              </div>
            </article>
          );
        })}

        {/* Uzman yanıt formu */}
        {isUzman && !submitted && (
          <div className="rounded-[2rem] border border-border/60 bg-white p-5 shadow-sm lg:rounded-[2.25rem]">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                {displayName ? getInitials(displayName) : "U"}
              </div>
              <p className="text-sm font-semibold text-primary-hover">Uzman Yanıtı</p>
            </div>
            <form onSubmit={handleAnswer} className="space-y-3">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Profesyonel yanıtınızı yazın... (min 20 karakter)"
                rows={4}
                maxLength={2000}
                className="w-full resize-none rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ring/25"
              />
              {submitError && (
                <p className="text-sm text-destructive">{submitError}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{text.length}/2000</span>
                <button
                  type="submit"
                  disabled={submitting || text.trim().length < 20}
                  className="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover disabled:opacity-60"
                >
                  {submitting
                    ? <><span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Gönderiliyor...</>
                    : <><Send className="size-4" />Gönder</>
                  }
                </button>
              </div>
            </form>
          </div>
        )}

        {isUzman && submitted && (
          <div className="rounded-[2rem] border border-primary/20 bg-[#e6f0ee] p-5 text-center shadow-sm lg:rounded-[2.25rem]">
            <p className="text-sm font-medium text-primary-hover">Yanıtınız gönderildi. Admin onayından sonra yayınlanacak.</p>
          </div>
        )}

        {!isUzman && (
          <div className="rounded-[2rem] border border-border/60 bg-white p-5 text-center shadow-sm lg:rounded-[2.25rem]">
            <p className="text-sm text-muted-foreground">
              {role === null
                ? "Yanıt göndermek için uzman olarak giriş yapın."
                : "Bu konuya yalnızca uzmanlar yanıt verebilir."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
