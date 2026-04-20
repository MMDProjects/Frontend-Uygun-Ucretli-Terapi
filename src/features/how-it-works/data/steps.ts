import type { LucideIcon } from "lucide-react";
import {
  ClipboardList,
  MessageCircle,
  Package,
  Search,
  UserRound,
} from "lucide-react";

export type HowItWorksStep = {
  id: string;
  order: string;
  title: string;
  cardTagline: string;
  summary: string;
  detail: string;
  Icon: LucideIcon;
  /** Adım kartı görseli (next/image — remotePatterns ile uyumlu URL) */
  imageSrc: string;
  imageAlt: string;
};

export const HOW_IT_WORKS_STEPS: readonly HowItWorksStep[] = [
  {
    id: "browse",
    order: "01",
    title: "Uzmanını seç",
    cardTagline: "Filtrele, karşılaştır, profili incele",
    summary: "Onaylı profiller ve şeffaf belgelerle güvenle gez.",
    detail:
      "Uzmanlar sayfasında alan, anahtar kelime ve puanlara göre arama yap. Profilde tanıtım metnini, sertifika ve CV PDF’lerini ve onaylı yorumları okuyarak sana en uygun uzmanı belirle.",
    Icon: Search,
    imageSrc:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Uzman arama ve seçim sürecini temsil eden görsel",
  },
  {
    id: "account",
    order: "02",
    title: "Hesabını oluştur",
    cardTagline: "Kayıt veya giriş — tek akış",
    summary: "Talep ve kişisel içerikler için hesabını hazırla.",
    detail:
      "Danışan kaydıyla ad, iletişim ve KVKK onayını tamamla. Zaten üyeysen giriş yap; anonim olarak da listeyi ve blogu incelemeye devam edebilirsin.",
    Icon: UserRound,
    imageSrc:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Hesap oluşturma ve güvenli girişi temsil eden görsel",
  },
  {
    id: "contact",
    order: "03",
    title: "Ön görüşme veya talep",
    cardTagline: "WhatsApp veya talep formu",
    summary: "Ücretsiz ön görüşmeyi başlat veya talep gönder.",
    detail:
      "Uzman profilinde Canlı Destek ile WhatsApp üzerinden ücretsiz ön görüşmeyi başlatabilir veya giriş yaptıysan talep formunu doldurarak iletişim talebini iletebilirsin.",
    Icon: MessageCircle,
    imageSrc:
      "https://images.unsplash.com/photo-1516321318423-f751f576d41f?auto=format&fit=crop&w=800&q=80",
    imageAlt: "İletişim ve ön görüşme adımını temsil eden görsel",
  },
  {
    id: "packages",
    order: "04",
    title: "Paketleri incele",
    cardTagline: "Fiyatlar tek sayfada",
    summary: "Seans paketlerini ve güncel ücretleri Paketler’de gör.",
    detail:
      "Uzman kartında fiyat gösterilmez; tüm paket adları, seans sayıları ve fiyatlar yalnızca Paketler sayfasında listelenir. Admin güncellemeleri anında buraya yansır.",
    Icon: Package,
    imageSrc:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Paket ve planlama adımını temsil eden görsel",
  },
  {
    id: "journey",
    order: "05",
    title: "Sürece devam et",
    cardTagline: "Testler ve içerikler",
    summary: "Destek sürecini testler ve blogla destekle.",
    detail:
      "Giriş yaptıysan test sonuçların arşivlenir; ana sayfalarda sana özel CTA’lar görünür. Blog ve SSS ile bilgilendirilmeye devam edebilirsin.",
    Icon: ClipboardList,
    imageSrc:
      "https://images.unsplash.com/photo-1494390248081-4cd9749c948e?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Sürece devam ve içerikleri temsil eden görsel",
  },
];
