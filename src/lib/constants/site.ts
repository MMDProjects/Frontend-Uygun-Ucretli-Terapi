export const siteConfig = {
  name: "Psikolojik Danismanlik Platformu",
  description:
    "Danisanlarin uzman bulabildigi, testleri cozumleyebildigi ve guven odakli iceriklere ulasabildigi psikolojik danismanlik platformu.",
  /** Ana sayfa ve footer metinleriyle uyumlu kısa marka adı */
  brandShortName: "Uygun Ücretli Terapi",
  /** Header vb. görünen marka yazısı */
  brandDisplayName: "Uygun Ücretli Terapi",
  brandLogoUrl:
    "https://cdn.fikriorjin.com/themes/b8b168db-c150-4fb9-8be8-c10059a3ab80/uygunu%CC%88cretliterapilogo-vector-01_1.png",
  siteUrl: "https://uygunucretliterapi.com",
  contact: {
    addressLines: [],
    phoneDisplay: "+90 530 917 25 90",
    phoneHref: "tel:+905309172590",
    email: "uygunucretliterapi@gmail.com",
  },
  socialLinks: [
    {
      label: "Instagram",
      href: "https://www.instagram.com/uygunucretliterapi/",
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
