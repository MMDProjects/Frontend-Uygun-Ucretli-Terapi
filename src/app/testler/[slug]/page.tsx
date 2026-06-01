"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Users, RotateCcw
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getTestBySlug, type ApiTestWithDefinition } from "@/lib/services/public.service";
import { saveTestResult } from "@/lib/services/danisan.service";
import { computePsychometricScores } from "@/lib/psychometric-scoring";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { PsychometricTestDefinition, TestAnswersMap } from "@/types/dto/psychometric-test";
import { cn } from "@/lib/utils";

// ─── Sonuç Ekranı ──────────────────────────────────────────────────────────────

function ResultScreen({
  test,
  definition,
  answers,
  onRetry,
}: {
  test: ApiTestWithDefinition;
  definition: PsychometricTestDefinition;
  answers: TestAnswersMap;
  onRetry: () => void;
}) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const scores = computePsychometricScores(definition, answers);
  const maxScore = definition.questions.reduce((acc, q) => {
    const max = Math.max(...q.options.map((o) => Number(o.score) || 0));
    return acc + max;
  }, 0);
  const pct = maxScore > 0 ? Math.round((scores.totalScore / maxScore) * 100) : 0;

  const summaryText = scores.band
    ? `${scores.band.title}: ${scores.band.summary} (Puan: ${scores.totalScore})`
    : `Toplam Puan: ${scores.totalScore}`;

  useEffect(() => {
    if (saved) return;
    setSaving(true);
    saveTestResult(test.id, summaryText)
      .then(() => setSaved(true))
      .catch(() => {})
      .finally(() => setSaving(false));
  }, [test.id, summaryText, saved]);

  const subscaleNames = Object.fromEntries(
    definition.subscales.map((s) => [s.id, s.name])
  );

  return (
    <div className="page-shell max-w-2xl mx-auto py-12 space-y-8">
      {/* Başlık */}
      <div className="text-center space-y-2">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 mx-auto">
          <CheckCircle2 className="size-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">{definition.title}</h1>
        <p className="text-sm text-muted-foreground">Test tamamlandı</p>
      </div>

      {/* Puan özeti */}
      <div className="surface-card !rounded-[2rem] p-6 space-y-4">
        {scores.band ? (
          <>
            <h2 className="text-lg font-bold text-primary-hover">{scores.band.title}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{scores.band.summary}</p>
          </>
        ) : (
          <h2 className="text-lg font-bold text-foreground">Toplam Puan: {scores.totalScore}</h2>
        )}

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span className="font-semibold text-foreground">{scores.totalScore} / {maxScore}</span>
            <span>{maxScore}</span>
          </div>
          <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Alt ölçek puanları */}
      {Object.keys(scores.subscaleScores).length > 0 && (
        <div className="surface-card !rounded-[2rem] p-6 space-y-3">
          <h3 className="text-sm font-bold text-foreground">Alt Ölçek Puanları</h3>
          <div className="space-y-2">
            {Object.entries(scores.subscaleScores).map(([id, score]) => (
              <div key={id} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{subscaleNames[id] ?? id}</span>
                <span className="font-semibold text-foreground">{score}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kaydetme durumu */}
      <p className="text-center text-xs text-muted-foreground">
        {saving ? "Sonuç kaydediliyor…" : saved ? "✓ Sonuç hesabınıza kaydedildi" : ""}
      </p>

      {/* Uzman önerisi CTA (R02) */}
      <div className="rounded-[2rem] border border-primary/20 bg-primary/5 p-6 text-center space-y-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 mx-auto">
          <Users className="size-5 text-primary" />
        </div>
        <p className="text-sm font-semibold text-primary-hover">Profesyonel destek almak ister misiniz?</p>
        <p className="text-xs text-muted-foreground">
          Uzmanlarımız size özel değerlendirme ve destek sunabilir.
        </p>
        <Link
          href="/uzmanlar"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover"
        >
          Uzman Bul
        </Link>
      </div>

      {/* Tekrar yap */}
      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-2 rounded-xl border border-border/60 px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/30 hover:text-primary"
        >
          <RotateCcw className="size-4" />
          Testi Tekrarla
        </button>
        <Link
          href="/testler"
          className="flex items-center gap-2 rounded-xl border border-border/60 px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/30 hover:text-primary"
        >
          Diğer Testler
        </Link>
      </div>
    </div>
  );
}

// ─── Ana Sayfa Bileşeni ────────────────────────────────────────────────────────

export default function TestDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [test, setTest] = useState<ApiTestWithDefinition | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<TestAnswersMap>({});
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/giris?redirect=/testler/${slug}`);
      return;
    }
    getTestBySlug(slug)
      .then(setTest)
      .catch(() => setTest(null))
      .finally(() => setLoading(false));
  }, [slug, isAuthenticated, router]);

  if (loading) {
    return (
      <section className="page-shell py-16">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="skeleton h-10 w-2/3 rounded-2xl" />
          <div className="skeleton h-48 rounded-3xl" />
          <div className="skeleton h-12 rounded-2xl" />
        </div>
      </section>
    );
  }

  if (!test) {
    return (
      <section className="page-shell py-16 text-center space-y-4">
        <AlertCircle className="size-12 text-muted-foreground/40 mx-auto" />
        <h1 className="text-xl font-bold text-foreground">Test bulunamadı</h1>
        <Link href="/testler" className="text-sm text-primary hover:underline">
          Testlere Dön
        </Link>
      </section>
    );
  }

  const definition = test.definition as PsychometricTestDefinition | null | undefined;

  if (!definition || !definition.questions?.length) {
    return (
      <section className="page-shell py-16 text-center space-y-4 max-w-lg mx-auto">
        <div className="surface-card !rounded-[2rem] p-8 space-y-4">
          <h1 className="text-xl font-bold text-foreground">{test.title}</h1>
          <p className="text-sm text-muted-foreground">{test.description}</p>
          <p className="text-sm text-muted-foreground italic">
            Test içeriği yakında eklenecek.
          </p>
          <Link href="/testler" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
            <ChevronLeft className="size-4" />
            Testlere Dön
          </Link>
        </div>
      </section>
    );
  }

  if (finished) {
    return (
      <ResultScreen
        test={test}
        definition={definition}
        answers={answers}
        onRetry={() => { setFinished(false); setCurrentQ(0); setAnswers({}); }}
      />
    );
  }

  const questions = definition.questions.sort((a, b) => a.order - b.order);
  const total = questions.length;
  const question = questions[currentQ];
  const selectedOption = answers[question.id];
  const isLast = currentQ === total - 1;
  const pct = Math.round(((currentQ) / total) * 100);

  function handleSelect(optionId: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: optionId }));
  }

  function handleNext() {
    if (!selectedOption) {
      toast.error("Lütfen bir seçenek işaretleyin.");
      return;
    }
    if (isLast) {
      setFinished(true);
    } else {
      setCurrentQ((q) => q + 1);
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="border-b border-border/70 bg-[#cce1de] pt-[calc(var(--site-header-height)+2rem)] pb-8">
        <div className="page-shell max-w-2xl mx-auto">
          <Link href="/testler" className="mb-4 inline-flex items-center gap-1 text-xs text-primary hover:underline">
            <ChevronLeft className="size-3.5" />
            Testler
          </Link>
          <h1 className="text-2xl font-bold text-primary-hover sm:text-3xl">{definition.title}</h1>
          {definition.disclaimer && (
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{definition.disclaimer}</p>
          )}
        </div>
      </section>

      <section className="bg-[#e6f0ee] py-10">
        <div className="page-shell max-w-2xl mx-auto space-y-6">
          {/* İlerleme */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Soru {currentQ + 1} / {total}</span>
              <span>%{pct}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/60 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Soru kartı */}
          <div className="surface-card !rounded-[2rem] p-6 sm:p-8 space-y-6">
            <p className="text-base font-semibold text-foreground leading-relaxed">
              {question.text}
            </p>

            <div className="space-y-3">
              {question.options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelect(opt.id)}
                  className={cn(
                    "w-full text-left rounded-2xl border px-4 py-3 text-sm font-medium transition-colors",
                    selectedOption === opt.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/60 bg-white text-foreground hover:border-primary/40 hover:bg-primary/5"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Navigasyon */}
          <div className="flex justify-between gap-3">
            <button
              type="button"
              disabled={currentQ === 0}
              onClick={() => setCurrentQ((q) => q - 1)}
              className="flex items-center gap-2 rounded-xl border border-border/60 px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/30 hover:text-primary disabled:opacity-40"
            >
              <ChevronLeft className="size-4" />
              Önceki
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover"
            >
              {isLast ? "Tamamla" : "Sonraki"}
              {!isLast && <ChevronRight className="size-4" />}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
