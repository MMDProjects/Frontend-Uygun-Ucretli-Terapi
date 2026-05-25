import { httpRequest } from "@/lib/http-client";
import type { FaqDto, FaqInput } from "@/types/dto/faq";

interface BackendSss {
  id: string;
  question: string;
  answer: string;
  page: string;
  isActive: boolean;
  order: number;
}

function pageToCategory(page: string): string {
  switch (page) {
    case "TESTLER": return "testler";
    case "PAKETLER": return "paketler";
    default: return "genel";
  }
}

function categoryToPage(category: string): string {
  switch (category.toLowerCase()) {
    case "testler": return "TESTLER";
    case "paketler": return "PAKETLER";
    default: return "GENEL";
  }
}

function mapSssToFaq(sss: BackendSss): FaqDto {
  return {
    id: sss.id,
    question: sss.question,
    answer: sss.answer,
    category: pageToCategory(sss.page),
    order: sss.order,
    status: sss.isActive ? "published" : "draft",
    updatedAt: "",
  };
}

function faqInputToSssBody(input: FaqInput) {
  return {
    question: input.question,
    answer: input.answer,
    page: categoryToPage(input.category),
    isActive: input.status === "published",
    order: input.order,
  };
}

/**
 * Lists SSS entries sorted by order ascending.
 */
export async function listFaqs(
  accessToken?: string | null
): Promise<FaqDto[]> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) return [];

  const res = await httpRequest<BackendSss[]>("/admin/sss", {
    method: "GET",
    accessToken: accessToken ?? undefined,
  });
  const items = Array.isArray(res.data) ? res.data : [];
  return items
    .map(mapSssToFaq)
    .sort((a, b) => a.order - b.order);
}

/**
 * Creates a new SSS entry.
 */
export async function createFaq(
  input: FaqInput,
  accessToken?: string | null
): Promise<FaqDto> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    throw new Error("API URL tanımlı değil");
  }

  const res = await httpRequest<BackendSss>("/admin/sss", {
    method: "POST",
    body: faqInputToSssBody(input),
    accessToken: accessToken ?? undefined,
  });
  return mapSssToFaq(res.data);
}

/**
 * Updates an existing SSS entry.
 */
export async function updateFaq(
  id: string,
  input: FaqInput,
  accessToken?: string | null
): Promise<FaqDto> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    throw new Error("API URL tanımlı değil");
  }

  const res = await httpRequest<BackendSss>(`/admin/sss/${id}`, {
    method: "PATCH",
    body: faqInputToSssBody(input),
    accessToken: accessToken ?? undefined,
  });
  return mapSssToFaq(res.data);
}

/**
 * Deletes an SSS entry.
 */
export async function deleteFaq(
  id: string,
  accessToken?: string | null
): Promise<void> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) return;

  await httpRequest<null>(`/admin/sss/${id}`, {
    method: "DELETE",
    accessToken: accessToken ?? undefined,
  });
}
