"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Send, ShieldCheck, MessageCircle } from "lucide-react";

import { useAuthStore } from "@/lib/stores/auth-store";
import { useForumStore } from "@/lib/stores/forum-store";
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

export default function KonuDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { displayName, role } = useAuthStore();
  const { threads, replies, addReply } = useForumStore();

  const thread = threads.find((t) => t.id === id);
  if (!thread) notFound();

  const threadReplies = replies
    .filter((r) => r.threadId === id)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const isExpert = role === "uzman";
  const isThreadAuthor = displayName === thread.authorName;
  const canReply = isExpert || (role === "danisan" && isThreadAuthor);

  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !canReply || !displayName || !role) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 450));
    addReply(id, text.trim(), displayName, displayName, role as "danisan" | "uzman");
    setText("");
    setSubmitting(false);
  }

  return (
    <div className="bg-[#e6f0ee] !pt-0">
      {/* Hero — /uzmanlar ile aynı yapı */}
      <section className="section-shell relative overflow-hidden border-b border-border/70 bg-[#cce1de]">
        <div className="page-shell">
          <Link href="/forum" className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-primary">
            <ArrowLeft className="size-4" />
            Tüm Konular
          </Link>
          <div className="max-w-2xl space-y-3">
            {thread.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {thread.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-[#cce1de] px-2.5 py-0.5 text-xs font-semibold text-[#014a3e]">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-primary-hover sm:text-4xl">
              {thread.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{thread.authorName}</span>
              <span className="flex items-center gap-1"><Clock className="size-3.5" />{formatDateShort(thread.createdAt)}</span>
              <span className="flex items-center gap-1"><MessageCircle className="size-3.5" />{threadReplies.length} yanıt</span>
            </div>
          </div>
        </div>
      </section>

      <div className="page-shell max-w-3xl py-6 space-y-3">
        {/* Orijinal soru */}
        <article className="rounded-[2rem] border border-border/60 bg-white p-6 shadow-sm lg:rounded-[2.25rem]">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#e6f0ee] text-sm font-bold text-primary-hover">
              {getInitials(thread.authorName)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-semibold text-foreground">{thread.authorName}</span>
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">Danışan</span>
                <span className="text-xs text-muted-foreground">{formatDate(thread.createdAt)}</span>
              </div>
              <p className="mt-3 text-base leading-7 text-foreground">{thread.content}</p>
            </div>
          </div>
        </article>

        {/* Yanıtlar */}
        {threadReplies.map((reply) => (
          <article
            key={reply.id}
            className={cn(
              "rounded-[2rem] border p-5 shadow-sm lg:rounded-[2.25rem]",
              reply.authorRole === "uzman" ? "border-primary/20 bg-[#e6f0ee]" : "border-border/60 bg-white"
            )}
          >
            <div className="flex items-start gap-3">
              <div className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                reply.authorRole === "uzman" ? "bg-primary text-white" : "bg-muted text-primary-hover"
              )}>
                {getInitials(reply.authorName)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-semibold text-foreground">{reply.authorName}</span>
                  {reply.authorRole === "uzman" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-white">
                      <ShieldCheck className="size-3" />Uzman
                    </span>
                  ) : (
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">Danışan</span>
                  )}
                  <span className="text-xs text-muted-foreground">{formatDate(reply.createdAt)}</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-foreground">{reply.content}</p>
              </div>
            </div>
          </article>
        ))}

        {/* Yanıt formu */}
        {canReply ? (
          <div className="rounded-[2rem] border border-border/60 bg-white p-5 shadow-sm lg:rounded-[2.25rem]">
            <div className="mb-3 flex items-center gap-2">
              <div className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                isExpert ? "bg-primary text-white" : "bg-[#e6f0ee] text-primary-hover"
              )}>
                {displayName ? getInitials(displayName) : "?"}
              </div>
              <p className="text-sm font-semibold text-primary-hover">
                {isExpert ? "Uzman Yanıtı" : "Takip Sorusu"}
              </p>
            </div>
            <form onSubmit={handleReply} className="space-y-3">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={isExpert ? "Profesyonel yanıtınızı yazın..." : "Takip sorunuzu yazın..."}
                rows={4}
                maxLength={2000}
                className="w-full resize-none rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ring/25"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{text.length}/2000</span>
                <button
                  type="submit"
                  disabled={submitting || !text.trim()}
                  className="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover disabled:opacity-60"
                >
                  {submitting ? <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Send className="size-4" />}
                  {submitting ? "Gönderiliyor..." : "Gönder"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="rounded-[2rem] border border-border/60 bg-white p-5 text-center shadow-sm lg:rounded-[2.25rem]">
            <p className="text-sm text-muted-foreground">Bu konuya yalnızca konu sahibi ve uzmanlar yanıt verebilir.</p>
          </div>
        )}
      </div>
    </div>
  );
}
