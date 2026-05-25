export type FaqStatus = "published" | "draft";

export interface FaqDto {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  status: FaqStatus;
  updatedAt: string;
}

export interface FaqInput {
  question: string;
  answer: string;
  category: string;
  order: number;
  status: FaqStatus;
}
