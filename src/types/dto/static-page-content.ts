export interface StaticExtraSection {
  id: string;
  title: string;
  body: string;
  order: number;
}

export interface StaticPageContent {
  about: string;
  vision: string;
  mission: string;
  extraSections: StaticExtraSection[];
}

export type StaticPageContentUpdatePayload = StaticPageContent;
