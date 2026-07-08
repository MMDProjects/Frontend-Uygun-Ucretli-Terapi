export const siteConfig = {
  name: "Çaremer | Online Danışmanlık Platformu",
  description:
    "Danışanların uzman bulabildığı, testleri çözebildiği ve güven odaklı içeriklere ulaşabildiği online psikolojik danışmanlık platformu.",
  /** Ana sayfa ve footer metinleriyle uyumlu kısa marka adı */
  brandShortName: "Çaremer",
  /** Header vb. görünen marka yazısı */
  brandDisplayName: "Çaremer",
  brandLogoUrl: "/images/logo.png",
  siteUrl: "https://caremer.online",
  contact: {
    addressLines: [],
    phoneDisplay: "+90 530 917 25 90",
    phoneHref: "tel:+905309172590",
    // email: "uygunucretliterapi@gmail.com",
    email: "",
  },
  socialLinks: [
    {
      label: "Instagram",
      href: "https://www.instagram.com/caremeronline/",
    },
    {
      label: "WhatsApp",
      href: "https://wa.me/905309172590",
    },
  ],
  navigation: [
    { href: "/", label: "Ana Sayfa" },
    { href: "/uzmanlar", label: "Uzmanlar" },
    { href: "/testler", label: "Testler" },
    { href: "/blog", label: "Blog" },
    { href: "/paketler", label: "Paketler" },
    { href: "/nasil-calisir", label: "Nasıl Çalışır" },
    { href: "/iletisim", label: "İletişim" },
    { href: "/kurumsal", label: "Kurumsal" },
  ],
  whatsappHref: "https://wa.me/905309172590?text=Merhaba%2C%20ucretsiz%20on%20gorusme%20icin%20iletisime%20gecmek%20istiyorum.",
} as const;
