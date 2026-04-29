import type {
  BlogPostPreview,
  Expert,
  ExpertRequest,
  HomeFaqItem,
  PackagePlan,
  Testimonial,
  TestPreview,
  TestResult,
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
  {
    slug: "zeynep-karaca",
    name: "Uzm. Psk. Zeynep Karaca",
    title: "Kaygı ve Panik",
    bio: "Panik belirtileri, yoğun kaygı atakları ve kaçınma davranışları üzerine çalışırım. Danışanla birlikte tetikleyici döngüleri görünür kılar; bedensel belirtileri düzenlemeye yardımcı nefes ve dikkat teknikleri uygularım. Süreci küçük, ölçülebilir hedeflerle ilerletir; günlük hayata aktarılabilir uygulamalarla desteklerim. Online görüşmelerde güvenli alan ve net sınırlar benim için temel ilkedir.",
    rating: 4.82,
    tags: ["Kaygı", "Panik", "Duygu düzenleme"],
    photoUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&auto=format&q=80",
  },
  {
    slug: "murat-yildiz",
    name: "Klinik Psk. Murat Yıldız",
    title: "Depresyon ve Tükenmişlik",
    bio: "Depresif duygu durum, motivasyon kaybı ve tükenmişlik belirtileriyle çalışan danışanlara destek veririm. Günlük işlevselliği artıran davranış aktivasyonu planları ve düşünce farkındalığı teknikleri kullanırım. İlerlemeyi haftalık hedeflerle takip ederek süreci sürdürülebilir hale getiririz. Danışma sürecinde şefkatli ama yapılandırılmış bir yaklaşımı benimserim.",
    rating: 4.76,
    tags: ["Depresyon", "Tükenmişlik", "Motivasyon"],
    photoUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&auto=format&q=80",
  },
  {
    slug: "selin-yalcin",
    name: "Psk. Dan. Selin Yalçın",
    title: "İlişki ve Sınır Koyma",
    bio: "İlişkilerde iletişim tıkanıklıkları, sınır koyma güçlüğü ve tekrar eden çatışmalar üzerinde çalışırım. Danışanların ihtiyaçlarını net ifade etmesini, suçlayıcı olmayan iletişim dili geliştirmesini desteklerim. Seanslar arasında kısa alıştırmalarla yeni iletişim becerilerini günlük hayata taşımayı hedefleriz. Sürecin her adımında karşılıklı güven ve açıklık önceliğimdir.",
    rating: 4.88,
    tags: ["İlişki", "Sınır koyma", "İletişim"],
    photoUrl:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&auto=format&q=80",
  },
  {
    slug: "baris-akin",
    name: "Uzm. Psk. Barış Akın",
    title: "OKB ve Zorlayıcı Düşünceler",
    bio: "Takıntılı düşünceler, zihinsel tekrarlar ve kompulsif davranışlar konusunda danışanlara yapılandırılmış destek sunarım. Belirti döngüsünü anlamaya ve kaçınma örüntülerini azaltmaya odaklanan tekniklerle ilerleriz. Danışanın yaşam ritmine uygun, adım adım uygulanabilir planlar geliştiririm. Uzun vadede belirtileri yönetebilme becerisini güçlendirmeyi amaçlarım.",
    rating: 4.79,
    tags: ["OKB", "Takıntı", "Davranış planı"],
    photoUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&auto=format&q=80",
  },
  {
    slug: "ece-dogan",
    name: "Klinik Psk. Ece Doğan",
    title: "Travma Sonrası Destek",
    bio: "Travmatik yaşantı sonrası güven hissini yeniden kurma, tetikleyicileri düzenleme ve günlük yaşama dönme başlıklarında danışanları desteklerim. Seanslarda danışanın hızına saygı duyan, stabilizasyon odaklı bir çerçeve izlerim. Duygu ve beden farkındalığını artıran tekniklerle dayanıklılığı güçlendiririz. Süreci şeffaf, güvenli ve adım adım yapılandırırım.",
    rating: 4.91,
    tags: ["Travma", "Stabilizasyon", "Dayanıklılık"],
    photoUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&auto=format&q=80",
  },
  {
    slug: "gizem-unal",
    name: "Uzm. Psk. Gizem Ünal",
    title: "Sosyal Kaygı",
    bio: "Sosyal ortamlarda yoğun kaygı, performans baskısı ve kaçınma davranışları yaşayan danışanlarla çalışırım. Düşünce-bedensel tepki-davranış döngüsünü görünür hale getirerek daha işlevsel baş etme yolları geliştiririz. Kademeli maruz kalma ve öz-şefkat temelli pratiklerle süreci desteklerim. Amaç, günlük yaşamda daha rahat ve sürdürülebilir bir denge kurmaktır.",
    rating: 4.83,
    tags: ["Sosyal kaygı", "Özgüven", "Maruz kalma"],
    photoUrl:
      "https://images.unsplash.com/photo-1541534401786-2077eed87a72?w=400&h=400&fit=crop&auto=format&q=80",
  },
  {
    slug: "kerem-sahin",
    name: "Psk. Dan. Kerem Şahin",
    title: "Öfke ve Duygu Yönetimi",
    bio: "Yoğun öfke, dürtüsel tepkiler ve ilişki çatışmaları yaşayan danışanlara yapılandırılmış destek veririm. Tetikleyici durumları birlikte analiz ederek daha düzenleyici tepki repertuarı geliştirmeyi hedefleriz. Seans arası kısa egzersizlerle ilerlemeyi gündelik hayata taşırım. Süreçte güvenli iletişim ve sorumluluk dengesi temel yaklaşımımdır.",
    rating: 4.74,
    tags: ["Öfke", "Duygu yönetimi", "İlişki"],
    photoUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format&q=80",
  },
  {
    slug: "eda-kilic",
    name: "Klinik Psk. Eda Kılıç",
    title: "Yeme Davranışı",
    bio: "Duygusal yeme, beden algısı ve yeme düzeni zorluklarında danışanlarla bütüncül bir çerçevede çalışırım. Suçluluk döngülerini azaltmaya, farkındalığı artırmaya ve sürdürülebilir alışkanlıklar oluşturmaya odaklanırım. Gerektiğinde multidisipliner yönlendirme önererek süreci desteklerim. Danışanın temposuna uygun, yargılamayan bir yaklaşımı benimserim.",
    rating: 4.8,
    tags: ["Yeme davranışı", "Beden algısı", "Farkındalık"],
    photoUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&auto=format&q=80",
  },
  {
    slug: "onur-cevik",
    name: "Uzm. Psk. Onur Çevik",
    title: "Uyku ve Rutin",
    bio: "Uyku düzensizliği, gece kaygısı ve günlük ritim bozulmaları yaşayan danışanlarla çalışırım. Uyku hijyeni, davranışsal düzenleme ve stres azaltma tekniklerini birlikte planlarız. Amaç kısa sürede uygulanabilir bir rutin kurmak ve bunun sürdürülebilirliğini artırmaktır. Seanslar net hedefler ve düzenli takip ile ilerler.",
    rating: 4.77,
    tags: ["Uyku", "Rutin", "Stres"],
    photoUrl:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=400&h=400&fit=crop&auto=format&q=80",
  },
  {
    slug: "nazli-erdem",
    name: "Psk. Dan. Nazlı Erdem",
    title: "Ergen ve Aile İletişimi",
    bio: "Ergenlik dönemindeki iletişim çatışmaları ve sınır problemlerinde gençler ve ebeveynlerle destekleyici bir çerçevede çalışırım. Karşılıklı anlaşılmayı artıran pratik iletişim araçları ve ev içi yapılandırma önerileri sunarım. Süreci tarafların ihtiyaçlarını dengeleyen bir perspektifle yönetirim. Hedef daha sakin, açık ve güvenli bir aile iletişimidir.",
    rating: 4.86,
    tags: ["Ergen", "Aile", "İletişim"],
    photoUrl:
      "https://images.unsplash.com/photo-1542206395-9feb3edaa68d?w=400&h=400&fit=crop&auto=format&q=80",
  },
  {
    slug: "tuna-koc",
    name: "Klinik Psk. Tuna Koç",
    title: "İş Yaşamı ve Tükenmişlik",
    bio: "İş stresi, performans baskısı ve tükenmişlik yaşayan danışanlarla kaynak odaklı bir yol haritası oluştururum. Enerji yönetimi, sınır koyma ve önceliklendirme becerilerini güçlendirmeye odaklanırız. Kısa, uygulanabilir adımlarla iş-özel yaşam dengesini yeniden kurmayı hedeflerim. Sürecin izlenebilir ve ölçülebilir olmasına önem veririm.",
    rating: 4.81,
    tags: ["İş stresi", "Tükenmişlik", "Denge"],
    photoUrl:
      "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=400&h=400&fit=crop&auto=format&q=80",
  },
  {
    slug: "seda-gunes",
    name: "Uzm. Psk. Seda Güneş",
    title: "Kayıp ve Yas Süreci",
    bio: "Kayıp sonrası yoğun duygulanım, yalnızlık ve anlam arayışı yaşayan danışanlara eşlik ederim. Yasın dalgalı doğasına saygı duyan bir ritimde, güvenli ve şefkatli bir danışmanlık çerçevesi sunarım. Duygu düzenleme ve günlük yaşama geri bağlanmayı destekleyen küçük adımlarla ilerleriz. Süreç boyunca danışanın sınırları ve ihtiyaçları merkezdedir.",
    rating: 4.9,
    tags: ["Yas", "Kayıp", "Duygu düzenleme"],
    photoUrl:
      "https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=400&h=400&fit=crop&auto=format&q=80",
  },
];

/** Ana sayfadaki "önerilen uzmanlar" alanı — en fazla dört kart. */
export const recommendedHomeExperts: Expert[] = featuredExperts.slice(0, 4);

export const packagePlans: PackagePlan[] = [
  {
    name: "Başlangıç",
    sessionCount: 1,
    description: "İlk adımı atmak, ihtiyacını netleştirmek ve süreci tanımak isteyenler için.",
    priceLabel: "Yakında",
    features: [
      "1 online video seans (50 dk)",
      "Uzman eşleştirme",
      "KVKK uyumlu platform",
      "Güvenli şifreli bağlantı",
    ],
  },
  {
    name: "Denge",
    sessionCount: 4,
    description: "Kısa dönemli destek ve düzenli takip ihtiyacı olan danışanlar için.",
    priceLabel: "Yakında",
    features: [
      "4 online video seans (50 dk)",
      "Uzman eşleştirme",
      "Seans arası mesaj desteği",
      "KVKK uyumlu platform",
      "Güvenli şifreli bağlantı",
    ],
  },
  {
    name: "Gelişim",
    sessionCount: 8,
    description: "Hedef odaklı ve daha derin bir sürece başlamak isteyenler için ideal paket.",
    priceLabel: "Yakında",
    highlighted: true,
    features: [
      "8 online video seans (50 dk)",
      "Uzman eşleştirme",
      "Seans arası mesaj desteği",
      "Seans özeti ve notlar",
      "Psikolojik test erişimi",
      "KVKK uyumlu platform",
      "Güvenli şifreli bağlantı",
    ],
  },
  {
    name: "Süreklilik",
    sessionCount: 12,
    description: "Uzun süreli takip ve kalıcı davranış değişimi hedefleyen yapılar için.",
    priceLabel: "Yakında",
    features: [
      "12 online video seans (50 dk)",
      "Uzman eşleştirme",
      "Seans arası mesaj desteği",
      "Seans özeti ve notlar",
      "Psikolojik test erişimi",
      "Uzman değişikliği hakkı",
      "KVKK uyumlu platform",
      "Güvenli şifreli bağlantı",
    ],
  },
  {
    name: "Derinleşme",
    sessionCount: 20,
    description: "Kapsamlı ve esnek destek planı isteyen danışanlar için tam paket.",
    priceLabel: "Yakında",
    features: [
      "20 online video seans (50 dk)",
      "Uzman eşleştirme",
      "Seans arası mesaj desteği",
      "Seans özeti ve notlar",
      "Psikolojik test erişimi",
      "Uzman değişikliği hakkı",
      "Öncelikli randevu",
      "KVKK uyumlu platform",
      "Güvenli şifreli bağlantı",
    ],
  },
];

export const blogPostsPreview: BlogPostPreview[] = [
  {
    slug: "anksiyete-ile-basa-cikma",
    title: "Anksiyete ile başa çıkma yolları",
    excerpt:
      "Kaygı, günlük hayatın pek çok alanını sessizce etkileyen ancak doğru tekniklerle yönetilebilir bir durumdur. Bilinçli nefes egzersizleri bedenin stres tepkisini doğrudan yavaşlatır; düzenli pratikle panik eşiği belirgin biçimde yükselir. Düşünce kayıtları ise otomatik ve çarpıtılmış düşünce kalıplarını gün yüzüne çıkararak onları sorgulama fırsatı sunar. Aşamalı maruz kalma, kaçınılan durumları küçük adımlarla yeniden deneyimlemeyi mümkün kılar ve kaygının zamanla söndüğünü kanıtlar. Bu yazıda üç yöntemi de somut örneklerle açıklıyor, haftalık bir uygulama planı öneriyoruz.",
    category: "Psikoloji",
    dateLabel: "12 Mart 2026",
    authorName: "Uzm. Psk. Ayşe Demir",
    imageSrc:
      "https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=1200&h=800&fit=crop&auto=format&q=80",
  },
  {
    slug: "iletisimde-sinir-koymak",
    title: "İletişimde sınır koymak",
    excerpt:
      "Sağlıklı bir ilişkinin temeli, karşılıklı saygıya dayalı net sınırlardır. Hayır demek bencillik değil; kendi ihtiyaçlarına saygı göstermektir. Pek çok kişi, sınır koyduğunda sevilmeyeceğinden ya da ilişkiyi kaybedeceğinden korkar; oysa uzun vadede sınırsız ilişkiler daha fazla kırılganlık üretir. Pasif agresif iletişim, sınır koyamamanın en yaygın belirtilerinden biridir ve farkında olmadan ilişkiyi zehirler. Bu yazıda duygusal engelleri tanımayı, ihtiyaçlarınızı suçlayıcı olmadan ifade etmeyi ve hayır dedikten sonra gelen suçluluk duygusunu yönetmeyi adım adım ele alıyoruz.",
    category: "İlişkiler",
    dateLabel: "5 Mart 2026",
    authorName: "Psk. Dan. Mehmet Kaya",
    imageSrc:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=800&fit=crop&auto=format&q=80",
  },
  {
    slug: "uyku-hijyeni-ipuclari",
    title: "Uyku hijyeni: 6 pratik ipucu",
    excerpt:
      "Kaliteli uyku, zihinsel sağlığın en güçlü destekçilerinden biridir; yetersiz uyku kaygıyı, dikkat dağınıklığını ve duygusal tepkiselliği doğrudan artırır. Uyumadan en az bir saat önce ekran maruziyetini kesmek, melatonin salgısını düzenler ve uykuya dalma süresini kısaltır. Sabit uyku-uyanış saatleri biyolojik saati kalibre ederken, serin ve karanlık bir oda uyku derinliğini artırır. Kafein tüketimini öğleden sonra kesmek, yatmadan önce hafif bir germe rutini oluşturmak ve yatağı yalnızca uyku için kullanmak da bu süreçte kritik rol oynar. 6 bilimsel temelli ipucunu ve uygulamaya koymanın en kolay yolunu bu yazıda adım adım bulabilirsiniz.",
    category: "Yaşam",
    dateLabel: "28 Şubat 2026",
    authorName: "Klinik Psk. Elif Arslan",
    imageSrc:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=800&fit=crop&auto=format&q=80",
  },
  {
    slug: "sosyal-kaygida-ilk-adimlar",
    title: "Sosyal kaygıda ilk adımlar",
    excerpt:
      "Sosyal kaygı yalnızca utangaçlık değil; değerlendirilme korkusuyla tetiklenen, kişiyi sosyal ortamlardan uzaklaştıran ve zamanla izolasyona sürükleyen bir örüntüdür. Kaçınma davranışı kısa vadede rahatlama sağlasa da uzun vadede kaygıyı besler ve büyütür. Bilişsel yeniden yapılandırma, felaket senaryolarını sorgulamayı ve daha gerçekçi beklentiler geliştirmeyi sağlar. Aşamalı maruz kalma ise en az tehdit edici durumdan başlayarak sinir sistemini yeniden eğitir. Bu yazıda kendi hiyerarşinizi oluşturmanıza ve ilk güvenli adımı atmanıza yardımcı olacak bir rehber sunuyoruz.",
    category: "Kaygı",
    dateLabel: "20 Şubat 2026",
    authorName: "Uzm. Psk. Zeynep Karaca",
    imageSrc:
      "https://images.unsplash.com/photo-1499728603263-13726abce5fd?w=1200&h=800&fit=crop&auto=format&q=80",
  },
  {
    slug: "ciftlerde-saglikli-iletisim",
    title: "Çiftlerde sağlıklı iletişim rehberi",
    excerpt:
      "Çatışmaların kaçınılmaz olduğu çift ilişkilerinde belirleyici olan kavgaların içeriği değil, nasıl yürütüldüğüdür. Sen hep böylesin gibi genelleyici suçlamalar savunmacılığı tetikler ve gerçek sorunu görünmez kılar. Ben şunu hissediyorum dili ise duyguları sahiplenerek iletişimi açık tutar. Aktif dinleme, konuyu dağıtmadan kalma ve zaman aşımı tekniği, ısınan tartışmaları yönetilebilir hale getirir. Fiziksel yakınlığı ve ortak ritüelleri korumak da ilişki dokusunu onarır. Bu rehberde ihtiyaç odaklı iletişimin ilkelerini, çift egzersizlerini ve acil durum planını bulacaksınız.",
    category: "İlişkiler",
    dateLabel: "14 Şubat 2026",
    authorName: "Psk. Dan. Selin Yalçın",
    imageSrc:
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=1200&h=800&fit=crop&auto=format&q=80",
  },
  {
    slug: "ofke-yonetiminde-4-teknik",
    title: "Öfke yönetiminde 4 etkili teknik",
    excerpt:
      "Öfke, bastırılması ya da patlatılması gereken bir düşman değil; bir ihtiyacın ya da sınırın işaret fişeğidir. Tetikleyici anı erken fark etmek, bedenin uyarı sinyallerini okumayı gerektirir; kalp hızı artışı, çene kasılması veya göğüste sıkışma bunların başında gelir. Fizyolojik uyarılmayı düşürmek için zaman aşımı tekniği ve diyafram nefesi kritik öneme sahiptir. Dürtüsel tepkiyi ertelemek ise cevap vermeden önce on saniye beklemek kadar basit bir alışkanlıkla başlar. Dördüncü teknik olan bilişsel yeniden çerçeveleme, olayın anlamını sorgulatarak kronik öfke döngüsünü kırar. Bu yazıda her tekniği günlük yaşama nasıl entegre edeceğinizi somut senaryolarla gösteriyoruz.",
    category: "Duygu Düzenleme",
    dateLabel: "8 Şubat 2026",
    authorName: "Psk. Dan. Kerem Şahin",
    imageSrc:
      "https://images.unsplash.com/photo-1474418397713-7ede21d49118?w=1200&h=800&fit=crop&auto=format&q=80",
  },
  {
    slug: "is-stresi-ile-basa-cikmak",
    title: "İş stresi ile başa çıkma planı",
    excerpt:
      "Kronik iş stresi, verimlilik kaybının çok ötesinde; uyku bozukluğu, bağışıklık zayıflaması ve duygusal körelme gibi ciddi bedensel ve zihinsel sonuçlar doğurur. Tükenmişlik genellikle aniden gelmez; ilk sinyaller olan motivasyon düşüşü, sinizm ve yorgunluktan iyileşememe uzun süre görmezden gelinir. Görev önceliklendirme için Eisenhower matrisi gibi basit araçlar, acil-önemli karmaşasını çözer. Sınır koymak ise kötü performans değil; sürdürülebilir üretkenliğin temelidir. Mesai dışı bildirim kuralları, dijital detoks rutinleri ve yöneticiyle yapılan net beklenti konuşmaları bu sınırları somutlaştırır. Kendi tükenmişlik belirtilerinizi ve eylem planınızı bu yazıda bulabilirsiniz.",
    category: "Yaşam",
    dateLabel: "2 Şubat 2026",
    authorName: "Klinik Psk. Tuna Koç",
    imageSrc:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=800&fit=crop&auto=format&q=80",
  },
  {
    slug: "yas-surecinde-kendine-destek",
    title: "Yas sürecinde kendine destek",
    excerpt:
      "Yas, doğrusal bir süreç değildir; inkar, öfke, pazarlık, depresyon ve kabullenme evreleri farklı sıralarda, bazen aynı anda ve defalarca yaşanabilir. Acıyı geçmeye zorlamak ya da normalleştirme baskısına uymak, iyileşmeyi yavaşlatır; yas tutmaya izin vermek ise tam tersine onu hızlandırır. Destek almak zayıflık değil, en cesur adımdur. Günlük rutinlere küçük anlamlı unsurlar eklemek, bedeni ve zihni yeniden hayata bağlar. Anı ritüelleri, yazma pratikleri ve seçici sosyal temas da süreci destekleyen yöntemler arasındadır. Bu yazıda kendine şefkat göstermeyi ve günlük yaşamla yeniden bağ kurmayı kolaylaştıran somut adımları paylaşıyoruz.",
    category: "Travma",
    dateLabel: "27 Ocak 2026",
    authorName: "Uzm. Psk. Seda Güneş",
    imageSrc:
      "https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?w=1200&h=800&fit=crop&auto=format&q=80",
  },
  {
    slug: "ergenlikte-sinir-koyma",
    title: "Ergenlikte sınır koyma dengesi",
    excerpt:
      "Ergenlik döneminde sınır koymak; yasaklar listesi oluşturmak değil, güven inşa etmektir. Aşırı koruyucu ebeveyn tutumu özerklik gelişimini engeller; ilgisiz tutum ise genci yalnız bırakır. Her ikisi de uzun vadede güvensiz bağlanma biçimlerine zemin hazırlar. Etkili sınırlar tutarlı, öngörülebilir ve gerekçelendirilmiş olmalıdır; keyfi kurallar isyanı besler. Gencin sesini duyurmak, müzakere alanı tanımak ve sonuçları önceden netleştirmek bu dengeyi kurar. Dijital sınırlar, arkadaşlık özerkliği ve akademik baskı konularında spesifik örneklerle desteklenen pratik yaklaşımları bu yazıda bulabilirsiniz.",
    category: "Aile",
    dateLabel: "21 Ocak 2026",
    authorName: "Psk. Dan. Nazlı Erdem",
    imageSrc:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1200&h=800&fit=crop&auto=format&q=80",
  },
  {
    slug: "okb-dongusunu-anlamak",
    title: "OKB döngüsünü anlamak",
    excerpt:
      "Obsesif-kompulsif bozukluk, titizlik ya da düzene düşkünlük olarak küçümsenmemesi gereken, kişinin saatlerini tüketen ve gündelik işlevselliğini ciddi biçimde bozan bir örüntüdür. Takıntı tetiklendiğinde duyulan kaygı, kompulsiyonu neredeyse kaçınılmaz hissettirir; oysa kompulsiyon kaygıyı geçici olarak düşürüp döngüyü kalıcı biçimde güçlendirir. Maruz bırakma ve yanıt engelleme terapisi bu döngüyü tersine çeviren en kanıtlanmış yöntemdir. Tedavide adım adım hiyerarşi oluşturmak ve her adımda kaygıyı kompulsiyon olmadan tolere etmek kritiktir. Mükemmeliyetçilik, simetri takıntısı ve zarar obsesyonu gibi farklı OKB biçimlerini ve ilk terapötik adımı bu yazıda ele alıyoruz.",
    category: "Psikoloji",
    dateLabel: "15 Ocak 2026",
    authorName: "Uzm. Psk. Barış Akın",
    imageSrc:
      "https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=1200&h=800&fit=crop&auto=format&q=80",
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

export const mockTestResults: TestResult[] = [
  {
    id: "tr-1",
    slug: "kaygi-duzeyi",
    title: "Kaygı düzeyi öz değerlendirmesi",
    dateLabel: "24 Nisan 2026",
    score: 68,
    level: "Yüksek",
    recommendation: "Kaygı belirtileriniz yüksek. Bir uzmanla görüşmenizi öneririz.",
  },
  {
    id: "tr-2",
    slug: "stres-yonetimi",
    title: "Stres yönetimi tarama testi",
    dateLabel: "18 Nisan 2026",
    score: 44,
    level: "Orta",
    recommendation: "Orta düzey stres var. Düzenli takip önerilir.",
  },
  {
    id: "tr-3",
    slug: "uyku-kalitesi-hizli-test",
    title: "Uyku kalitesi hızlı testi",
    dateLabel: "10 Nisan 2026",
    score: 22,
    level: "Düşük",
    recommendation: "Uyku kaliteniz iyi görünüyor.",
  },
];

export const mockExpertRequests: ExpertRequest[] = [
  {
    id: "req-1",
    expertName: "Uzm. Psk. Ayşe Demir",
    expertTitle: "Yetişkin Danışmanı",
    expertSlug: "ayse-demir",
    dateLabel: "22 Nisan 2026",
    status: "Yanıtlandı",
    message: "Kaygı ve stres konusunda destek almak istiyorum.",
  },
  {
    id: "req-2",
    expertName: "Klinik Psk. Elif Arslan",
    expertTitle: "Ergen Danışmanı",
    expertSlug: "elif-arslan",
    dateLabel: "15 Nisan 2026",
    status: "Beklemede",
    message: "Sınav kaygısı için görüşme talep ediyorum.",
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
  {
    slug: "sosyal-kaygi-tarama",
    title: "Sosyal kaygı tarama testi",
    description:
      "Topluluk içinde yaşanan çekinme ve kaçınma düzeyini kısa sorularla değerlendirir.",
    durationMinutes: 6,
  },
  {
    slug: "duygu-duzenleme-profili",
    title: "Duygu düzenleme profili",
    description:
      "Zorlayıcı duygular karşısında kullandığınız baş etme yollarını görünür hale getirir.",
    durationMinutes: 8,
  },
  {
    slug: "ofke-kontrol-olcegi",
    title: "Öfke kontrol ölçeği",
    description:
      "Öfke tetikleyicileri ve tepki şiddeti hakkında yönlendirici bir risk profili üretir.",
    durationMinutes: 5,
  },
  {
    slug: "is-yuku-tukenmislik",
    title: "İş yükü ve tükenmişlik testi",
    description:
      "Çalışma temposunun zihinsel ve duygusal yorgunluk üzerindeki etkisini tarar.",
    durationMinutes: 7,
  },
  {
    slug: "uyku-kalitesi-hizli-test",
    title: "Uyku kalitesi hızlı testi",
    description:
      "Son dönemdeki uyku düzeninizin dinlenme ve odaklanma üzerindeki etkisini ölçer.",
    durationMinutes: 4,
  },
  {
    slug: "iliski-iletisim-analizi",
    title: "İlişki iletişim analizi",
    description:
      "Partner veya yakın çevre iletişiminde tekrar eden çatışma örüntülerini tespit eder.",
    durationMinutes: 8,
  },
  {
    slug: "yas-uyum-degerlendirmesi",
    title: "Yas uyum değerlendirmesi",
    description:
      "Kayıp sonrası duygusal uyum sürecinizde destek gerektirebilecek başlıkları belirler.",
    durationMinutes: 6,
  },
  {
    slug: "beden-algisi-farkindalik",
    title: "Beden algısı farkındalık testi",
    description:
      "Beden algınız ve yeme davranışınız arasındaki ilişkiyi anlamaya yönelik kısa tarama.",
    durationMinutes: 7,
  },
  {
    slug: "gunluk-dayaniklilik-olcumu",
    title: "Günlük dayanıklılık ölçümü",
    description:
      "Stresli durumlarda toparlanma kapasitenizi ve psikolojik esnekliğinizi değerlendirir.",
    durationMinutes: 5,
  },
];
