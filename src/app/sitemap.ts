import type { MetadataRoute } from "next";

const BASE_URL = "https://yecamer.com.tr";

// Backend /experts en fazla limit=50 kabul ediyor (FilterExpertsDto @Max(50)),
// tanımsız sorgu parametrelerini de 400 ile reddediyor (forbidNonWhitelisted).
const PAGE_SIZE = 50;
// Sonsuz döngüye karşı üst sınır: 20 sayfa × 50 = 1000 kayıt.
const MAX_PAGES = 20;

const staticRoutes: MetadataRoute.Sitemap = [
  { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
  { url: `${BASE_URL}/uzmanlar`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
  { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
  { url: `${BASE_URL}/paketler`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  { url: `${BASE_URL}/testler`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
  { url: `${BASE_URL}/hakkimizda`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE_URL}/nasil-calisir`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE_URL}/iletisim`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  { url: `${BASE_URL}/kurumsal`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  { url: `${BASE_URL}/sss`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  { url: `${BASE_URL}/uzman-basvurusu`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  { url: `${BASE_URL}/kvkk`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
];

/** Sayfalı bir public listeyi { data, total } bitene kadar çeker; hata olursa o ana kadar toplananı döner. */
async function fetchAllPages<T>(path: string): Promise<T[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
  if (!apiUrl) return [];

  const items: T[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    try {
      const res = await fetch(`${apiUrl}${path}?page=${page}&limit=${PAGE_SIZE}`, {
        next: { revalidate: 3600 },
      });
      if (!res.ok) break;
      const body: { data?: T[]; total?: number } = await res.json();
      const data = body.data ?? [];
      items.push(...data);
      if (data.length < PAGE_SIZE || (body.total !== undefined && items.length >= body.total)) break;
    } catch {
      break;
    }
  }
  return items;
}

async function getExpertSlugs(): Promise<string[]> {
  // /experts yalnızca yayındaki (isPublished) uzmanları döner.
  const experts = await fetchAllPages<{ slug?: string; id?: string }>("/experts");
  // Uzman profillerinde slug alanı yok; URL'ler id ile kurulu (bkz. ExpertCardApi)
  return experts.map((e) => e.slug ?? e.id).filter(Boolean) as string[];
}

async function getBlogPosts(): Promise<{ slug: string; createdAt?: string }[]> {
  // /blogs yalnızca YAYINDA statüsündeki yazıları döner.
  const posts = await fetchAllPages<{ slug?: string; createdAt?: string }>("/blogs");
  return posts.filter((p): p is { slug: string; createdAt?: string } => Boolean(p.slug));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [expertSlugs, blogPosts] = await Promise.all([
    getExpertSlugs(),
    getBlogPosts(),
  ]);

  const expertRoutes: MetadataRoute.Sitemap = expertSlugs.map((slug) => ({
    url: `${BASE_URL}/uzmanlar/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.createdAt ? new Date(post.createdAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...expertRoutes, ...blogRoutes];
}
