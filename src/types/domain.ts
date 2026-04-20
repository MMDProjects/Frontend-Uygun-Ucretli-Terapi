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
};

export type PackagePlan = {
  name: string;
  sessionCount: number;
  description: string;
  priceLabel: string;
};

export type BlogPostPreview = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  dateLabel: string;
  authorName: string;
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
