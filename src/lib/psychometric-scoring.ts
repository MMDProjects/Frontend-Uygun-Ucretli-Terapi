import type {
  PsychometricInterpretationBand,
  PsychometricTestDefinition,
  TestAnswersMap,
} from "@/types/dto/psychometric-test";

export interface ComputedPsychometricScores {
  totalScore: number;
  subscaleScores: Record<string, number>;
  band: PsychometricInterpretationBand | null;
}

/**
 * Sums option scores from answers; aggregates by question.subscaleId.
 * Picks first interpretation band where minScore <= total <= maxScore (bands sorted by minScore).
 */
export function computePsychometricScores(
  definition: PsychometricTestDefinition,
  answersByQuestionId: TestAnswersMap
): ComputedPsychometricScores {
  const subscaleScores: Record<string, number> = {};
  let totalScore = 0;

  for (const q of definition.questions) {
    const optionId = answersByQuestionId[q.id];
    if (!optionId) continue;
    const opt = q.options.find((o) => o.id === optionId);
    if (!opt) continue;
    const pts = Number(opt.score);
    if (Number.isNaN(pts)) continue;
    totalScore += pts;
    if (q.subscaleId) {
      subscaleScores[q.subscaleId] =
        (subscaleScores[q.subscaleId] ?? 0) + pts;
    }
  }

  const sortedBands = [...definition.interpretationBands].sort(
    (a, b) => a.minScore - b.minScore
  );

  let band: PsychometricInterpretationBand | null = null;
  for (const b of sortedBands) {
    if (totalScore >= b.minScore && totalScore <= b.maxScore) {
      band = b;
      break;
    }
  }

  return { totalScore, subscaleScores, band };
}
