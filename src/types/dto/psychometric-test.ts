/** One answer option on a question; `score` is added when this option is selected. */
export interface PsychometricOption {
  id: string;
  label: string;
  score: number;
}

export interface PsychometricQuestion {
  id: string;
  order: number;
  text: string;
  subscaleId?: string;
  options: PsychometricOption[];
}

export interface PsychometricSubscale {
  id: string;
  name: string;
  description?: string;
}

export interface PsychometricInterpretationBand {
  id: string;
  minScore: number;
  maxScore: number;
  title: string;
  summary: string;
}

export interface PsychometricTestDefinition {
  id: string;
  title: string;
  description: string;
  disclaimer?: string;
  subscales: PsychometricSubscale[];
  interpretationBands: PsychometricInterpretationBand[];
  questions: PsychometricQuestion[];
  updatedAt?: string;
}

/** questionId -> selected optionId */
export type TestAnswersMap = Record<string, string>;

export interface TestResultSubmission {
  id: string;
  testId: string;
  testTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
  submittedAt: string;
  answers: TestAnswersMap;
  totalScore: number;
  subscaleScores: Record<string, number>;
  matchedBandTitle: string;
}

export interface TestResultsListFilters {
  testId?: string;
  search?: string;
}
