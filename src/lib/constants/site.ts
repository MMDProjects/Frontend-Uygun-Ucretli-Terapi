export const siteConfig = {
  name: "Psikolojik Danismanlik Platformu",
  description:
    "Danisanlarin uzman bulabildigi, testleri cozumleyebildigi ve guven odakli iceriklere ulasabildigi psikolojik danismanlik platformu.",
  /** Ana sayfa ve footer metinleriyle uyumlu kısa marka adı */
  brandShortName: "PsikoDestek",
  /** Header vb. görünen marka yazısı */
  brandDisplayName: "Uygun Ücretli Terapi",
  brandLogoUrl:
    "https://cdn.fikriorjin.com/themes/b8b168db-c150-4fb9-8be8-c10059a3ab80/uygunu%CC%88cretliterapilogo-vector-01_1.png",
  siteUrl: "https://www.psikodestek.com",
  contact: {
    addressLines: ["Maslak Mahallesi", "İstanbul, Türkiye"],
    phoneDisplay: "+90 (212) 000 00 00",
    phoneHref: "tel:+902120000000",
    email: "destek@psikodestek.com",
  },
  socialLinks: [
    {
      label: "Instagram",
      href: "https://www.instagram.com/",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/",
    },
    {
      label: "Facebook",
      href: "https://www.facebook.com/",
    },
    {
      label: "YouTube",
      href: "https://www.youtube.com/",
    },
  ],
  navigation: [
    { href: "/", label: "Ana Sayfa" },
    { href: "/uzmanlar", label: "Uzmanlar" },
    { href: "/testler", label: "Testler" },
    { href: "/blog", label: "Blog" },
    { href: "/paketler", label: "Paketler" },
    { href: "/nasil-calisir", label: "Nasil Calisir" },
    { href: "/iletisim", label: "Iletisim" },
    { href: "/kurumsal", label: "Kurumsal" },
  ],
  whatsappHref: "https://wa.me/905555555555?text=Merhaba%2C%20ucretsiz%20on%20gorusme%20icin%20iletisime%20gecmek%20istiyorum.",
} as const;
