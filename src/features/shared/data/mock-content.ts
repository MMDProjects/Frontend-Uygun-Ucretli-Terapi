import type {
  BlogPostPreview,
  Expert,
  HomeFaqItem,
  PackagePlan,
  Testimonial,
  TestPreview,
} from "@/types/domain";

/**
 * Ana sayfa ve liste ekranlarında kullanılan örnek uzmanlar.
 * API entegrasyonunda liste admin öncelik skoru ve yayın durumuna göre beslenir.
 */
export const featuredExperts: Expert[] = [
  {
    slug: "ayse-demir",
    name: "Uzm. Psk. Ayşe Demir",
    title: "Yetişkin Danışmanı",
    bio: "Kaygı, stres yönetimi ve ilişki problemleri alanında online danışmanlık sunar. Seanslarda duygularınızı adlandırmanıza, tetikleyicileri fark etmenize ve günlük hayatta uygulanabilir beceriler geliştirmenize odaklanırım. Kısa süreli hedeflerle başlayıp ihtiyaç halinde derinleşen bir tempo öneririm; süreç boyunca gizlilik ve sınırlarınıza saygı önceliğimdir. Randevu dışında önerdiğim alıştırmalar, nefes ve beden farkındalığı çalışmalarıyla desteklenir. Kendinizi güvende hissettiğiniz bir ortamda, değişimi sürdürülebilir kılmayı hedefleriz.",
    rating: 4.9,
    tags: ["Kaygı", "Stres", "İlişkiler"],
    photoUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&auto=format&q=80",
  },
  {
    slug: "mehmet-kaya",
    name: "Psk. Dan. Mehmet Kaya",
    title: "Aile ve Çift Danışmanı",
    bio: "Çift terapisi, iletişim problemleri ve aile içi denge konularında destek veririm. Çatışmaları suçlayıcı olmadan ele alır; her iki tarafın da ihtiyaç ve beklentilerini duyurabileceği bir çerçeve kurarım. Ortak dil geliştirme, sınır koyma ve yakınlığı yeniden inşa etme üzerine pratik adımlar planlarız. Gerekirse aile üyeleriyle sınırlı oturumlar önererek sistemin tamamına bakarız. Online görüşmelerde görüntülü bağlantı ve güvenli paylaşım kurallarıyla süreci net ve öngörülebilir tutarım.",
    rating: 4.8,
    tags: ["Çift", "Aile", "İletişim"],
    photoUrl:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&auto=format&q=80",
  },
  {
    slug: "elif-arslan",
    name: "Klinik Psk. Elif Arslan",
    title: "Ergen Danışmanı",
    bio: "Ergenlik dönemi duygusal süreçleri ve sınav kaygısı odaklı çalışırım. Gençlerin kendi hızında ifade bulmasına alan açar; ebeveynlerle koordinasyon gerektiğinde şeffaf ve yaş uygunu bir iletişim modeli öneririm. Akademik baskı, arkadaşlık ilişkileri ve özgüven konularında kısa hedeflerle ilerleriz. Motivasyonu korumak için küçük kazanımları görünür kılan yöntemler kullanırım. Güvenli bir dijital ortamda, gizlilik ilkeleriyle ergen danışanların haklarını ön planda tutarım.",
    rating: 4.7,
    tags: ["Ergen", "Sınav kaygısı", "Özgüven"],
    photoUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&auto=format&q=80",
  },
  {
    slug: "can-ozturk",
    name: "Psk. Dan. Can Öztürk",
    title: "Travma ve Kayıp",
    bio: "Yas süreci, travma sonrası iyileşme ve duygusal düzenleme üzerine çalışırım. Yaşanan kaybın veya olayın anlamlandırılmasında acele etmeden, beden ve duygu tepkilerine saygı duyarım. Mindfulness ve nefes çalışmalarıyla düzenlenmeyi destekler; ihtiyaç halinde güvenlik ve stabilizasyon adımlarıyla başlarız. Terapi ilişkisinde öngörülebilir bir ritim ve net sınırlar sunarım. Uzun vadede, yaşamınıza yeniden bağlanmanız için küçük ama tutarlı adımlar planlarız.",
    rating: 4.85,
    tags: ["Yas", "Travma", "Mindfulness"],
    photoUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&auto=format&q=80",
  },
];

/** Ana sayfadaki “önerilen uzmanlar” alanı — en fazla dört kart. */
export const recommendedHomeExperts: Expert[] = featuredExperts.slice(0, 4);

export const packagePlans: PackagePlan[] = [
  {
    name: "Başlangıç Paketi",
    sessionCount: 1,
    description:
      "İlk değerlendirme ve süreç ihtiyacını netleştirmek için giriş paketi.",
    priceLabel: "Yakında",
  },
  {
    name: "Denge Paketi",
    sessionCount: 4,
    description: "Kısa dönem destek ve düzenli takip ihtiyacı olan danışanlar için.",
    priceLabel: "Yakında",
  },
  {
    name: "Gelişim Paketi",
    sessionCount: 8,
    description: "Hedef odaklı ve daha derin bir sürece başlamak isteyenler için.",
    priceLabel: "Yakında",
  },
  {
    name: "Süreklilik Paketi",
    sessionCount: 12,
    description:
      "Uzun süreli takip ve kalıcı davranış değişimi hedefleyen yapılar için.",
    priceLabel: "Yakında",
  },
  {
    name: "Derinleşme Paketi",
    sessionCount: 20,
    description:
      "Daha kapsamlı destek planı isteyen danışanlar için esnek paket yapısı.",
    priceLabel: "Yakında",
  },
];

export const blogPostsPreview: BlogPostPreview[] = [
  {
    slug: "anksiyete-ile-basa-cikma",
    title: "Anksiyete ile başa çıkma yolları",
    excerpt:
      "Günlük hayatta kaygıyı yönetmeye yardımcı bilinçli nefes ve düşünce alıştırmaları.",
    category: "Psikoloji",
    dateLabel: "12 Mart 2026",
    authorName: "Uzm. Psk. Ayşe Demir",
  },
  {
    slug: "iletisimde-sinir-koymak",
    title: "İletişimde sınır koymak",
    excerpt:
      "Sağlıklı ilişkiler için “hayır” demeyi ve ihtiyaçlarını net ifade etmeyi anlatıyoruz.",
    category: "İlişkiler",
    dateLabel: "5 Mart 2026",
    authorName: "Psk. Dan. Mehmet Kaya",
  },
  {
    slug: "uyku-hijyeni-ipuclari",
    title: "Uyku hijyeni: 6 pratik ipucu",
    excerpt:
      "Düzenli uyku rutini, ekran süresi ve ortam düzenlemesiyle daha iyi dinlenme.",
    category: "Yaşam",
    dateLabel: "28 Şubat 2026",
    authorName: "Klinik Psk. Elif Arslan",
  },
];

export const homeTestimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Selin K.",
    quote:
      "Uzman eşleştirmesi netti; ilk görüşmede güvende hissettim. Online süreç benim için çok daha sürdürülebilir oldu.",
    imageSrc: "/images/testimonial-avatar.svg",
    imageAlt: "Selin K. profil görseli",
  },
  {
    id: "t2",
    name: "Burak T.",
    quote:
      "Talep formu ve iletişim akışı sade. Yoğun iş temposunda randevuya uyum sağlamak kolaylaştı.",
    imageSrc: "/images/testimonial-avatar.svg",
    imageAlt: "Burak T. profil görseli",
  },
  {
    id: "t3",
    name: "Elif M.",
    quote:
      "Testler sayesinde kendimi daha iyi tarif edebildim; uzmanla görüşmede ortak bir dil kurduk.",
    imageSrc: "/images/testimonial-avatar.svg",
    imageAlt: "Elif M. profil görseli",
  },
  {
    id: "t4",
    name: "Can D.",
    quote:
      "Gizlilik ve KVKK konusundaki şeffaflık güvenimi artırdı. Destek almak için doğru adres olduğunu düşünüyorum.",
    imageSrc: "/images/testimonial-avatar.svg",
    imageAlt: "Can D. profil görseli",
  },
];

export const homeFaqItems: HomeFaqItem[] = [
  {
    question: "Seanslar nasıl yapılıyor?",
    answer:
      "Tüm görüşmeler çevrimiçi ve güvenli bağlantı üzerinden gerçekleştirilir. Uzmanınızla uygun zamanı birlikte planlarsınız; süreç boyunca iletişim kanalları net şekilde paylaşılır.",
  },
  {
    question: "Ücretler nerede listeleniyor?",
    answer:
      "Fiyatlar yalnızca paketler sayfasında gösterilir; uzman kartlarında veya profil sayfalarında fiyat alanı bulunmaz. Böylece kararınızı önce uygunluk ve alan uyumu üzerinden verebilirsiniz.",
  },
  {
    question: "Anonim ziyaretçi ne yapabilir?",
    answer:
      "Kurumsal sayfaları, uzman listesini, blog ve testleri inceleyebilirsiniz. Talep gönderme ve kişisel sonuç arşivi gibi özellikler için hesap oluşturmanız gerekir.",
  },
  {
    question: "Test sonuçları saklanıyor mu?",
    answer:
      "Giriş yaptığınızda test sonuçlarınız hesabınızda görüntülenebilir. Verilerin işlenmesi KVKK kapsamında ve açık rıza süreçleriyle yönetilir.",
  },
  {
    question: "Kurumsal talepler için ayrı kanal var mı?",
    answer:
      "Evet. Şirket ve ekip desteği için kurumsal sayfasındaki formu kullanabilir; yetkili kişi ve iletişim bilgilerinizi iletebilirsiniz.",
  },
  {
    question: "Şifre sıfırlama nasıl çalışır?",
    answer:
      "Şifremi unuttum akışında e-posta adresinizi girersiniz; Brevo üzerinden gönderilen bağlantı ile şifrenizi yenilersiniz. Bağlantı süresi sınırlıdır.",
  },
];

export const testsPreview: TestPreview[] = [
  {
    slug: "kaygi-duzeyi",
    title: "Kaygı düzeyi öz değerlendirmesi",
    description:
      "Son iki haftadaki kaygı belirtilerinize göre genel bir özet puanı üretir.",
    durationMinutes: 5,
  },
  {
    slug: "stres-yonetimi",
    title: "Stres yönetimi tarama testi",
    description:
      "İş ve günlük yaşam stres kaynaklarınızı fark etmenize yardımcı kısa tarama.",
    durationMinutes: 7,
  },
  {
    slug: "ozguven-olcegi",
    title: "Özgüven envanteri",
    description:
      "Sosyal ve kişisel alanlardaki özgüven algınız hakkında yönlendirici bir özet sunar.",
    durationMinutes: 6,
  },
];
