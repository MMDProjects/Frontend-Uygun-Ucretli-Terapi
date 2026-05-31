"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, Clock, CheckCircle2, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/features/admin/components/page-header";
import { getAssignedQuestions, type AssignedQuestion } from "@/lib/services/forum.service";
import { cn } from "@/lib/utils";

type FilterTab = "Tümü" | "Yanıt Bekliyor" | "Yanıtladım";

const FILTER_TABS: FilterTab[] = ["Tümü", "Yanıt Bekliyor", "Yanıtladım"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function QuestionCard({ q }: { q: AssignedQuestion }) {
  const [expanded, setExpanded] = useState(false);
  const answered = q.status === "CEVAPLANDI";

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-white">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-start gap-4 p-5 text-left"
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <MessageSquare className="size-5 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-foreground line-clamp-1">{q.title}</p>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                answered
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-amber-200 bg-amber-50 text-amber-700"
              )}
            >
              {answered
                ? <><CheckCircle2 className="size-3" />Yanıtladım</>
                : <><Clock className="size-3" />Yanıt Bekliyor</>
              }
            </span>
          </div>
          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{q.content}</p>
          <p className="mt-1 text-[10px] text-muted-foreground">{formatDate(q.createdAt)}</p>
        </div>
        <div className="shrink-0 text-muted-foreground">
          {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border/50 px-5 pb-5 pt-4">
          <div className="mb-4 rounded-xl bg-muted/40 p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-1">Soru</p>
            <p className="text-sm text-foreground">{q.content}</p>
          </div>
          <Link
            href={`/forum/konu/${q.id}`}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-4 py-1.5 text-xs font-semibold transition",
              answered
                ? "border border-border/60 bg-white text-muted-foreground hover:border-primary/30 hover:text-primary"
                : "bg-primary text-white hover:bg-primary-hover"
            )}
          >
            <ExternalLink className="size-3.5" />
            {answered ? "Cevabı Gör" : "Cevapla"}
          </Link>
        </div>
      )}
    </div>
  );
}

export default function UzmanForumPage() {
  const [questions, setQuestions] = useState<AssignedQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>("Tümü");

  useEffect(() => {
    getAssignedQuestions()
      .then(setQuestions)
      .catch(() => toast.error("Sorular yüklenemedi."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = questions.filter((q) => {
    if (activeTab === "Yanıt Bekliyor") return q.status === "ATANDI";
    if (activeTab === "Yanıtladım") return q.status === "CEVAPLANDI";
    return true;
  });

  const counts: Record<FilterTab, number> = {
    "Tümü": questions.length,
    "Yanıt Bekliyor": questions.filter((q) => q.status === "ATANDI").length,
    "Yanıtladım": questions.filter((q) => q.status === "CEVAPLANDI").length,
  };

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="h-10 w-48 skeleton rounded-xl" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 skeleton rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Forum Soruları"
        description="Size atanan soruları yanıtlayın."
      />

      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition",
              activeTab === tab
                ? "border-primary bg-primary text-white"
                : "border-border/60 bg-white text-muted-foreground hover:border-primary/30 hover:text-primary"
            )}
          >
            {tab}
            <span
              className={cn(
                "flex size-5 items-center justify-center rounded-full text-[10px] font-bold",
                activeTab === tab ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
              )}
            >
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-white py-16 text-center">
          <MessageSquare className="mb-3 size-10 text-muted-foreground/40" />
          <p className="text-sm font-semibold text-muted-foreground">
            {activeTab === "Yanıt Bekliyor"
              ? "Yanıt bekleyen soru yok"
              : activeTab === "Yanıtladım"
              ? "Henüz yanıtladığınız soru yok"
              : "Size atanmış soru yok"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((q) => (
            <QuestionCard key={q.id} q={q} />
          ))}
        </div>
      )}
    </div>
  );
}
