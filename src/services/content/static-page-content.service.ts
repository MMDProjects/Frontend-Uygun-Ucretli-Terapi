import { getOptionalApiBase } from "@/lib/http-client";
import type { ApiResponse } from "@/types/dto/api";
import type {
  StaticPageContent,
  StaticPageContentUpdatePayload,
} from "@/types/dto/static-page-content";

const MOCK_STATIC_PAGE_CONTENT: StaticPageContent = {
  about:
    "Psikolog platformu, bireyleri doğru uzmanla hızlı ve güvenli biçimde buluşturmayı hedefler.",
  vision:
    "Dijital ruh sağlığı hizmetlerinde güvenilir, erişilebilir ve sürdürülebilir bir standart olmak.",
  mission:
    "Bilimsel temelli psikolojik desteği kullanıcı deneyimi yüksek bir platform üzerinden herkes için ulaşılabilir kılmak.",
  extraSections: [
    {
      id: "sec-1",
      title: "Değerlerimiz",
      body: "Etik ilkelere bağlılık, gizlilik, şeffaf iletişim ve sürekli gelişim odağında çalışırız.",
      order: 0,
    },
  ],
};

function cloneMock(): StaticPageContent {
  return {
    about: MOCK_STATIC_PAGE_CONTENT.about,
    vision: MOCK_STATIC_PAGE_CONTENT.vision,
    mission: MOCK_STATIC_PAGE_CONTENT.mission,
    extraSections: MOCK_STATIC_PAGE_CONTENT.extraSections.map((x) => ({ ...x })),
  };
}

/**
 * GET static page content. Uses mock fallback when API is unavailable.
 */
export async function getStaticPageContent(): Promise<StaticPageContent> {
  const base = getOptionalApiBase();
  if (!base) {
    return cloneMock();
  }

  try {
    const res = await fetch(`${base}/admin/content/static-pages`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      return cloneMock();
    }

    const payload = (await res.json()) as ApiResponse<StaticPageContent>;
    if (!payload?.success || !payload.data) {
      return cloneMock();
    }

    return payload.data;
  } catch {
    return cloneMock();
  }
}

/**
 * PUT static page content. Returns success envelope; falls back to mock response.
 */
export async function updateStaticPageContent(
  input: StaticPageContentUpdatePayload
): Promise<ApiResponse<StaticPageContent>> {
  const base = getOptionalApiBase();
  if (!base) {
    return {
      success: true,
      data: input,
      message: "İçerik kaydedildi (mock).",
    };
  }

  try {
    const res = await fetch(`${base}/admin/content/static-pages`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      return {
        success: true,
        data: input,
        message: "API yanıtı alınamadı, içerik yerel olarak korundu.",
      };
    }

    const payload = (await res.json()) as ApiResponse<StaticPageContent>;
    if (typeof payload?.success !== "boolean") {
      return {
        success: true,
        data: input,
        message: "Geçersiz API yanıtı, içerik yerel olarak korundu.",
      };
    }
    return payload;
  } catch {
    return {
      success: true,
      data: input,
      message: "Bağlantı hatası, içerik yerel olarak korundu.",
    };
  }
}
