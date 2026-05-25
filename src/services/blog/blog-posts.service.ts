import type { BlogPostDto } from "@/types/dto/blog-post";

export const MOCK_BLOG_POSTS: BlogPostDto[] = [
  {
    id: "BL-101",
    title: "Sınav Kaygısı ile Baş Etme Teknikleri",
    excerpt:
      "Sınav dönemlerinde kaygıyı yönetmek için nefes egzersizi, çalışma planı ve uyku düzeni kritik rol oynar.",
    content:
      "Sınav kaygısı, performansı doğrudan etkileyen bir süreçtir. İlk adım, kaygının normal olduğunu kabul etmektir. Ardından nefes egzersizleri ile bedensel tepkileri dengelemek, günlük kısa tekrar planları yapmak ve uyku saatlerini sabitlemek gerekir. Gerektiğinde profesyonel destek almak süreci hızlandırır.",
    expertName: "Uzm. Psk. Esra Demir",
    publishedAt: "2026-03-10",
    status: "published",
  },
  {
    id: "BL-102",
    title: "Ergenlerde Dijital Denge Nasıl Kurulur?",
    excerpt:
      "Aile içi dijital sınırlar, ortak kullanım kuralları ve model olma davranışı ergenlerde dengeyi destekler.",
    content:
      "Ergenlerde dijital denge için yasaklayıcı değil, anlaşılır kurallar belirlemek gerekir. Ekran süresi, içerik türü ve cihazsız saatler birlikte planlanmalıdır. Ebeveynlerin kendi dijital davranışları da doğrudan örnek oluşturur. Düzenli geri bildirim toplantıları ile kurallar gözden geçirilmelidir.",
    expertName: "Klinik Psk. Deniz Yalçın",
    publishedAt: "2026-03-21",
    status: "published",
  },
  {
    id: "BL-103",
    title: "İş Yerinde Tükenmişlik Belirtileri",
    excerpt:
      "Duygusal yorgunluk, motivasyon kaybı ve dikkat dağınıklığı tükenmişliğin en sık görülen erken işaretleridir.",
    content:
      "Tükenmişlik, uzun süreli stresin birikimiyle gelişir. Belirtiler erken fark edildiğinde mola planı, görev paylaşımı ve psikolojik danışmanlık desteği ile süreç yönetilebilir. Kurumsal düzeyde ise iş yükü dengelemesi, net rol tanımları ve düzenli geri bildirim kültürü koruyucu etki sağlar.",
    expertName: "Uzm. Psk. Burak Arı",
    publishedAt: "2026-04-02",
    status: "published",
  },
];

/**
 * Lists expert-authored blog posts for admin UI.
 * TODO: Replace mock with backend endpoint when contract is finalized.
 */
export async function listBlogPosts(): Promise<BlogPostDto[]> {
  return Promise.resolve(MOCK_BLOG_POSTS);
}
