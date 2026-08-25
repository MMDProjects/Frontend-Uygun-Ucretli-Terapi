import type { ContentPublishPayload } from "@/types/dto/content-publish";

export type ContentPublishResult = {
  success: boolean;
  data: { id: string } | null;
  message: string;
};

/**
 * Gecici mock: backend tarafinda icerik yayin endpointi tanimlanana kadar
 * bu servis sahte yanit doner. Gercek API sozlesmesi geldiginde degistirilecek.
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
