import { apiFetch } from "@/lib/api";
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
    case "TESTLER":   return "testler";
    case "PAKETLER":  return "paketler";
    case "RANDEVU":   return "randevu";
    case "ODEME":     return "odeme";
    case "UZMAN":     return "uzman";
    case "GIZLILIK":  return "gizlilik";
    default:          return "genel";
  }
}

function categoryToPage(category: string): string {
  switch (category.toLowerCase()) {
    case "testler":   return "TESTLER";
    case "paketler":  return "PAKETLER";
    case "randevu":   return "RANDEVU";
    case "odeme":     return "ODEME";
    case "uzman":     return "UZMAN";
    case "gizlilik":  return "GIZLILIK";
    default:          return "GENEL";
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

  const data = await apiFetch<BackendSss[]>("/admin/sss", {
    token: accessToken,
  });
  const items = Array.isArray(data) ? data : [];
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

  const data = await apiFetch<BackendSss>("/admin/sss", {
    method: "POST",
    body: faqInputToSssBody(input),
    token: accessToken,
  });
  return mapSssToFaq(data);
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

  const data = await apiFetch<BackendSss>(`/admin/sss/${id}`, {
    method: "PATCH",
    body: faqInputToSssBody(input),
    token: accessToken,
  });
  return mapSssToFaq(data);
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

  await apiFetch<unknown>(`/admin/sss/${id}`, {
    method: "DELETE",
    token: accessToken,
  });
}
