import type {
  UzmanProfile,
  UzmanBlogPost,
  UzmanNotification,
  UzmanStats,
  AvailabilityCell,
  DayOfWeek,
  TimeSlot,
  UzmanDanisanRequest,
} from "@/types/domain";

export const MOCK_UZMAN_PROFILE: UzmanProfile = {
  id: "uzman-001",
  name: "Dr. Ayşe Kaya",
  title: "Klinik Psikolog",
  bio: "10 yılı aşkın deneyimim ile bireylerin zihinsel sağlıklarını güçlendirmelerine destek oluyorum. Anksiyete, depresyon ve ilişki sorunlarında uzmanlaşmış bir klinisyen olarak her danışanıma özgü, kanıta dayalı terapi yaklaşımları sunuyorum.",
  phone: "05321234567",
  keywords: ["Anksiyete", "Depresyon", "İlişki Terapisi", "CBT"],
  rating: 4.8,
  priorityScore: 85,
  status: "yayinda",
};

export const MOCK_UZMAN_STATS: UzmanStats = {
  totalRequests: 47,
  pendingRequests: 3,
  rating: 4.8,
  reviewCount: 28,
};

export const MOCK_DANISAN_REQUESTS: UzmanDanisanRequest[] = [
  {
    id: "req-001",
    danisanName: "Mehmet Y.",
    message:
      "Merhaba, uzun süredir yaşadığım kaygı sorunları için yardım almak istiyorum. Özellikle iş ortamında yoğun stres yaşıyorum.",
    dateLabel: "28 Nisan 2026",
    status: "Beklemede",
    email: "mehmet.y@email.com",
  },
  {
    id: "req-002",
    danisanName: "Zeynep A.",
    message:
      "İlişki sorunlarım nedeniyle destek almak istiyorum. Partnerimle iletişim kurmakta güçlük çekiyoruz.",
    dateLabel: "26 Nisan 2026",
    status: "Yanıtlandı",
    email: "zeynep.a@email.com",
  },
  {
    id: "req-003",
    danisanName: "Ali K.",
    message: "Uyku sorunlarım ve genel bunaltı hissi için görüşmek istiyorum.",
    dateLabel: "24 Nisan 2026",
    status: "Tamamlandı",
    email: "ali.k@email.com",
  },
  {
    id: "req-004",
    danisanName: "Selin D.",
    message:
      "Sosyal anksiyete ile başa çıkma konusunda destek almak istiyorum. Topluluk önünde konuşmak beni çok gergin ediyor.",
    dateLabel: "22 Nisan 2026",
    status: "Beklemede",
    email: "selin.d@email.com",
  },
];

export const MOCK_BLOG_POSTS: UzmanBlogPost[] = [
  {
    id: "blog-001",
    title: "Anksiyete ile Başa Çıkmanın 5 Etkili Yolu",
    excerpt:
      "Günlük yaşamda anksiyeteyi yönetmek için kanıta dayalı stratejiler ve pratik öneriler.",
    status: "yayinda",
    createdAt: "15 Mart 2026",
    updatedAt: "15 Mart 2026",
  },
  {
    id: "blog-002",
    title: "İlişkilerde Sağlıklı İletişim Kurma",
    excerpt:
      "Çiftlerin birbirleriyle daha sağlıklı iletişim kurmasına yardımcı olacak pratik teknikler.",
    status: "incelemede",
    createdAt: "20 Nisan 2026",
    updatedAt: "20 Nisan 2026",
  },
  {
    id: "blog-003",
    title: "Depresyon Hakkında Bilinmesi Gerekenler",
    excerpt: "Depresyon belirtileri, tedavi yöntemleri ve destek arama süreci hakkında kapsamlı bir rehber.",
    status: "reddedildi",
    adminNote: "Makale başlığı ve içerik arasında uyumsuzluk var. Lütfen içeriği gözden geçirin.",
    createdAt: "10 Nisan 2026",
    updatedAt: "18 Nisan 2026",
  },
  {
    id: "blog-004",
    title: "Mindfulness Meditasyonu: Başlangıç Rehberi",
    excerpt:
      "Günlük hayatınıza mindfulness uygulamalarını nasıl entegre edebileceğinizi öğrenin.",
    status: "taslak",
    createdAt: "28 Nisan 2026",
    updatedAt: "28 Nisan 2026",
  },
];

export const MOCK_NOTIFICATIONS: UzmanNotification[] = [
  {
    id: "notif-001",
    message:
      "Profiliniz admin tarafından inceleniyor. En kısa sürede geri dönüş yapılacaktır.",
    isRead: false,
    createdAt: "29 Nisan 2026",
    type: "sistem",
  },
  {
    id: "notif-002",
    message:
      'Blog yazınız "Depresyon Hakkında Bilinmesi Gerekenler" reddedildi. Lütfen admin notunu inceleyin.',
    isRead: false,
    createdAt: "27 Nisan 2026",
    type: "blog_reddedildi",
  },
  {
    id: "notif-003",
    message:
      "Yeni bir danışan talep formu doldurmaya çalıştı ancak tamamlayamadı. Lütfen profil bilgilerinizi güncelleyin.",
    isRead: true,
    createdAt: "25 Nisan 2026",
    type: "admin_message",
  },
];

const DAYS: DayOfWeek[] = [
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
  "Pazar",
];
const SLOTS: TimeSlot[] = ["Sabah", "Öğleden Sonra", "Akşam"];

export const MOCK_AVAILABILITY: AvailabilityCell[] = DAYS.flatMap((day) =>
  SLOTS.map((slot) => ({
    day,
    slot,
    available:
      day !== "Cumartesi" &&
      day !== "Pazar" &&
      slot !== "Akşam",
    adminLocked: day === "Çarşamba" && slot === "Öğleden Sonra",
  }))
);

export const ADMIN_KEYWORD_LIST = [
  "Anksiyete",
  "Depresyon",
  "İlişki Terapisi",
  "CBT",
  "Travma",
  "EMDR",
  "Aile Terapisi",
  "Çocuk Psikolojisi",
  "Ergen Psikolojisi",
  "Bağımlılık",
  "Yeme Bozuklukları",
  "Yas Danışmanlığı",
  "Kariyer Danışmanlığı",
  "Stres Yönetimi",
  "Mindfulness",
  "OKB",
  "Fobiler",
  "Öfke Yönetimi",
  "Uyku Sorunları",
  "Cinsel Terapi",
];
