export type NavItem = {
  href: string;
  label: string;
};

export type Expert = {
  slug: string;
  name: string;
  title: string;
  bio: string;
  rating: number;
  tags: string[];
  /** Profil fotoğrafı; yoksa kartta baş harf placeholder kullanılır. */
  photoUrl?: string;
  /** Uzmana özel fiyat; null ise global platform fiyatı kullanılır. */
  standardPrice?: number | null;
  discountedPrice?: number | null;
};

export type PackagePlan = {
  name: string;
  sessionCount: number;
  description: string;
  priceLabel: string;
  perSessionLabel?: string;
  features: string[];
  highlighted?: boolean;
};

export type BlogPostPreview = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  dateLabel: string;
  authorName: string;
  imageSrc?: string;
};

export type TestPreview = {
  slug: string;
  title: string;
  description: string;
  durationMinutes: number;
};

export type Testimonial = {
  id: string;
  name: string;
  quote: string;
  imageSrc: string;
  imageAlt: string;
};

export type HomeFaqItem = {
  question: string;
  answer: string;
};

export type TestResultLevel = "Düşük" | "Orta" | "Yüksek";

export type TestResult = {
  id: string;
  slug: string;
  title: string;
  dateLabel: string;
  score: number;
  level: TestResultLevel;
  recommendation: string;
};

export type ExpertRequestStatus = "Beklemede" | "Yanıtlandı" | "Tamamlandı" | "Reddedildi";

export type ExpertRequest = {
  id: string;
  expertName: string;
  expertTitle: string;
  expertSlug: string;
  dateLabel: string;
  status: ExpertRequestStatus;
  message: string;
};

// ─── Uzman Panel Types ────────────────────────────────────────────────────────

export type UzmanProfileStatus = "taslak" | "onay_bekliyor" | "yayinda" | "pasif";

export type UzmanProfile = {
  id: string;
  name: string;
  title: string;
  bio: string;
  photoUrl?: string;
  phone: string;
  keywords: string[];
  rating: number;
  priorityScore: number;
  status: UzmanProfileStatus;
  adminNote?: string;
};

export type UzmanBlogStatus =
  | "taslak"
  | "incelemede"
  | "yayinda"
  | "reddedildi"
  | "revize_gonderildi";

export type UzmanBlogPost = {
  id: string;
  title: string;
  excerpt: string;
  status: UzmanBlogStatus;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
};

export type UzmanNotificationType =
  | "admin_message"
  | "profil_reddedildi"
  | "blog_reddedildi"
  | "sistem"
  | "danger_panic";

export type UzmanNotification = {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type: UzmanNotificationType;
};

export type UzmanStats = {
  totalRequests: number;
  pendingRequests: number;
  rating: number;
  reviewCount: number;
};

export type DayOfWeek =
  | "Pazartesi"
  | "Salı"
  | "Çarşamba"
  | "Perşembe"
  | "Cuma"
  | "Cumartesi"
  | "Pazar";

export type TimeSlot = string;

export type AvailabilityCell = {
  id?: string;
  day: DayOfWeek;
  slot: TimeSlot;
  available: boolean;
  adminLocked: boolean;
};

export type UzmanDanisanRequest = {
  id: string;
  danisanName: string;
  message: string;
  dateLabel: string;
  status: ExpertRequestStatus;
  phone?: string;
  email?: string;
};
