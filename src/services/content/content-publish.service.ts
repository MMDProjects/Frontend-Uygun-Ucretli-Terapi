import type { ContentPublishPayload } from "@/types/dto/content-publish";

export type ContentPublishResult = {
  success: boolean;
  data: { id: string } | null;
  message: string;
};

/**
 * Placeholder until Supabase/API contract exists.
 */
export async function submitContentPublish(
  payload: ContentPublishPayload
): Promise<ContentPublishResult> {
  void payload;
  await new Promise((r) => setTimeout(r, 450));
  return {
    success: true,
    data: { id: `mock-${Date.now()}` },
    message: "İçerik yayın talebi alındı (mock).",
  };
}
