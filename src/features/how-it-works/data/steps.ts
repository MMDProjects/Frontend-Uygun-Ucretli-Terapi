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
  linkHref: string;
  linkLabel: string;
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
    imageSrc: "/undraw_choose_5kz4 (1).svg",
    imageAlt: "Uzman arama ve seçim sürecini temsil eden görsel",
    linkHref: "/uzmanlar",
    linkLabel: "Uzmanları gör",
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
    imageSrc: "/undraw_user-account_fvqa (1).svg",
    imageAlt: "Hesap oluşturma ve güvenli girişi temsil eden görsel",
    linkHref: "/kayit",
    linkLabel: "Hesap oluştur",
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
    imageSrc: "/undraw_online-meeting_qe61 (1).svg",
    imageAlt: "İletişim ve ön görüşme adımını temsil eden görsel",
    linkHref: "/iletisim",
    linkLabel: "İletişime geç",
  },
  {
    id: "packages",
    order: "04",
    title: "Paketleri incele",
    cardTagline: "Fiyatlar tek sayfada",
    summary: "Seans paketlerini ve güncel ücretleri Paketler’de gör.",
    detail:
      "Tüm paket adları, seans sayıları ve fiyatlar Paketler sayfasında listelenir. Admin güncellemeleri anında buraya yansır.",
    Icon: Package,
    imageSrc: "/undraw_questions_52ic (1).svg",
    imageAlt: "Paket ve planlama adımını temsil eden görsel",
    linkHref: "/paketler",
    linkLabel: "Paketleri gör",
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
    imageSrc: "/undraw_well-done_kqud.svg",
    imageAlt: "Sürece devam ve içerikleri temsil eden görsel",
    linkHref: "/testler",
    linkLabel: "Testlere başla",
  },
];
